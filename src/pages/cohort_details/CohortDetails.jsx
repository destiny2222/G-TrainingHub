import React, { useState } from "react";
import {
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import "./CohortDetails.css";

const CohortDetails = () => {
  const [expandedSections, setExpandedSections] = useState({
    intro: false,
    fundamentals: false,
    deepLearning: true,
    project: false,
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(7); // August (0-indexed); add 1 to get exact date
  const [currentYear, setCurrentYear] = useState(2025);

  // Highlighted dates (flexible - you can modify these)
  const highlightedDates = [
    [6, 7, 8, 12, 13, 14, 15],
    [6, 1, 23, 14, 15],
    [6, 7, 8, 12, 13, 20],
  ];
  const highlightedMonths = [7, 8, 11];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month

    for (let day = 1; day <= daysInMonth; day++) {
      const index = highlightedMonths.findIndex(
        (month) => month === currentMonth,
      );
      const isHighlighted = index >= 0 && highlightedDates[index].includes(day);
      days.push(
        <div
          key={day}
          className={`calendar-day ${isHighlighted && highlightedMonths.includes(currentMonth) ? "highlighted" : ""}`}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="container">
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
          <div className="enroll">
            <button className="btn-primary">Enroll Now</button>
          </div>

          <div className="brochure">
            <button className="btn-secondary">Download Brochure</button>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="curriculum-section">
          <h2>Curriculum</h2>

          <div className="curriculum-item">
            <div
              className="curriculum-header"
              onClick={() => toggleSection("intro")}
            >
              <span>Introduction to AI</span>
              <IoChevronDown
                className={expandedSections.intro ? "rotated" : ""}
              />
            </div>
            {expandedSections.intro && (
              <div className="curriculum-content">
                Explore the foundational concepts of artificial intelligence and
                get hands-on with key frameworks and real-world use cases. Gain
                insight into various types of AI and set a strong foundation for
                AI/ML success.
              </div>
            )}
          </div>

          <div className="curriculum-item">
            <div
              className="curriculum-header"
              onClick={() => toggleSection("fundamentals")}
            >
              <span>Machine Learning Fundamentals</span>
              <IoChevronDown
                className={expandedSections.fundamentals ? "rotated" : ""}
              />
            </div>
            {expandedSections.fundamentals && (
              <div className="curriculum-content">
                Master the core concepts of machine learning including
                supervised and unsupervised learning.
              </div>
            )}
          </div>

          <div className="curriculum-item">
            <div
              className="curriculum-header"
              onClick={() => toggleSection("deepLearning")}
            >
              <span>Deep Learning</span>
              <IoChevronDown
                className={expandedSections.deepLearning ? "rotated" : ""}
              />
            </div>
            {expandedSections.deepLearning && (
              <div className="curriculum-content">
                Dive deep into neural networks and advanced deep learning
                architectures.
              </div>
            )}
          </div>

          <div className="curriculum-item">
            <div
              className="curriculum-header"
              onClick={() => toggleSection("project")}
            >
              <span>Final Project & Deployment</span>
              <IoChevronDown
                className={expandedSections.project ? "rotated" : ""}
              />
            </div>
            {expandedSections.project && (
              <div className="curriculum-content">
                Build and deploy a complete AI/ML project from scratch.
              </div>
            )}
          </div>
        </div>

        <div className="calendar-section">
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
        </div>
      </div>

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
