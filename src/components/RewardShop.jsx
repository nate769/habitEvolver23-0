import { useState, useEffect } from 'react';
import './RewardShop.css';

function RewardShop({ dailyPoints, setDailyPoints }) {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('rewardItems');
    return savedItems ? JSON.parse(savedItems) : [
      { id: 1, name: '⭐ Golden Star', cost: 50, purchased: false, type: 'sticker', description: 'A shining symbol of achievement' },
      { id: 2, name: '🏆 Trophy', cost: 100, purchased: false, type: 'sticker', description: 'For those special victories' },
      { id: 3, name: '👑 Crown', cost: 150, purchased: false, type: 'sticker', description: 'Rule your habits like royalty' },
      { id: 4, name: '💎 Diamond', cost: 200, purchased: false, type: 'sticker', description: 'The pinnacle of persistence' },
      { id: 5, name: '🎯 Focus Boost', cost: 75, purchased: false, type: 'boost', description: 'Double points for 1 hour' },
      { id: 6, name: '🌟 Golden Theme', cost: 300, purchased: false, type: 'theme', description: 'Unlock a premium golden interface' },
      { id: 7, name: '📅 Streak Shield', cost: 250, purchased: false, type: 'streak', description: 'Protect your streak for one day' }
    ];
  });

  const [unlockedStickers, setUnlockedStickers] = useState(() => {
    const saved = localStorage.getItem('unlockedStickers');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSticker, setSelectedSticker] = useState(null);

  useEffect(() => {
    localStorage.setItem('rewardItems', JSON.stringify(items));
    localStorage.setItem('unlockedStickers', JSON.stringify(unlockedStickers));
  }, [items, unlockedStickers]);

  const handlePurchase = (index) => {
    const item = items[index];
    if (dailyPoints >= item.cost && !item.purchased) {
      setDailyPoints(dailyPoints - item.cost);
      
      const updatedItems = [...items];
      updatedItems[index].purchased = true;
      setItems(updatedItems);

      if (item.type === 'sticker') {
        setUnlockedStickers([...unlockedStickers, item]);
        showPurchaseAnimation(item.name);
      }
    }
  };

  const showPurchaseAnimation = (itemName) => {
    const notification = document.createElement('div');
    notification.className = 'reward-notification';
    notification.textContent = `🎉 Unlocked: ${itemName}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 2000);
  };

  const handleStickerClick = (sticker) => {
    setSelectedSticker(sticker);
    const stickerPreview = document.createElement('div');
    stickerPreview.className = 'sticker-preview';
    stickerPreview.innerHTML = `
      <div class="sticker-preview-content">
        <span class="sticker-emoji">${sticker.name.split(' ')[0]}</span>
        <h3>${sticker.name}</h3>
        <p>${sticker.description}</p>
      </div>
    `;
    document.body.appendChild(stickerPreview);

    setTimeout(() => {
      stickerPreview.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(stickerPreview), 300);
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
            {unlockedStickers.map((sticker, i) => (
              <div 
                key={i} 
                className="sticker"
                onClick={() => handleStickerClick(sticker)}
              >
                {sticker.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reward-list">
        {items.map((item, i) => (
          <div key={i} className={`reward-item ${item.type}`}>
            <div className="reward-info">
              <span className="reward-name">{item.name}</span>
              <span className="reward-description">{item.description}</span>
              <span className="reward-cost">{item.cost} Points</span>
            </div>
            <button
              onClick={() => handlePurchase(i)}
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