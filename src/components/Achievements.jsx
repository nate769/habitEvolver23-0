import React from 'react';
import { motion } from 'framer-motion';
import './Achievements.css';

const BADGES = [
  { id: 'streak5', name: '5-Day Streak', icon: '🔥', description: 'Maintain a 5-day streak' },
  { id: 'streak10', name: '10-Day Streak', icon: '🔥', description: 'Maintain a 10-day streak' },
  { id: 'consistency', name: 'Consistency King', icon: '👑', description: 'Complete all goals for 7 days' },
  { id: 'earlyBird', name: 'Early Bird', icon: '🌅', description: 'Complete goals before 9 AM' },
  { id: 'nightOwl', name: 'Night Owl', icon: '🦉', description: 'Complete goals after 9 PM' },
  { id: 'perfectWeek', name: 'Perfect Week', icon: '⭐', description: 'Complete all goals for a week' }
];

const HABIT_TEMPLATES = [
  {
    id: 'morning',
    name: 'Morning Routine',
    goals: [
      'Wake up at 6:00 AM',
      'Drink water',
      'Exercise for 30 minutes',
      'Meditate for 10 minutes',
      'Read for 20 minutes'
    ]
  },
  {
    id: 'fitness',
    name: 'Fitness Challenge',
    goals: [
      '30 minutes cardio',
      'Strength training',
      'Stretching routine',
      'Track water intake',
      'Healthy meal prep'
    ]
  },
  {
    id: 'reading',
    name: 'Reading Plan',
    goals: [
      'Read 30 minutes',
      'Take notes',
      'Review highlights',
      'Share insights',
      'Set next book goal'
    ]
  }
];

function Achievements({ streak, dailyPoints, setDailyPoints, goals, setGoals }) {
  const [unlockedBadges, setUnlockedBadges] = React.useState(() => {
    const saved = localStorage.getItem('unlockedBadges');
    return saved ? JSON.parse(saved) : [];
  });

  const [streakFreeze, setStreakFreeze] = React.useState(() => {
    const saved = localStorage.getItem('streakFreeze');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));
    localStorage.setItem('streakFreeze', JSON.stringify(streakFreeze));
  }, [unlockedBadges, streakFreeze]);

  const checkBadges = () => {
    const newBadges = [...unlockedBadges];
    
    if (streak >= 5 && !unlockedBadges.includes('streak5')) {
      newBadges.push('streak5');
    }
    if (streak >= 10 && !unlockedBadges.includes('streak10')) {
      newBadges.push('streak10');
    }
    if (streak >= 7 && !unlockedBadges.includes('consistency')) {
      newBadges.push('consistency');
    }
    
    setUnlockedBadges(newBadges);
  };

  React.useEffect(() => {
    checkBadges();
  }, [streak]);

  const handleStreakFreeze = () => {
    if (dailyPoints >= 100 && !streakFreeze) {
      setDailyPoints(dailyPoints - 100);
      setStreakFreeze(true);
    }
  };

  const applyTemplate = (template) => {
    const newGoals = template.goals.map(goal => ({
      text: goal,
      completed: false,
      taskStreak: 0,
      position: 'right',
      priority: 'medium',
      completionHistory: [],
      longestStreak: 0
    }));
    setGoals([...goals, ...newGoals]);
  };

  return (
    <motion.div 
      className="achievements"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Achievements & Templates</h3>
      
      <div className="streak-freeze">
        <div className="streak-freeze-info">
          <span className="streak-freeze-icon">❄️</span>
          <span className="streak-freeze-text">
            {streakFreeze ? 'Streak Freeze Active' : 'Protect your streak for 100 points'}
          </span>
        </div>
        <motion.button
          className={`streak-freeze-btn ${streakFreeze ? 'active' : ''}`}
          onClick={handleStreakFreeze}
          disabled={streakFreeze || dailyPoints < 100}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {streakFreeze ? 'Active' : 'Activate'}
        </motion.button>
      </div>

      <div className="badges-section">
        <h4>Your Badges</h4>
        <div className="badges-grid">
          {BADGES.map(badge => (
            <motion.div
              key={badge.id}
              className={`badge ${unlockedBadges.includes(badge.id) ? 'unlocked' : 'locked'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="badge-icon">{badge.icon}</span>
              <span className="badge-name">{badge.name}</span>
              <span className="badge-description">{badge.description}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="templates-section">
        <h4>Habit Templates</h4>
        <div className="templates-grid">
          {HABIT_TEMPLATES.map(template => (
            <motion.div
              key={template.id}
              className="template-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyTemplate(template)}
            >
              <h5>{template.name}</h5>
              <ul>
                {template.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
              <motion.button
                className="apply-template-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Template
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Achievements; 