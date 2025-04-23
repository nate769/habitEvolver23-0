import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Notifications.css';

function Notifications({ goals }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const overdueGoals = goals.filter(goal => goal.date && goal.date < today && !goal.completed);
    if (overdueGoals.length > 0) {
      setNotifications(overdueGoals.map(goal => `Reminder: ${goal.text} is overdue!`));
    } else {
      setNotifications([]);
    }
  }, [goals]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div 
      className="notifications" 
      role="alert" 
      aria-label="Overdue Tasks"
      aria-live="polite"
    >
      {notifications.map((msg, i) => (
        <div 
          key={i} 
          className="notification"
          tabIndex={0}
        >
          {msg}
        </div>
      ))}
    </div>
  );
}

Notifications.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    date: PropTypes.string,
    completed: PropTypes.bool.isRequired
  })).isRequired
};

export default Notifications;