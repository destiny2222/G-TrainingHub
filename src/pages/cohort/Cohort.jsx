import React, { useState, useMemo } from "react";
import "./Cohort.css";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCohorts } from "../../redux/slices/frontend/cohortSlice";
import Pencil from "./Pencil";

function Cohort() {
  const dispatch = useDispatch();
  const { cohorts, loading, error } = useSelector((state) => state.cohorts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    status: "",
  });

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
        course.course.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        !selectedFilters.category ||
        course.course.category.toLowerCase() ===
          selectedFilters.category.toLowerCase();

      // Status filter
      const matchesStatus =
        !selectedFilters.status ||
        course.status.toLowerCase() === selectedFilters.status.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
    return result;
  }, [cohorts, searchTerm, selectedFilters]);

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
              {filteredCohorts.length > 0 ? (
                filteredCohorts.map((cohort, i) => {
                  let course = cohort.course;
                  return (
                    <article key={i} className="course-card">
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
                            <span className={`status-badge ${cohort.status}`}>
                              {cohort.status}
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
                          <Link to={`./${cohort.id}/register/${course.title}`}>
                            <button className="enroll-btn primary-btn">
                              Enroll Now
                            </button>
                          </Link>

                          <Link to={`./${cohort.slug}/details`}>
                            <button className="details-btn secondary-btn">
                              View Details
                            </button>
                          </Link>
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
