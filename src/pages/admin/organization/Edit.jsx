import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrganizationById,fetchOrganizationBySlug, updateOrganization } from '../../../redux/slices/super_admin/organisationSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Edit.css';

function Edit() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organization, loading, error } = useSelector((state) => state.orgAdmin);
  const [formData, setFormData] = useState({
    name: '',
    rc_number: '',
    sector: '',
    employee_count: '',
    training_focus_area: '',
    contact_person_name: '',
    official_email: '',
    address: '',
    training_mode: '',
    subscription_plan: '',
    subscription_status: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchOrganizationById(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        rc_number: organization.rc_number || '',
        sector: organization.sector || '',
        employee_count: organization.employee_count || '',
        training_focus_area: organization.training_focus_area || '',
        contact_person_name: organization.contact_person_name || '',
        official_email: organization.official_email || '',
        address: organization.address || '',
        training_mode: organization.training_mode || '',
        subscription_plan: organization.subscription_plan || '',
        subscription_status: organization.subscription_status || '',
      });
    }
  }, [organization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Organization name is required';
    }

    if (!formData.official_email.trim()) {
      errors.official_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.official_email)) {
      errors.official_email = 'Email is invalid';
    }

    if (!formData.contact_person_name.trim()) {
      errors.contact_person_name = 'Contact person name is required';
    }

    if (!formData.sector.trim()) {
      errors.sector = 'Sector is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(updateOrganization({ 
        organizationID: slug, 
        organizationData: formData 
      })).unwrap();
      
      alert('Organization updated successfully!');
      setTimeout(() => {
         navigate(`/admin/organizations`);
      }, 2000);
    } catch (error) {
      alert('Failed to update organization: ' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate(`/admin/organizations`);
    // }
  };

  if (loading && !organization) {
    return (
      <div className="organization-edit-container">
        <div className="edit-header">
          <div>
            <Skeleton width={200} height={32} style={{ marginBottom: '0.5rem' }} />
            <Skeleton width={250} height={20} />
          </div>
        </div>

        <div className="edit-form">
          {/* Form Section Skeletons */}
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="form-section">
              <Skeleton width={200} height={24} style={{ marginBottom: '1.5rem' }} />
              <div className="form-grid">
                {[1, 2, 3, 4].map((field) => (
                  <div key={field} className="form-group">
                    <Skeleton width={150} height={20} style={{ marginBottom: '0.5rem' }} />
                    <Skeleton height={45} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Form Actions Skeleton */}
          <div className="form-actions">
            <Skeleton width={120} height={45} />
            <Skeleton width={150} height={45} />
          </div>
        </div>
      </div>
    );
  }

  if (error && !organization) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/organizations')} className="btn-back">
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-edit-container">
      <div className="edit-header">
        <div>
          <h1>Edit Organization</h1>
          <p className="edit-subtitle">Update organization information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fas fa-info-circle"></i> Basic Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                Organization Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rc_number">RC Number</label>
              <input
                type="text"
                id="rc_number"
                name="rc_number"
                value={formData.rc_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sector">
                Sector <span className="required">*</span>
              </label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className={formErrors.sector ? 'error' : ''}
              >
                <option value="">Select Sector</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.sector && <span className="error-message">{formErrors.sector}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="employee_count">Employee Count</label>
              <select
                id="employee_count"
                name="employee_count"
                value={formData.employee_count}
                onChange={handleChange}
              >
                <option value="">Select Range</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501+">501+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fas fa-address-book"></i> Contact Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contact_person_name">
                Contact Person Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="contact_person_name"
                name="contact_person_name"
                value={formData.contact_person_name}
                onChange={handleChange}
                className={formErrors.contact_person_name ? 'error' : ''}
              />
              {formErrors.contact_person_name && (
                <span className="error-message">{formErrors.contact_person_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="official_email">
                Official Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="official_email"
                name="official_email"
                value={formData.official_email}
                onChange={handleChange}
                className={formErrors.official_email ? 'error' : ''}
              />
              {formErrors.official_email && (
                <span className="error-message">{formErrors.official_email}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">
                Address <span className="required">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={formErrors.address ? 'error' : ''}
              />
              {formErrors.address && <span className="error-message">{formErrors.address}</span>}
            </div>
          </div>
        </div>

        {/* Training Information */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fas fa-graduation-cap"></i> Training Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="training_focus_area">Training Focus Area</label>
              <input
                type="text"
                id="training_focus_area"
                name="training_focus_area"
                value={formData.training_focus_area}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="training_mode">Training Mode</label>
              <select
                id="training_mode"
                name="training_mode"
                value={formData.training_mode}
                onChange={handleChange}
              >
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fas fa-credit-card"></i> Subscription Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="subscription_plan">Subscription Plan</label>
              <select
                id="subscription_plan"
                name="subscription_plan"
                value={formData.subscription_plan}
                onChange={handleChange}
              >
                <option value="">Select Plan</option>
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subscription_status">Subscription Status</label>
              <select
                id="subscription_status"
                name="subscription_status"
                value={formData.subscription_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            <i className="fas fa-times"></i> Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span> Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
