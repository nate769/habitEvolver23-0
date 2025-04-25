import { useState, useEffect } from 'react';
import { messaging, getToken } from '../firebase';

function AlarmFeature({ task }) {
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const fcmToken = await getToken(messaging, { vapidKey: 'your-vapid-key' });
          if (fcmToken) {
            setToken(fcmToken);
            setIsAlarmSet(false);
          }
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    requestPermission();
  }, []);

  const setAlarm = async () => {
    if (!token || !task.date || !task.time || isAlarmSet) return;

    const now = new Date();
    const [day, month, year] = task.date.split('-');
    const [hours, minutes] = task.time.split(':');
    const taskTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const timeDiff = taskTime - now;

    if (timeDiff > 0) {
      try {
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

        if (response.ok) {
          setIsAlarmSet(true);
        } else {
          console.error('Failed to schedule notification:', response.statusText);
        }
      } catch (error) {
        console.error('Error scheduling notification:', error);
      }
    } else {
      console.warn('Task time is in the past:', taskTime);
    }
  };

  return (
    <button
      onClick={setAlarm}
      disabled={!token || isAlarmSet}
      className="goal-box__alarm-btn"
    >
      {isAlarmSet ? 'Alarm Set' : 'Set Alarm'}
    </button>
  );
}

export default AlarmFeature;