import { useState, useEffect } from 'react';
import './Notifications.css';

function Notifications({ goals }) {
  const [notifications, setNotifications] = useState([]);
  const [dismissedNotifications, setDismissedNotifications] = useState(() => {
    const saved = localStorage.getItem('dismissedNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const checkGoals = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const overdue = goals
        .filter(goal => {
          if (!goal.date || goal.completed) return false;
          const goalDate = new Date(goal.date);
          return goalDate < today;
        })
        .filter(goal => !dismissedNotifications.includes(goal.text))
        .map(goal => ({
          id: `${goal.text}-${goal.date}`,
          message: `Reminder: ${goal.text} is overdue!`,
          type: 'overdue'
        }));

      const upcoming = goals
        .filter(goal => {
          if (!goal.date || goal.completed) return false;
          const goalDate = new Date(goal.date);
          const daysDiff = Math.ceil((goalDate - today) / (1000 * 60 * 60 * 24));
          return daysDiff <= 2 && daysDiff > 0;
        })
        .filter(goal => !dismissedNotifications.includes(goal.text))
        .map(goal => ({
          id: `${goal.text}-${goal.date}`,
          message: `Coming up: ${goal.text} is due in ${
            new Date(goal.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })
          }`,
          type: 'upcoming'
        }));

      setNotifications([...overdue, ...upcoming]);
    };

    checkGoals();
    const interval = setInterval(checkGoals, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [goals, dismissedNotifications]);

  useEffect(() => {
    localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
  }, [dismissedNotifications]);

  const handleDismiss = (notification) => {
    setDismissedNotifications(prev => [...prev, notification.message]);
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notifications">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button 
            onClick={() => handleDismiss(notification)}
            className="notification-dismiss"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;