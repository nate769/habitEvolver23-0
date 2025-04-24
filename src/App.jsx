import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/Habitevolve.png';
import GoalBox from './components/GoalBox';
import ProgressTracker from './components/ProgressTracker';
import RewardShop from './components/RewardShop';
import Notifications from './components/Notifications';
import Login from './components/Login';
import Signup from './components/Signup';
import Notes from './components/Notes';
import WelcomePage from './components/WelcomePage';
import MotivationalQuote from './components/MotivationalQuote';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CalendarPage from './components/CalendarPage';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import UserProfile from './components/UserProfile';

function App({ baseUrl = '/' }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [streak, setStreak] = useState(0);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : {
      weeklyStreak: false,
      tenHabits: false,
      consistentWeek: false
    };
  });
  const [goals, setGoals] = useState([
    { text: 'Exercise for 30 minutes', date: '', completed: false, taskStreak: 0 },
    { text: 'Read a book chapter', date: '', completed: false, taskStreak: 0 },
    { text: 'Wake up at 6:00 AM', date: '', completed: false, taskStreak: 0 },
    { text: 'Practice mindfulness for 10 minutes', date: '', completed: false, taskStreak: 0 },
    { text: 'Drink 8 glasses of water', date: '', completed: false, taskStreak: 0 }
  ]);
  const [completedDates, setCompletedDates] = useState(() => {
    try {
      const saved = localStorage.getItem('completedDates');
      return saved ? JSON.parse(saved).filter(date => !isNaN(new Date(date).getTime())) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (token || storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }

    const savedPoints = localStorage.getItem('dailyPoints');
    if (savedPoints) setDailyPoints(parseInt(savedPoints, 10));

    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dailyPoints', dailyPoints.toString());
      localStorage.setItem('goals', JSON.stringify(goals));
      localStorage.setItem('isLoggedIn', isLoggedIn.toString());
      localStorage.setItem('completedDates', JSON.stringify(completedDates));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [dailyPoints, goals, isLoggedIn, completedDates]);

  useEffect(() => {
    const calculateStreak = () => {
      if (!completedDates.length) return 0;
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      while (true) {
        if (!completedDates.includes(currentDate.toDateString())) break;
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
      return streak;
    };
    setStreak(calculateStreak());
  }, [completedDates]);

  // Check for achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = { ...achievements };
      
      // Check for 7-day streak
      if (streak >= 7 && !achievements.weeklyStreak) {
        newAchievements.weeklyStreak = true;
        showAchievementNotification('🏅 7-Day Streak Master!');
      }

      // Check for 10 different habits
      if (goals.length >= 10 && !achievements.tenHabits) {
        newAchievements.tenHabits = true;
        showAchievementNotification('🧠 Habit Collector: Added 10 habits!');
      }

      // Check for consistent week (completed all goals for 7 days)
      const last7Days = completedDates.filter(date => {
        const d = new Date(date);
        const now = new Date();
        return (now - d) / (1000 * 60 * 60 * 24) <= 7;
      });
      
      if (last7Days.length >= 7 && !achievements.consistentWeek) {
        newAchievements.consistentWeek = true;
        showAchievementNotification('🕒 Consistency Champion: Perfect week!');
      }

      setAchievements(newAchievements);
    };

    checkAchievements();
  }, [goals, streak, completedDates]);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const showAchievementNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
    localStorage.setItem('authToken', 'token_' + Date.now());
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
    localStorage.setItem('authToken', 'token_' + Date.now());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
  };

  const markTodayAsCompleted = () => {
    const today = new Date().toDateString();
    const allCompleted = goals.every(goal => goal.completed);

    setCompletedDates(prev => {
      if (allCompleted && !prev.includes(today)) return [...prev, today];
      if (!allCompleted && prev.includes(today)) return prev.filter(date => date !== today);
      return prev;
    });
  };

  useEffect(() => {
    markTodayAsCompleted();
  }, [goals]);

  return (
    <ThemeProvider>
      <Router basename={baseUrl}>
        <div className="app-container">
          <header className="header">
            <Link to="/" className="home-link">
              <img src={logo} className="logo" alt="HabitEvolve Logo" />
              <span className="logo-text">Home</span>
            </Link>
            {isLoggedIn ? (
              <nav className="nav-menu">
                <div className="top-right-stats">
                  <ThemeToggle />
                  <div className="streak">🔥 {streak} Day Streak</div>
                  <div className="points">💰 {dailyPoints} Points</div>
                  <div className="achievements-display">
                    {achievements.weeklyStreak && <span title="7-Day Streak Master">🏅</span>}
                    {achievements.tenHabits && <span title="Habit Collector">🧠</span>}
                    {achievements.consistentWeek && <span title="Consistency Champion">🕒</span>}
                  </div>
                  <Link to="/calendar" className="nav-link">📅 Calendar</Link>
                  <Link to="/notes" className="nav-link">📝 Notes</Link>
                  <UserProfile />
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              </nav>
            ) : (
              <nav className="nav-menu">
                <ThemeToggle />
                <div className="auth-buttons">
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </div>
              </nav>
            )}
          </header>

          <Routes>
            <Route path="/" element={!isLoggedIn ? <WelcomePage /> : (
              <div className="main-content logged-in">
                <h1>Make Your Dreams A Reality One Day At A Time</h1>
                <MotivationalQuote />
                <div className="main-content__grid">
                  <div className="main-content__left">
                    <GoalBox setDailyPoints={setDailyPoints} goals={goals} setGoals={setGoals} />
                  </div>
                  <div className="main-content__right">
                    <ProgressTracker goals={goals} />
                    <RewardShop dailyPoints={dailyPoints} setDailyPoints={setDailyPoints} />
                  </div>
                </div>
                <Notifications goals={goals} />
              </div>
            )} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : 
              <Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : 
              <Signup onSignupSuccess={handleSignupSuccess} />} />
            <Route path="/calendar" element={isLoggedIn ? 
              <CalendarPage completedDates={completedDates} /> : 
              <Navigate to="/login" state={{ from: "/calendar" }} replace />} />
            <Route path="/notes" element={isLoggedIn ? 
              <Notes /> : 
              <Navigate to="/login" state={{ from: "/notes" }} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
