import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheduleSessions } from '../../../redux/slices/super_admin/scheduleSessionSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../admin/course/Course.css';

function ScheduleSessionList() {
  const dispatch = useDispatch();
  const { scheduleSessions = [], loading = false, error = null } = useSelector((state) => state.scheduleSessions || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchScheduleSessions());
  }, [dispatch]);

  const filtered = scheduleSessions.filter((s) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = q === '' ||
      (s.title || '').toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.user_name || '').toLowerCase().includes(q) ||
      (s.user_email || '').toLowerCase().includes(q) ||
      (s.user_organization || '').toLowerCase().includes(q);
    const matchesFilter = filterStatus === 'all' || String(s.status) === String(filterStatus);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="course-list-header">
          <h1>Schedule Sessions</h1>
          <Skeleton width={180} height={40} />
        </div>
        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>User</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map(i => (
                <tr key={i}>
                  {Array.from({length:8}).map((_, idx) => <td key={idx}><Skeleton /></td>)}
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
          <p>Error loading sessions: {error.message || error}</p>
          <button onClick={() => dispatch(fetchScheduleSessions())} className="btn-primary btn" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Schedule Sessions</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => dispatch(fetchScheduleSessions())} className="btn-secondary">Refresh</button>
        </div>
      </div>

      <div className="course-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="0">Draft</option>
            <option value="1">Scheduled</option>
            <option value="2">Completed</option>
          </select>
        </div>
      </div>

      <div className="course-stats">
        <div className="stat-card">
          <h4>Total Sessions</h4>
          <p className="stat-value">{scheduleSessions.length}</p>
        </div>
        <div className="stat-card">
          <h4>Scheduled</h4>
          <p className="stat-value">{scheduleSessions.filter(s => String(s.status) === '1').length}</p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p className="stat-value">{scheduleSessions.filter(s => String(s.status) === '2').length}</p>
        </div>
        <div className="stat-card">
          <h4>Draft</h4>
          <p className="stat-value">{scheduleSessions.filter(s => String(s.status) === '0').length}</p>
        </div>
      </div>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>User</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s, idx) => (
                <tr key={s.id || idx}>
                  <td data-label="Title"><strong>{s.title}</strong></td>
                  <td data-label="Description" className="truncate-cell"><div className="course-description"><p>{s.description}</p></div></td>
                  <td data-label="User">{s.user_name || '—'}</td>
                  <td data-label="Email" title={s.user_email || ''} className="email-cell">{s.user_email || '—'}</td>
                  <td data-label="Organization" title={s.user_organization || ''} className="organization-cell">{s.user_organization || '—'}</td>
                  <td data-label="Status"><span className={`status-badge status-${s.status}`}>{String(s.status) === '1' ? 'Scheduled' : String(s.status) === '2' ? 'Completed' : 'Draft'}</span></td>
                  <td data-label="Created">{s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <Link to={`/admin/schedule-sessions/${s.id || idx}`} className="btn-action btn btn-primary" title="View Details">View</Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <div className="no-data-content">
                    <h3>No sessions found</h3>
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

export default ScheduleSessionList;