import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createLibraryItem } from '../../../redux/slices/super_admin/LibrarySlice';
import { toast } from 'react-toastify';
import './Library.css';

const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

function Create() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.library);
//   const loading = false;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publish_year: '',
    image_url: '',
    file_url: '',
    description: '',
    status: 'active',
    imageFile: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);
    data.append('folder', 'library_images');
    const res = await fetch(url, {
      method: 'POST',
      body: data,
    });
    if (!res.ok) throw new Error('Cloudinary upload failed');
    return res.json();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.publish_year.trim()) newErrors.publish_year = 'Publish year is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.file_url.trim()) newErrors.file_url = 'File URL is required';
    if (!formData.imageFile) newErrors.image_url = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      let imageResult = null;
      if (formData.imageFile) {
        imageResult = await uploadImageToCloudinary(formData.imageFile);
      }
      const payload = {
        title: formData.title,
        author: formData.author,
        publish_year: formData.publish_year,
        image_url: imageResult?.secure_url || '',
        file_url: formData.file_url,
        description: formData.description,
        status: formData.status,
      };
      console.log(payload);
      await dispatch(createLibraryItem(payload)).unwrap();
      toast.success('Library item created successfully!');
      setTimeout(() => {
        navigate('/admin/library');
      }, 200);
    } catch (error) {
      let errorMsg = error?.message;
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      toast.error(errorMsg || 'Failed to create library item');
    }
  };

  const handleCancel = () => {
    navigate('/admin/library');
  };

  return (
    <div className="library-form-container">
      <div className="library-form-header">
        <div>
          <h1>Create Library Item</h1>
          <p>Add a new item to the library</p>
        </div>
        <button onClick={handleCancel} className="btn-secondary">Cancel</button>
      </div>
      <form onSubmit={handleSubmit} className="library-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Title <span className="required">*</span></label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={errors.title ? 'error' : ''} />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="author">Author <span className="required">*</span></label>
              <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className={errors.author ? 'error' : ''} />
              {errors.author && <span className="error-message">{errors.author}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="publish_year">Publish Year <span className="required">*</span></label>
              <input type="text" id="publish_year" name="publish_year" value={formData.publish_year} onChange={handleChange} className={errors.publish_year ? 'error' : ''} />
              {errors.publish_year && <span className="error-message">{errors.publish_year}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="file_url">File URL <span className="required">*</span></label>
              <input type="text" id="file_url" name="file_url" value={formData.file_url} onChange={handleChange} className={errors.file_url ? 'error' : ''} />
              {errors.file_url && <span className="error-message">{errors.file_url}</span>}
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="status">Status <span className="required">*</span></label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="description">Description <span className="required">*</span></label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className={errors.description ? 'error' : ''} />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>
        </div>
        <div className="form-section">
          <h2>Library Image</h2>
          <div className="form-group">
            <label htmlFor="image_url">Upload Image <span className="required">*</span></label>
            <div className="file-upload-area">
              {imagePreview ? (
                <div className="thumbnail-preview">
                  <img src={imagePreview} alt="Library preview" />
                  <button type="button" onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, imageFile: null })); }} className="remove-thumbnail">Remove</button>
                </div>
              ) : (
                <label htmlFor="image_url" className="file-upload-label">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 16V32M16 24H32" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Click to upload or drag and drop</span>
                  <span className="file-upload-hint">PNG, JPG or GIF (max. 5MB)</span>
                </label>
              )}
              <input type="file" id="image_url" name="image_url" onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
              {errors.image_url && <span className="error-message">{errors.image_url}</span>}
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Library Item'}</button>
        </div>
      </form>
    </div>
  );
}

export default Create;