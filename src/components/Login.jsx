import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate hook

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (username === 'test' && password === 'password') {
        onLoginSuccess();
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" role="main" aria-labelledby="login-title">
      <h2 id="login-title">Welcome Back!</h2>
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'login-error' : undefined}
            disabled={isLoading}
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'login-error' : undefined}
              disabled={isLoading}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && (
          <p className="error-message" id="login-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="login-button"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          <span className="button-text">
            {isLoading ? 'Logging in...' : 'Log In'}
          </span>
        </button>

        <p className="signup-link">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')} // Navigate to /signup
            className="text-button"
            aria-label="Switch to sign up form"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default Login;