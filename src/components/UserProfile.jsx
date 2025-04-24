import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserProfile.css';

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    memberSince: new Date('2024-01-01').toLocaleDateString(),
    stats: {
      totalGoals: 42,
      completedGoals: 28,
      currentStreak: 7,
      bestStreak: 14
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const statVariants = {
    initial: { scale: 0, y: 20 },
    animate: i => ({
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };

  return (
    <div className="user-profile">
      <motion.button
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className="avatar"
          animate={{ 
            rotate: isOpen ? [0, -10, 10, 0] : 0 
          }}
          transition={{ duration: 0.5 }}
        >
          {user.name[0]}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="profile-header">
              <motion.div 
                className="avatar large"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
              >
                {user.name[0]}
              </motion.div>
              <motion.div 
                className="user-info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>Member since {user.memberSince}</p>
              </motion.div>
            </div>

            <div className="profile-stats">
              <motion.div 
                className="stat"
                custom={0}
                variants={statVariants}
                initial="initial"
                animate="animate"
              >
                <span>Total Goals</span>
                <span>{user.stats.totalGoals}</span>
              </motion.div>
              <motion.div 
                className="stat"
                custom={1}
                variants={statVariants}
                initial="initial"
                animate="animate"
              >
                <span>Completed</span>
                <span>{user.stats.completedGoals}</span>
              </motion.div>
              <motion.div 
                className="stat"
                custom={2}
                variants={statVariants}
                initial="initial"
                animate="animate"
              >
                <span>Current Streak</span>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  style={{ color: 'var(--primary)' }}
                >
                  🔥 {user.stats.currentStreak} days
                </motion.span>
              </motion.div>
              <motion.div 
                className="stat"
                custom={3}
                variants={statVariants}
                initial="initial"
                animate="animate"
              >
                <span>Best Streak</span>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  style={{ color: 'var(--primary)' }}
                >
                  ⭐ {user.stats.bestStreak} days
                </motion.span>
              </motion.div>
            </div>

            <motion.button
              className="profile-settings-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              ⚙️ Settings
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserProfile;