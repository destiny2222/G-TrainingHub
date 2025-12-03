import "./MyCourse.css";
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";

const MyCourse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters({ ...selectedFilters, [filterType]: value });
  };

  //Fetch enrolled cohorts

  return (
    <>
      <div className="enrolled-courses-container">
        <h1>My Course Page</h1>
        <div>
          <p>This page displays the courses you have enrolled in.</p>
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
      </div>
    </>
  );
};

export default MyCourse;
