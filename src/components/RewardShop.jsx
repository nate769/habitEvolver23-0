import { useState, useEffect } from 'react';
import './RewardShop.css';

const DEFAULT_ITEMS = [
  { id: 1, name: '⭐ Golden Star', cost: 50, type: 'sticker', description: 'A shining symbol of achievement' },
  { id: 2, name: '🏆 Trophy', cost: 100, type: 'sticker', description: 'For those special victories' },
  { id: 3, name: '👑 Crown', cost: 150, type: 'sticker', description: 'Rule your habits like royalty' },
  { id: 4, name: '💎 Diamond', cost: 200, type: 'sticker', description: 'The pinnacle of persistence' },
  { id: 5, name: '🎯 Focus Boost', cost: 75, type: 'boost', description: 'Double points for 1 hour' },
  { id: 6, name: '🌟 Golden Theme', cost: 300, type: 'theme', description: 'Unlock a premium golden interface' },
  { id: 7, name: '📅 Streak Shield', cost: 250, type: 'streak', description: 'Protect your streak for one day' }
];

function RewardShop({ dailyPoints, setDailyPoints }) {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('rewardItems');
    return savedItems ? JSON.parse(savedItems) : DEFAULT_ITEMS.map(item => ({ ...item, purchased: false }));
  });

  const [unlockedStickers, setUnlockedStickers] = useState(() => {
    const saved = localStorage.getItem('unlockedStickers');
    return saved ? JSON.parse(saved) : [];
  });

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
        showPurchaseNotification(item.name);
      }
    }
  };

  const showPurchaseNotification = (itemName) => {
    const notification = document.createElement('div');
    notification.className = 'reward-notification';
    notification.textContent = `🎉 Unlocked: ${itemName}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  };

  const showStickerPreview = (sticker) => {
    const preview = document.createElement('div');
    preview.className = 'sticker-preview';
    preview.innerHTML = `
      <div class="sticker-preview-content">
        <span class="sticker-emoji">${sticker.name.split(' ')[0]}</span>
        <h3>${sticker.name}</h3>
        <p>${sticker.description}</p>
      </div>
    `;
    document.body.appendChild(preview);

    setTimeout(() => {
      preview.classList.add('fade-out');
      setTimeout(() => preview.remove(), 300);
    }, 2000);
  };

  return (
    <div className="reward-shop">
      <h3>Reward Shop</h3>
      <div className="reward-points">Current Points: {dailyPoints}</div>
      
      {unlockedStickers.length > 0 && (
        <div className="unlocked-stickers">
          <h4>Your Sticker Collection</h4>
          <div className="sticker-grid">
            {unlockedStickers.map((sticker) => (
              <div 
                key={sticker.id}
                className="sticker"
                onClick={() => showStickerPreview(sticker)}
                role="button"
                tabIndex={0}
              >
                {sticker.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reward-list">
        {items.map((item, index) => (
          <div key={item.id} className={`reward-item ${item.type}`}>
            <div className="reward-info">
              <span className="reward-name">{item.name}</span>
              <span className="reward-description">{item.description}</span>
              <span className="reward-cost">{item.cost} Points</span>
            </div>
            <button
              onClick={() => handlePurchase(index)}
              disabled={dailyPoints < item.cost || item.purchased}
              className={`reward-btn ${item.purchased ? 'purchased' : ''}`}
            >
              {item.purchased ? 'Owned' : 'Buy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RewardShop;