import React from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <select 
        value={theme.name}
        onChange={(e) => toggleTheme(e.target.value)}
        className="theme-select"
      >
        {Object.keys(themes).map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}