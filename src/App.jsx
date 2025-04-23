import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/Habitevolve.png';
import GoalBox from './components/GoalBox';
import ProgressTracker from './components/ProgressTracker';
import RewardShop from './components/RewardShop';
import Notifications from './components/Notifications';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
    <Router>
      <div className="app-container">
        <header className="header">
          <img src={logo} className="logo" alt="HabitEvolve Logo" />
          {isLoggedIn ? (
            <div className="top-right-stats">
              <div className="streak">🔥 {streak} Day Streak</div>
              <div className="points">💰 {dailyPoints} Points</div>
              <Link to="/calendar">
                <button style={{ marginRight: '1rem' }}>📅 Calendar</button>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <button onClick={() => setShowSignup(false)}>Login</button>
              <button onClick={toggleSignup}>Sign Up</button>
            </div>
          )}
        </header>

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <div className="main-content logged-in">
                  <h1>Make Your Dreams A Reality One Day At A Time</h1>
                  <aside className="sidebar">
                    <GoalBox setDailyPoints={setDailyPoints} goals={goals} setGoals={setGoals} />
                    <ProgressTracker goals={goals} />
                    <RewardShop dailyPoints={dailyPoints} setDailyPoints={setDailyPoints} />
                  </aside>
                  <Notifications goals={goals} />
                </div>
              ) : showSignup ? (
                <Signup onSignupSuccess={handleSignupSuccess} />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="/calendar" element={<CalendarPage completedDates={completedDates} />} />
        </Routes>

        <canvas id="background-canvas" aria-hidden="true"></canvas>
      </div>
    </Router>
  );
}

export default App;
