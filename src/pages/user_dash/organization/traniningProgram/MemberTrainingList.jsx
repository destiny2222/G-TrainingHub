import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMemberTrainings, unassignCourseFromMember, clearState } from '../../../../redux/slices/admin_organisation/trainingProgramSlice';
import { getOrganizationMember } from '../../../../redux/slices/organisationUserSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TrainingProgram.css';

const MemberTrainingList = () => {
  const { memberId } = useParams();
  const dispatch = useDispatch();
  const { memberTrainings, loading, error, success, message } = useSelector((state) => state.trainingProgram);
  const { member } = useSelector((state) => state.organizationUser);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (memberId) {
      dispatch(getMemberTrainings(memberId));
      dispatch(getOrganizationMember(memberId));
    }
  }, [dispatch, memberId]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
    if (success) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(clearState());
      dispatch(getMemberTrainings(memberId));
    }
  }, [error, success, message, dispatch, memberId]);

  const handleUnassign = async (courseId) => {
    if (window.confirm('Are you sure you want to unassign this course from the member?')) {
      try {
        await dispatch(unassignCourseFromMember({
          organization_user_id: memberId,
          course_id: courseId
        })).unwrap();
      } catch (err) {
        // Error is handled in useEffect
      }
    }
  };

  const filteredTrainings = memberTrainings.filter(training => {
    const matchesSearch = training.course_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || training.status === filterStatus;
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
                <th>Course</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Enrolled Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(i => (
                <tr key={i}>
                  <td><Skeleton width={250} /></td>
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
          <Link to="/organization/members" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Members
          </Link>
          <h1>{member?.name || 'Member'}'s Training Programs</h1>
          {member && (
            <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
              {member.email}
            </p>
          )}
        </div>
        <Link to={`/organization/trainings/assign/${memberId}`} className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Assign Course
        </Link>
      </div>

      <div className="training-program-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by course title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="training-program-stats">
        <div className="stat-card">
          <h4>Total Courses</h4>
          <p className="stat-value">{memberTrainings.length}</p>
        </div>
        <div className="stat-card">
          <h4>Active</h4>
          <p className="stat-value">{memberTrainings.filter(t => t.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p className="stat-value">{memberTrainings.filter(t => t.status === 'completed').length}</p>
        </div>
        <div className="stat-card">
          <h4>Average Progress</h4>
          <p className="stat-value">
            {memberTrainings.length > 0 
              ? Math.round(memberTrainings.reduce((sum, t) => sum + parseFloat(t.progress || 0), 0) / memberTrainings.length)
              : 0}%
          </p>
        </div>
      </div>

      <div className="training-program-table-container">
        <table className="training-program-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Enrolled Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => (
                <tr key={training.id}>
                  <td>
                    <div className="course-info">
                      {training.course_image && (
                        <img 
                          src={training.course_image} 
                          alt={training.course_title}
                          className="course-image"
                        />
                      )}
                      <div className="course-details">
                        <h4>{training.course_title}</h4>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div className="progress-info">
                        <span className="progress-label">Progress</span>
                        <span className="progress-percentage">{parseFloat(training.progress || 0).toFixed(1)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${training.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${training.status}`}>
                      {training.status}
                    </span>
                  </td>
                  <td>
                    {training.enrolled_at ? new Date(training.enrolled_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleUnassign(training.course_id)}
                        className="btn-action btn-unassign"
                        title="Unassign Course"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
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
                    <h3>No training programs found</h3>
                    <p>This member hasn't been assigned any courses yet</p>
                    <Link to={`/organization/trainings/assign/${memberId}`} className="btn-primary" style={{ marginTop: '1rem' }}>
                      Assign Course
                    </Link>
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

export default MemberTrainingList;
