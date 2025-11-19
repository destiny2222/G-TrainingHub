import React, { useState, useMemo } from "react";
import "./Cohort.css";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCohorts } from "../../redux/slices/frontend/cohortSlice";

function Cohort() {
  const dispatch = useDispatch();
  const { cohorts, loading, error } = useSelector((state) => state.cohorts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    status: "",
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    dispatch(fetchCohorts());
  }, [dispatch]);

  // Filter cohorts based on search term and selected filters
  const filteredCohorts = useMemo(() => {
    if (!cohorts) return [];

    const result = cohorts.filter((course) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        course.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        course.course.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        !selectedFilters.category ||
        course.course.category.toLowerCase() ===
          selectedFilters.category.toLowerCase();

      // Status filter
      const matchesStatus =
        !selectedFilters.status ||
        course.course.status.toLowerCase() ===
          selectedFilters.status.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
    return result;
  }, [cohorts, searchTerm, selectedFilters]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value,
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
    <div>
      <section className="breadcrumb-area cohort-hero-section pt-100 pb-100 background">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="hero-content">
                <h1>
                  Training <span className="primary-color">Cohorts</span>
                </h1>
                <p>
                  Explore our comprehensive training programs designed to
                  advance your career in technology and data science.
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
                value={selectedFilters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
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
                value={selectedFilters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Cohorts</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        <div className="courses-container">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading Cohorts...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-message">Error: {error.message}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="courses-grid">
              {filteredCohorts.length > 0 ? (
                filteredCohorts.map((cohortObj) => {
                  const cohort = cohortObj.course;
                  return (
                    <article key={cohort.id} className="course-card">
                      <div className="course-card-header">
                        <div
                          className="course-image"
                          style={{
                            backgroundImage: cohort.image
                              ? `url(${cohort.image})`
                              : "linear-gradient(135deg, #0a74da 0%, #487efc 100%)",
                          }}
                        >
                          <div className="course-overlay">
                            <span className="category-badge">
                              <BiCategory />
                              {cohort.category}
                            </span>
                            <span className={`status-badge ${cohort.status}`}>
                              {cohort.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="course-card-body">
                        <h3 className="course-title">{cohort.title}</h3>
                        <p className="course-description">
                          {truncateText(cohort.description, 120)}
                        </p>

                        <div className="course-actions">
                          <Link to={`./${cohortObj.id}/register`}>
                            <button className="enroll-btn primary-btn">
                              Enroll Now
                            </button>
                          </Link>

                          <button
                            className="details-btn secondary-btn"
                            onClick={() => openModal(cohortObj)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="no-courses">
                  <h3>No cohort found</h3>
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
                <h2 className="modal-title">{selectedCourse.course.title}</h2>
                <button className="modal-close" onClick={closeModal}>
                  <IoClose size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-image">
                  <img
                    src={
                      selectedCourse.course.image ||
                      "https://via.placeholder.com/400x200?text=Course+Image"
                    }
                    alt={selectedCourse.course.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Course+Image";
                    }}
                  />
                  <div className="modal-badges">
                    <span className="category-badge">
                      <BiCategory />
                      {selectedCourse.course.category}
                    </span>
                    <span
                      className={`status-badge ${selectedCourse.course.status}`}
                    >
                      {selectedCourse.course.status}
                    </span>
                  </div>
                </div>

                <div className="modal-details">
                  <div className="detail-section">
                    <h3>Description</h3>
                    <p>{selectedCourse.course.description}</p>
                  </div>

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
                          <span>{selectedCourse.course.category}</span>
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
    </div>
  );
}

export default Cohort;
