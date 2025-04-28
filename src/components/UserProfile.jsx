import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
      setUser({
        name: currentUser.username,
        email: currentUser.email,
        memberSince: new Date(currentUser.dateJoined).toLocaleDateString(),
        stats: {
          totalGoals: currentUser.goals?.length || 0,
          completedGoals: currentUser.goals?.filter(goal => goal.completed)?.length || 0,
          currentStreak: currentUser.streak || 0,
          bestStreak: currentUser.bestStreak || 0
        }
      });
      setEditedName(currentUser.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    window.location.reload();
  };

  const handleSaveProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
      currentUser.username = editedName;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setUser(prev => ({ ...prev, name: editedName }));
      setIsEditing(false);
    }
  };

  if (!user) return null;

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
                {isEditing ? (
                  <div className="edit-profile">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="profile-edit-input"
                    />
                    <div className="edit-buttons">
                      <button onClick={handleSaveProfile} className="save-btn">Save</button>
                      <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <p>Member since {user.memberSince}</p>
                  </>
                )}
              </motion.div>
            </div>

            <div className="profile-stats">
              {Object.entries(user.stats).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="stat"
                  custom={index}
                  initial="initial"
                  animate="animate"
                  variants={statVariants}
                >
                  <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{value}</span>
                </motion.div>
              ))}
            </div>

            <div className="profile-actions">
              <motion.button
                className="profile-edit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </motion.button>
              <motion.button
                className="profile-logout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={handleLogout}
              >
                🚪 Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserProfile;