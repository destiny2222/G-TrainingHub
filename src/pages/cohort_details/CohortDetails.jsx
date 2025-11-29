import { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import "./CohortDetails.css";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourses } from "../../redux/slices/frontend/courseSlice";

const CohortDetails = () => {
  const { courses, loading, error } = useSelector((state) => state.courses);

  const { slug } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Slug filter
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    const result = courses.filter((course) => {
      const matchesSearch = course.cohorts[0].slug === slug;
      return matchesSearch;
    });
    return result[0];
  }, [courses, slug]);

  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (filteredCourses?.curriculum) {
      setExpandedSections(
        Object.fromEntries(
          filteredCourses.curriculum.map((item) => [item.title, false]),
        ),
      );
    }
  }, [filteredCourses]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="details-container">
      <div className="hero">
        {/* <button className="close-btn">
          <IoClose size={24} />
        </button>*/}
        <h1>August 2025 Live Cohort</h1>
        <p>
          Join our comprehensive program for master of start Machine Learning,
          curated by industry experts in a hands-on, collaborative environment.
        </p>
        <div className="buttons">
          <Link
            to={`/cohorts/${filteredCourses?.cohorts[0].id}/register/${filteredCourses?.title}`}
          >
            <div className="enroll">
              <button className="btn-primary">Enroll Now</button>
            </div>
          </Link>

          <div className="brochure">
            <button className="btn-secondary">Download Brochure</button>
          </div>
        </div>
      </div>

      <div className="description">
        <h2>{filteredCourses?.title || ""}</h2>
        <hr />
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading Description...</p>
          </div>
        )}
        <p>{filteredCourses?.description || ""}</p>
      </div>

      <div className="content-grid">
        <div className="curriculum-section">
          <h2>Curriculum</h2>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading Curriculum...</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredCourses?.curriculum.map((item, index) => (
                <div className="curriculum-item" key={index}>
                  <div
                    className="curriculum-header"
                    onClick={() => toggleSection(item.title)}
                  >
                    <span>{item.title}</span>
                    <IoChevronDown
                      className={expandedSections[item.title] ? "rotated" : ""}
                    />
                  </div>
                  {expandedSections[item.title] && (
                    <div className="curriculum-content">{item.description}</div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        <div className="details-section">
          <div className="prerequisite">
            <h4>Prerequisites</h4>
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Prerequisites...</p>
              </div>
            )}
            <ul>
              {!loading && !error && (
                <>
                  {filteredCourses?.prerequisite?.length > 0 ? (
                    filteredCourses.prerequisite.map((prerequisite, index) => (
                      <li key={index}>{prerequisite.title}</li>
                    ))
                  ) : (
                    <li>No prerequisite</li>
                  )}
                </>
              )}
            </ul>
          </div>
          <div className="time">
            <div className="starting">
              <h6>Starting Date:</h6>
              {loading && <div className="loading-spinner"></div>}
              {filteredCourses?.cohorts[0]?.start_date && (
                <p>{formatDate(filteredCourses.cohorts[0].start_date)}</p>
              )}
            </div>
            <div className="ending">
              <h6>Ending Date:</h6>
              {loading && <div className="loading-spinner"></div>}
              {filteredCourses?.cohorts[0]?.start_date && (
                <p>{formatDate(filteredCourses.cohorts[0].end_date)}</p>
              )}
            </div>
            <div className="duration">
              <h6>Duration:</h6>
              {loading && <div className="loading-spinner"></div>}
              {filteredCourses?.cohorts[0]?.start_date && (
                <p>{filteredCourses.cohorts[0].duration}</p>
              )}
            </div>
          </div>
        </div>

        {/* <div className="calendar-section">
          <h2>Live Sessions Calendar</h2>
          <div className="calendar">
            <div className="calendar-header">
              <button onClick={() => navigateMonth("prev")}>
                <IoChevronBack size={20} />
              </button>
              <span>
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={() => navigateMonth("next")}>
                <IoChevronForward size={20} />
              </button>
            </div>
            <div className="calendar-weekdays">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="calendar-grid">{renderCalendar()}</div>
          </div>
        </div>*/}
      </div>
      <div className="pricing">
        <h2>Pricing</h2>
        <hr />
        <p>
          <span className="naira">N</span>
          {filteredCourses?.cohorts[0]?.price && (
            <>{parseFloat(filteredCourses.cohorts[0].price).toLocaleString()}</>
          )}
        </p>
      </div>

      <Link
        to={`/cohorts/${filteredCourses?.cohorts[0].id}/register/${filteredCourses?.title}`}
      >
        <div className="enroll">
          <button className="btn-primary">Enroll Now</button>
        </div>
      </Link>

      <div className="instructors-section">
        <h2>Instructors & Guest Speakers</h2>
        <div className="instructors-grid">
          <div className="instructor-card">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=evelyn"
              alt="Dr. Evelyn Reed"
            />
            <h3>Dr. Evelyn Reed</h3>
            <p className="role">Lead Instructor</p>
            <p>
              Expert in Natural Language Processing with 15 years of experience
              in AI and ML research.
            </p>
          </div>
          <div className="instructor-card">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=kevin"
              alt="Kevin Tanaka"
            />
            <h3>Kevin Tanaka</h3>
            <p className="role">AI Specialist</p>
            <p>
              Renowned deep learning specialist with 10 years of experience in
              Computer Vision.
            </p>
          </div>
          <div className="instructor-card">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
              alt="Maria Rodriguez"
            />
            <h3>Maria Rodriguez</h3>
            <p className="role">Industry Expert</p>
            <p>
              A lifelong participant for over two decades delivering
              cutting-edge solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2>What Our Alumni Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
                alt="Alex Chen"
              />
              <div>
                <h4>Alex Chen</h4>
                <p>Data Scientist at Amazon Inc.</p>
              </div>
            </div>
            <p>
              "The cohort was a game-changer for my career. The hands-on
              projects and personalized feedback from instructors helped me land
              my dream job at Amazon!"
            </p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=sammi"
                alt="Sammi Jones"
              />
              <div>
                <h4>Sammi Jones</h4>
                <p>ML Engineer at Facebook</p>
              </div>
            </div>
            <p>
              "The curriculum is incredibly well-structured, and the
              peer-to-peer learning atmosphere here, I went from zero to highly
              recommended for deployment models!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortDetails;
