import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Trash, 
  User, 
  Sms, 
  Call,
  Crown,
  InfoCircle,
  TickCircle,
  CloseCircle,
  Clock
} from 'iconsax-reactjs';
import { toast } from 'react-toastify';
import {
  getOrganizationMember,
  deleteOrganizationMember,
  clearError,
  clearSuccess
} from '../../../../redux/slices/organisationUserSlice';
import './MemberShowModern.css';

const MemberShow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { member, loading, error,  success } = useSelector(state => state.organizationUser);

  // Fetch member details on component mount
  useEffect(() => {
    if (id) {
      dispatch(getOrganizationMember(id));
    }
  }, [dispatch, id]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDeleteMember = async (memberId, memberName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${memberName} from your organization? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await dispatch(deleteOrganizationMember(memberId)).unwrap();
        toast.success(`${memberName} has been removed from your organization`);
        navigate('/organization/members');
      } catch (error) {
        toast.error(error || 'Failed to remove member');
      }
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'admin': 'admin',
      'manager': 'manager',
      'member': 'member'
    };
    return roleColors[role?.toLowerCase()] || 'member';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'active',
      'inactive': 'inactive',
      'pending': 'pending'
    };
    return statusColors[status?.toLowerCase()] || 'active';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="member-show-container">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading member details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !member) {
    return (
      <div className="member-show-container">
        <div className="alert alert-danger" role="alert">
          <h4>Error Loading Member</h4>
          <p>{error}</p>
          <div className="d-flex gap-3">
            <button 
              className="btn btn-primary" 
              onClick={() => dispatch(getOrganizationMember(id))}
            >
              Try Again
            </button>
            <Link to="/organization/members" className="btn btn-secondary">
              Back to Members
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="member-show-container">
        <div className="alert alert-warning" role="alert">
          <h4>Member Not Found</h4>
          <p>The member you're looking for doesn't exist or has been removed.</p>
          <Link to="/organization/members" className="btn btn-primary">
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-member-show">
      <div className="container-fluid p-4">
        {/* Breadcrumb & Header */}
        <div className="header-section mb-4">
          <div className="breadcrumb-nav">
            <Link to="/organization/members" className="breadcrumb-link">
              <ArrowLeft size="18" className="me-2" />
              Back to Members
            </Link>
          </div>
          
          <div className="page-header d-flex justify-content-between align-items-start">
            <div>
              <h1 className="page-title">Member Profile</h1>
              <p className="page-subtitle">Manage member information and permissions</p>
            </div>
            <div className="action-group">
              <Link 
                to={`/organization/members/${member.id}/edit`} 
                className="btn btn-primary btn-modern"
              >
                <Edit2 size="18" className="me-2" />
                Edit Profile
              </Link>
              <button
                className="btn btn-danger btn-modern"
                onClick={() => handleDeleteMember(member.id, member.name)}
              >
                <Trash size="18" className="me-2" />
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="row g-4">
          {/* Left Column - Profile Card */}
          <div className="col-lg-4">
            <div className="profile-card">
              <div className="profile-header ">
                <div className="avatar-container">
                  <div className="member-avatar">
                    {member.profile_picture ? (
                      <img src={member.profile_picture} alt={member.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="avatar-status">
                    {member.status === 'success' && <TickCircle size="20" className="text-success" />}
                    {member.status === 'active' && <TickCircle size="20" className="text-success" />}
                    {member.status === 'inactive' && <CloseCircle size="20" className="text-danger" />}
                    {member.status === 'pending' && <Clock size="20" className="text-warning" />}
                  </div>
                </div>
                <h3 className="member-name">{member.name || 'Unnamed User'}</h3>
                <p className="member-email ">{member.email || 'No email provided'}</p>
                
                <div className="badges-container">
                  <span className={`role-pill role-${getRoleColor(member.role)}`}>
                    <Crown size="14" className="me-1" />
                    {member.role || 'Member'}
                  </span>
                  <span className={`status-pill status-${getStatusColor(member.status)}`}>
                    {member.status || 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">Member Since</span>
                  <span className="stat-value">{formatDate(member.created_at)}</span>
                </div>
                {member.last_login_at && (
                  <div className="stat-item">
                    <span className="stat-label">Last Active</span>
                    <span className="stat-value">{formatDate(member.last_login_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details Cards */}
          <div className="col-lg-8">
            <div className="details-grid">
              {/* Contact Information */}
              <div className="detail-card">
                <div className="card-header">
                  <h4 className="card-title">
                    <Sms size="20" className="me-2 text-primary" />
                    Contact Information
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="info-item">
                        <label className="info-label">Email Address</label>
                        <div className="info-value">
                          <Sms size="16" className="me-2 text-muted" />
                          {member.email || 'Not provided'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <label className="info-label">Phone Number</label>
                        <div className="info-value">
                          <Call size="16" className="me-2 text-muted" />
                          {member.phone || 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Details */}
              <div className="detail-card">
                <div className="card-header">
                  <h4 className="card-title">
                    <User size="20" className="me-2 text-primary" />
                    Member Details
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="info-item">
                        <label className="info-label">Full Name</label>
                        <div className="info-value">{member.name || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <label className="info-label">Role</label>
                        <div className="info-value">
                          <span className={`role-badge-sm role-${getRoleColor(member.role)}`}>
                            {member.role || 'Member'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <label className="info-label">Status</label>
                        <div className="info-value">
                          <span className={`status-badge-sm status-${getStatusColor(member.status)}`}>
                            {member.status === 'success' && <TickCircle size="14" className="me-1" />}
                            {member.status === 'active' && <TickCircle size="14" className="me-1" />}
                            {member.status === 'inactive' && <CloseCircle size="14" className="me-1" />}
                            {member.status === 'pending' && <Clock size="14" className="me-1" />}
                            {member.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <label className="info-label">Member ID</label>
                        <div className="info-value">#{member.id || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Information */}
              {(member.last_login_at || member.updated_at) && (
                <div className="detail-card">
                  <div className="card-header">
                    <h4 className="card-title">
                      <Clock size="20" className="me-2 text-primary" />
                      Activity Timeline
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="activity-timeline">
                      <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <span className="timeline-label">Date Joined</span>
                          <span className="timeline-value">{formatDate(member.created_at)}</span>
                        </div>
                      </div>
                      {member.last_login_at && (
                        <div className="timeline-item">
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <span className="timeline-label">Last Login</span>
                            <span className="timeline-value">{formatDate(member.last_login_at)}</span>
                          </div>
                        </div>
                      )}
                      {member.updated_at && (
                        <div className="timeline-item">
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <span className="timeline-label">Last Updated</span>
                            <span className="timeline-value">{formatDate(member.updated_at)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Details */}
              {member.organization && (
                <div className="detail-card">
                  <div className="card-header">
                    <h4 className="card-title">
                      <InfoCircle size="20" className="me-2 text-primary" />
                      Organization
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="info-item">
                      <label className="info-label">Organization Name</label>
                      <div className="info-value">{member.organization.name || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberShow;