import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useRef, useState } from "react";
import cohortImage from "../../assets/image/background/background.jpeg";
import { Award, Profile, Book, AddCircle, TrendUp, Calendar } from "iconsax-reactjs";
import { fetchClassRooms } from "../../redux/slices/classRoomSlice";
import { fetchUserEnrolledCohorts } from "../../redux/slices/userEnrolledCohortSlice";
import { fetchAssignments } from "../../redux/slices/assignmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import FileInput from "../../components/individual/FileInput";
import {
  fetchRecapMaterials,
  fetchRecapMaterialByCohortSlug,
} from "../../redux/slices/classRecapMaterialSlice";
import { useFetchUser } from "../../utils/useUserStore";
import { fetchAnalyticsData } from "../../redux/slices/analyticsSlice";
import api from "../../utils/api";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useFetchUser();
  const [loading, setLoading] = useState(true);
  const [libraryData, setLibraryData] = useState([]);
  const [error, setError] = useState(null);
  const nextClassRooms = useSelector((state) => state.classRooms.classRooms);
  const classRoomsLoading = useSelector((state) => state.classRooms.loading);
  const userAnalytics = useSelector((state) => state.userAnalytics.analyticsData);
  const userAssignments = useSelector(
    (state) => state.userAssignments.assignments,
  );
  const recapMaterials = useSelector(
    (state) => state.classRecapMaterials.recapMaterials,
  );
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

  const [isOpen, setIsOpen] = useState(false);

  // console.log("Libaray :", Data);

  useEffect(() => {
    dispatch(fetchAssignments());
    dispatch(fetchAnalyticsData());
    handleLibrary();
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

  const handleLibrary = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/libraries");
      const data = response.data.data;
      setLibraryData(data);
    } catch (error) {
      // console.error(error);
      setError(error);
    } finally {
      setLoading(false);
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
      <div className="wrapper  min-vh-100">
        <div className=" header-area">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="h4 fw-semibold mb-0">
              {isLoading ? (
                <Skeleton width={200} />
              ) : (
                <span>
                  Welcome back,{" "}
                  <span className="user">{user?.name || "Guest"}!</span>
                </span>
              )}
            </h1>
            <p className="text-muted">Continue your learning journey</p>
          </div>
          {/* <div className="d-flex flex-wrap justify-content-end">
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
                  <Book /> Book a Mentor
                </Link>
                <Link className="act-button">
                  <Profile /> Access Career Guide
                </Link>
              </div>
            )}
          </div> */}
        </div>
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
                <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                    <Book size="24" className="me-2" color="#2563eb" />
                    <p className="text-muted mb-0">My Courses</p>
                </div>
                <h2 className="h3 fw-bold">{userAnalytics?.active_courses_count || 0}</h2>
                <p className="text-muted small mb-0">Active courses</p>
                </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
                <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                    <TrendUp size="24" className="me-2" color="#10b981" />
                    <p className="text-muted mb-0">Progress</p>
                </div>
                <h2 className="h3 fw-bold">{userAnalytics?.overall_completion || 0}%</h2>
                <p className="text-muted small mb-0">Overall completion</p>
                </div>
            </div>
          </div>
        {/* <div className="col-md-3 mb-3">
            <div className="card shadow-sm h-100">
                <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                    <Calendar size="24" className="me-2" color="#f59e0b" />
                    <p className="text-muted mb-0">Upcoming</p>
                </div>
                <h2 className="h3 fw-bold">2</h2>
                <p className="text-muted small mb-0">Sessions this week</p>
                </div>
            </div>
            </div> */}
            <div className="col-md-4 mb-3">
                <div className="card shadow-sm h-100">
                    <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                        <Award size="24" className="me-2" color="#8b5cf6" />
                        <p className="text-muted mb-0">Certificates</p>
                    </div>
                    <h2 className="h3 fw-bold">{userAnalytics?.certificates_count || 0}</h2>
                    <p className="text-muted small mb-0">Earned certificates</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row mb-5">
          <div className="col-12 col-lg-8 d-flex flex-column mb-4">
            {/* Ongoing Courses */}
            <h2 className="h5 fw-semibold mb-3">
              {canJoin ? "Continue Learning" : "Upcoming Class"}
            </h2>
            <div className="card custom-card  mb-4">
              <div className="card-body">
                <div className="d-lg-flex flex-row align-items-center">
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
                      className="rounded img-fluid me-3 join-class-img"
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
                          style={{ width: `${userEnrolledCohorts.progress ? userEnrolledCohorts.progress : 0}%` }}
                          aria-valuenow={userEnrolledCohorts.progress ? userEnrolledCohorts.progress : 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                        </div>
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
                        // className= "btn-button primary-btn join-class-btn"
                        className={`btn-button join-class-btn ${!canJoin || isLoading ? 'btn-disabled' : 'primary-btn'}`}
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

          <div className="col-12 col-lg-4 d-flex flex-column mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-semibold mb-3">Class Recap Videos</h2>
              <Link to="/recap-videos" className="">
                {" "}
                View All
              </Link>
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
              recapMaterials.slice(0, 3).map((material) => (
                <div className="card custom-card mb-3" key={material.id}>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      {isLoading ? (
  <Skeleton width={80} height={50} />
                        ) : (
                        <div
                        className="rounded me-3 d-flex align-items-center justify-content-center"
                        style={{ width: "80px", height: "50px", background: "#f5f6f7" }}
                        >
                        <a
                          href={material.file_path}
                          target="_blank"
                          rel="noreferrer"
                          className="text-decoration-none fw-semibold"
                          style={{ fontSize: "12px" }}
                        >
                          Zoom
                        </a>
                        </div>
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
        <div className="row mb-4">
          <div className="col-12 col-lg-8 mb-4">
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
                              <span
                                className={`badge ${assignment.status === "Submitted" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}
                              >
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
          <div className="col-12 col-lg-4 mb-4">
            <h2 className="h5 fw-semibold mb-3">Tech Library</h2>
            {libraryData.length === 0 && !loading ? (
              <div className="card custom-card">
                <div className="card-body">
                  <img
                    src={cohortImage}
                    alt="Tech library"
                    className="img-fluid rounded mb-3"
                  />
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
                  <Link to="/library">
                    <button className="btn btn-dark w-100" disabled={isLoading}>
                      {isLoading ? <Skeleton width={120} /> : "Explore Library"}
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              //  recapMaterials.slice(0, 3).map((material) => (
              libraryData.slice(0, 1).map((library) => (
              <div className="card custom-card">
                <div className="card-body">
                  <img  src={library.image_url} alt="Tech library"  className="img-fluid rounded mb-3"/>
                  <h3 className="h6 fw-medium mb-2">
                    {isLoading ? (  <Skeleton width={180} /> ) : ( 
                      library.title
                    )}
                  </h3>
                  <p className="text-muted small mb-3">
                    {isLoading ? (
                      <Skeleton width={220} />
                    ) : (
                      library.description.slice(0, 100) + "..."
                    )}
                  </p>
                  <Link to="/library">
                    <button className="btn btn-dark w-100" disabled={isLoading}>
                      {isLoading ? <Skeleton width={120} /> : "Explore Library"}
                    </button>
                  </Link>
                </div>
              </div>
              ))
            )}
            {/* <div className="card custom-card">
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
                <Link to="/library">
                  <button className="btn btn-dark w-100" disabled={isLoading}>
                    {isLoading ? <Skeleton width={120} /> : "Explore Library"}
                  </button>
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <FileInput isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default Dashboard;
