import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecapMaterial, fetchRecapMaterials } from '../../../redux/slices/super_admin/RecapMaterial';
import { fetchCohorts } from '../../../redux/slices/cohortSlice';
import { toast, ToastContainer } from 'react-toastify';
import './RecapMaterial.css';

const RecapMaterialEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { cohorts } = useSelector((state) => state.cohorts);
  const { recapMaterials, loading } = useSelector((state) => state.recapMaterials);

  const [formData, setFormData] = useState({
    cohort_id: '',
    title: '',
    description: '',
    file_path: '',        // ✅ Zoom link
    file_public_id: '',   // keep if backend expects it; otherwise remove
  });

  const [errors, setErrors] = useState({});
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    dispatch(fetchCohorts());
    dispatch(fetchRecapMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (!initialLoaded && recapMaterials.length > 0) {
      const material = recapMaterials.find((m) => m.slug === slug);
      if (material) {
        setFormData({
          cohort_id: material.cohort_id || '',
          title: material.title || '',
          description: material.description || '',
          file_path: material.file_path || '',         // ✅ load existing zoom link
          file_public_id: material.file_public_id || '', // keep if needed
        });

        setInitialLoaded(true);
        setShowSkeleton(false);
      }
    }
  }, [recapMaterials, slug, initialLoaded]);

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

    // ✅ require zoom link (make optional by removing the "required" block)
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

    try {
      const payload = {
        cohort_id: formData.cohort_id,
        title: formData.title,
        description: formData.description,
        file_path: formData.file_path.trim(), // ✅ zoom link stored here
        file_public_id: formData.file_public_id || '', // optional
      };

      await dispatch(updateRecapMaterial({ slug, recapMaterialData: payload })).unwrap();
      toast.success('Recap material updated successfully!');
      setTimeout(() => navigate('/admin/class-recap-materials'), 300);
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || error?.data?.message || error?.message || 'Failed to update recap material';
      toast.error(errorMsg);
    }
  };

  const handleCancel = () => navigate('/admin/class-recap-materials');

  if (showSkeleton) {
    return (
      <div className="recap-form-container">
        <Skeleton height={50} width={300} style={{ marginBottom: 20 }} />
        <Skeleton height={30} width={200} style={{ marginBottom: 10 }} />
        <Skeleton height={40} width={400} style={{ marginBottom: 10 }} />
        <Skeleton height={80} width={400} style={{ marginBottom: 10 }} />
        <Skeleton height={30} width={200} style={{ marginBottom: 10 }} />
        <Skeleton height={180} width={320} style={{ marginBottom: 10 }} />
        <Skeleton height={40} width={200} style={{ marginBottom: 10 }} />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="recap-form-container">
        <div className="recap-form-header">
          <div>
            <h1>Edit Recap Material</h1>
            <p>Update recap material for a cohort</p>
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
                {cohorts.map((cohort) => (
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

          {/* ✅ Zoom link section */}
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

              {formData.file_path && isValidUrl(formData.file_path) && (
                <div style={{ marginTop: 10 }}>
                  <a href={formData.file_path} target="_blank" rel="noreferrer">
                    Open Zoom link
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Recap Material'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RecapMaterialEdit;