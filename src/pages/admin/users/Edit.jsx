import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserManagementById, updateUserManagement } from '../../../redux/slices/super_admin/userManagementSlice';
import { toast } from 'react-toastify';
import '../course/Course.css';

const UserEdit = () => {
  const navigate = useNavigate();
  const { Id } = useParams();
  const dispatch = useDispatch();
  const { userManagement, loading } = useSelector((state) => state.userManagement);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // phone: '',
    organization: '',
    role: 'user',
    // status: 'active',
    // bio: '',
    // address: '',
    // city: '',
    // state: '',
    // country: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch user data
  useEffect(() => {
    dispatch(fetchUserManagementById(Id));
  }, [dispatch, Id]);

  // Update form when user data is loaded
  useEffect(() => {
    if (userManagement) {
      setFormData({
        name: userManagement.name || '',
        email: userManagement.email || '',
        // phone: userManagement.phone || '',
        organization: userManagement.organization || '',
        role: userManagement.role || 'user',
        // status: userManagement.status || 'active',
        // bio: userManagement.bio || '',
        // address: userManagement.address || '',
        // city: userManagement.city || '',
        // state: userManagement.state || '',
        // country: userManagement.country || '',
      });
    }
  }, [userManagement]);

  const handleChange = (e) => {
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
    //   newErrors.phone = 'Invalid phone number format';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await dispatch(updateUserManagement({ 
          userID: Id, 
          userData: formData 
        })).unwrap();
        
        toast.success('User updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/admin/users');
      } catch (error) {
        const errorMessage = error.errors 
          ? Object.values(error.errors).flat().join(', ')
          : error.message || 'Failed to update user';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/admin/users');
    }
  };

  if (loading) {
    return (
      <div className="course-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <h1>Edit User</h1>
      </div>

      <form onSubmit={handleSubmit} className="course-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="user@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            {/* <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="+1234567890"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div> */}

            <div className="form-group">
              <label htmlFor="organization">Organization</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Enter organization name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="member">Member</option>
                <option value="organization_admin">Organization Admin</option>
              </select>
            </div>

            {/* <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div> */}
          </div>

          {/* <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Enter user bio..."
            />
          </div> */}
        </div>

        {/* Location Information */}
         {/* <div className="form-section">
          <h2>Location Information</h2>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter street address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />
          </div>
        </div> */}

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;