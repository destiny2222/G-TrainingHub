import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createRecapMaterial } from '../../../redux/slices/super_admin/RecapMaterial';
import { fetchCohorts } from '../../../redux/slices/cohortSlice';
import { toast, ToastContainer } from 'react-toastify';
import './RecapMaterial.css';

const RecapMaterialCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cohorts } = useSelector((state) => state.cohorts);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCohorts());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    cohort_id: '',
    title: '',
    description: '',
    file_path: '', // ✅ now holds Zoom link (string)
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValidUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cohort_id.trim()) newErrors.cohort_id = 'Cohort is required';

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be at most 255 characters';
    }

    // ✅ require zoom link (if you want it optional, remove this block)
    if (!formData.file_path.trim()) {
      newErrors.file_path = 'Zoom link is required';
    } else if (!isValidUrl(formData.file_path.trim())) {
      newErrors.file_path = 'Please enter a valid URL (e.g. https://zoom.us/j/...)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        cohort_id: formData.cohort_id,
        title: formData.title,
        description: formData.description,
        file_path: formData.file_path.trim(), // ✅ zoom link
        file_public_id: '', // ✅ keep if your backend expects it; otherwise remove
      };

      await dispatch(createRecapMaterial(payload)).unwrap();
      toast.success('Recap material created successfully!');
      setTimeout(() => navigate('/admin/class-recap-materials'), 300);
    } catch (error) {
      let errorMsg = error?.message;
      if (error?.response?.data?.message) errorMsg = error.response.data.message;
      else if (typeof error === 'string') errorMsg = error;

      toast.error(errorMsg || 'Failed to create recap material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate('/admin/class-recap-materials');

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="recap-form-container">
        <div className="recap-form-header">
          <div>
            <h1>Create Recap Material</h1>
            <p>Add a new recap material for a cohort</p>
          </div>
          <button onClick={handleCancel} className="btn-secondary">Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="recap-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="cohort_id">Cohort <span className="required">*</span></label>
              <select name="cohort_id" id="cohort_id" value={formData.cohort_id} onChange={handleChange}>
                <option value="">Select a Cohort</option>
                {cohorts.map(cohort => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name || cohort.title || `Cohort ${cohort.id}`}
                  </option>
                ))}
              </select>
              {errors.cohort_id && <span className="error-message">{errors.cohort_id}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="title">Title <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description (optional)"
                rows="3"
              />
            </div>
          </div>

          {/* ✅ replaced Upload Video with Zoom Link */}
          <div className="form-section">
            <h2>Zoom Link</h2>
            <div className="form-group">
              <label htmlFor="file_path">Zoom Meeting Link <span className="required">*</span></label>
              <input
                type="url"
                id="file_path"
                name="file_path"
                value={formData.file_path}
                onChange={handleChange}
                placeholder="https://zoom.us/j/..."
                className={errors.file_path ? 'error' : ''}
              />
              {errors.file_path && <span className="error-message">{errors.file_path}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Recap Material'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RecapMaterialCreate;
