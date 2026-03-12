import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Call backend API
      const response = await authAPI.login({ email, password });
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Store user info
      const user = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userRole', response.user.role);
      
      // Call parent callback
      onLogin(user, response.user.role);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🎓</span>
          </div>
          <h1 className="login-title">CampusMate</h1>
          <p className="login-subtitle">Smart Student Life Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            <span>{loading ? 'Logging in...' : 'Login'}</span>
            <span className="button-arrow">→</span>
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-link">
            Don't have an account?{' '}
            <Link to="/signup" className="link-text">
              Sign up here
            </Link>
          </p>
          <div className="login-tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">
              Tip: Use email with "cr@" or "cr." for CR role
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
