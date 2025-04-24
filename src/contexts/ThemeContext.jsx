import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    text: '#2c3e50',
    primary: '#3498db',
    secondary: '#2980b9',
    success: '#2ecc71',
    cardBg: '#ffffff',
    borderColor: 'rgba(58, 123, 213, 0.1)'
  },
  dark: {
    name: 'dark',
    background: 'linear-gradient(135deg, #2c3e50 0%, #1a202c 100%)',
    text: '#f5f7fa',
    primary: '#3498db',
    secondary: '#2980b9',
    success: '#2ecc71',
    cardBg: '#34495e',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  calm: {
    name: 'calm',
    background: 'linear-gradient(135deg, #e8f3f7 0%, #e0f0e9 100%)',
    text: '#2c3e50',
    primary: '#4caf50',
    secondary: '#388e3c',
    success: '#81c784',
    cardBg: '#ffffff',
    borderColor: 'rgba(76, 175, 80, 0.1)'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [customTheme, setCustomTheme] = useState(() => {
    const savedCustomTheme = localStorage.getItem('customTheme');
    return savedCustomTheme ? JSON.parse(savedCustomTheme) : null;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyTheme(theme, customTheme);
  }, [theme, customTheme]);

  const applyTheme = (themeName, custom = null) => {
    const root = document.documentElement;
    if (custom) {
      root.style.setProperty('--background', custom.background || 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)');
      root.style.setProperty('--text', custom.text || '#2c3e50');
      root.style.setProperty('--primary', custom.primary || '#3498db');
      root.style.setProperty('--secondary', custom.secondary || '#2980b9');
      root.style.setProperty('--card-bg', custom.cardBg || '#ffffff');
      root.style.setProperty('--border-color', custom.borderColor || 'rgba(58, 123, 213, 0.1)');
    } else {
      switch (themeName) {
        case 'dark':
          root.style.setProperty('--background', 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)');
          root.style.setProperty('--text', '#e0e0e0');
          root.style.setProperty('--primary', '#3498db');
          root.style.setProperty('--secondary', '#2980b9');
          root.style.setProperty('--card-bg', '#2c3e50');
          root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
          break;
        case 'golden':
          root.style.setProperty('--background', 'linear-gradient(135deg, #fff9c4 0%, #fff176 100%)');
          root.style.setProperty('--text', '#5d4037');
          root.style.setProperty('--primary', '#ffd700');
          root.style.setProperty('--secondary', '#daa520');
          root.style.setProperty('--card-bg', '#ffffff');
          root.style.setProperty('--border-color', 'rgba(218, 165, 32, 0.2)');
          break;
        default: // light theme
          root.style.setProperty('--background', 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)');
          root.style.setProperty('--text', '#2c3e50');
          root.style.setProperty('--primary', '#3498db');
          root.style.setProperty('--secondary', '#2980b9');
          root.style.setProperty('--card-bg', '#ffffff');
          root.style.setProperty('--border-color', 'rgba(58, 123, 213, 0.1)');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  const setGoldenTheme = () => {
    setTheme('golden');
  };

  const setCustomThemeColors = (colors) => {
    setCustomTheme(colors);
    localStorage.setItem('customTheme', JSON.stringify(colors));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setGoldenTheme,
      setCustomThemeColors,
      customTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}