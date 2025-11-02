import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Login.css';
import slideOne from '../../assets/image/auth/auth-register-illustration-light.png';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
          remember_me: rememberMe
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle success
      if (response.data) {
        toast.success('Login successful! Welcome back.', {
          autoClose: 3000
        });

        // Store authentication data
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        }

        // Redirect based on user role
        const userRole = response.data.user?.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'organization') {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('Please fix the errors in the form.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.response?.status === 422) {
        toast.error('Please verify your email before logging in.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    pauseOnHover: true,
    appendDots: dots => (
      <div className="slider-dots">
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="dot"></div>
    )
  };

  // Slider content data
  const slides = [
    {
      title: "Welcome Back to Gritinai",
      description: "Continue your journey in transforming your organization with cutting-edge training programs and comprehensive learning management.",
      image: slideOne
    },
    {
      title: "Access Your Dashboard",
      description: "Manage your courses, track progress, and analyze performance metrics all in one centralized platform designed for efficiency.",
      image: slideOne
    },
    {
      title: "Resume Your Training",
      description: "Pick up where you left off and continue building your team's skills with our personalized learning paths and data-driven insights.",
      image: slideOne
    }
  ];

  return (
    <div className="user-login-container">
      <div className="user-login-wrapper">
        {/* Left Side - Form */}
        <div className="user-login-left-panel">
          <div className="form-scroll-container">
            <div className="user-login-form-header">
              <h1>Log In to Explore</h1>
              <p>Navigate your organization's training journey with comprehensive learning</p>
            </div>

            <form onSubmit={handleSubmit} className="user-login-form">
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={errors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="form-options">
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember Me</span>
                    </label>
                  </div>
                  <button 
                    type="button" 
                    className="forgot-password-link"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Signing In...' : 'Login'}
                </button>

                {/* Sign Up Link */}
                <div className="form-footer">
                  <p>Register as an organization? <Link to="/organization/register">Sign Up</Link></p>
                </div>

                {/* Divider */}
                <div className="divider">
                  <span>OR CONTINUE WITH</span>
                </div>

                {/* Social Login (Optional) */}
                <div className="auth-social-login">
                  <button type="button" className="btn-social google">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Slider/Carousel */}
        <div className="user-login-right-panel">
          <div className="slider-overlay"></div>
          <div className="slider-content">
            <div className="brand-section">
              <div className="brand-logo">
                <span className="logo-icon">🎓</span>
                <span className="brand-name">Gritinai</span>
              </div>
            </div>

            <div className="slider-main">
              <Slider {...sliderSettings}>
                {slides.map((slide, index) => (
                  <div key={index} className="slide-item">
                    <div className="slide-content">
                      <div className="slide-text">
                        <h2>{slide.title}</h2>
                        <p>{slide.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
