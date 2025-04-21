// Signup.jsx
import React, { useState } from 'react';
import './Signup.css';

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

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
    console.log('Signup submitted:', { username, email, password });
    onSignupSuccess();
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordMatchError('');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
        <p className="login-link">
          Already have an account? <a href="#" onClick={() => {}}>Log In</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;