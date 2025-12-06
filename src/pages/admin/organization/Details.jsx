import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrganizationBySlug, fetchOrganizationById } from '../../../redux/slices/super_admin/organisationSlice.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Details.css';

function Details() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organization, loading, error } = useSelector((state) => state.orgAdmin);
  useEffect(() => {
    if (slug) {
      dispatch(fetchOrganizationById(slug));
    }
  }, [dispatch, slug]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'trial':
        return 'badge-warning';
      case 'expired':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="organization-details-container">
        <div className="details-header">
          <Skeleton width={100} height={40} />
          <Skeleton width={180} height={40} />
        </div>

        <div className="details-content">
          {/* Header Card Skeleton */}
          <div className="details-card header-card">
            <div className="org-header-section">
              <Skeleton circle width={120} height={120} />
              <div style={{ flex: 1 }}>
                <Skeleton width={250} height={32} style={{ marginBottom: '0.5rem' }} />
                <Skeleton width={150} height={20} style={{ marginBottom: '1rem' }} />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Skeleton width={80} height={30} />
                  <Skeleton width={80} height={30} />
                  <Skeleton width={100} height={30} />
                </div>
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="details-card">
            <Skeleton width={200} height={24} style={{ marginBottom: '1.5rem' }} />
            <div className="details-table-wrapper">
              <table className="details-table">
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
                    <tr key={i}>
                      <th><Skeleton width={150} /></th>
                      <td><Skeleton width={300} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!organization) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-building"></i>
          <p>Organization not found</p>
          <button onClick={() => navigate('/admin/organizations')} className="btn-back">
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-details-container">
      <div className="details-header">
        <button onClick={() => navigate('/admin/organizations')} className="btn-back-simple">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <div className="header-actions">
          <button onClick={() => navigate(`/admin/organizations/${slug}/edit`)} className="btn-edit-header">
            <i className="fas fa-edit"></i> Edit Organization
          </button>
        </div>
      </div>

      <div className="details-content">
        {/* Header Card */}
        <div className="details-card header-card">
          <div className="org-header-section">
            <div className="org-logo-large">
              {organization.company_logo_path_thumbnail ? (
                <img src={organization.company_logo_path_thumbnail} alt={organization.name} />
              ) : (
                <div className="logo-placeholder-large">
                  <i className="fas fa-building"></i>
                </div>
              )}
            </div>
            <div className="org-header-info">
              <h1>{organization.name}</h1>
              <p className="org-slug">@{organization.slug}</p>
              <div className="org-badges">
                <span className={`badge ${getStatusBadgeClass(organization.subscription_status)}`}>
                  {organization.subscription_status}
                </span>
                <span className="badge badge-info">{organization.subscription_plan}</span>
                {organization.is_email_verified && (
                  <span className="badge badge-verified">
                    <i className="fas fa-check-circle"></i> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Organization Details Table */}
        <div className="details-card">
          <h2 className="section-title">
            <i className="fas fa-info-circle"></i> Organization Details
          </h2>
          <div className="details-table-wrapper">
            <table className="details-table">
              <tbody>
                <tr>
                  <th>Organization Name</th>
                  <td>{organization.name}</td>
                </tr>
                <tr>
                  <th>Slug</th>
                  <td>@{organization.slug}</td>
                </tr>
                <tr>
                  <th>RC Number</th>
                  <td>{organization.rc_number}</td>
                </tr>
                <tr>
                  <th>Sector</th>
                  <td>{organization.sector}</td>
                </tr>
                <tr>
                  <th>Employee Count</th>
                  <td>{organization.employee_count}</td>
                </tr>
                <tr>
                  <th>Contact Person</th>
                  <td>{organization.contact_person_name}</td>
                </tr>
                <tr>
                  <th>Official Email</th>
                  <td>
                    <a href={`mailto:${organization.official_email}`}>
                      {organization.official_email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{organization.address}</td>
                </tr>
                <tr>
                  <th>Training Focus Area</th>
                  <td>{organization.training_focus_area}</td>
                </tr>
                <tr>
                  <th>Training Mode</th>
                  <td>
                    <span className="training-mode">
                      <i className={organization.training_mode === 'online' ? 'fas fa-laptop' : 'fas fa-chalkboard-teacher'}></i>
                      {organization.training_mode}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Subscription Plan</th>
                  <td className="plan-name">{organization.subscription_plan}</td>
                </tr>
                <tr>
                  <th>Subscription Status</th>
                  <td>
                    <span className={`status-indicator ${organization.subscription_status}`}>
                      {organization.subscription_status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
