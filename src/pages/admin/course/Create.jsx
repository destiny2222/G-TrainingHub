import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../../redux/slices/courseSlice';
import { toast } from 'react-toastify';
import './Course.css';

const CourseCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.courses);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    curriculum: [{ topic: '', description: '' }],
    prerequisites: [''],
    image: null,
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

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
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[index][field] = value;
    setFormData(prev => ({ ...prev, curriculum: updatedCurriculum }));
  };

  const addCurriculumItem = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { topic: '', description: '' }]
    }));
  };

  const removeCurriculumItem = (index) => {
    if (formData.curriculum.length > 1) {
      const updatedCurriculum = formData.curriculum.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, curriculum: updatedCurriculum }));
    }
  };

  const handlePrerequisiteChange = (index, value) => {
    const updatedPrerequisites = [...formData.prerequisites];
    updatedPrerequisites[index] = value;
    setFormData(prev => ({ ...prev, prerequisites: updatedPrerequisites }));
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const removePrerequisite = (index) => {
    if (formData.prerequisites.length > 1) {
      const updatedPrerequisites = formData.prerequisites.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, prerequisites: updatedPrerequisites }));
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
      if (!item.topic.trim()) {
        itemErrors.topic = 'Topic is required';
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
    const prerequisiteErrors = formData.prerequisites.map((prereq, index) => {
      if (!prereq.trim()) {
        return 'Prerequisite cannot be empty';
      }
      return '';
    });

    if (prerequisiteErrors.some(err => err !== '')) {
      newErrors.prerequisites = prerequisiteErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare FormData for multipart/form-data submission
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      
      // Append curriculum as individual array items
      formData.curriculum.forEach((item, index) => {
        submitData.append(`curriculum[${index}][title]`, item.topic);
        submitData.append(`curriculum[${index}][description]`, item.description);
      });
      
      // Append prerequisites as array of objects with title field
      const validPrerequisites = formData.prerequisites.filter(p => p && p.trim());
      validPrerequisites.forEach((prereq, index) => {
        submitData.append(`prerequisite[${index}][title]`, prereq);
      });
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      try {
        await dispatch(createCourse(submitData)).unwrap();
        toast.success('Course created successfully! Now you can add cohorts to this course.', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate(`/admin/courses`);
      } catch (error) {
        const errorMessage = error.errors 
          ? Object.values(error.errors).flat().join(', ')
          : error.message || 'Failed to create course';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/admin/courses');
    }
  };

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <div>
          <h1>Create New Course</h1>
          <p>Add a new course to your training platform</p>
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
                  <img src={imagePreview} alt="Course preview" />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
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
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="prerequisite-item">
                <div className="prerequisite-input-group">
                  <input
                    type="text"
                    value={prerequisite}
                    onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                    placeholder={`e.g., Basic knowledge of ${index === 0 ? 'HTML & CSS' : 'JavaScript'}`}
                    className={errors.prerequisites?.[index] ? 'error' : ''}
                  />
                  {formData.prerequisites.length > 1 && (
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
                {errors.prerequisites?.[index] && (
                  <span className="error-message">{errors.prerequisites[index]}</span>
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
                    <label htmlFor={`topic-${index}`}>Topic Title <span className="required">*</span></label>
                    <input
                      type="text"
                      id={`topic-${index}`}
                      value={item.topic}
                      onChange={(e) => handleCurriculumChange(index, 'topic', e.target.value)}
                      placeholder="e.g., Introduction to Components"
                      className={errors.curriculum?.[index]?.topic ? 'error' : ''}
                    />
                    {errors.curriculum?.[index]?.topic && (
                      <span className="error-message">{errors.curriculum[index].topic}</span>
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
          <button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreate;
