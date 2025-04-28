import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';
import studyImage from '../assets/study.jpg';
import workoutImage from '../assets/workout.jpg';
import meditateImage from '../assets/meditate.jpg';
import QuotesManager from './QuotesManager';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to HabitEvolver</h1>
      
      <section className="motivation-section">
        <h2>Why HabitEvolver?</h2>
        <div className="atomic-habits-quotes">
          <QuotesManager type="daily" />
        </div>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={studyImage} alt="Study habits" />
            <h3>Track Daily Progress</h3>
            <p>Monitor your habits and see your improvement over time</p>
          </div>
          <div className="feature-card">
            <img src={workoutImage} alt="Workout habits" />
            <h3>Earn Rewards</h3>
            <p>Get motivated with points and unlock special stickers</p>
          </div>
          <div className="feature-card">
            <img src={meditateImage} alt="Meditation habits" />
            <h3>Build Consistency</h3>
            <p>Create lasting habits with daily streaks and reminders</p>
          </div>
        </div>
      </section>

      <section className="reward-preview">
        <h2>Start Today and Get 100 Points!</h2>
        <p>Begin your journey to better habits and unlock exclusive rewards</p>
      </section>

      <div className="auth-buttons">
        <Link to="/login" className="auth-button login">Login</Link>
        <Link to="/signup" className="auth-button signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default WelcomePage;