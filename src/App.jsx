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
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CalendarPage from './components/CalendarPage';

function App() {
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

  const [isFirstTimeUser, setIsFirstTimeUser] = useState(() => {
    return !localStorage.getItem('hasVisited');
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      if (token && storedUserData) {
        setIsLoggedIn(true);
        const userData = JSON.parse(storedUserData);
        setDailyPoints(userData.points || 0);
        setStreak(userData.streak || 0);
        setGoals(userData.goals || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const userData = {
        points: dailyPoints,
        streak: streak,
        goals: goals,
      };
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [isLoggedIn, dailyPoints, streak, goals]);

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

  useEffect(() => {
    if (isFirstTimeUser && isLoggedIn) {
      setDailyPoints(prev => prev + 100);
      localStorage.setItem('hasVisited', 'true');
      setIsFirstTimeUser(false);
      
      const notification = document.createElement('div');
      notification.className = 'welcome-bonus';
      notification.textContent = '🎉 Welcome Bonus: +100 Points!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
    }
  }, [isLoggedIn, isFirstTimeUser]);

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
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    setDailyPoints(0);
    setStreak(0);
    setGoals([]);
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
    <Router>
      <div className="app-container">
        <header className="header">
          <img src={logo} className="logo" alt="HabitEvolve Logo" />
          {isLoggedIn ? (
            <div className="top-right-stats">
              <div className="streak">🔥 {streak} Day Streak</div>
              <div className="points">💰 {dailyPoints} Points</div>
              <Link to="/calendar" className="nav-link">📅 Calendar</Link>
              <Link to="/notes" className="nav-link">📝 Notes</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={() => setShowSignup(false)}>Login</button>
              <button onClick={toggleSignup}>Sign Up</button>
            </div>
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
            element={isLoggedIn ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route 
            path="/signup" 
            element={isLoggedIn ? <Navigate to="/" /> : <Signup onSignupSuccess={handleSignupSuccess} />} 
          />
          <Route 
            path="/calendar" 
            element={isLoggedIn ? <CalendarPage completedDates={completedDates} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/notes" 
            element={isLoggedIn ? <Notes /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
