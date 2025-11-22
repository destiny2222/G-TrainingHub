import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VerificationPending.css';

const VerificationPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Email address not found. Please register again.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/organization/resend-verification`,
        { email }
      );

      if (response.data) {
        toast.success('Verification email sent successfully! Please check your inbox.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-pending-container">
      <div className="verification-card">
        <div className="verification-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1>Check Your Email</h1>
        <p className="subtitle">
          We've sent a verification link to
        </p>
        <p className="email-address">{email}</p>
        
        <div className="info-box">
          <p>
            Click the link in the email to verify your organization and complete the registration process.
          </p>
        </div>

        <div className="actions">
          <p className="resend-text">Didn't receive the email?</p>
          <button 
            onClick={handleResendVerification} 
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>

        <div className="footer-links">
          <button onClick={() => navigate('/organization/register')} className="link-button">
            Back to Registration
          </button>
          <span className="separator">|</span>
          <button onClick={() => navigate('/login')} className="link-button">
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
