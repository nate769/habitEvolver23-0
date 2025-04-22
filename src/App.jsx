import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/Habitevolve.png';
import GoalBox from './components/GoalBox';
import ProgressTracker from './components/ProgressTracker';
import RewardShop from './components/RewardShop';
import Notifications from './components/Notifications';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [streak] = useState(5);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [goals, setGoals] = useState([
    { text: 'Get Fit', date: '', completed: false, taskStreak: 0 },
    { text: 'Improve Coding Skills', date: '', completed: false, taskStreak: 0 },
    { text: 'Wake Up Early', date: '', completed: false, taskStreak: 0 },
  ]);

  useEffect(() => {
  
    const token = localStorage.getItem('authToken');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (token) {
      setIsLoggedIn(true);
    } else if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }

    const savedPoints = localStorage.getItem('dailyPoints');
    if (savedPoints) setDailyPoints(parseInt(savedPoints));
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyPoints', dailyPoints);
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [dailyPoints, goals, isLoggedIn]);

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

  return (
    <div className="app-container">
      <header className="header">
        <img src={logo} className="logo" alt="HabitEvolve Logo" />
        {isLoggedIn ? (
          <div className="top-right-stats">
            <div className="streak">🔥 {streak} Day Streak</div>
            <div className="points">💰 {dailyPoints} Points</div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setShowSignup(false)}>Login</button>
            <button onClick={toggleSignup}>Sign Up</button>
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
          </>
        ) : (
          showSignup ? (
            <Signup onSignupSuccess={handleSignupSuccess} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        )}
      </div>
      <canvas id="background-canvas"></canvas>
    </div>
  );
}

export default App;