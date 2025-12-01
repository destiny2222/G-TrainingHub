import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useRef } from "react";
import cohortImage from "../../assets/image/background/background.jpeg";
import { Award, Profile, Book } from "iconsax-reactjs";
import { fetchClassRooms } from "../../redux/slices/classRoomSlice";
import { fetchUserEnrolledCohorts } from "../../redux/slices/userEnrolledCohortSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nextClassRooms = useSelector((state) => state.classRooms.classRooms);
  const classRoomsLoading = useSelector((state) => state.classRooms.loading);
  const userEnrolledCohorts = useSelector(
    (state) => state.userEnrolledCohorts.enrollment,
  );
  const userEnrolledLoading = useSelector(
    (state) => state.userEnrolledCohorts.loading,
  );
  const cohort = userEnrolledCohorts[0]?.cohort || {};
  const canJoin = nextClassRooms?.next_class?.can_join;
  const cohortSlug = cohort?.slug;

  const lastFetchedSlug = useRef();

  useEffect(() => {
    dispatch(fetchUserEnrolledCohorts());
  }, [dispatch]);

  useEffect(() => {
    if (cohortSlug && lastFetchedSlug.current !== cohortSlug) {
      dispatch(fetchClassRooms(cohortSlug));
      lastFetchedSlug.current = cohortSlug;
    }
  }, [dispatch, cohortSlug]);

  const isLoading = classRoomsLoading || userEnrolledLoading;

  const handleJoinClass = () => {
    console.log("Join class clicked");
    // if (canJoin) {
    navigate(`/classroom/${cohort.slug}`);
    // }
  };

  return (
    <div className="dashboard-main-section">
      <div className="container p-4 min-vh-100">
        {/* Welcome Section */}
        <section className="mb-4 d-flex justify-content-between align-items-center">
          <div className="welcome-head">
            <h1 className="welcome-text-title animate-text-color">
              {isLoading ? <Skeleton width={200} /> : "Welcome back, Alex!"}
            </h1>
            <p className="welcome-text-subtitle mb-3">
              {isLoading ? (
                <Skeleton width={250} />
              ) : (
                "You have 2 assignments due this week."
              )}
            </p>
          </div>
          <div className="d-flex flex-wrap justify-content-end">
            {isLoading ? (
              <Skeleton
                width={180}
                height={40}
                count={3}
                style={{ marginRight: "12px", marginBottom: "8px" }}
              />
            ) : (
              <div className="action-buttons">
                <button className="act-button custom-card">
                  <Award /> Download Certificates
                </button>
                <button className="act-button custom-card">
                  <Book /> Book a Mentor
                </button>
                <button className=" act-button custom-card">
                  <Profile /> Access Career Guide
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="row">
          <div className="col-12 col-lg-8 d-flex flex-column">
            {/* Ongoing Courses */}
            <h2 className="h5 fw-semibold mb-3">
              {canJoin ? "Continue Learning" : "Upcoming Class"}
            </h2>
            <div className="card custom-card  mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  {isLoading ? (
                    <Skeleton
                      width={100}
                      height={100}
                      style={{ marginRight: "12px" }}
                    />
                  ) : (
                    <img
                      src={cohort?.course?.thumbnail_path}
                      alt="Course thumbnail"
                      className="rounded img-fluid me-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="flex-grow-1">
                    <h3 className="h6 fw-medium">
                      {isLoading ? <Skeleton width={120} /> : cohort.name}
                    </h3>
                    <div className="progress-container ">
                      {isLoading ? (
                        <Skeleton width={200} height={10} />
                      ) : (
                        <div
                          className="progress-fill"
                          role="progressbar"
                          style={{ width: "80%" }}
                          aria-valuenow="60"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      )}
                    </div>
                    <div className="progress-info">
                      <span className="">
                        {isLoading ? (
                          <Skeleton width={80} />
                        ) : (
                          `Progress: ${userEnrolledCohorts.progress ? userEnrolledCohorts.progress : 0}%`
                        )}
                      </span>
                      <button
                        type="button"
                        className="primary-btn"
                        // disabled={isLoading || !canJoin}
                        onClick={handleJoinClass}
                      >
                        {isLoading ? (
                          <Skeleton width={120} />
                        ) : canJoin ? (
                          "Join Class"
                        ) : (
                          "Class not live yet"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Class Recap*/}
          <div className="col-12 col-lg-4 d-flex flex-column">
            <h2 className="h5 fw-semibold mb-3">Class Recap Videos</h2>
            <div className="card custom-card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                    style={{ width: "80px", height: "50px" }}
                  >
                    {isLoading ? (
                      <Skeleton width={80} height={50} />
                    ) : (
                      <img
                        src={cohortImage}
                        alt="Video thumbnail"
                        className="rounded me-3"
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="h6 fw-medium mb-0">
                      {isLoading ? (
                        <Skeleton width={100} />
                      ) : (
                        "Intro to Machine Learning"
                      )}
                    </h4>
                    <p className="text-muted small mb-0">
                      {isLoading ? <Skeleton width={80} /> : "Oct 20, 2024"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card custom-card mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  {isLoading ? (
                    <Skeleton
                      width={80}
                      height={50}
                      style={{ marginRight: "12px" }}
                    />
                  ) : (
                    <img
                      src={cohortImage}
                      alt="Video thumbnail"
                      className="rounded me-3"
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div>
                    <h4 className="h6 fw-medium mb-0">
                      {isLoading ? (
                        <Skeleton width={120} />
                      ) : (
                        "Deep Learning Fundamentals"
                      )}
                    </h4>
                    <p className="text-muted small mb-0">
                      {isLoading ? <Skeleton width={80} /> : "Oct 22, 2024"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-8">
            {/* Assignments & Scores */}
            <h2 className="h5 fw-semibold mb-3">Assignments & Scores</h2>
            <div className="card custom-card">
              <div className="card-body">
                <div className="table-responsive">
                  {isLoading ? (
                    <Skeleton
                      count={4}
                      height={40}
                      style={{ marginBottom: "8px" }}
                    />
                  ) : (
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Assignment</th>
                          <th scope="col">Due Date</th>
                          <th scope="col">Status</th>
                          <th scope="col">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Module 1 Quiz</td>
                          <td>2024-10-26</td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              Submitted
                            </span>
                          </td>
                          <td>95/100</td>
                        </tr>
                        <tr>
                          <td>Project Proposal</td>
                          <td>2024-11-02</td>
                          <td>
                            <span className="badge bg-warning-subtle text-warning">
                              Pending
                            </span>
                          </td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>Mid-term Exam</td>
                          <td>2024-11-09</td>
                          <td>
                            <span className="badge bg-warning-subtle text-warning">
                              Pending
                            </span>
                          </td>
                          <td>-</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <h2 className="h5 fw-semibold mb-3">Tech Library</h2>
            <div className="card custom-card">
              <div className="card-body">
                {isLoading ? (
                  <Skeleton
                    width={250}
                    height={150}
                    style={{ marginBottom: "12px" }}
                  />
                ) : (
                  <img
                    src={cohortImage}
                    alt="Tech library"
                    className="img-fluid rounded mb-3"
                  />
                )}
                <h3 className="h6 fw-medium mb-2">
                  {isLoading ? (
                    <Skeleton width={180} />
                  ) : (
                    "Explore the Tech Library"
                  )}
                </h3>
                <p className="text-muted small mb-3">
                  {isLoading ? (
                    <Skeleton width={220} />
                  ) : (
                    "Access a wide range of books, articles, and resources to supplement your learning."
                  )}
                </p>
                <button className="btn btn-dark w-100" disabled={isLoading}>
                  {isLoading ? <Skeleton width={120} /> : "Explore Library"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
