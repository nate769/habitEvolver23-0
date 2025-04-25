import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserProfile.css';

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    memberSince: '',
    stats: {
      totalGoals: 0,
      completedGoals: 0,
      currentStreak: 0,
      bestStreak: 0
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isFirstLogin = userData.isFirstLogin;
    
    if (isFirstLogin) {
      // Reset stats for first login
      userData.stats = {
        totalGoals: 0,
        completedGoals: 0,
        currentStreak: 0,
        bestStreak: 0
      };
      userData.isFirstLogin = false;
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    setUser({
      name: userData.username || 'User',
      email: userData.email || 'user@example.com',
      memberSince: userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : new Date().toLocaleDateString(),
      stats: userData.stats || {
        totalGoals: 0,
        completedGoals: 0,
        currentStreak: 0,
        bestStreak: 0
      }
    });
  }, []);

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.username = newUsername || userData.username;
    if (newPassword) {
      userData.password = newPassword;
    }
    localStorage.setItem('userData', JSON.stringify(userData));

    setUser(prev => ({
      ...prev,
      name: newUsername || prev.name
    }));

    setShowSettings(false);
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
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
              onClick={() => setShowSettings(!showSettings)}
            >
              ⚙️ Settings
            </motion.button>

            {showSettings && (
              <motion.div
                className="settings-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <form onSubmit={handleSettingsSubmit}>
                  <div className="form-group">
                    <label htmlFor="newUsername">New Username:</label>
                    <input
                      type="text"
                      id="newUsername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter new username"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                  </div>
                  <button type="submit" className="save-settings-btn">Save Changes</button>
                </form>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserProfile;