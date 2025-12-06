import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserManagementById } from '../../../redux/slices/super_admin/userManagementSlice';
import '../course/Course.css';

const UserDetails = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userManagement, loading, error } = useSelector((state) => state.userManagement);

  useEffect(() => {
    if (Id) {
      dispatch(fetchUserManagementById(Id));
    }
  }, [dispatch, Id]);

  if (loading) {
    return (
      <div className="course-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-form-container">
        <div className="error-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Error Loading User</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/users')} className="btn-primary">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (!userManagement) {
    return (
      <div className="course-form-container">
        <div className="error-state">
          <h3>User Not Found</h3>
          <p>The user you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/admin/users')} className="btn-primary">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <div>
          <h1>User Details</h1>
          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/admin/users" className="breadcrumb-link">
              ← Back to Users
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/admin/users/${userManagement.id}/edit`} className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit User
          </Link>
        </div>
      </div>

      <div className="course-details-content">
        {/* User Avatar */}
        {userManagement.profile_picture && (
          <div className="detail-section">
            <div className="course-image-preview">
              <img 
                src={userManagement.profile_picture} 
                alt={userManagement.name}
                style={{ maxWidth: '200px', borderRadius: '50%' }}
              />
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="detail-section">
          <h2>Basic Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Full Name</label>
              <p>{userManagement.name}</p>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <p>{userManagement.email}</p>
            </div>
            {/* <div className="detail-item">
              <label>Phone Number</label>
              <p>{userManagement.phone || 'N/A'}</p>
            </div> */}
            <div className="detail-item">
              <label>Organization</label>
              <p>
                <span className="category-badge">{userManagement.organization || 'N/A'}</span>
              </p>
            </div>
            <div className="detail-item">
              <label>Role</label>
              <p>
                <span className={`status-badge ${userManagement.role || 'user'}`}>
                  {userManagement.role ? userManagement.role.charAt(0).toUpperCase() + userManagement.role.slice(1) : 'User'}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <p>
                <span className={`status-badge ${userManagement.status || 'inactive'}`}>
                  {userManagement.status ? userManagement.status.charAt(0).toUpperCase() + userManagement.status.slice(1) : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Created At</label>
              <p>{userManagement.created_at ? new Date(userManagement.created_at).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Last Updated</label>
              <p>{userManagement.updated_at ? new Date(userManagement.updated_at).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
