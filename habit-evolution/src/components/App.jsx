import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/Habitevolve.png';
import Neglish from './components/Neglish';
// ...existing imports...

function App() {
  // ...existing state and functions...

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          // ...existing header content...
        </header>

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <div className="main-content logged-in">
                  <h1>Make Your Dreams A Reality One Day At A Time</h1>
                  <div className="main-content__grid">
                    <div className="main-content__left">
                      <Neglish setDailyPoints={setDailyPoints} goals={goals} setGoals={setGoals} />
                    </div>
                    <div className="main-content__right">
                      <ProgressTracker goals={goals} />
                    </div>
                    <div className="main-content__bottom">
                      <RewardShop dailyPoints={dailyPoints} setDailyPoints={setDailyPoints} />
                    </div>
                  </div>
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
      </div>
    </Router>
  );
}