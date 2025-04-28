import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const themes = {
  dark: {
    name: 'dark',
    background: 'linear-gradient(135deg, #181c24 0%, #232946 100%)',
    text: '#f3f6fa',
    primary: '#4f8cff',
    secondary: '#232946',
    success: '#2ecc71',
    cardBg: '#232946',
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  calm: {
    name: 'calm',
    background: 'linear-gradient(135deg, #eaf6f6 0%, #e0f7fa 100%)',
    text: '#2c3e50',
    primary: '#5ec6ca',
    secondary: '#b2dfdb',
    success: '#81c784',
    cardBg: '#ffffff',
    borderColor: 'rgba(94, 198, 202, 0.13)'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && Object.keys(themes).includes(savedTheme) ? savedTheme : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    const t = themes[themeName] || themes.dark;
    root.style.setProperty('--background', t.background);
    root.style.setProperty('--text', t.text);
    root.style.setProperty('--primary', t.primary);
    root.style.setProperty('--secondary', t.secondary);
    root.style.setProperty('--card-bg', t.cardBg);
    root.style.setProperty('--border-color', t.borderColor);
  };

  const toggleTheme = (themeName) => {
    setTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: themes[theme], 
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}