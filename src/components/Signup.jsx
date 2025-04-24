import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatchError(event.target.value !== password ? 'Passwords do not match' : '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }

    // Store user data
    const userData = {
      username,
      email,
      password, // In a real app, this should be hashed
      isFirstLogin: true,
      dateJoined: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isRegistered', 'true');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <h2>Start Your Habit Evolution Journey</h2>
      <p className="signup-bonus">🎉 Sign up now and receive 100 points to start your journey!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={handleUsernameChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={handleEmailChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={handlePasswordChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange} 
            required 
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}
        </div>
        
        <button type="submit" className="signup-button">
          Start Your Journey
        </button>
        
        <p className="login-link">
          Already evolving? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;