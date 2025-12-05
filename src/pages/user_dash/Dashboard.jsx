import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useRef, useState } from "react";
import cohortImage from "../../assets/image/background/background.jpeg";
import { Award, Profile, Book, AddCircle } from "iconsax-reactjs";
import { fetchClassRooms } from "../../redux/slices/classRoomSlice";
import { fetchUserEnrolledCohorts } from "../../redux/slices/userEnrolledCohortSlice";
import { fetchAssignments } from "../../redux/slices/assignmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import FileInput from "../../components/individual/FileInput";
import { fetchRecapMaterials, fetchRecapMaterialByCohortSlug } from "../../redux/slices/classRecapMaterialSlice";
import { useFetchUser } from "../../utils/useUserStore";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useFetchUser();
  const nextClassRooms = useSelector((state) => state.classRooms.classRooms);
  const classRoomsLoading = useSelector((state) => state.classRooms.loading);
  const userAssignments = useSelector((state) => state.userAssignments.assignments);
  const recapMaterials = useSelector((state) => state.classRecapMaterials.recapMaterials);
  const userEnrolledCohorts = useSelector(
    (state) => state.userEnrolledCohorts.enrollment,
  );
  const userEnrolledLoading = useSelector(
    (state) => state.userEnrolledCohorts.loading,
  );
  const { assignments, loading, error } = useSelector(
    (state) => state.userAssignments,
  );
  console.log(assignments);

  const cohort = userEnrolledCohorts[0]?.cohort || {};
  const canJoin = nextClassRooms?.next_class?.can_join;
  const cohortSlug = cohort?.slug;

  const lastFetchedSlug = useRef();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserEnrolledCohorts());
    dispatch(fetchAssignments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRecapMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (cohortSlug && lastFetchedSlug.current !== cohortSlug) {
      dispatch(fetchRecapMaterialByCohortSlug(cohortSlug));
      lastFetchedSlug.current = cohortSlug;
    }
  }, [dispatch, cohortSlug]);

  useEffect(() => {
    if (cohortSlug && lastFetchedSlug.current !== cohortSlug) {
      dispatch(fetchClassRooms(cohortSlug));
      lastFetchedSlug.current = cohortSlug;
    }
  }, [dispatch, cohortSlug]);

  const isLoading = classRoomsLoading || userEnrolledLoading;

  const handleJoinClass = () => {
    if (canJoin) {
      navigate(`/classroom/${cohort.slug}`);
      navigate(`/classroom/${cohort.slug}`);
    }
  };


  // Helper function to format date as d m y
  const formatDateDMY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="dashboard-main-section">
      <div className="wrapper p-4 min-vh-100">
        <div className=" header-area">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="h4 fw-semibold mb-0">
              {isLoading ? <Skeleton width={200} /> : `Welcome back, ${user?.name || "Learner"}!`}
            </h1>
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
                <Link className="act-button">
                  <Award /> Download Certificates
                </Link>
                <Link className="act-button">
                  <Book /> Book a Mentor
                </Link>
                <Link className="act-button">
                  <Profile /> Access Career Guide
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="row mb-5">
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
                          style={{ width: "30%" }}
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
                        disabled={isLoading || !canJoin}
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

          <div className="col-12 col-lg-4 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-semibold mb-3">Class Recap Videos</h2>
              <Link to="/user_dash/recapVideos/List" className=""> View All</Link>
            </div>
            {recapMaterials.length === 0 && !isLoading ? (
              <div className="card custom-card mb-3">
                <div className="card-body">
                  <p className="text-muted small mb-0">
                    No recap materials available.
                  </p>
                </div>
              </div>
            ) : (
              recapMaterials.slice(0, 3).map(material => (
                <div className="card custom-card mb-3" key={material.id}>
                  <div className="card-body">
                    <div className="d-flex align-items-center">

                      {isLoading ? (
                        <Skeleton width={80} height={50} />
                      ) : (
                        <video
                          className="rounded me-3"
                          style={{
                            width: "80px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          muted
                          loop
                          playsInline
                          controls
                        >
                          <source src={material.thumbnail_path} />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      <div>
                        <h4 className="h6 fw-medium mb-0">
                          {isLoading ? (
                            <Skeleton width={100} />
                          ) : (
                            material.title || "Intro to Machine Learning"
                          )}
                        </h4>

                        <p className="text-muted small mb-0">
                          {isLoading ? (
                            <Skeleton width={80} />
                          ) : (
                            formatDateDMY(material.created_at) || "20 Oct 2024"
                          )}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-8">
            {/* Assignments & Scores */}
            <div className="card shadow-sm">
              <div className="d-flex justify-content-between align-items-end mb-3 px-3 pt-3 gap-3">
                <h2 className="h5 fw-semibold mb-3">
                  Assignments {"& Scores"}
                </h2>

                <button
                  className="primary-btn assignment-btn"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <AddCircle size={24} />{" "}
                  {isLoading ? <Skeleton width={100} /> : "Submit Assignment"}
                </button>
              </div>
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
                        {userAssignments.slice(0, 5).map((assignment) => (
                          <tr key={assignment.id}>
                            <td>{assignment.description}</td>
                            <td>{formatDateDMY(assignment.created_at)}</td>
                            <td>
                              <span className={`badge ${assignment.status === "Submitted" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}>
                                {assignment.status}
                              </span>
                            </td>
                            <td>{assignment.score || "-"}</td>
                          </tr>
                        ))}
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
      <FileInput isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default Dashboard;
