import React, { useState, useMemo } from "react";
import "./Cohort.css";
import { IoIosSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { FaCalendarAlt, FaUsers, FaClock, FaGraduationCap } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { fetchCourses } from "../../redux/slices/frontend/courseSlice";
import { useDispatch, useSelector } from "react-redux";


function Cohort() {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    status: ''
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Filter courses based on search term and selected filters
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    
    return courses.filter(course => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = !selectedFilters.category || 
        course.category.toLowerCase() === selectedFilters.category.toLowerCase();
      
      // Status filter
      const matchesStatus = !selectedFilters.status || 
        course.status.toLowerCase() === selectedFilters.status.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, searchTerm, selectedFilters]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // const getCategoryColor = (category) => {
  //   const colors = {
  //     'Data Science': '#487EFC',
  //     'Machine Learning': '#10B981',
  //     'Web Development': '#3B82F6',
  //     'AI': '#F59E0B',
  //     'Analytics': '#EF4444',
  //     'default': '#6B7280'
  //   };
  //   return colors[category] || colors.default;
  // };

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <section className="breadcrumb-area cohort-hero-section pt-100 pb-100 background">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="hero-content">
                <h1>
                  Training <span className="primary-color">Courses</span>
                </h1>
                <p>
                  Explore our comprehensive training programs designed to advance your career
                  in technology and data science.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cohort-section">
        <div className="cohort-title">
          <h2>Available Training Programs</h2>
        </div>

        <div className="search-filter-container">
          <div className="search-section">
            <IoIosSearch className="search-icon" />
            <input
              className="cohort-search-input"
              placeholder="Search by title or category.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <select
                className="filter-dropdown"
                value={selectedFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Web Development">Web Development</option>
                <option value="AI">AI</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status:</label>
              <select
                className="filter-dropdown"
                value={selectedFilters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Courses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        <div className="cohort-container">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading courses...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-message">Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="courses-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <article key={course.id} className="course-card">
                    <div className="course-card-header">
                      <div 
                        className="course-image"
                        style={{
                          backgroundImage: course.image ? `url(${course.image})` : "linear-gradient(135deg, #0a74da 0%, #487efc 100%)"
                        }}
                      >
                        <div className="course-overlay">
                          <span 
                            className="category-badge">
                            <BiCategory />
                            {course.category}
                          </span>
                          <span className={`status-badge ${course.status}`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="course-card-body">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">
                        {truncateText(course.description, 120)}
                      </p>

                      <div className="course-actions">
                        <button className="enroll-btn primary-btn">
                          Enroll Now
                        </button>
                        <button 
                          className="details-btn secondary-btn"
                          onClick={() => openModal(course)}
                          // onMouseEnter={() => openModal(course)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-courses">
                  <h3>No courses found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Course Details Modal */}
        {isModalOpen && selectedCourse && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{selectedCourse.title}</h2>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="modal-image">
                  <img 
                    src={selectedCourse.image || "https://via.placeholder.com/400x200?text=Course+Image"} 
                    alt={selectedCourse.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=Course+Image";
                    }}
                  />
                  <div className="modal-badges">
                    <span  className="category-badge" >
                      <BiCategory />
                      {selectedCourse.category}
                    </span>
                    <span className={`status-badge ${selectedCourse.status}`}>
                      {selectedCourse.status}
                    </span>
                  </div>
                </div>

                <div className="modal-details">
                  <div className="detail-section">
                    <h3>Description</h3>
                    <p>{selectedCourse.description}</p>
                  </div>

                  {selectedCourse.prerequisite && selectedCourse.prerequisite.length > 0 && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <FaGraduationCap />
                        Prerequisites
                      </h3>
                      <div className="prerequisites-grid">
                        {selectedCourse.prerequisite.map((prereq, index) => (
                          <div key={index} className="prerequisite-item">
                            {prereq.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.curriculum && selectedCourse.curriculum.length > 0 && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <FaClock />
                        Curriculum
                      </h3>
                      <div className="curriculum-grid">
                        {selectedCourse.curriculum.map((item, index) => (
                          <div key={index} className="curriculum-detail-item">
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="detail-section">
                    <h3>Course Information</h3>
                    <div className="course-info-grid">
                      <div className="info-item">
                        <FaCalendarAlt />
                        <div>
                          <strong>Created:</strong>
                          <span>{formatDate(selectedCourse.created_at)}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <FaUsers />
                        <div>
                          <strong>Type:</strong>
                          <span>Cohort Program</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <BiCategory />
                        <div>
                          <strong>Category:</strong>
                          <span>{selectedCourse.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="modal-enroll-btn" onClick={closeModal}>
                  Enroll Now
                </button>
                <button className="modal-close-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Cohort;
