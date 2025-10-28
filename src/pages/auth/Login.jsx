import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [field, setField] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token); // Store the token
        navigate('/admin/dashboard'); // Redirect to admin dashboard
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'Network error or server is unreachable');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page-wrapper"> 
      <div className="login-container">
        <div className="login-left-panel">
          <div className="admin-panel-header">
            <i className="fas fa-file-alt admin-icon"></i>
            <span>Admin Panel</span>
          </div>
          <div className="empowering-text">
            <h1>Empowering Connections, Driven by AI.</h1>
            <ul>
              <li><i className="fas fa-users"></i> Manage Users Seamlessly</li>
              <li><i className="fas fa-handshake"></i> Connect Mentors and Mentees</li>
              <li><i className="fas fa-lightbulb"></i> Optimize with AI Insights</li>
            </ul>
          </div>
        </div>
        <div className="login-right-panel">
          <div className="login-form-header">
            <span className="active">Log In</span>
          </div>
          <div className="welcome-message">
            <h2>Welcome Back</h2>
            <p>Log in to your account.</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
              <label htmlFor="email">Email/Username</label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email or username"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
              />
            </div>
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          {/* <div className="or-continue-with">
            <hr />
            <span>Or continue with</span>
            <hr />
          </div>
          <div className="social-login">
            <button className="social-button google">
              <i className="fab fa-google"></i> Google 
            </button>
            <button className="social-button linkedin">
              <i className="fab fa-linkedin-in"></i> LinkedIn 
            </button>
          </div> */}
          {/* <p className="terms-privacy">
            By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
