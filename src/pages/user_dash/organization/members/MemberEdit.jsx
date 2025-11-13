import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Sms, 
  Crown,
  Save2,
  RefreshCircle,
  Trash,
  Calendar,
  Award
} from 'iconsax-reactjs';
import { toast } from 'react-toastify';
import {
  editOrganizationMember,
  updateOrganizationMember,
  deleteOrganizationMember,
  clearError,
  clearSuccess
} from '../../../../redux/slices/organisationUserSlice';
import './member.css';

const MemberEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memberId } = useParams();
  const { member, loading, error,  success } = useSelector(state => state.organizationUser);
  // const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
 
  // Fetch member data on component mount
  useEffect(() => {
    if (memberId) {
      dispatch(editOrganizationMember({ organizationUserId: memberId }));
    }
  }, [dispatch,  memberId]);


  useEffect(() => {
    // if member exists (i.e., data has loaded)
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || 'member',
        phone: member.phone || '',
        is_admin: member.is_admin || false,
        status: member.status || 'active'
      });
    }
  }, [member]);
  

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    phone: '',
    is_admin: false,
    status: 'active'
  });
  




  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    } else if (!['member', 'admin'].includes(formData.role)) {
      newErrors.role = 'Please select a valid role';
    }

    // if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
    //   newErrors.phone = 'Please enter a valid phone number';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const result = await dispatch(updateOrganizationMember({
        organizationUserId: memberId,
        memberData: formData
      }));

      // Check if the action was rejected
      if (updateOrganizationMember.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update member');
        return;
      }

      // Check if the action was fulfilled
      if (updateOrganizationMember.fulfilled.match(result)) {
        toast.success('Member updated successfully!');
        // navigate back to member list page
        setTimeout(() => {
          navigate('/organization/members');
        }, 1500);
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle delete member
  const handleDeleteMember = async () => {
    try {
      await dispatch(deleteOrganizationMember({
        organizationUser: memberId
      }));
      toast.success('Member removed successfully!');
      navigate('/organization/members');
    } catch (error) {
      toast.error('Failed to remove member');
    }
    setShowDeleteModal(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // return to member details page
  }

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <h4>Member not found</h4>
          <p className="text-muted">The member you're looking for doesn't exist or has been removed.</p>
          <Link to="/organization/members" className="btn btn-primary">
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="member-edit-container">
      {/* Header */}
      <div className="member-edit-header d-flex align-items-center justify-content-between mb-4 fade-in-up">
        <div className="d-flex flex-column align-items-start">
          <Link 
            to="/organization/members" 
            className="back-btn mb-4"
          >
            <ArrowLeft size="20" />
            Back to Members
          </Link>
          <div>
            <h1>Member Details</h1>
            <p>View and manage member information</p>
          </div>
        </div>
        
        <div className="action-buttons">
          
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="editMemberForm"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save2 size="20" />
                    Save Changes
                  </>
                )}
              </button>
            </>
        </div>
      </div>

      <div className="row fade-in-up">
        {/* Member Information Card */}
        <div className="col-lg-8 mb-4">
          <div className="member-info-card shadow-sm">
            <div className="member-info-header">
              <h5>Member Information</h5>
            </div>
            <div className="member-info-body">
                <form id="editMemberForm" onSubmit={handleSubmit}>
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
                          aria-label="Full Name"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="form-text">
                        Please enter the member's full name as it should appear in the organization.
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
                          aria-label="Email Address"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                      <div className="form-text">
                        We'll use this email to send notifications and updates to the member.
                      </div>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          aria-label="Phone Number"
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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
                          className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                          value={formData.role}
                          onChange={handleInputChange}
                          aria-label="Role"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                        {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                      </div>
                      <div className="form-text">
                        Assign a role to the member that defines their permissions in the organization.
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                        aria-label="Status"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                      <div className="form-text">
                        Set the member's status to control their access to organization resources.
                      </div>
                    </div>
                  </div>
                </form>
            </div>
          </div>
        </div>

        {/* Member Statistics Card */}
        <div className="col-lg-4 mb-4">
          <div className="member-stats-card shadow-sm">
            <div className="member-stats-header">
              <h5>Member Statistics</h5>
            </div>
            <div className="member-stats-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="stat-item">
                    <Calendar size="24" className="stat-icon text-primary" />
                    <h6 className="stat-label">Joined Date</h6>
                    <small className="stat-value">
                      {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                    </small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="stat-item">
                    <RefreshCircle size="24" className="stat-icon text-success" />
                    <h6 className="stat-label">Last Updated</h6>
                    <small className="stat-value">
                      {member.updated_at ? new Date(member.updated_at).toLocaleDateString() : 'N/A'}
                    </small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="stat-item">
                    <Award size="24" className="stat-icon text-warning" />
                    <h6 className="stat-label">Courses</h6>
                    <small className="stat-value">
                      {member.courses_count || 0}
                    </small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="stat-item">
                    <Crown size="24" className="stat-icon text-info" />
                    <h6 className="stat-label">Certifications</h6>
                    <small className="stat-value">
                      {member.certifications_count || 0}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              <Trash size="48" />
            </div>
            <h6>Remove {member.name} from organization?</h6>
            <p>
              This action cannot be undone. The member will lose access to all organization resources 
              and will need to be re-invited if you want to add them back.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteMember}
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberEdit;