
import { useState, useEffect } from 'react';
import './RewardShop.css';

function RewardShop({ dailyPoints, setDailyPoints }) {
  const [items, setItems] = useState([
    { name: 'Motivation Boost', cost: 50, purchased: false },
    { name: 'Custom Theme', cost: 100, purchased: false },
    { name: 'Extra Streak Day', cost: 200, purchased: false },
  ]);

  const handlePurchase = (index) => {
    const item = items[index];
    if (dailyPoints >= item.cost && !item.purchased) {
      setDailyPoints(dailyPoints - item.cost);
      const updatedItems = [...items];
      updatedItems[index].purchased = true;
      setItems(updatedItems);
    }
  };

  return (
    <div className="reward-shop">
      <h3>Reward Shop</h3>
      <ul className="reward-list">
        {items.map((item, i) => (
          <li key={i} className="reward-item">
            <span>{item.name} - {item.cost} Points</span>
            <button
              onClick={() => handlePurchase(i)}
              disabled={dailyPoints < item.cost || item.purchased}
              className="reward-btn"
            >
              {item.purchased ? 'Purchased' : 'Buy'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RewardShop;