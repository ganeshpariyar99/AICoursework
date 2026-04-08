import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim().toLowerCase().endsWith('@gmail.com')) {
      setError("email doesnot match");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName, // Map fullName to name for backend
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Success, redirect to login
        alert("Registration successful! Please login.");
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create an account</h2>
        <p className="auth-subtitle">Join E-GadgetHive to start shopping</p>

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
            <label className="form-label">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Name"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              name="email"
              type="email"
              placeholder="name@gmail.com"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="full" isLoading={isLoading} style={{ marginTop: '1rem' }}>
            Create Account
          </Button>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
