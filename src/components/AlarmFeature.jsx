// src/components/AlarmFeature.jsx
import { useState, useEffect } from 'react';

function AlarmFeature({ task }) {
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setIsAlarmSet(true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') setIsAlarmSet(true);
      });
    }
  }, []);

  const setAlarm = () => {
    if (!isAlarmSet || !task.date || !task.time) return;

    const now = new Date();
    const [hours, minutes] = task.time.split(':');
    const taskTime = new Date(task.date);
    taskTime.setHours(hours, minutes, 0, 0);
    const timeDiff = taskTime - now;

    if (timeDiff > 0) {
      setTimeout(() => {
        new Notification(`Reminder: ${task.text}`, {
          body: `Time to complete: ${task.text}`,
          icon: '/path/to/icon.png',
        });
      }, timeDiff);
      setIsAlarmSet(true);
    }
  };

  return (
    <button
      onClick={setAlarm}
      disabled={!isAlarmSet || isAlarmSet}
      className="goal-box__alarm-btn"
    >
      {isAlarmSet ? 'Alarm Set' : 'Set Alarm'}
    </button>
  );
}

export default AlarmFeature;