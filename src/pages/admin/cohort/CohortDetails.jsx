import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCohortById } from '../../../redux/slices/cohortSlice';
import '../course/Course.css';

const CohortDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCohort, loading, error } = useSelector((state) => state.cohorts);

  useEffect(() => {
    if (slug) {
      dispatch(fetchCohortById(slug));
    }
  }, [dispatch, slug]);

  const getStatusClass = (startDate, endDate, status) => {
    if (status === 'inactive') return 'inactive';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  const getStatusText = (startDate, endDate, status) => {
    if (status === 'inactive') return 'Inactive';
    
    const statusClass = getStatusClass(startDate, endDate, status);
    return statusClass.charAt(0).toUpperCase() + statusClass.slice(1);
  };

  if (loading) {
    return (
      <div className="course-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading cohort details...</p>
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
          <h3>Error Loading Cohort</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/cohorts')} className="btn-primary">
            Back to Cohorts
          </button>
        </div>
      </div>
    );
  }

  if (!currentCohort) {
    return (
      <div className="course-form-container">
        <div className="error-state">
          <h3>Cohort Not Found</h3>
          <p>The cohort you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/admin/cohorts')} className="btn-primary">
            Back to Cohorts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <div>
          <h1>Cohort Details</h1>
          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/admin/cohorts" className="breadcrumb-link">
              ← Back to Cohorts
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/admin/cohorts/edit/${currentCohort.slug || currentCohort.id}`} className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Cohort
          </Link>
        </div>
      </div>

      <div className="course-details-content">
        {/* Basic Information */}
        <div className="detail-section">
          <h2>Basic Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Cohort Name</label>
              <p>{currentCohort.name}</p>
            </div>
            <div className="detail-item">
              <label>Course</label>
              <p>
                <span className="category-badge">
                  {currentCohort.course?.title || 'N/A'}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Price</label>
              <p className="price">{currentCohort.price}</p>
            </div>
            <div className="detail-item">
              <label>Duration</label>
              <p>{currentCohort.duration}</p>
            </div>
            <div className="detail-item">
              <label>Start Date</label>
              <p>{new Date(currentCohort.start_date).toLocaleDateString()}</p>
            </div>
            <div className="detail-item">
              <label>End Date</label>
              <p>{new Date(currentCohort.end_date).toLocaleDateString()}</p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <p>
                <span className={`status-badge ${getStatusClass(currentCohort.start_date, currentCohort.end_date, currentCohort.status)}`}>
                  {getStatusText(currentCohort.start_date, currentCohort.end_date, currentCohort.status)}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Created At</label>
              <p>{currentCohort.created_at ? new Date(currentCohort.created_at).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Course Details */}
        {currentCohort.course && (
          <div className="detail-section">
            <h2>Course Information</h2>
            <div className="detail-grid">
              <div className="detail-item full-width">
                <label>Course Title</label>
                <p>{currentCohort.course.title}</p>
              </div>
              <div className="detail-item full-width">
                <label>Course Description</label>
                <p>{currentCohort.course.description || 'No description available'}</p>
              </div>
              <div className="detail-item">
                <label>Course Category</label>
                <p>
                  <span className="category-badge">{currentCohort.course.category || 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Information */}
        <div className="detail-section">
          <h2>Timeline</h2>
          <div className="timeline-info">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Cohort Start</h4>
                <p>{new Date(currentCohort.start_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Cohort End</h4>
                <p>{new Date(currentCohort.end_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortDetails;
