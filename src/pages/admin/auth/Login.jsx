import React, { useState } from 'react';
import { useLogin } from '../../../hooks/useLogin';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    field: '',
    password: '',
  });

  const { login, isLoading, error } = useLogin();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData, 'admin', '/admin/dashboard');
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="field">Email/Username</label>
              <input
                type="text"
                id="field"
                name="field"
                placeholder="Enter your email or username"
                value={formData.field}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
