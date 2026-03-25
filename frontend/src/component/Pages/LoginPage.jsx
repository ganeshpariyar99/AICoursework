import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store auth details
        localStorage.setItem('token', data.jwtToken);
        localStorage.setItem('loggedInUser', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userId', data.userId);

        // Navigate to previous page or home
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && (
          <div style={{
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <label className="checkbox-label">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <Button type="submit" variant="primary" size="full" isLoading={isLoading}>
            Sign in
          </Button>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>

          <div className="demo-credentials">
            <div style={{ marginBottom: '4px', fontWeight: 600 }}>Demo Credentials:</div>
            <div>User: user@example.com / anypass</div>
          </div>
        </form>
      </div>
    </div>
  );
}
