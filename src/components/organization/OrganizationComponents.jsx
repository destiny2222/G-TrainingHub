// Example: How to use the Organization Redux slice in your components

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPublicOrganization,
  getOrganization,
  updateOrganization,
  clearErrors,
  clearUpdateSuccess,
  selectPublicOrganization,
  selectOrganization,
  selectPublicLoading,
  selectLoading,
  selectUpdateLoading,
  selectPublicError,
  selectError,
  selectUpdateError,
  selectUpdateSuccess,
} from '../redux/slices/organisationSlice';

// Example 1: Public Organization Component
const PublicOrganizationProfile = ({ slug }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const publicOrganization = useSelector(selectPublicOrganization);
  const publicLoading = useSelector(selectPublicLoading);
  const publicError = useSelector(selectPublicError);

  useEffect(() => {
    if (slug) {
      dispatch(getPublicOrganization(slug));
    }
  }, [dispatch, slug]);

  if (publicLoading) return <div>Loading organization info...</div>;
  if (publicError) return <div>Error: {publicError}</div>;
  if (!publicOrganization) return <div>Organization not found</div>;

  return (
    <div className="public-organization-profile">
      <h2>{publicOrganization.name}</h2>
      <p>Contact Email: {publicOrganization.contact_email}</p>
      <p>Sector: {publicOrganization.sector}</p>
      <p>Training Focus: {publicOrganization.training_focus_area}</p>
      {publicOrganization.company_logo_path_thumbnail && (
        <img 
          src={publicOrganization.company_logo_path_thumbnail} 
          alt={`${publicOrganization.name} logo`} 
        />
      )}
    </div>
  );
};

// Example 2: Authenticated Organization Dashboard
const OrganizationDashboard = ({ slug }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const organization = useSelector(selectOrganization);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (slug) {
      dispatch(getOrganization(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    // Clear errors on component mount
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  if (loading) return <div>Loading organization details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!organization) return <div>Organization not found</div>;

  return (
    <div className="organization-dashboard">
      <h1>Welcome to {organization.name}</h1>
      <div className="organization-details">
        <p><strong>Subscription Plan:</strong> {organization.subscription_plan}</p>
        <p><strong>Subscription Status:</strong> {organization.subscription_status}</p>
        <p><strong>Contact Person:</strong> {organization.contact_person_name}</p>
        <p><strong>Official Email:</strong> {organization.official_email}</p>
        <p><strong>RC Number:</strong> {organization.rc_number}</p>
        <p><strong>Employee Count:</strong> {organization.employee_count}</p>
        <p><strong>Training Mode:</strong> {organization.training_mode}</p>
        <p><strong>Address:</strong> {organization.address}</p>
        <p><strong>Email Verified:</strong> {organization.email_verified_at ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

// Example 3: Organization Settings/Edit Form
const OrganizationSettings = ({ slug }) => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const organization = useSelector(selectOrganization);
  const loading = useSelector(selectLoading);
  const updateLoading = useSelector(selectUpdateLoading);
  const updateError = useSelector(selectUpdateError);
  const updateSuccess = useSelector(selectUpdateSuccess);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    rc_number: '',
    sector: '',
    employee_count: '',
    training_focus_area: '',
    contact_person_name: '',
    official_email: '',
    address: '',
    training_mode: '',
  });

  useEffect(() => {
    if (slug) {
      dispatch(getOrganization(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        contact_email: organization.contact_email || '',
        rc_number: organization.rc_number || '',
        sector: organization.sector || '',
        employee_count: organization.employee_count || '',
        training_focus_area: organization.training_focus_area || '',
        contact_person_name: organization.contact_person_name || '',
        official_email: organization.official_email || '',
        address: organization.address || '',
        training_mode: organization.training_mode || '',
      });
    }
  }, [organization]);

  useEffect(() => {
    if (updateSuccess) {
      alert('Organization updated successfully!');
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateOrganization({ slug, organizationData: formData }));
  };

  if (loading) return <div>Loading organization details...</div>;

  return (
    <div className="organization-settings">
      <h2>Organization Settings</h2>
      
      {updateError && (
        <div className="error-message">
          Error updating organization: {updateError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Organization Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact_email">Contact Email:</label>
          <input
            type="email"
            id="contact_email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rc_number">RC Number:</label>
          <input
            type="text"
            id="rc_number"
            name="rc_number"
            value={formData.rc_number}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sector">Sector:</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="employee_count">Employee Count:</label>
          <input
            type="number"
            id="employee_count"
            name="employee_count"
            value={formData.employee_count}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="training_focus_area">Training Focus Area:</label>
          <input
            type="text"
            id="training_focus_area"
            name="training_focus_area"
            value={formData.training_focus_area}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact_person_name">Contact Person Name:</label>
          <input
            type="text"
            id="contact_person_name"
            name="contact_person_name"
            value={formData.contact_person_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="official_email">Official Email:</label>
          <input
            type="email"
            id="official_email"
            name="official_email"
            value={formData.official_email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="training_mode">Training Mode:</label>
          <select
            id="training_mode"
            name="training_mode"
            value={formData.training_mode}
            onChange={handleInputChange}
          >
            <option value="">Select Training Mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={updateLoading}
          className="submit-button"
        >
          {updateLoading ? 'Updating...' : 'Update Organization'}
        </button>
      </form>
    </div>
  );
};

export { PublicOrganizationProfile, OrganizationDashboard, OrganizationSettings };