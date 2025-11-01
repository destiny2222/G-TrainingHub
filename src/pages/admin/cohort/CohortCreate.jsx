import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCohort } from '../../../redux/slices/cohortSlice';
import { fetchCourses } from '../../../redux/slices/courseSlice';
import { toast } from 'react-toastify';
import '../course/Course.css';

const CohortCreate = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const { loading } = useSelector((state) => state.cohorts);
  
  
  const [formData, setFormData] = useState({
    name: '',
    course_id: courseId || '',
    price: '',
    start_date: '',
    end_date: '',
    duration: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  // Fetch available courses
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Cohort name is required';
    }
    
    if (!formData.course_id) {
      newErrors.course_id = 'Please select a course';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        newErrors.end_date = 'End date must be after start date';
      }
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await dispatch(createCohort(formData)).unwrap();
        toast.success('Cohort created successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/admin/cohorts');
      } catch (error) {
        const errorMessage = error.errors 
          ? Object.values(error.errors).flat().join(', ')
          : error.message || 'Failed to create cohort';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/admin/cohorts');
    }
  };

  // Show message if no courses are available
  if (courses.length === 0 && !loading) {
    return (
      <div className="course-form-container">
        <div className="course-form-header">
          <div>
            <h1>Add New Cohort</h1>
            <p>Create a new cohort for a course</p>
            <div style={{ marginTop: '0.5rem' }}>
              <Link to="/admin/cohorts" className="breadcrumb-link">
                ← Back to Cohorts
              </Link>
            </div>
          </div>
        </div>

        <div style={{ 
          maxWidth: '600px', 
          margin: '2rem auto', 
          padding: '2rem', 
          background: '#fff', 
          border: '2px dashed #e5e7eb',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: '0 auto 1.5rem', color: '#9ca3af' }}
          >
            <path 
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
            No Courses Available
          </h2>
          
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            You need to create at least one course before you can add cohorts. 
            Courses are required to organize and manage your cohorts effectively.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/admin/courses/create" 
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create Your First Course
            </Link>
            
            <Link 
              to="/admin/courses" 
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              View All Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <div>
          <h1>Add New Cohort</h1>
          <p>Create a new cohort for a course</p>
          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/admin/cohorts" className="breadcrumb-link">
              ← Back to Cohorts
            </Link>
          </div>
        </div>
        <button onClick={handleCancel} className="btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section">
          <h2>Cohort Information</h2>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Cohort Name <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., January 2025 Cohort"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="course_id">Course <span className="required">*</span></label>
              <select
                id="course_id"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className={errors.course_id ? 'error' : ''}
                disabled={!!courseId}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.uuid || course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.course_id && <span className="error-message">{errors.course_id}</span>}
              {courseId && <p className="field-note">Course is pre-selected from navigation</p>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) <span className="required">*</span></label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration <span className="required">*</span></label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 8 weeks, 3 months"
                className={errors.duration ? 'error' : ''}
              />
              {errors.duration && <span className="error-message">{errors.duration}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="start_date">Start Date <span className="required">*</span></label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={errors.start_date ? 'error' : ''}
              />
              {errors.start_date && <span className="error-message">{errors.start_date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date <span className="required">*</span></label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={errors.end_date ? 'error' : ''}
              />
              {errors.end_date && <span className="error-message">{errors.end_date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status <span className="required">*</span></label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Cohort'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CohortCreate;
