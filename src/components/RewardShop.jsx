import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
    <div className="reward-shop" role="region" aria-label="Reward Shop">
      <h3>Reward Shop</h3>
      <ul className="reward-list" role="list">
        {items.map((item, i) => (
          <li key={i} className="reward-item" role="listitem">
            <span id={`item-${i}-description`}>{item.name} - {item.cost} Points</span>
            <button
              onClick={() => handlePurchase(i)}
              disabled={dailyPoints < item.cost || item.purchased}
              className="reward-btn"
              aria-describedby={`item-${i}-description`}
              aria-disabled={dailyPoints < item.cost || item.purchased}
            >
              {item.purchased ? 'Purchased' : 'Buy'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

RewardShop.propTypes = {
  dailyPoints: PropTypes.number.isRequired,
  setDailyPoints: PropTypes.func.isRequired
};

export default RewardShop;