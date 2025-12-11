import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, updateCourse } from '../../../redux/slices/courseSlice';
import { toast } from 'react-toastify';
import './Course.css';

const CourseEdit = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentCourse, loading } = useSelector((state) => state.courses);
//   console.log(currentCourse);
  
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    curriculum: [{ title: '', description: '' }],
    prerequisite: [{ title: '' }],
    image: null,
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch course data
  useEffect(() => {
    dispatch(fetchCourseById(slug));
  }, [dispatch, slug]);

  // Update form when course data is loaded
  useEffect(() => {
    if (currentCourse) {
      // Parse and normalize prerequisite data
      let prerequisiteData = currentCourse.prerequisite || [''];
      
      // If prerequisites are already objects with title, keep them
      // If they're strings, convert to objects
      if (Array.isArray(prerequisiteData)) {
        prerequisiteData = prerequisiteData.map(item => {
          if (typeof item === 'string') {
            return { title: item };
          }
          return item;
        });
      }
      
      // Ensure at least one empty prerequisite
      if (prerequisiteData.length === 0) {
        prerequisiteData = [{ title: '' }];
      }
      
      setFormData({
        title: currentCourse.title || '',
        description: currentCourse.description || '',
        category: currentCourse.category || '',
        curriculum: currentCourse.curriculum || [{ title: '', description: '' }],
        prerequisite: prerequisiteData,
        image: null,
        status: currentCourse.status || 'active',
      });
      if (currentCourse.image) {
        // Add cache-busting parameter to image URL
        const imageUrl = currentCourse.image.includes('?') 
          ? `${currentCourse.image}&t=${Date.now()}` 
          : `${currentCourse.image}?t=${Date.now()}`;
        setImagePreview(imageUrl);
        setImageKey(Date.now());
      }
    }
  }, [currentCourse]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCurriculumChange = (index, field, value) => {
    const updatedCurriculum = formData.curriculum.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData(prev => ({ ...prev, curriculum: updatedCurriculum }));
  };

  const addCurriculumItem = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: '', description: '' }]
    }));
  };

  const removeCurriculumItem = (index) => {
    if (formData.curriculum.length > 1) {
      const updatedCurriculum = formData.curriculum.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, curriculum: updatedCurriculum }));
    }
  };

  const handlePrerequisiteChange = (index, value) => {
    const updatedPrerequisites = formData.prerequisite.map((item, i) => {
      if (i === index) {
        return { title: value };
      }
      return item;
    });
    setFormData(prev => ({ ...prev, prerequisite: updatedPrerequisites }));
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisite: [...prev.prerequisite, { title: '' }]
    }));
  };

  const removePrerequisite = (index) => {
    if (formData.prerequisite.length > 1) {
      const updatedPrerequisites = formData.prerequisite.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, prerequisite: updatedPrerequisites }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    // Validate curriculum
    const curriculumErrors = formData.curriculum.map((item, index) => {
      const itemErrors = {};
      if (!item.title.trim()) {
        itemErrors.title = 'Title is required';
      }
      if (!item.description.trim()) {
        itemErrors.description = 'Description is required';
      }
      return itemErrors;
    });

    if (curriculumErrors.some(err => Object.keys(err).length > 0)) {
      newErrors.curriculum = curriculumErrors;
    }

    // Validate prerequisites
    const prerequisiteErrors = formData.prerequisite.map((prereq, index) => {
      const prereqTitle = typeof prereq === 'string' ? prereq : (prereq?.title || '');
      if (!prereqTitle.trim()) {
        return 'Prerequisite cannot be empty';
      }
      return '';
    });

    if (prerequisiteErrors.some(err => err !== '')) {
      newErrors.prerequisite = prerequisiteErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Prepare FormData for multipart/form-data submission
      const submitData = new FormData();
      submitData.append('_method', 'PUT'); // Laravel method spoofing for PUT with FormData
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      
      // Append curriculum as individual array items
      formData.curriculum.forEach((item, index) => {
        submitData.append(`curriculum[${index}][title]`, item.title);
        submitData.append(`curriculum[${index}][description]`, item.description);
      });
      
      // Append prerequisites as array of objects with title field
      // Filter out empty prerequisites before sending
      const validPrerequisites = formData.prerequisite.filter(prereq => {
        const prereqTitle = typeof prereq === 'string' ? prereq : (prereq?.title || '');
        return prereqTitle.trim() !== '';
      });
      
      if (validPrerequisites.length > 0) {
        validPrerequisites.forEach((prereq, index) => {
          const prereqTitle = typeof prereq === 'string' ? prereq : (prereq?.title || '');
          submitData.append(`prerequisite[${index}][title]`, prereqTitle.trim());
        });
      } else {
        // Send an empty array if all prerequisites are removed
        submitData.append('prerequisite', '[]');
      }
      
      // Debug: Log what's being sent
      // console.log('Valid Prerequisites:', validPrerequisites);
      for (let pair of submitData.entries()) {
        if (pair[0].startsWith('prerequisite')) {
          // console.log(pair[0] + ': ' + pair[1]);
        }
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      try {
        
        const result = await dispatch(updateCourse({ slug, formData: submitData })).unwrap();
        
        // Backend returns { message: ..., course: ... }
        const updatedCourse = result.course || result.data || result;
        
        // Update image preview with new image URL if image was uploaded
        if (formData.image && updatedCourse?.image) {
          const newImageUrl = updatedCourse.image.includes('?') 
            ? `${updatedCourse.image}&t=${Date.now()}` 
            : `${updatedCourse.image}?t=${Date.now()}`;
          setImagePreview(newImageUrl);
          setImageKey(Date.now());
          // Clear the file input after successful upload
          const fileInput = document.getElementById('image');
          if (fileInput) fileInput.value = '';
        }
        
        toast.success('Course updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/admin/courses');
      } catch (error) {
        const errorMessage = error.errors 
          ? Object.values(error.errors).flat().join(', ')
          : error.message || 'Failed to update course';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/admin/courses');
    }
  };

  if (loading && !isSubmitting) {
    return (
      <div className="course-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <div>
          <h1>Edit Course</h1>
          <p>Update course information for: <strong>{formData.title}</strong></p>
        </div>
        <button onClick={handleCancel} className="btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Course Title <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to React Development"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description <span className="required">*</span></label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the course..."
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category <span className="required">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
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

        <div className="form-section">
          <h2>Course Image</h2>
          <div className="form-group full-width">
            <label htmlFor="image">Upload Course Image</label>
            <div className="file-upload-area">
              {imagePreview ? (
                <div className="thumbnail-preview">
                  <img src={imagePreview} alt="Course preview" key={imageKey} />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                      setImageKey(Date.now());
                      // Clear the file input
                      const fileInput = document.getElementById('image');
                      if (fileInput) fileInput.value = '';
                    }}
                    className="remove-thumbnail"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label htmlFor="image" className="file-upload-label">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 16V32M16 24H32" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Click to upload or drag and drop</span>
                  <span className="file-upload-hint">PNG, JPG or GIF (max. 5MB)</span>
                </label>
              )}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Prerequisites</h2>
          <p className="section-description">List the requirements or prior knowledge needed for this course</p>
          
          <div className="prerequisites-list">
            {formData.prerequisite.map((prerequisite, index) => (
              <div key={index} className="prerequisite-item">
                <div className="prerequisite-input-group">
                  <input
                    type="text"
                    value={prerequisite.title}
                    onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                    placeholder={`e.g., Basic knowledge of ${index === 0 ? 'HTML & CSS' : 'JavaScript'}`}
                    className={errors.prerequisite?.[index] ? 'error' : ''}
                  />
                  {formData.prerequisite.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrerequisite(index)}
                      className="btn-remove-item"
                      title="Remove prerequisite"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                {errors.prerequisite?.[index] && (
                  <span className="error-message">{errors.prerequisite[index]}</span>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPrerequisite}
            className="btn-add-curriculum"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Another Prerequisite
          </button>
        </div>

        <div className="form-section">
          <h2>Curriculum</h2>
          <p className="section-description">Define the topics and content covered in this course</p>
          
          <div className="curriculum-list">
            {formData.curriculum.map((item, index) => (
              <div key={index} className="curriculum-item">
                <div className="curriculum-item-header">
                  <h4>Topic {index + 1}</h4>
                  {formData.curriculum.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCurriculumItem(index)}
                      className="btn-remove-curriculum"
                      title="Remove topic"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor={`title-${index}`}>Topic Title <span className="required">*</span></label>
                    <input
                      type="text"
                      id={`title-${index}`}
                      value={item.title}
                      onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)}
                      placeholder="e.g., Introduction to Components"
                      className={errors.curriculum?.[index]?.title ? 'error' : ''}
                    />
                    {errors.curriculum?.[index]?.title && (
                      <span className="error-message">{errors.curriculum[index].title}</span>
                    )}
                  </div>
                  
                  <div className="form-group full-width">
                    <label htmlFor={`description-${index}`}>Topic Description <span className="required">*</span></label>
                    <textarea
                      id={`description-${index}`}
                      value={item.description}
                      onChange={(e) => handleCurriculumChange(index, 'description', e.target.value)}
                      placeholder="Describe what will be covered in this topic..."
                      rows="3"
                      className={errors.curriculum?.[index]?.description ? 'error' : ''}
                    />
                    {errors.curriculum?.[index]?.description && (
                      <span className="error-message">{errors.curriculum[index].description}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCurriculumItem}
            className="btn-add-curriculum"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Another Topic
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEdit;
