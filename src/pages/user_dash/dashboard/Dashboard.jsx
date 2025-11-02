import React from 'react';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import Sidebar from '../../../components/dashboard/Sidebar';
import cohortImage from '../../../assets/image/background/background.jpeg';
import { Award, Profile, Book } from 'iconsax-reactjs';

function Dashboard() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <DashboardHeader />
                <div className="dashboard-main-section">
                    <div className="container p-4 min-vh-100">
                        {/* Welcome Section */}
                        <section className="p-4 mb-4 d-flex justify-content-between align-items-center">
                            <div className="welcome-head">
                                <h1 className="welcome-text-title">Welcome back, Alex!</h1>
                                <p className="welcome-text-subtitle mb-3">You have 2 assignments due this week.</p>
                            </div>
                            <div className="d-flex flex-wrap justify-content-end">
                                <button className="btn-download d-flex align-items-center me-3 mb-2">
                                    <Award /> Download Certificates
                                </button>
                                <button className="btn-download d-flex align-items-center me-3 mb-2">
                                    <Book /> Book a Mentor
                                </button>
                                <button className="btn-download d-flex align-items-center mb-2">
                                    <Profile /> Access Career Guide
                                </button>
                            </div>
                        </section>

                        {/* Main Content Grid */}
                        <div className="row">
                            <div className="col-12 col-lg-8 d-flex flex-column">
                                {/* Ongoing Courses */}
                                <h2 className="h5 fw-semibold mb-3">Ongoing Courses</h2>
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <img src={cohortImage} alt="Course thumbnail" className="rounded img-fluid me-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            <div className="flex-grow-1">
                                                <h3 className="h6 fw-medium">AI Bootcamp 2025 - Cohort 1</h3>
                                                <div className="progress my-2" style={{ height: '10px' }}>
                                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '80%' }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="small">Progress: 60%</span>
                                                    <button className="btn btn-dark">Continue Learning</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4 d-flex flex-column">
                                <h2 className="h5 fw-semibold mb-3">Class Recap Videos</h2>
                                <div className="card shadow-sm mb-3">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center me-3" style={{ width: '80px', height: '50px' }}>
                                                <img src={cohortImage} alt="Video thumbnail" className="rounded me-3" style={{ width: '80px', height: '50px', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <h4 className="h6 fw-medium mb-0">Intro to Machine Learning</h4>
                                                <p className="text-muted small mb-0">Oct 20, 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <img src={cohortImage} alt="Video thumbnail" className="rounded me-3" style={{ width: '80px', height: '50px', objectFit: 'cover' }} />
                                            <div>
                                                <h4 className="h6 fw-medium mb-0">Deep Learning Fundamentals</h4>
                                                <p className="text-muted small mb-0">Oct 22, 2024</p>
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
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <div className="table-responsive">
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
                                                        <td><span className="badge bg-success-subtle text-success">Submitted</span></td>
                                                        <td>95/100</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Project Proposal</td>
                                                        <td>2024-11-02</td>
                                                        <td><span className="badge bg-warning-subtle text-warning">Pending</span></td>
                                                        <td>-</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mid-term Exam</td>
                                                        <td>2024-11-09</td>
                                                        <td><span className="badge bg-warning-subtle text-warning">Pending</span></td>
                                                        <td>-</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4">
                                <h2 className="h5 fw-semibold mb-3">Tech Library</h2>
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <img src={cohortImage} alt="Tech library" className="img-fluid rounded mb-3" />
                                        <h3 className="h6 fw-medium mb-2">Explore the Tech Library</h3>
                                        <p className="text-muted small mb-3">Access a wide range of books, articles, and resources to supplement your learning.</p>
                                        <button className="btn btn-dark w-100">Explore Library</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Dashboard;
