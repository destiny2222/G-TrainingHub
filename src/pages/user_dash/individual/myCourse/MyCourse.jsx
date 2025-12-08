import "./MyCourse.css";
import { useState, useEffect, useMemo } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { fetchUserEnrolledCohorts } from "../../../../redux/slices/userEnrolledCohortSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Calendar from "../Calender/Calender";

const MyCourse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [calendar, setCalendar] = useState(false);
  const [time, setTime] = useState({
    start: "",
    end: "",
  });
  const dispatch = useDispatch();
  const { enrollment, loading, error } = useSelector(
    (state) => state.userEnrolledCohorts,
  );

  //Fetch enrolled cohorts
  useEffect(() => {
    dispatch(fetchUserEnrolledCohorts());
  }, [dispatch]);

  const filteredEnrollment = useMemo(() => {
    if (!enrollment) return [];

    const result = enrollment.filter((cohort) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        cohort.cohort.course.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
    return result;
  }, [enrollment, searchTerm]);

  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleCalendarClick = (start, end) => {
    setCalendar(true);
    setTime({
      start: start,
      end: end,
    });
  };

  const handleCalendarClose = () => {
    setCalendar(false);
  };

  return (
    <>
      <div className="enrolled-courses-container">
        <h1 className="fw-bold">My Enrolled Courses</h1>
        <div>
          <p>
            This page provides a detailed overview of all the courses you have
            enrolled in, allowing you to easily track and manage your learning
            progress in one convenient place.
          </p>
        </div>

        <div className="search-section">
          <IoIosSearch className="search-icon" />
          <input
            className="cohort-search-input"
            placeholder="Search by title or category.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="spinner" role="status"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="enrollment-list">
            {filteredEnrollment.map((cohort) => (
              <div key={cohort.id} className="enrollment-item">
                <img
                  src={cohort.cohort.course.thumbnail_path}
                  alt={cohort.title}
                />
                <div className="enrollment-info">
                  <h3>{cohort.cohort.course.title}</h3>
                  <p>{truncateString(cohort.cohort.course.description, 100)}</p>
                  <p>Progress: {cohort.progress}</p>
                  <p>Enrolled: {formatDate(cohort.enrolled_at)}</p>

                  <Link to={`/cohorts/${cohort.cohort.slug}/details`}>
                    <button className="details-btn primary-btn enrolled-btn">
                      View Details
                    </button>
                  </Link>

                  <button
                    className="details-btn primary-btn calendar-btn"
                    onClick={() =>
                      handleCalendarClick(
                        cohort.cohort.start_date,
                        cohort.cohort.end_date,
                      )
                    }
                  >
                    View Calendar
                  </button>
                </div>
              </div>
            ))}
            {filteredEnrollment.length === 0 && (
              <div className="no-enrollment-message">
                Enrolled courses not found.
              </div>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: "100vh",
          width: "100vw",
          borderRadius: "10px",
          display: calendar ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      />
      <div className="calendar-container" style={{}}>
        <IoMdClose
          onClick={handleCalendarClose}
          style={{
            zIndex: 1000,
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            color: "white",
            fontSize: "24px",
          }}
        />
        {calendar && <Calendar start={time.start} end={time.end} />}
      </div>
    </>
  );
};

export default MyCourse;
