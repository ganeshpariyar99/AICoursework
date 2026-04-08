import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8081/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8081/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('OTP Verified. Please enter your new password.');
        setStep(3);
      } else {
        setError(data.message || 'Invalid or expired OTP');
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8081/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">
          {step === 1 && "Enter your email to receive an OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Enter your new password"}
        </p>

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
        
        {message && (
          <div style={{
            color: '#16a34a',
            backgroundColor: '#dcfce7',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
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
            <Button type="submit" variant="primary" size="full" isLoading={isLoading}>
              Send OTP
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label className="form-label">OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" size="full" isLoading={isLoading}>
              Verify OTP
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" size="full" isLoading={isLoading}>
              Reset Password
            </Button>
          </form>
        )}

        <div className="auth-footer" style={{ marginTop: '1rem' }}>
          Back to <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
