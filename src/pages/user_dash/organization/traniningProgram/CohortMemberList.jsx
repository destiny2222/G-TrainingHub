import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCohortMembers } from '../../../../redux/slices/admin_organisation/trainingProgramSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TrainingProgram.css';

const CohortMemberList = () => {
  const { cohortId } = useParams();
  const dispatch = useDispatch();
  const { cohortMembers, currentCohort, loading, error } = useSelector((state) => state.trainingProgram);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (cohortId) {
      dispatch(getCohortMembers(cohortId));
    }
  }, [dispatch, cohortId]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const filteredMembers = cohortMembers.filter(member => {
    const matchesSearch = member.organization_user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.organization_user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="training-program-container">
        <div className="training-program-header">
          <Skeleton width={300} height={40} />
          <Skeleton width={150} height={40} />
        </div>
        
        <div className="training-program-filters">
          <Skeleton height={45} width={300} />
          <Skeleton height={45} width={150} />
        </div>
        
        <div className="training-program-stats">
          {[1, 2, 3].map(i => (
            <div key={i} className="stat-card">
              <Skeleton width={100} height={20} />
              <Skeleton width={40} height={30} style={{ marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
        
        <div className="training-program-table-container">
          <table className="training-program-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Enrolled Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td><Skeleton width={200} /></td>
                  <td><Skeleton width={150} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={100} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-container">
      <div className="training-program-header">
        <div>
          <Link to="/organization/trainings/cohorts" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Cohorts
          </Link>
          <h1>{currentCohort?.name || 'Cohort Members'}</h1>
          {currentCohort && (
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              {currentCohort.course_title} • {new Date(currentCohort.start_date).toLocaleDateString()} - {new Date(currentCohort.end_date).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <Link 
          to={`/organization/trainings/cohorts/${cohortId}/assign-member`}
          className="btn-primary"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.95rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Assign Member
        </Link>
      </div>

      <div className="training-program-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by member name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Members</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="training-program-stats">
        <div className="stat-card">
          <h4>Total Members</h4>
          <p className="stat-value">{cohortMembers.length}</p>
        </div>
        <div className="stat-card">
          <h4>Active</h4>
          <p className="stat-value">{cohortMembers.filter(m => m.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p className="stat-value">{cohortMembers.filter(m => m.status === 'completed').length}</p>
        </div>
        <div className="stat-card">
          <h4>Average Progress</h4>
          <p className="stat-value">
            {cohortMembers.length > 0 
              ? Math.round(cohortMembers.reduce((sum, m) => sum + parseFloat(m.progress || 0), 0) / cohortMembers.length)
              : 0}%
          </p>
        </div>
      </div>

      <div className="training-program-table-container">
        <table className="training-program-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Enrolled Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="member-info">
                      {member.organization_user_profile_picture ? (
                        <img 
                          src={member.organization_user_profile_picture} 
                          alt={member.organization_user_name}
                          className="member-avatar"
                        />
                      ) : (
                        <div className="member-avatar" style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: '#3b82f6',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {member.organization_user_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="member-details">
                        <h4>{member.organization_user_name}</h4>
                        <p>{member.organization_user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-info">
                        <span className="progress-label">Progress</span>
                        <span className="progress-percentage">{parseFloat(member.progress || 0).toFixed(1)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${member.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${member.status}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    {member.enrolled_at ? new Date(member.enrolled_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/organization/members/${member.organization_user_id}`} 
                        className="btn-action btn-view" 
                        title="View Member Profile"
                      >
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
                <td colSpan="5" className="no-data">
                  <div className="no-data-content">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 42.6667V32M32 21.3333H32.0267M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No members found</h3>
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

export default CohortMemberList;
