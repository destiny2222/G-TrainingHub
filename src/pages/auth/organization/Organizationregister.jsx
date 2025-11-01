import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Organizationregister.css';

const Organizationregister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1 - Organization Details
    name: '',
    rc_number: '',
    sector: '',
    employee_count: '',
    training_focus_area: '',
    contact_person_name: '',
    official_email: '',
    company_logo: null,
    address: '',
    training_mode: '',
    
    // Step 2 - Admin User Details (only for admin_user method)
    admin_name: '',
    admin_email: '',
    admin_phone: '',
    admin_password: '',
    admin_password_confirmation: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview for logo
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate Step 1 - Basic Organization Info
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.rc_number.trim()) newErrors.rc_number = 'RC number is required';
    if (!formData.sector.trim()) newErrors.sector = 'Sector is required';
    if (!formData.employee_count) newErrors.employee_count = 'Employee count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2 - Contact & Training Details
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.training_focus_area.trim()) newErrors.training_focus_area = 'Training focus area is required';
    if (!formData.contact_person_name.trim()) newErrors.contact_person_name = 'Contact person name is required';
    if (!formData.official_email.trim()) {
      newErrors.official_email = 'Official email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.official_email)) {
      newErrors.official_email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.training_mode) newErrors.training_mode = 'Training mode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3 - Admin Account
  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.admin_name.trim()) newErrors.admin_name = 'Admin name is required';
    if (!formData.admin_email.trim()) {
      newErrors.admin_email = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.admin_email)) {
      newErrors.admin_email = 'Email is invalid';
    }
    if (!formData.admin_phone.trim()) newErrors.admin_phone = 'Admin phone is required';
    if (!formData.admin_password) {
      newErrors.admin_password = 'Password is required';
    } else if (formData.admin_password.length < 8) {
      newErrors.admin_password = 'Password must be at least 8 characters';
    }
    if (!formData.admin_password_confirmation) {
      newErrors.admin_password_confirmation = 'Password confirmation is required';
    } else if (formData.admin_password !== formData.admin_password_confirmation) {
      newErrors.admin_password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate current step first
    if (currentStep === 1) {
      if (!validateStep1()) return;
      handleNext();
      return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      handleNext();
      return;
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('signup_method', 'email_verification');
      submitData.append('name', formData.name);
      submitData.append('rc_number', formData.rc_number);
      submitData.append('sector', formData.sector);
      submitData.append('employee_count', formData.employee_count);
      submitData.append('training_focus_area', formData.training_focus_area);
      submitData.append('contact_person_name', formData.contact_person_name);
      submitData.append('official_email', formData.official_email);
      submitData.append('address', formData.address);
      submitData.append('training_mode', formData.training_mode);

      if (formData.company_logo) {
        submitData.append('company_logo', formData.company_logo);
      }

      // Add admin details - now required for both methods
      submitData.append('admin_name', formData.admin_name);
      submitData.append('admin_email', formData.admin_email);
      submitData.append('admin_phone', formData.admin_phone);
      submitData.append('admin_password', formData.admin_password);
      submitData.append('admin_password_confirmation', formData.admin_password_confirmation);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/api/organization/register`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle success
      if (response.data) {
        toast.success(`Registration successful! A verification email has been sent to ${formData.admin_email}. Please check your email to complete registration.`, {
          autoClose: 5000
        });
        // Redirect to a verification pending page
        navigate('/verification-pending', { state: { email: formData.admin_email } });
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('Please fix the errors in the form.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sector options
  const sectorOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Construction',
    'Other'
  ];

  // Employee count options
  const employeeCountOptions = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  // Training mode options
  const trainingModeOptions = [
    { value: 'online', label: 'Online' },
    { value: 'on-site', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  return (
    <div className="organization-register-container">
      <div className="register-wrapper">
        {/* Left Side - Illustration/Info */}
        <div className="register-left-panel">
          <div className="left-panel-content">
            <div className="brand-section">
              <div className="brand-logo">
                <span className="logo-icon">🎓</span>
                <span className="brand-name">Gritinai</span>
              </div>
            </div>
            
            <div className="illustration-section">
              <div className="illustration-card sessions-card">
                <h4>Sessions</h4>
                <p className="subtitle">This Month</p>
                <div className="stats-bars">
                  <div className="stat-bar purple" style={{ height: '40px' }}></div>
                  <div className="stat-bar blue" style={{ height: '50px' }}></div>
                  <div className="stat-bar purple" style={{ height: '60px' }}></div>
                  <div className="stat-bar blue" style={{ height: '45px' }}></div>
                  <div className="stat-bar green" style={{ height: '55px' }}></div>
                  <div className="stat-bar green" style={{ height: '40px' }}></div>
                  <div className="stat-bar purple" style={{ height: '65px' }}></div>
                  <div className="stat-bar blue" style={{ height: '50px' }}></div>
                </div>
                <div className="stats-number">
                  <span className="big-number">45.1k</span>
                  <span className="percentage">+16.4%</span>
                </div>
              </div>

              <div className="main-illustration">
                <div className="person-illustration">👩‍💼</div>
              </div>

              <div className="illustration-card sales-card">
                <h4>Sales</h4>
                <p className="subtitle">Last Year</p>
                <div className="chart-line">
                  <svg viewBox="0 0 100 40" width="100%" height="60">
                    <path d="M 0,30 Q 25,20 50,25 T 100,15" fill="none" stroke="#10b981" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stats-number">
                  <span className="big-number">175k</span>
                  <span className="percentage negative">-16.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="register-right-panel">
          <div className="form-scroll-container">
            <div className="register-form-header">
              <h1>Adventure starts here 🚀</h1>
              <p>Make your organization management easy and fun!</p>
            </div>

            {/* Step Progress Indicator */}
            <div className="step-progress">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Organization</div>
              </div>
              <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Details</div>
              </div>
              <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Admin Account</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Step 1 - Basic Organization Info */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h3 className="step-title">Basic Organization Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="name">Organization Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your organization name"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="rc_number">RC Number</label>
                    <input
                      type="text"
                      id="rc_number"
                      name="rc_number"
                      value={formData.rc_number}
                      onChange={handleChange}
                      placeholder="Enter RC number"
                      className={errors.rc_number ? 'error' : ''}
                    />
                    {errors.rc_number && <span className="error-message">{errors.rc_number}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="sector">Sector</label>
                      <select
                        id="sector"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        className={errors.sector ? 'error' : ''}
                      >
                        <option value="">Select sector</option>
                        {sectorOptions.map(sector => (
                          <option key={sector} value={sector}>{sector}</option>
                        ))}
                      </select>
                      {errors.sector && <span className="error-message">{errors.sector}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="employee_count">Employee Count</label>
                      <select
                        id="employee_count"
                        name="employee_count"
                        value={formData.employee_count}
                        onChange={handleChange}
                        className={errors.employee_count ? 'error' : ''}
                      >
                        <option value="">Select range</option>
                        {employeeCountOptions.map(count => (
                          <option key={count} value={count}>{count}</option>
                        ))}
                      </select>
                      {errors.employee_count && <span className="error-message">{errors.employee_count}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Contact & Training Details */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h3 className="step-title">Contact & Training Details</h3>
                  
                  <div className="form-group">
                    <label htmlFor="training_focus_area">Training Focus Area</label>
                    <input
                      type="text"
                      id="training_focus_area"
                      name="training_focus_area"
                      value={formData.training_focus_area}
                      onChange={handleChange}
                      placeholder="e.g., AI/ML, Leadership, Sales"
                      className={errors.training_focus_area ? 'error' : ''}
                    />
                    {errors.training_focus_area && <span className="error-message">{errors.training_focus_area}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact_person_name">Contact Person</label>
                    <input
                      type="text"
                      id="contact_person_name"
                      name="contact_person_name"
                      value={formData.contact_person_name}
                      onChange={handleChange}
                      placeholder="Enter contact person name"
                      className={errors.contact_person_name ? 'error' : ''}
                    />
                    {errors.contact_person_name && <span className="error-message">{errors.contact_person_name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="official_email">Official Email</label>
                    <input
                      type="email"
                      id="official_email"
                      name="official_email"
                      value={formData.official_email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={errors.official_email ? 'error' : ''}
                    />
                    {errors.official_email && <span className="error-message">{errors.official_email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter company address"
                      rows="2"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>Training Mode</label>
                    <div className="radio-group-inline">
                      {trainingModeOptions.map(mode => (
                        <label key={mode.value} className="radio-label">
                          <input
                            type="radio"
                            name="training_mode"
                            value={mode.value}
                            checked={formData.training_mode === mode.value}
                            onChange={handleChange}
                          />
                          <span>{mode.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.training_mode && <span className="error-message">{errors.training_mode}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company_logo">Company Logo (optional)</label>
                    <input
                      type="file"
                      id="company_logo"
                      name="company_logo"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {logoPreview && (
                      <div className="logo-preview-small">
                        <img src={logoPreview} alt="Logo preview" />
                      </div>
                    )}
                    {errors.company_logo && <span className="error-message">{errors.company_logo}</span>}
                  </div>
                </div>
              )}

              {/* Step 3 - Admin Account */}
              {currentStep === 3 && (
                <div className="form-step">
                  <h3 className="step-title">Admin Account Details</h3>
                  
                  <div className="form-group">
                    <label htmlFor="admin_name">Admin Name</label>
                    <input
                      type="text"
                      id="admin_name"
                      name="admin_name"
                      value={formData.admin_name}
                      onChange={handleChange}
                      placeholder="Enter admin name"
                      className={errors.admin_name ? 'error' : ''}
                    />
                    {errors.admin_name && <span className="error-message">{errors.admin_name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin_email">Admin Email</label>
                    <input
                      type="email"
                      id="admin_email"
                      name="admin_email"
                      value={formData.admin_email}
                      onChange={handleChange}
                      placeholder="Enter admin email"
                      className={errors.admin_email ? 'error' : ''}
                    />
                    {errors.admin_email && <span className="error-message">{errors.admin_email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin_phone">Admin Phone</label>
                    <input
                      type="tel"
                      id="admin_phone"
                      name="admin_phone"
                      value={formData.admin_phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className={errors.admin_phone ? 'error' : ''}
                    />
                    {errors.admin_phone && <span className="error-message">{errors.admin_phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin_password">Password</label>
                    <input
                      type="password"
                      id="admin_password"
                      name="admin_password"
                      value={formData.admin_password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={errors.admin_password ? 'error' : ''}
                    />
                    {errors.admin_password && <span className="error-message">{errors.admin_password}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin_password_confirmation">Confirm Password</label>
                    <input
                      type="password"
                      id="admin_password_confirmation"
                      name="admin_password_confirmation"
                      value={formData.admin_password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={errors.admin_password_confirmation ? 'error' : ''}
                    />
                    {errors.admin_password_confirmation && <span className="error-message">{errors.admin_password_confirmation}</span>}
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      <span>I agree to <a href="/privacy">privacy policy & terms</a></span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button type="button" className="btn-secondary" onClick={handlePrevious}>
                    Previous
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button type="button" className="btn-submit" onClick={handleNext}>
                    Next
                  </button>
                ) : (
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign up'}
                  </button>
                )}
              </div>

              {currentStep === 1 && (
                <>
                  <div className="form-footer">
                    <p>Already have an account? <a href="/login">Sign in instead</a></p>
                  </div>

                 

                  
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizationregister;
