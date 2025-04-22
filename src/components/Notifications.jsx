
import { useState, useEffect } from 'react';
import './Notifications.css';

function Notifications({ goals }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const overdueGoals = goals.filter(goal => goal.date && goal.date < today && !goal.completed);
    if (overdueGoals.length > 0) {
      setNotifications(overdueGoals.map(goal => `Reminder: ${goal.text} is overdue!`));
    }
  }, [goals]);

  return (
    <div className="notifications">
      {notifications.map((msg, i) => (
        <div key={i} className="notification">{msg}</div>
      ))}
    </div>
  );
}

export default Notifications;