import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const themeOptions = [
  { value: 'dark', label: 'Dark 🌙', preview: 'linear-gradient(135deg, #181c24 0%, #232946 100%)' },
  { value: 'calm', label: 'Calm 🧘', preview: 'linear-gradient(135deg, #eaf6f6 0%, #e0f7fa 100%)' }
];

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <div className="theme-preview-select">
        {themeOptions.map((opt) => (
          <button
            key={opt.value}
            className={`theme-preview-btn${theme.name === opt.value ? ' selected' : ''}`}
            style={{ background: opt.preview }}
            onClick={() => toggleTheme(opt.value)}
            aria-label={opt.label}
          >
            <span className="theme-preview-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}