import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { messaging, getToken, onMessage } from '../firebase';

function AlarmFeature({ task }) {
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const fcmToken = await getToken(messaging, { vapidKey: 'your-vapid-key' });
          if (fcmToken) {
            setToken(fcmToken);
            setIsAlarmSet(false);
          } else {
            throw new Error('Failed to get notification token');
          }
        } else {
          throw new Error('Notification permission denied');
        }
      } catch (error) {
        setError(`Notification setup failed: ${error.message}`);
        console.error('Error getting FCM token:', error);
      }
    };

    requestPermission();
  }, []);

  const setAlarm = async () => {
    if (!token || !task.date || !task.time || isAlarmSet) {
      setError('Cannot set alarm: missing required information');
      return;
    }

    try {
      const now = new Date();
      const [day, month, year] = task.date.split('-');
      const [hours, minutes] = task.time.split(':');
      const taskTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
      const timeDiff = taskTime - now;

      if (timeDiff <= 0) {
        setError('Cannot set alarm for past time');
        return;
      }

      const response = await fetch('http://localhost:3000/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          title: `Reminder: ${task.text}`,
          body: `Time to complete: ${task.text}`,
          timeDiff: timeDiff,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setIsAlarmSet(true);
      setError('');
    } catch (error) {
      setError(`Failed to set alarm: ${error.message}`);
      console.error('Error scheduling notification:', error);
    }
  };

  return (
    <div className="alarm-feature" role="region" aria-label="Task Alarm">
      <button
        onClick={setAlarm}
        disabled={!token || isAlarmSet}
        className="goal-box__alarm-btn"
        aria-disabled={!token || isAlarmSet}
        aria-label={`Set alarm for task: ${task.text}`}
      >
        {isAlarmSet ? 'Alarm Set' : 'Set Alarm'}
      </button>
      {error && (
        <div className="error-message" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
}

AlarmFeature.propTypes = {
  task: PropTypes.shape({
    text: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }).isRequired
};

export default AlarmFeature;