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
  bulkCreateOrganizationMembers
} from '../../../../redux/slices/organisationUserSlice';
import './member.css';

const MemberCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.organizationUser);

  // Form state
  const [creationMethod, setCreationMethod] = useState('single');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    phone: '',
    send_invitation: true,
    // organization_id:  userDetails?.organization_id ||  ''
  });
  
  // Bulk creation state
  const [bulkMembers, setBulkMembers] = useState([
    { name: '', email: '', role: 'member', phone: '' }
  ]);
  
  // Existing users state (for future feature)
  const [existingUserEmails] = useState(['']);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (creationMethod === 'single') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!['member', 'admin'].includes(formData.role)) {
        newErrors.role = 'Please select a valid role';
      }
    
    } else if (creationMethod === 'bulk') {
      bulkMembers.forEach((member, index) => {
        if (!member.name.trim()) newErrors[`bulk_name_${index}`] = 'Name is required';
        if (!member.email.trim()) newErrors[`bulk_email_${index}`] = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
          newErrors[`bulk_email_${index}`] = 'Please enter a valid email address';
        }
        if (!['member', 'admin'].includes(member.role)) {
          newErrors[`bulk_role_${index}`] = 'Please select a valid role';
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
        // Send the data directly, not wrapped in memberData
       const res = await dispatch(createOrganizationMember(formData)).unwrap();
        toast.success(res.data.message || 'Member created successfully!');
        setTimeout(() => {
          navigate('/organization/members');
        }, 1500);
        
      } else if (creationMethod === 'bulk') {
        await dispatch(bulkCreateOrganizationMembers({
          membersData: { members: bulkMembers }
        })).unwrap();
        toast.success('Members created successfully!');
        setTimeout(() => {
          navigate('/organization/members');
        }, 1500);
      }
    } catch (error) {
      // Error is already handled by Redux slice, just show it
      toast.error(error || 'An error occurred while creating members.');
      // console.error('Member creation error:', error);
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
    setBulkMembers(prev => [...prev, { name: '', email: '', phone: '', role: 'member' }]);
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



  return (
    <div className="member-create-container">
      {/* Header */}
      <div className="member-create-header d-flex flex-wrap justify-content-between align-items-center mb-4 fade-in-up">
        <Link 
          to="/organization/members" 
          className="back-btn me-3 mb-4 mb-md-0"
        >
          <ArrowLeft size="20" />
          Back to Members
        </Link>
        <div className="mb-4 mb-md-0">
          <h1>Add New Members</h1>
          <p>Invite new team members to your organization</p>
        </div>
      </div>

      {/* Creation Method Tabs */}
      <div className="method-tabs-card fade-in-up">
        <div className="method-tabs">
          <button
            type="button"
            className={`method-tab ${creationMethod === 'single' ? 'active' : ''}`}
            onClick={() => setCreationMethod('single')}
          >
            <User size="20" />
            Single Member
          </button>
          <button
            type="button"
            className={`method-tab ${creationMethod === 'bulk' ? 'active' : ''}`}
            onClick={() => setCreationMethod('bulk')}
          >
            <Add size="20" />
            Multiple Members
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="fade-in-up">
        {/* Single Member Form */}
        {creationMethod === 'single' && (
          <div className="form-card">
            <div className="form-card-header">
              <h5>Member Information</h5>
            </div>
            <div className="form-card-body">
              <div className="row">
                <div className="col-md-12 mb-3">
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
                      aria-label="Full Name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>

                <div className="col-md-12 mb-3">
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
                      aria-label="Email Address"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Sms size="20" />
                    </span>
                    <input
                      type="text"
                      name="phone"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      aria-label="Phone Number"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                </div>

                <div className="col-md-12 mb-3">
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
                      aria-label="Role"
                    >
                      <option value="member">Member</option>
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
          <div className="form-card">
            <div className="form-card-header d-flex justify-content-between align-items-center">
              <h5>Multiple Members</h5>
              <button
                type="button"
                className="add-row-btn"
                onClick={addBulkMemberRow}
                aria-label="Add Bulk Member Row"
              >
                <Add size="16" />
                Add Row
              </button>
            </div>
            <div className="form-card-body">
              {bulkMembers.map((member, index) => (
                <div key={index} className="bulk-member-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`bulk_name_${index}`] ? 'is-invalid' : ''}`}
                      placeholder="Enter full name"
                      value={member.name}
                      onChange={(e) => handleBulkMemberChange(index, 'name', e.target.value)}
                      aria-label={`Bulk Member ${index + 1} Full Name`}
                    />
                    {errors[`bulk_name_${index}`] && (
                      <div className="invalid-feedback">{errors[`bulk_name_${index}`]}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${errors[`bulk_email_${index}`] ? 'is-invalid' : ''}`}
                      placeholder="Enter email address"
                      value={member.email}
                      onChange={(e) => handleBulkMemberChange(index, 'email', e.target.value)}
                      aria-label={`Bulk Member ${index + 1} Email Address`}
                    />
                    {errors[`bulk_email_${index}`] && (
                      <div className="invalid-feedback">{errors[`bulk_email_${index}`]}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`bulk_phone_${index}`] ? 'is-invalid' : ''}`}
                      placeholder="Enter phone number"
                      value={member.phone}
                      onChange={(e) => handleBulkMemberChange(index, 'phone', e.target.value)}
                      aria-label={`Bulk Member ${index + 1} Phone Number`}
                    />
                    {errors[`bulk_phone_${index}`] && (
                      <div className="invalid-feedback">{errors[`bulk_phone_${index}`]}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={member.role}
                      onChange={(e) => handleBulkMemberChange(index, 'role', e.target.value)}
                      aria-label={`Bulk Member ${index + 1} Role`}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  {bulkMembers.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeBulkMemberRow(index)}
                      aria-label={`Remove Bulk Member ${index + 1}`}
                    >
                      <CloseCircle size="16" />
                    </button>
                  )}
                </div>
              ))}
              

              <div className="alert alert-info">
                <InfoCircle size="20" />
                <strong>Note:</strong> Temporary passwords will be generated for bulk-created members. 
                They will receive invitation emails to set their own passwords.
              </div>
            </div>
          </div>
        )}


        {/* Form Actions */}
        <div className="form-actions">
          <div className="text-muted">
            {creationMethod === 'single' && 'Ready to add 1 member'}
            {creationMethod === 'bulk' && `Ready to add ${bulkMembers.length} members`}
          </div>
          <div className="d-flex gap-2">
            <Link 
              to="/organization/members" 
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  <TickCircle size="20" />
                  {creationMethod === 'existing' ? 'Send Invitations' : 'Create Members'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberCreate;