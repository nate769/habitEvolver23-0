import React, { useState, useEffect, useContext } from 'react';
import './RewardShop.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

const DEFAULT_ITEMS = [
  { id: 1, name: '⭐ Golden Star', cost: 50, type: 'sticker', description: 'A shining symbol of achievement' },
  { id: 2, name: '🏆 Trophy', cost: 100, type: 'sticker', description: 'For those special victories' },
  { id: 3, name: '👑 Crown', cost: 150, type: 'sticker', description: 'Rule your habits like royalty' },
  { id: 4, name: '💎 Diamond', cost: 200, type: 'sticker', description: 'The pinnacle of persistence' },
  { id: 5, name: '🎯 Focus Boost', cost: 75, type: 'boost', description: 'Double points for 1 hour' },
  { id: 6, name: '🌟 Golden Theme', cost: 300, type: 'theme', description: 'Unlock a luxurious golden interface' },
  { id: 7, name: '📅 Streak Shield', cost: 250, type: 'streak', description: 'Protect your streak for one day' }
];

function RewardShop({ dailyPoints, setDailyPoints }) {
  const { setGoldenTheme } = useContext(ThemeContext);
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('rewardItems');
    return savedItems ? JSON.parse(savedItems) : DEFAULT_ITEMS.map(item => ({ ...item, purchased: false }));
  });

  const [unlockedStickers, setUnlockedStickers] = useState(() => {
    const saved = localStorage.getItem('unlockedStickers');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('rewardItems', JSON.stringify(items));
    localStorage.setItem('unlockedStickers', JSON.stringify(unlockedStickers));
  }, [items, unlockedStickers]);

  const handlePurchase = (index) => {
    const item = items[index];
    if (dailyPoints >= item.cost && !item.purchased) {
      setDailyPoints(dailyPoints - item.cost);
      
      setItems(prevItems => {
        const updated = [...prevItems];
        updated[index].purchased = true;
        return updated;
      });

      if (item.type === 'sticker') {
        setUnlockedStickers(prev => [...prev, item]);
      } else if (item.type === 'theme' && item.name === '🌟 Golden Theme') {
        setGoldenTheme();
      }

      setNotification({
        message: `Unlocked: ${item.name}!`,
        type: 'success'
      });
      
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="reward-shop"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Reward Shop</h3>
      
      <motion.div 
        className="reward-points"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {dailyPoints} Points
      </motion.div>

      {unlockedStickers.length > 0 && (
        <motion.div 
          className="unlocked-stickers"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4>Your Collection</h4>
          <motion.div 
            className="sticker-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {unlockedStickers.map((sticker) => (
              <motion.div
                key={sticker.id}
                className="sticker"
                variants={item}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
                role="button"
                tabIndex={0}
              >
                {sticker.name.split(' ')[0]}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      <motion.div 
        className="reward-list"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`reward-item ${item.type}`}
            variants={item}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <div className="reward-info">
              <span className="reward-name">{item.name}</span>
              <span className="reward-description">{item.description}</span>
              <span className="reward-cost">{item.cost} Points</span>
            </div>
            <motion.button
              className={`reward-btn ${dailyPoints < item.cost ? 'disabled' : ''} ${item.purchased ? 'purchased' : ''}`}
              onClick={() => handlePurchase(index)}
              disabled={dailyPoints < item.cost || item.purchased}
              whileHover={{ scale: dailyPoints >= item.cost ? 1.05 : 1 }}
              whileTap={{ scale: dailyPoints >= item.cost ? 0.95 : 1 }}
            >
              {item.purchased ? 'Owned' : 'Buy'}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {notification && (
          <motion.div 
            className="reward-notification"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RewardShop;