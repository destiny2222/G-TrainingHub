import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchOrganization, deleteOrganization } from '../../../redux/slices/super_admin/organisationSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './List.css';

function List() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organization, loading, error } = useSelector((state) => state.orgAdmin);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchOrganization());
  }, [dispatch]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await dispatch(deleteOrganization(id)).unwrap();
        toast.success('Organization deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error('Failed to delete organization: ' + (error.message || error), {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  // Ensure organization is an array
  const organizations = Array.isArray(organization) ? organization : [];

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.official_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || org.subscription_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="organization-list-container">
        <div className="organization-list-header">
          <h1>Organization Management</h1>
          <Skeleton width={150} height={40} />
        </div>
        
        <div className="organization-filters">
          <Skeleton height={45} width={300} />
          <Skeleton height={45} width={150} />
        </div>
        
        <div className="organization-stats">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <Skeleton width={100} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
        
        <div className="organization-table-container">
          <table className="organization-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Contact</th>
                <th>Sector</th>
                <th>Employees</th>
                <th>Status</th>
                <th>Plan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td><Skeleton width={200} /></td>
                  <td><Skeleton width={180} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={100} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organization-list-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
          <p>Error loading organizations: {error.message || error}</p>
          <button onClick={() => dispatch(fetchOrganization())} className="btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-list-container">
      <div className="organization-list-header">
        <h1>Organization Management</h1>
      </div>

      <div className="organization-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Organizations</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="organization-stats">
        <div className="stat-card">
          <h4>Total Organizations</h4>
          <p className="stat-value">{organizations.length}</p>
        </div>
        <div className="stat-card">
          <h4>Active</h4>
          <p className="stat-value">{organizations.filter(o => o.subscription_status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h4>Trial</h4>
          <p className="stat-value">{organizations.filter(o => o.subscription_status === 'trial').length}</p>
        </div>
        <div className="stat-card">
          <h4>Verified</h4>
          <p className="stat-value">{organizations.filter(o => o.is_email_verified).length}</p>
        </div>
      </div>

      <div className="organization-table-container">
        <table className="organization-table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Contact</th>
              <th>Sector</th>
              <th>Employees</th>
              <th>Status</th>
              <th>Plan</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrganizations.length > 0 ? (
              filteredOrganizations.map((org) => (
                <tr key={org.id}>
                  <td>
                    <div className="org-info">
                      <div className="org-logo-small">
                        {org.company_logo_path_thumbnail ? (
                          <img src={org.company_logo_path_thumbnail} alt={org.name} />
                        ) : (
                          <div className="logo-placeholder-small">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4>{org.name}</h4>
                        <span className="org-slug">@{org.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{org.contact_person_name}</div>
                      <div className="text-muted">{org.official_email}</div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{org.sector}</span>
                  </td>
                  <td>{org.employee_count}</td>
                  <td>
                    <span className={`status-badge ${org.subscription_status}`}>
                      {org.subscription_status.charAt(0).toUpperCase() + org.subscription_status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="plan-badge">{org.subscription_plan}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/organizations/${org.slug}`} className="btn-action btn-view" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      <Link to={`/admin/organizations/${org.slug}/edit`} className="btn-action btn-edit" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(org.id, org.name)} 
                        className="btn-action btn-delete"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  <div className="no-data-content">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No organizations found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;