import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Organizationregister.css';

const Organizationregister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [signupMethod, setSignupMethod] = useState('email_verification');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

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

  // Handle signup method change
  const handleSignupMethodChange = (method) => {
    setSignupMethod(method);
    setErrors({});
  };

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.rc_number.trim()) newErrors.rc_number = 'RC number is required';
    if (!formData.sector.trim()) newErrors.sector = 'Sector is required';
    if (!formData.employee_count) newErrors.employee_count = 'Employee count is required';
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

  // Validate Step 2 (only for admin_user method)
  const validateStep2 = () => {
    if (signupMethod === 'email_verification') return true;

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
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(1);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('signup_method', signupMethod);
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

      // Add admin details if signup method is admin_user
      if (signupMethod === 'admin_user') {
        submitData.append('admin_name', formData.admin_name);
        submitData.append('admin_email', formData.admin_email);
        submitData.append('admin_phone', formData.admin_phone);
        submitData.append('admin_password', formData.admin_password);
        submitData.append('admin_password_confirmation', formData.admin_password_confirmation);
      }

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
        if (signupMethod === 'email_verification') {
          alert('Registration successful! Please check your email for verification.');
        } else {
          alert('Registration successful! You can now log in.');
        }
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Registration failed. Please try again.');
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
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  return (
    <div className="organization-register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Organization Registration</h1>
          <p>Join our training platform and empower your team</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Organization Details</div>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">
              {signupMethod === 'email_verification' ? 'Verification Method' : 'Admin Account'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Organization Details */}
          {currentStep === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="name">Organization Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter organization name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rc_number">RC Number *</label>
                  <input
                    type="text"
                    id="rc_number"
                    name="rc_number"
                    value={formData.rc_number}
                    onChange={handleChange}
                    placeholder="e.g., RC123456"
                    className={errors.rc_number ? 'error' : ''}
                  />
                  {errors.rc_number && <span className="error-message">{errors.rc_number}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="sector">Sector *</label>
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="employee_count">Employee Count *</label>
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

                <div className="form-group">
                  <label htmlFor="training_focus_area">Training Focus Area *</label>
                  <input
                    type="text"
                    id="training_focus_area"
                    name="training_focus_area"
                    value={formData.training_focus_area}
                    onChange={handleChange}
                    placeholder="e.g., AI/ML, Web Development"
                    className={errors.training_focus_area ? 'error' : ''}
                  />
                  {errors.training_focus_area && <span className="error-message">{errors.training_focus_area}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact_person_name">Contact Person Name *</label>
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
                <label htmlFor="official_email">Official Email *</label>
                <input
                  type="email"
                  id="official_email"
                  name="official_email"
                  value={formData.official_email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  className={errors.official_email ? 'error' : ''}
                />
                {errors.official_email && <span className="error-message">{errors.official_email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="company_logo">Company Logo</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="company_logo"
                    name="company_logo"
                    onChange={handleChange}
                    accept="image/*"
                    className={errors.company_logo ? 'error' : ''}
                  />
                  {logoPreview && (
                    <div className="logo-preview">
                      <img src={logoPreview} alt="Logo preview" />
                    </div>
                  )}
                </div>
                {errors.company_logo && <span className="error-message">{errors.company_logo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows="3"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="training_mode">Training Mode *</label>
                <div className="radio-group">
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

              <div className="form-actions">
                <button type="button" onClick={handleNext} className="btn btn-primary">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Signup Method & Admin Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <div className="signup-method-selector">
                <h3>Choose Signup Method</h3>
                <div className="method-cards">
                  <div
                    className={`method-card ${signupMethod === 'email_verification' ? 'selected' : ''}`}
                    onClick={() => handleSignupMethodChange('email_verification')}
                  >
                    <div className="method-icon">📧</div>
                    <h4>Email Verification</h4>
                    <p>We'll send a verification link to complete registration</p>
                  </div>
                  <div
                    className={`method-card ${signupMethod === 'admin_user' ? 'selected' : ''}`}
                    onClick={() => handleSignupMethodChange('admin_user')}
                  >
                    <div className="method-icon">👤</div>
                    <h4>Create Admin Account</h4>
                    <p>Set up an admin account immediately</p>
                  </div>
                </div>
              </div>

              {/* Admin User Details (only shown when admin_user method is selected) */}
              {signupMethod === 'admin_user' && (
                <div className="admin-details-section">
                  <h3>Admin Account Details</h3>
                  
                  <div className="form-group">
                    <label htmlFor="admin_name">Admin Name *</label>
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
                    <label htmlFor="admin_email">Admin Email *</label>
                    <input
                      type="email"
                      id="admin_email"
                      name="admin_email"
                      value={formData.admin_email}
                      onChange={handleChange}
                      placeholder="admin@company.com"
                      className={errors.admin_email ? 'error' : ''}
                    />
                    {errors.admin_email && <span className="error-message">{errors.admin_email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin_phone">Admin Phone *</label>
                    <input
                      type="tel"
                      id="admin_phone"
                      name="admin_phone"
                      value={formData.admin_phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className={errors.admin_phone ? 'error' : ''}
                    />
                    {errors.admin_phone && <span className="error-message">{errors.admin_phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin_password">Password *</label>
                    <input
                      type="password"
                      id="admin_password"
                      name="admin_password"
                      value={formData.admin_password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className={errors.admin_password ? 'error' : ''}
                    />
                    {errors.admin_password && <span className="error-message">{errors.admin_password}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="admin_password_confirmation">Confirm Password *</label>
                    <input
                      type="password"
                      id="admin_password_confirmation"
                      name="admin_password_confirmation"
                      value={formData.admin_password_confirmation}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className={errors.admin_password_confirmation ? 'error' : ''}
                    />
                    {errors.admin_password_confirmation && <span className="error-message">{errors.admin_password_confirmation}</span>}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={handlePrevious} className="btn btn-secondary">
                  Previous
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Organizationregister;
