import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../../../redux/slices/courseSlice';
import './Course.css';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    if (slug) {
      dispatch(fetchCourseById(slug));
    }
  }, [dispatch, slug]);

  if (loading) {
    return (
      <div className="course-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading course details...</p>
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
          <h3>Error Loading Course</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/courses')} className="btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="course-form-container">
        <div className="error-state">
          <h3>Course Not Found</h3>
          <p>The course you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/admin/courses')} className="btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <div>
          <h1>Course Details</h1>
          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/admin/courses" className="breadcrumb-link">
              ← Back to Courses
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/admin/courses/edit/${currentCourse.slug || currentCourse.id}`} className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Course
          </Link>
        </div>
      </div>

      <div className="course-details-content">
        {/* Course Image */}
        {currentCourse.image && (
          <div className="detail-section">
            <div className="course-image-preview">
              <img 
                src={currentCourse.image} 
                alt={currentCourse.title}
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="detail-section">
          <h2>Basic Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Course Title</label>
              <p>{currentCourse.title}</p>
            </div>
            <div className="detail-item">
              <label>Category</label>
              <p>
                <span className="category-badge">{currentCourse.category || 'N/A'}</span>
              </p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <p>
                <span className={`status-badge ${currentCourse.status || 'inactive'}`}>
                  {currentCourse.status ? currentCourse.status.charAt(0).toUpperCase() + currentCourse.status.slice(1) : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Created At</label>
              <p>{currentCourse.created_at ? new Date(currentCourse.created_at).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="detail-item full-width">
              <label>Description</label>
              <p>{currentCourse.description || 'No description available'}</p>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        {currentCourse.curriculum && currentCourse.curriculum.length > 0 && (
          <div className="detail-section">
            <h2>Curriculum</h2>
            <div className="curriculum-list">
              {currentCourse.curriculum.map((item, index) => (
                <div key={index} className="curriculum-item-view">
                  <div className="curriculum-number">{index + 1}</div>
                  <div className="curriculum-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {currentCourse.prerequisite && currentCourse.prerequisite.length > 0 && (
          <div className="detail-section">
            <h2>Prerequisites</h2>
            <ul className="prerequisite-list">
              {currentCourse.prerequisite.map((item, index) => (
                <li key={index}>{item.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
