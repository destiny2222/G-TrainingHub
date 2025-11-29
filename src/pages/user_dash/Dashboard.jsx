import "./Dashboard.css";
import { LiaCertificateSolid } from "react-icons/lia";
import { MdEngineering } from "react-icons/md";
import { IoMdBook } from "react-icons/io";

function Dashboard() {
  return (
    <div class="wrapper">
      <section class="header-area">
        <div class="greeting-block">
          <h1>Welcome back, Alex!</h1>
        </div>
        <div class="action-buttons">
          <button class="act-button">
            <LiaCertificateSolid fontSize={25} /> Download Certificates
          </button>
          <button class="act-button">
            <IoMdBook fontSize={25} /> Book a Mentor
          </button>
          <button class="act-button">
            <MdEngineering fontSize={25} /> Access Career Guide
          </button>
        </div>
      </section>

      <div className="layout-info">
        <div class="layout-grid">
          {/* Ongoing Courses*/}
          <div>
            <h2 class="section-title">Ongoing Courses</h2>
            <div class="content-card">
              <div class="course-item">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"
                  alt="Course thumbnail"
                  class="course-thumb"
                />
                <div class="course-details">
                  <h3>AI Bootcamp 2025 - Cohort 1</h3>
                  <div class="progress-container">
                    <div class="progress-fill"></div>
                  </div>
                  <div class="progress-info">
                    <span class="progress-text">Progress: 60%</span>
                    <button class="primary-btn">Continue Learning</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment*/}
          <div>
            <h2 class="section-title">Assignments & Scores</h2>
            <div class="content-card">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Module 1 Quiz</td>
                    <td>2024-10-26</td>
                    <td>
                      <span class="status-badge status-completed">
                        Submitted
                      </span>
                    </td>
                    <td>95/100</td>
                  </tr>
                  <tr>
                    <td>Project Proposal</td>
                    <td>2024-11-02</td>
                    <td>
                      <span class="status-badge status-waiting">Pending</span>
                    </td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Mid-term Exam</td>
                    <td>2024-11-09</td>
                    <td>
                      <span class="status-badge status-waiting">Pending</span>
                    </td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="layout-grid">
          {/* Class recap*/}
          <div>
            <h2 class="section-title">Class Recap Videos</h2>
            <div class="content-card">
              <div class="video-list-item">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200"
                  alt="Video thumbnail"
                  class="video-thumb"
                />
                <div class="video-info">
                  <h4>Intro to Machine Learning</h4>
                  <p class="video-date">Oct 20, 2024</p>
                </div>
              </div>
            </div>
            <div class="content-card">
              <div class="video-list-item">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200"
                  alt="Video thumbnail"
                  class="video-thumb"
                />
                <div class="video-info">
                  <h4>Deep Learning Fundamentals</h4>
                  <p class="video-date">Oct 22, 2024</p>
                </div>
              </div>
            </div>
          </div>
          {/* Tech Library*/}
          <div>
            <h2 class="section-title">Tech Library</h2>
            <div class="content-card library-card">
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400"
                alt="Tech library"
              />
              <h3>Explore the Tech Library</h3>
              <p>
                Access a wide range of books, articles, and resources to
                supplement your learning.
              </p>
              <button class="full-width-btn">Explore Library</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
