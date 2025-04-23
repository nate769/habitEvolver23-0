import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check for saved credentials
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRememberMeChange = (event) => setRememberMe(event.target.checked);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login submitted:', { username, password });
    if (username === 'test' && password === 'password') {
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      onLoginSuccess();
    } else {
      alert('Login failed');
    }
    setPassword('');
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={handleUsernameChange} 
            required 
            placeholder="Enter your username"
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
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={handleRememberMeChange}
            />
            Remember me
          </label>
        </div>
        <button type="submit" className="login-button">Log In</button>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;