import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/Habitevolve.png';
import GoalBox from './components/GoalBox';
import ProgressTracker from './components/ProgressTracker';
import RewardShop from './components/RewardShop';
import Notifications from './components/Notifications';
import Login from './components/Login';
import Signup from './components/Signup';
import ProgressCalendar from './components/ProgressCalendar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [streak, setStreak] = useState(0); // Dynamic streak
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
      // Validate dates
      return Array.isArray(parsed)
        ? parsed.filter(date => !isNaN(new Date(date).getTime()))
        : [];
    } catch {
      return [];
    }
  });

  // Load initial state from localStorage
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

  // Save state to localStorage
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

  // Calculate streak based on completedDates
  useEffect(() => {
    const calculateStreak = () => {
      if (!completedDates.length) return 0;
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Normalize to start of day

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

  // Mark today's date if all goals completed, remove if not
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
    <div className="app-container">
      <header className="header">
        <img src={logo} className="logo" alt="HabitEvolve Logo" />
        {isLoggedIn ? (
          <div className="top-right-stats">
            <div className="streak" aria-label={`Streak: ${streak} days`}>
              🔥 {streak} Day Streak
            </div>
            <div className="points" aria-label={`Points: ${dailyPoints}`}>
              💰 {dailyPoints} Points
            </div>
            <button onClick={handleLogout} aria-label="Log out">
              Logout
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => setShowSignup(false)} aria-label="Log in">
              Login
            </button>
            <button onClick={toggleSignup} aria-label="Sign up">
              Sign Up
            </button>
          </div>
        )}
      </header>

      <div className={`main-content ${isLoggedIn ? 'logged-in' : ''}`}>
        {isLoggedIn ? (
          <>
            <h1>Make Your Dreams A Reality One Day At A Time</h1>
            <aside className="sidebar">
              <GoalBox setDailyPoints={setDailyPoints} goals={goals} setGoals={setGoals} />
              <ProgressTracker goals={goals} />
              <RewardShop dailyPoints={dailyPoints} setDailyPoints={setDailyPoints} />
            </aside>
            <Notifications goals={goals} />
            <ProgressCalendar completedDates={completedDates} />
          </>
        ) : showSignup ? (
          <Signup onSignupSuccess={handleSignupSuccess} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>

      <canvas id="background-canvas" aria-hidden="true"></canvas>
    </div>
  );
}

export default App;