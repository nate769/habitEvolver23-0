// Login.jsx
import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login submitted:', { username, password });
    if (username === 'test' && password === 'password') {
      onLoginSuccess();
    } else {
      alert('Login failed');
    }
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" className="login-button">Log In</button>
        <p className="signup-link">
          Don't have an account? <a href="#" onClick={() => {}}>Sign Up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;