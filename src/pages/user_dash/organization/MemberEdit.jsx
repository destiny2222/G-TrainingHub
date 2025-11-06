import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Sms, 
  Crown,
  Edit2,
  Save2,
  RefreshCircle,
  InfoCircle,
  Trash,
  Calendar,
  Award
} from 'iconsax-reactjs';
import { toast } from 'react-toastify';
import {
  getOrganizationMember,
  updateOrganizationMember,
  deleteOrganizationMember,
  clearError,
  clearSuccess
} from '../../../redux/slices/organisationUserSlice';
import { useAuth } from '../../../contexts/AuthContext';

const MemberEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memberId } = useParams();
  const { user } = useAuth();
  
  // Redux state
  const { 
    member, 
    loading, 
    error, 
    success 
  } = useSelector(state => state.organizationUser);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    status: 'active'
  });
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const organizationSlug = user?.organization?.slug;

  // Fetch member data on component mount
  useEffect(() => {
    if (organizationSlug && memberId) {
      dispatch(getOrganizationMember({
        organization: organizationSlug,
        organizationUser: memberId
      }));
    }
  }, [dispatch, organizationSlug, memberId]);

  // Update form data when member data is loaded
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || 'member',
        status: member.status || 'active'
      });
    }
  }, [member]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success('Member updated successfully!');
      dispatch(clearSuccess());
      setIsEditing(false);
      // Refresh member data
      dispatch(getOrganizationMember({
        organization: organizationSlug,
        organizationUser: memberId
      }));
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, organizationSlug, memberId]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      await dispatch(updateOrganizationMember({
        organization: organizationSlug,
        organizationUser: memberId,
        memberData: formData
      }));
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
        organization: organizationSlug,
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
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || 'member',
        status: member.status || 'active'
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-danger';
      case 'manager': return 'bg-warning';
      case 'member': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-secondary';
      case 'pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

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
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Link 
            to="/organization/members" 
            className="btn btn-outline-secondary me-3 d-flex align-items-center"
          >
            <ArrowLeft size="20" className="me-2" />
            Back to Members
          </Link>
          <div>
            <h1 className="h3 mb-1">Member Details</h1>
            <p className="text-muted mb-0">View and manage member information</p>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          {!isEditing ? (
            <>
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size="20" className="me-2" />
                Edit Member
              </button>
              <button
                className="btn btn-outline-danger d-flex align-items-center"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash size="20" className="me-2" />
                Remove Member
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="editMemberForm"
                className="btn btn-primary d-flex align-items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save2 size="20" className="me-2" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row">
        {/* Member Information Card */}
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Member Information</h5>
            </div>
            <div className="card-body">
              {isEditing ? (
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

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Full Name</label>
                    <div className="d-flex align-items-center">
                      <User size="20" className="text-muted me-2" />
                      <span className="h6 mb-0">{member.name || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Email Address</label>
                    <div className="d-flex align-items-center">
                      <Sms size="20" className="text-muted me-2" />
                      <span className="h6 mb-0">{member.email || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Role</label>
                    <div className="d-flex align-items-center">
                      <Crown size="20" className="text-muted me-2" />
                      <span className={`badge ${getRoleBadgeColor(member.role)} text-white`}>
                        {member.role || 'Member'}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Status</label>
                    <div className="d-flex align-items-center">
                      <span className={`badge ${getStatusBadgeColor(member.status)} text-white`}>
                        {member.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Statistics Card */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Member Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <Calendar size="24" className="text-primary mb-2" />
                    <h6 className="mb-1">Joined Date</h6>
                    <small className="text-muted">
                      {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                    </small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <RefreshCircle size="24" className="text-success mb-2" />
                    <h6 className="mb-1">Last Updated</h6>
                    <small className="text-muted">
                      {member.updated_at ? new Date(member.updated_at).toLocaleDateString() : 'N/A'}
                    </small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <Award size="24" className="text-warning mb-2" />
                    <h6 className="mb-1">Courses</h6>
                    <small className="text-muted">
                      {member.courses_count || 0}
                    </small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="border rounded p-3">
                    <Crown size="24" className="text-info mb-2" />
                    <h6 className="mb-1">Certifications</h6>
                    <small className="text-muted">
                      {member.certifications_count || 0}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Additional Information</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <InfoCircle size="20" className="me-2" />
                <strong>Note:</strong> Changes to member roles and status take effect immediately. 
                Members will be notified of any role changes via email.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Removal</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <Trash size="48" className="text-danger mb-3" />
                  <h6>Remove {member.name} from organization?</h6>
                  <p className="text-muted">
                    This action cannot be undone. The member will lose access to all organization resources 
                    and will need to be re-invited if you want to add them back.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteMember}
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberEdit;