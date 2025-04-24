import React, { useState, useEffect } from 'react';
import './MotivationalQuote.css';

const quotes = [
  {
    text: "Small steps every day lead to big changes.",
    author: "Unknown"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The difference between try and triumph is just a little umph!",
    author: "Marvin Phillips"
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  }
];

function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0]);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // Get today's date and use it as a seed for consistent daily quote
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);

    // Fade in animation
    setFadeIn(true);
  }, []);

  return (
    <div className={`quote-container ${fadeIn ? 'fade-in' : ''}`}>
      <div className="quote-content">
        <span className="quote-mark">❝</span>
        <p className="quote-text">{quote.text}</p>
        <span className="quote-mark">❞</span>
      </div>
      <p className="quote-author">— {quote.author}</p>
    </div>
  );
}

export default MotivationalQuote;