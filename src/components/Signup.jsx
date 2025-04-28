import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const errors = [];
    if (!hasUpperCase) errors.push('at least one uppercase letter');
    if (!hasLowerCase) errors.push('at least one lowercase letter');
    if (!hasNumbers) errors.push('at least one number');
    if (!hasSpecialChar) errors.push('at least one special character');
    if (!isLongEnough) errors.push('at least 8 characters long');

    return errors;
  };

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (confirmPassword) {
      setPasswordMatchError(event.target.value !== confirmPassword ? 'Passwords do not match' : '');
    }
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatchError(event.target.value !== password ? 'Passwords do not match' : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain ${passwordErrors.join(', ')}`);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Check if username already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some(user => user.username === username)) {
      setError('Username already exists');
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      username,
      email,
      password,
      isFirstLogin: true,
      dateJoined: new Date().toISOString(),
      points: 100, // Initial signup bonus points
      goals: [],
      achievements: {
        weeklyStreak: false,
        tenHabits: false,
        consistentWeek: false
      }
    };

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setSuccess(true);
      setTimeout(() => {
        onSignupSuccess();
        navigate('/');
      }, 1500);
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Start Your Habit Evolution Journey</h2>
      <p className="signup-bonus">🎉 Sign up now and receive 100 points to start your journey!</p>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Account created successfully! Redirecting...</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={handleUsernameChange} 
            required 
            placeholder="Choose a username"
            disabled={isLoading}
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
            placeholder="Enter your email"
            disabled={isLoading}
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
            placeholder="Create a password"
            minLength="8"
            disabled={isLoading}
          />
          <small className="password-requirements">
            Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange} 
            required 
            placeholder="Confirm your password"
            minLength="8"
            disabled={isLoading}
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}
        </div>
        
        <button 
          type="submit" 
          className={`signup-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Start Your Journey'}
        </button>
        
        <p className="login-link">
          Already evolving? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;