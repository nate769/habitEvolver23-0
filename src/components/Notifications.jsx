import React, { useState, useEffect } from 'react';
import './Notifications.css';
import { motion, AnimatePresence } from 'framer-motion';

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
          const diffTime = goalDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 2 && diffDays > 0;
        })
        .filter(goal => !dismissedNotifications.includes(goal.text))
        .map(goal => ({
          id: `${goal.text}-${goal.date}`,
          message: `Coming up: ${goal.text} due in ${new Date(goal.date).toLocaleDateString()}`,
          type: 'upcoming'
        }));

      setNotifications([...overdue, ...upcoming]);
    };

    checkGoals();
  }, [goals, dismissedNotifications]);

  const handleDismiss = (notification) => {
    setDismissedNotifications(prev => [...prev, notification.message]);
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const container = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (notifications.length === 0) return null;

  return (
    <motion.div 
      className="notifications"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`notification ${notification.type}`}
            variants={item}
            layout
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ 
              opacity: 0, 
              x: 20, 
              height: 0,
              transition: { duration: 0.2 }
            }}
            whileHover={{ scale: 1.02 }}
          >
            <span>{notification.message}</span>
            <motion.button 
              onClick={() => handleDismiss(notification)}
              className="notification-dismiss"
              aria-label="Dismiss notification"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default Notifications;