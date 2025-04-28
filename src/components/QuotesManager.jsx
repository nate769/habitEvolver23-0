import React, { useState, useEffect } from 'react';
import './QuotesManager.css';

const quotes = {
  motivation: [
    {
      text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
      author: "Steve Jobs",
      source: "Stanford Commencement Speech"
    },
    {
      text: "The harder you work for something, the greater you'll feel when you achieve it.",
      author: "Unknown",
      source: "Unknown"
    },
    {
      text: "The only limit to your impact is your imagination and commitment.",
      author: "Tony Robbins",
      source: "Unknown"
    }
  ],
  habits: [
    {
      text: "Habits are the compound interest of self-improvement. Getting 1% better every day counts for a lot in the long-run.",
      author: "James Clear",
      source: "Atomic Habits"
    },
    {
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      author: "James Clear",
      source: "Atomic Habits"
    },
    {
      text: "Your habits will determine your future.",
      author: "Jack Canfield",
      source: "Unknown"
    }
  ],
  wisdom: [
    {
      text: "The journey of a thousand miles begins with a single step.",
      author: "Lao Tzu",
      source: "Tao Te Ching"
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb",
      source: "Unknown"
    },
    {
      text: "The only person you are destined to become is the person you decide to be.",
      author: "Ralph Waldo Emerson",
      source: "Unknown"
    }
  ],
  success: [
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      source: "Unknown"
    },
    {
      text: "The best way to predict your future is to create it.",
      author: "Abraham Lincoln",
      source: "Unknown"
    },
    {
      text: "Success is the sum of small efforts, repeated day in and day out.",
      author: "Robert Collier",
      source: "Unknown"
    }
  ],
  growth: [
    {
      text: "It's not about being the best. It's about being better than you were yesterday.",
      author: "Unknown",
      source: "Unknown"
    },
    {
      text: "Small progress is still progress.",
      author: "Unknown",
      source: "Unknown"
    },
    {
      text: "Every day is a new beginning.",
      author: "Unknown",
      source: "Unknown"
    }
  ]
};

export function getDailyQuote() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const categories = Object.keys(quotes);
  const categoryIndex = dayOfYear % categories.length;
  const category = categories[categoryIndex];
  const categoryQuotes = quotes[category];
  const quoteIndex = Math.floor(dayOfYear / categories.length) % categoryQuotes.length;
  return {
    ...categoryQuotes[quoteIndex],
    category
  };
}

export function getRandomQuote() {
  const categories = Object.keys(quotes);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const categoryQuotes = quotes[randomCategory];
  const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
  return {
    ...randomQuote,
    category: randomCategory
  };
}

export default function QuotesManager({ type = 'daily' }) {
  const [quote, setQuote] = useState(type === 'daily' ? getDailyQuote() : getRandomQuote());
  const [fadeIn, setFadeIn] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteQuotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCopied, setShowCopied] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setFadeIn(false);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setFadeIn(true);
      setIsRefreshing(false);
    }, 300);
  };

  const toggleFavorite = () => {
    const quoteString = JSON.stringify(quote);
    const newFavorites = favorites.includes(quoteString)
      ? favorites.filter(fav => fav !== quoteString)
      : [...favorites, quoteString];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
  };

  const shareQuote = () => {
    const text = `"${quote.text}" - ${quote.author}, ${quote.source}`;
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  useEffect(() => {
    if (type === 'daily') {
      setQuote(getDailyQuote());
    } else {
      setQuote(getRandomQuote());
    }
    setFadeIn(true);
  }, [type]);

  const isFavorite = favorites.includes(JSON.stringify(quote));

  return (
    <div className="quotes-manager">
      <div className={`quote-container ${fadeIn ? 'fade-in' : ''}`}>
        <div className="quote-content">
          <span className="quote-mark">❝</span>
          <p className="quote-text">{quote.text}</p>
          <span className="quote-mark">❞</span>
        </div>
        <div className="quote-footer">
          <p className="quote-author">— {quote.author}, {quote.source}</p>
          <span className="quote-category">{quote.category}</span>
        </div>
        <div className="quote-actions">
          <button 
            className={`action-button favorite ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <button 
            className="action-button share"
            onClick={shareQuote}
            title="Share quote"
          >
            {showCopied ? '✓' : '📋'}
          </button>
        </div>
      </div>
      <button 
        className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? '🔄' : '🔄 New Quote'}
      </button>
    </div>
  );
} 