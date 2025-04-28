import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

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
  const handleResetEmailChange = (event) => setResetEmail(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      setError('No registered users found. Please sign up first.');
      return;
    }

    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      // Set current user
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Call success handler
      onLoginSuccess();
    } else {
      setError('Invalid username or password');
    }
    setPassword('');
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setError('');
    setResetMessage('');
    setIsSending(true);

    try {
      // Get stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === resetEmail);

      if (user) {
        // Generate a temporary reset token
        const resetToken = Math.random().toString(36).substring(2, 15);

        // Store the reset token with the user (for demo, in localStorage)
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        // Update user in localStorage
        const updatedUsers = users.map(u => u.email === resetEmail ? user : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Prepare email parameters
        const templateParams = {
          to_email: resetEmail,
          reset_link: `${window.location.origin}/reset-password?token=${resetToken}`,
          username: user.username
        };

        // Send the email using your real EmailJS credentials
        await emailjs.send(
          'service_f61nxcr',         // Your Service ID
          'template_j0q1jja',        // Your Template ID
          templateParams,
          'Ecymp7ehj63h_1oNs'        // Your Public Key
        );

        setResetMessage('Password reset instructions have been sent to your email.');
        setResetEmail('');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
        }, 3000);
      } else {
        setError('No account found with that email address.');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setError('Failed to send reset email. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      {error && <p className="error-message">{error}</p>}
      {resetMessage && <p className="success-message">{resetMessage}</p>}
      
      {!showForgotPassword ? (
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
          <div className="login-links">
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
            <button 
              type="button" 
              className="forgot-password-link"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleForgotPassword} className="forgot-password-form">
          <h3>Reset Your Password</h3>
          <p className="forgot-password-text">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          <div className="form-group">
            <label htmlFor="resetEmail">Email:</label>
            <input 
              type="email" 
              id="resetEmail" 
              value={resetEmail} 
              onChange={handleResetEmailChange} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="forgot-password-buttons">
            <button 
              type="submit" 
              className="reset-button"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button" 
              className="back-to-login"
              onClick={() => setShowForgotPassword(false)}
              disabled={isSending}
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;