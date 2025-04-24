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
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CalendarPage from './components/CalendarPage';

function App({ baseUrl = '/' }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [streak, setStreak] = useState(0);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [goals, setGoals] = useState([
    { text: 'Get Fit', date: '', completed: false, taskStreak: 0 },
    { text: 'Improve Coding Skills', date: '', completed: false, taskStreak: 0 },
    { text: 'Wake Up Early', date: '', completed: false, taskStreak: 0 },
  ]);
  const [completedDates, setCompletedDates] = useState(() => {
    try {
      const saved = localStorage.getItem('completedDates');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed)
        ? parsed.filter(date => !isNaN(new Date(date).getTime()))
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
      if (token || storedIsLoggedIn === 'true') {
        setIsLoggedIn(true);
      }

      const savedPoints = localStorage.getItem('dailyPoints');
      if (savedPoints) setDailyPoints(parseInt(savedPoints, 10));

      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dailyPoints', dailyPoints.toString());
      localStorage.setItem('goals', JSON.stringify(goals));
      localStorage.setItem('isLoggedIn', isLoggedIn.toString());
      localStorage.setItem('completedDates', JSON.stringify(completedDates));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [dailyPoints, goals, isLoggedIn, completedDates]);

  useEffect(() => {
    const calculateStreak = () => {
      if (!completedDates.length) return 0;
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      while (true) {
        const dateString = currentDate.toDateString();
        if (!completedDates.includes(dateString)) break;
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
      return streak;
    };
    setStreak(calculateStreak());
  }, [completedDates]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
    localStorage.setItem('authToken', 'somefaketoken');
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
    localStorage.setItem('authToken', 'anotherfaketoken');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  const markTodayAsCompleted = () => {
    const today = new Date().toDateString();
    const allCompleted = goals.every(goal => goal.completed);

    setCompletedDates(prev => {
      if (allCompleted && !prev.includes(today)) {
        return [...prev, today];
      } else if (!allCompleted && prev.includes(today)) {
        return prev.filter(date => date !== today);
      }
      return prev;
    });
  };

  useEffect(() => {
    markTodayAsCompleted();
  }, [goals]);

  return (
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
                <div className="streak">🔥 {streak} Day Streak</div>
                <div className="points">💰 {dailyPoints} Points</div>
                <Link to="/calendar" className="nav-link">📅 Calendar</Link>
                <Link to="/notes" className="nav-link">📝 Notes</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </nav>
          ) : (
            <nav className="nav-menu">
              <div className="auth-buttons">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-link">Sign Up</Link>
              </div>
            </nav>
          )}
        </header>

        <Routes>
          <Route 
            path="/" 
            element={
              !isLoggedIn ? (
                <WelcomePage />
              ) : (
                <div className="main-content logged-in">
                  <h1>Make Your Dreams A Reality One Day At A Time</h1>
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
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <Signup onSignupSuccess={handleSignupSuccess} />
            } 
          />
          <Route 
            path="/calendar" 
            element={
              isLoggedIn ? <CalendarPage completedDates={completedDates} /> : <Navigate to="/login" state={{ from: "/calendar" }} replace />
            } 
          />
          <Route 
            path="/notes" 
            element={
              isLoggedIn ? <Notes /> : <Navigate to="/login" state={{ from: "/notes" }} replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
