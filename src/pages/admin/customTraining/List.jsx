import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganizationCustomRequests } from '../../../redux/slices/super_admin/organisationCustomRequestSilce';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../course/Course.css';

const CustomTrainingList = () => {
  const dispatch = useDispatch();
  const { organizationCustomRequests = [], loading, error } = useSelector((state) => state.customTraining || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchOrganizationCustomRequests());
  }, [dispatch]);

  const filteredRequests = organizationCustomRequests.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      r.title?.toLowerCase().includes(term) ||
      r.user_name?.toLowerCase().includes(term) ||
      r.user_organization?.toLowerCase().includes(term) ||
      r.business_challenge?.toLowerCase().includes(term);

    const matchesFilter = filterStatus === 'all' || (r.status || 'pending') === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="course-list-header">
          <h1>Organization Training Requests</h1>
          <Skeleton width={150} height={40} />
        </div>

        <div className="course-filters">
          <Skeleton height={45} width={300} />
          <Skeleton height={45} width={150} />
        </div>

        <div className="course-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <Skeleton width={100} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>

        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Business Challenge</th>
                <th>Requestor</th>
                <th>Organization</th>
                <th>Participants</th>
                <th>Skill Level</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td><Skeleton width={200} /></td>
                  <td><Skeleton width={300} /></td>
                  <td><Skeleton width={150} /></td>
                  <td><Skeleton width={130} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={90} /></td>
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
      <div className="course-list-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
          <p>Error loading requests: {error.message || error}</p>
          <button onClick={() => dispatch(fetchOrganizationCustomRequests())} className="btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const total = organizationCustomRequests.length;
  const pendingCount = organizationCustomRequests.filter((r) => (r.status || 'pending') === 'pending').length;
  const approvedCount = organizationCustomRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = organizationCustomRequests.filter((r) => r.status === 'rejected').length;
  const organizationsCount = new Set(organizationCustomRequests.map((r) => r.user_organization)).size;

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Organization Training Requests</h1>
        {/* <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/organization-requests/create" className="btn-secondary">
            Create Request
          </Link>
        </div> */}
      </div>

      <div className="course-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by title, requestor or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="course-stats">
        <div className="stat-card">
          <h4>Total Requests</h4>
          <p className="stat-value">{total}</p>
        </div>
        <div className="stat-card">
          <h4>Pending</h4>
          <p className="stat-value">{pendingCount}</p>
        </div>
        <div className="stat-card">
          <h4>Approved</h4>
          <p className="stat-value">{approvedCount}</p>
        </div>
        <div className="stat-card">
          <h4>Rejected</h4>
          <p className="stat-value">{rejectedCount}</p>
        </div>
        <div className="stat-card">
          <h4>Organizations</h4>
          <p className="stat-value">{organizationsCount}</p>
        </div>
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Business Challenge</th>
              <th>Requestor</th>
              <th>Organization</th>
              <th>Participants</th>
              <th>Skill Level</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="course-title">
                      <h4>{r.title}</h4>
                    </div>
                  </td>
                  <td className="business-challenge">
                    <p className="muted small">{r.business_challenge?.slice(0, 150)}{r.business_challenge && r.business_challenge.length > 150 ? '...' : ''}</p>
                  </td>
                  <td>{r.user_name}</td>
                  <td>{r.user_organization || '—'}</td>
                  <td>{r.number_of_participants}</td>
                  <td>{r.skill_level}</td>
                  <td>
                    <span className={`status-badge ${r.status || 'pending'}`}>
                      {(r.status || 'pending').charAt(0).toUpperCase() + (r.status || 'pending').slice(1)}
                    </span>
                  </td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/organization-requests/${r.id}`} className="btn-action btn-view" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="no-data-content">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No requests found</h3>
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
};

export default CustomTrainingList;