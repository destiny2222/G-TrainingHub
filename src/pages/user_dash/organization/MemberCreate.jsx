import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Add, 
  User, 
  Sms, 
  Lock, 
  Crown,
  InfoCircle,
  TickCircle,
  CloseCircle
} from 'iconsax-reactjs';
import { toast } from 'react-toastify';
import {
  createOrganizationMember,
  bulkCreateOrganizationMembers,
  addExistingUsersAsMembers,
  clearError,
  clearSuccess
} from '../../../redux/slices/organisationUserSlice';
import { useAuth } from '../../../contexts/AuthContext';

const MemberCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redux state
  const { loading, error, success } = useSelector(state => state.organizationUser);

  // Form state
  const [creationMethod, setCreationMethod] = useState('single'); // 'single', 'bulk', 'existing'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    send_invitation: true
  });
  
  // Bulk creation state
  const [bulkMembers, setBulkMembers] = useState([
    { name: '', email: '', role: 'member' }
  ]);
  
  // Existing users state
  const [existingUserEmails, setExistingUserEmails] = useState(['']);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizationSlug = user?.organization?.slug;

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success('Member(s) created successfully!');
      dispatch(clearSuccess());
      navigate('/organization/members');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (creationMethod === 'single') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password.trim()) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (creationMethod === 'bulk') {
      bulkMembers.forEach((member, index) => {
        if (!member.name.trim()) newErrors[`bulk_name_${index}`] = 'Name is required';
        if (!member.email.trim()) newErrors[`bulk_email_${index}`] = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
          newErrors[`bulk_email_${index}`] = 'Please enter a valid email address';
        }
      });
    } else if (creationMethod === 'existing') {
      existingUserEmails.forEach((email, index) => {
        if (!email.trim()) newErrors[`existing_email_${index}`] = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          newErrors[`existing_email_${index}`] = 'Please enter a valid email address';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (creationMethod === 'single') {
        await dispatch(createOrganizationMember({
          organization: organizationSlug,
          memberData: formData
        }));
      } else if (creationMethod === 'bulk') {
        await dispatch(bulkCreateOrganizationMembers({
          organization: organizationSlug,
          membersData: { members: bulkMembers }
        }));
      } else if (creationMethod === 'existing') {
        await dispatch(addExistingUsersAsMembers({
          organization: organizationSlug,
          userData: { emails: existingUserEmails.filter(email => email.trim()) }
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add bulk member row
  const addBulkMemberRow = () => {
    setBulkMembers(prev => [...prev, { name: '', email: '', role: 'member' }]);
  };

  // Remove bulk member row
  const removeBulkMemberRow = (index) => {
    setBulkMembers(prev => prev.filter((_, i) => i !== index));
  };

  // Handle bulk member change
  const handleBulkMemberChange = (index, field, value) => {
    setBulkMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
    // Clear error
    const errorKey = `bulk_${field}_${index}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  // Add existing user email row
  const addExistingUserRow = () => {
    setExistingUserEmails(prev => [...prev, '']);
  };

  // Remove existing user email row
  const removeExistingUserRow = (index) => {
    setExistingUserEmails(prev => prev.filter((_, i) => i !== index));
  };

  // Handle existing user email change
  const handleExistingUserChange = (index, value) => {
    setExistingUserEmails(prev => prev.map((email, i) => 
      i === index ? value : email
    ));
    // Clear error
    const errorKey = `existing_email_${index}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Link 
          to="/organization/members" 
          className="btn btn-outline-secondary me-3 d-flex align-items-center"
        >
          <ArrowLeft size="20" className="me-2" />
          Back to Members
        </Link>
        <div>
          <h1 className="h3 mb-1">Add New Members</h1>
          <p className="text-muted mb-0">Invite new team members to your organization</p>
        </div>
      </div>

      {/* Creation Method Tabs */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="nav nav-pills nav-fill" role="tablist">
                <button
                  className={`nav-link ${creationMethod === 'single' ? 'active' : ''}`}
                  onClick={() => setCreationMethod('single')}
                >
                  <User size="20" className="me-2" />
                  Single Member
                </button>
                <button
                  className={`nav-link ${creationMethod === 'bulk' ? 'active' : ''}`}
                  onClick={() => setCreationMethod('bulk')}
                >
                  <Add size="20" className="me-2" />
                  Multiple Members
                </button>
                <button
                  className={`nav-link ${creationMethod === 'existing' ? 'active' : ''}`}
                  onClick={() => setCreationMethod('existing')}
                >
                  <Sms size="20" className="me-2" />
                  Existing Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Single Member Form */}
        {creationMethod === 'single' && (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Member Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <User size="20" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Sms size="20" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size="20" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                  <small className="form-text text-muted">
                    Password must be at least 6 characters long
                  </small>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Role <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Crown size="20" />
                    </span>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="send_invitation"
                      id="send_invitation"
                      className="form-check-input"
                      checked={formData.send_invitation}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="send_invitation">
                      Send invitation email to the new member
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Members Form */}
        {creationMethod === 'bulk' && (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Multiple Members</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={addBulkMemberRow}
              >
                <Add size="16" className="me-1" />
                Add Row
              </button>
            </div>
            <div className="card-body">
              {bulkMembers.map((member, index) => (
                <div key={index} className="row mb-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`bulk_name_${index}`] ? 'is-invalid' : ''}`}
                      placeholder="Enter full name"
                      value={member.name}
                      onChange={(e) => handleBulkMemberChange(index, 'name', e.target.value)}
                    />
                    {errors[`bulk_name_${index}`] && (
                      <div className="invalid-feedback">{errors[`bulk_name_${index}`]}</div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${errors[`bulk_email_${index}`] ? 'is-invalid' : ''}`}
                      placeholder="Enter email address"
                      value={member.email}
                      onChange={(e) => handleBulkMemberChange(index, 'email', e.target.value)}
                    />
                    {errors[`bulk_email_${index}`] && (
                      <div className="invalid-feedback">{errors[`bulk_email_${index}`]}</div>
                    )}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={member.role}
                      onChange={(e) => handleBulkMemberChange(index, 'role', e.target.value)}
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-1">
                    {bulkMembers.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeBulkMemberRow(index)}
                      >
                        <CloseCircle size="16" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="alert alert-info">
                <InfoCircle size="20" className="me-2" />
                <strong>Note:</strong> Temporary passwords will be generated for bulk-created members. 
                They will receive invitation emails to set their own passwords.
              </div>
            </div>
          </div>
        )}

        {/* Existing Users Form */}
        {creationMethod === 'existing' && (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Add Existing Users</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={addExistingUserRow}
              >
                <Add size="16" className="me-1" />
                Add Email
              </button>
            </div>
            <div className="card-body">
              {existingUserEmails.map((email, index) => (
                <div key={index} className="row mb-3 align-items-end">
                  <div className="col-md-11">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${errors[`existing_email_${index}`] ? 'is-invalid' : ''}`}
                      placeholder="Enter existing user's email address"
                      value={email}
                      onChange={(e) => handleExistingUserChange(index, e.target.value)}
                    />
                    {errors[`existing_email_${index}`] && (
                      <div className="invalid-feedback">{errors[`existing_email_${index}`]}</div>
                    )}
                  </div>
                  <div className="col-md-1">
                    {existingUserEmails.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeExistingUserRow(index)}
                      >
                        <CloseCircle size="16" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="alert alert-warning">
                <InfoCircle size="20" className="me-2" />
                <strong>Note:</strong> These users must already have accounts in the system. 
                They will be invited to join your organization and can accept or decline the invitation.
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="card mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                {creationMethod === 'single' && 'Ready to add 1 member'}
                {creationMethod === 'bulk' && `Ready to add ${bulkMembers.length} members`}
                {creationMethod === 'existing' && `Ready to invite ${existingUserEmails.filter(e => e.trim()).length} existing users`}
              </div>
              <div className="d-flex gap-2">
                <Link 
                  to="/organization/members" 
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <TickCircle size="20" className="me-2" />
                      {creationMethod === 'existing' ? 'Send Invitations' : 'Create Members'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberCreate;