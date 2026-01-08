import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCohorts } from "../../../../redux/slices/frontend/cohortSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./TrainingProgram.css";
import Modal from "../../../../components/Modal";

const OrganizationCourseList = () => {
  const dispatch = useDispatch();
  const { cohorts, loading } = useSelector((state) => state.cohorts);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cohortData, setCohortData] = useState("");
  
  useEffect(() => {
    dispatch(fetchCohorts());
  }, [dispatch]);

  const filteredCohorts = cohorts.filter(
    (cohort) =>
      cohort.course.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      cohort.status === "active",
  );

  if (loading) {
    return (
      <div className="training-program-container">
        <div className="training-program-header">
          <h1>Available Courses</h1>
          <Skeleton width={150} height={40} />
        </div>
        <div className="training-program-filters">
          <Skeleton height={45} width={300} />
        </div>
        <div className="training-program-table-container">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="cohort-card"
              style={{ marginBottom: "1rem" }}
            >
              <Skeleton height={100} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-container">
      <div className="training-program-header">
        <div>
          <Link
            to="/organization/training-programs"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            ← Back to Training Programs
          </Link>
          <h1>Available Cohort</h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
            Register for a cohort to start assigning members.
          </p>
        </div>
      </div>

      <div className="training-program-filters">
        <div className="search-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div
        className="courses-list"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {filteredCohorts.length > 0 ? (
          filteredCohorts.map((cohort) => {
            const courseCohorts = cohorts.filter((c) => c.id === cohort.id);

            return (
              <div key={cohort.id} style={{ backgroundColor: "white" }}>
                <div className="cohorts-section">
                  {courseCohorts.length > 0 ? (
                    <div
                      className="cohorts-grid"
                      style={{
                        display: "grid",
                        gap: "1rem",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(300px, 1fr))",
                      }}
                    >
                      {courseCohorts.map((cohort) => (
                        <div
                          key={cohort.id}
                          className="cohort-item"
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            padding: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <h4
                                style={{ fontWeight: "600", color: "#111827" }}
                              >
                                {cohort.name}
                              </h4>
                              <span
                                className={`status-badge ${cohort.status || "active"}`}
                                style={{ fontSize: "0.75rem" }}
                              >
                                {cohort.status || "Active"}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                                marginBottom: "1rem",
                              }}
                            >
                              <p>
                                Start:{" "}
                                {new Date(
                                  cohort.start_date,
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                End:{" "}
                                {new Date(cohort.end_date).toLocaleDateString()}
                              </p>
                              <p>
                                Price: ₦
                                {parseFloat(cohort.price).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Link
                            to={`/cohorts/${cohort.slug}/details`}
                            className=" mb-lg-0 details-btn enrolled-btn"
                            target="_blank"
                          >
                            View Details
                          </Link>
                          <button
                            className="btn-primary"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              marginTop: "1rem",
                            }}
                            onClick={() => {
                              setIsModalOpen(true);
                              setCohortData(cohort);

                            }}
                          >
                            Register for Cohort
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
                      No active cohorts available for this course.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data">
            <div className="no-data-content">
              <h3>No courses found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        Data={cohortData}
      />
    </div>
  );
};

export default OrganizationCourseList;
