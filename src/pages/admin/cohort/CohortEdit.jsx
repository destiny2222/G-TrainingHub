import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCohortById, updateCohort } from '../../../redux/slices/cohortSlice';
import { fetchCourses } from '../../../redux/slices/courseSlice';
import { toast } from 'react-toastify';
import '../course/Course.css';

const CohortEdit = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentCohort, loading } = useSelector((state) => state.cohorts);
  const { courses } = useSelector((state) => state.courses);
  
  const [formData, setFormData] = useState({
    name: '',
    course_id: '',
    price: '',
    start_date: '',
    end_date: '',
    duration: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  // Fetch cohort data and courses
  useEffect(() => {
    dispatch(fetchCohortById(slug));
    dispatch(fetchCourses());
  }, [dispatch, slug]);

  // Update form when cohort data is loaded
  useEffect(() => {
    if (currentCohort) {
      setFormData({
        name: currentCohort.name || '',
        course_id: currentCohort.course_id || currentCohort.course?.id || '',
        price: currentCohort.price || '',
        start_date: currentCohort.start_date || '',
        end_date: currentCohort.end_date || '',
        duration: currentCohort.duration || '',
        status: currentCohort.status || 'active',
      });
    }
  }, [currentCohort]);

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
        await dispatch(updateCohort({ slug, cohortData: formData })).unwrap();
        toast.success('Cohort updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/admin/cohorts');
      } catch (error) {
        const errorMessage = error.errors 
          ? Object.values(error.errors).flat().join(', ')
          : error.message || 'Failed to update cohort';
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

  if (loading) {
    return (
      <div className="course-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading cohort data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <div>
          <h1>Edit Cohort</h1>
          <p>Update cohort information for: <strong>{formData.name}</strong></p>
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
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.uuid || course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.course_id && <span className="error-message">{errors.course_id}</span>}
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
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Cohort'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CohortEdit;
