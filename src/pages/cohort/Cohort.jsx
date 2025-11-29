import React, { useState, useMemo, useEffect } from "react";
import "./Cohort.css";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../redux/slices/frontend/courseSlice";
import Pencil from "./Pencil";

function Cohort() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Filter cohorts based on search term and selected filters
  const filteredCourse = useMemo(() => {
    if (!courses) return [];

    const result = courses.filter((course) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());
      // Category filter
      const matchesCategory =
        !selectedFilters.category ||
        course.category.toLowerCase() ===
          selectedFilters.category.toLowerCase();

      // Status filter
      const matchesStatus =
        !selectedFilters.status ||
        course.status.toLowerCase() ===
          selectedFilters.status.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
    return result;
  }, [courses, searchTerm, selectedFilters]);

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

    const handleRegisterCourse = (cohortId) => {
    setTimeout(() => {
      navigate('/cohort/register', { state: { cohort_id: cohortId } });
    }, 1000);
  };

  // const openModal = (course) => {
  //   setSelectedCourse(course);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedCourse(null);
  // };

  return (
    <div>
      <section className="cohort-hero-section">
        <div className="hero-content">
          <h1>
            Training <span className="primary-color">Cohorts</span>
          </h1>
          <p>
            Unlock high-impact career growth. Explore our intensive programs
            designed to deliver immediate, in-demand technical authority in tech
            and data science.
          </p>
        </div>

        <Pencil />
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
                <option value="Mobile Development">Mobile Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
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
              {filteredCourse.length > 0 ? (
                filteredCourse.map((course) => {
                  return (
                    <article key={course.id} className="course-card">
                      <div className="course-card-header">
                        <div
                          className="course-image"
                          style={{
                            backgroundImage: course.image
                              ? `url(${course.image})`
                              : "linear-gradient(135deg, #0a74da 0%, #487efc 100%)",
                          }}
                        >
                          <div className="course-overlay">
                            <span className="category-badge">
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
                          <button
                            onClick={() => handleRegisterCourse(course?.cohorts?.[0]?.id)}
                            className="enroll-btn primary-btn"
                          >
                            Enroll Now
                          </button>

                          <button
                            className="details-btn secondary-btn"
                            // onClick={() => openModal(course)}
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
      </section>
    </div>
  );
}

export default Cohort;
