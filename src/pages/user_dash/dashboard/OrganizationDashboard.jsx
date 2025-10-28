import React from 'react';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import Sidebar from '../../../components/dashboard/Sidebar';
import { Add, DocumentDownload, CalendarEdit, Award } from 'iconsax-reactjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function OrganizationDashboard() {
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Training Progress',
                data: [65, 59, 80, 81, 56, 70],
                backgroundColor: '#DAE7FF',
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                display: false,
                grid: {
                    display: false,
                },
            },
        },
    };

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
                                <h1 className="welcome-text-title">Welcome, Acme Inc.</h1>
                            </div>
                            <div className="d-flex flex-wrap justify-content-end">
                                <button className="btn-request-training d-flex align-items-center mb-2">
                                    <Add size="20" className="me-2" /> Request Custom Training
                                </button>
                            </div>
                        </section>

                        {/* Stats Cards */}
                        <div className="row mb-4">
                            <div className="col-md-3 mb-3">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">Total Learners</p>
                                        <h2 className="h3 fw-bold">1,234</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">Active Training</p>
                                        <h2 className="h3 fw-bold">56</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">Completion Rate</p>
                                        <h2 className="h3 fw-bold">89%</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <p className="text-muted mb-1">Pending Requests</p>
                                        <h2 className="h3 fw-bold">5</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Training Progress and Upcoming Sessions */}
                        <div className="row mb-4">
                            <div className="col-12 col-lg-8 d-flex flex-column">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h2 className="h5 fw-semibold mb-3">Training Progress</h2>
                                        <div style={{ height: '200px' }}>
                                            <Bar data={chartData} options={chartOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4 d-flex flex-column">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h2 className="h5 fw-semibold mb-3">Upcoming Sessions</h2>
                                        <ul className="list-unstyled">
                                            <li className="d-flex align-items-start mb-3">
                                                <div className="date-badge me-3">
                                                    <span className="month">JUL</span>
                                                    <span className="day">28</span>
                                                </div>
                                                <div>
                                                    <h4 className="h6 fw-medium mb-0">Project Management 101</h4>
                                                    <p className="text-muted small mb-0">Virtual | 10:00 AM - 12:00 PM</p>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start mb-3">
                                                <div className="date-badge me-3">
                                                    <span className="month">AUG</span>
                                                    <span className="day">05</span>
                                                </div>
                                                <div>
                                                    <h4 className="h6 fw-medium mb-0">Leadership Skills Workshop</h4>
                                                    <p className="text-muted small mb-0">On-site | 9:00 AM - 4:00 PM</p>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start mb-3">
                                                <div className="date-badge me-3">
                                                    <span className="month">AUG</span>
                                                    <span className="day">12</span>
                                                </div>
                                                <div>
                                                    <h4 className="h6 fw-medium mb-0">Advanced Excel Techniques</h4>
                                                    <p className="text-muted small mb-0">Virtual | 1:00 PM - 3:00 PM</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity and Quick Actions */}
                        <div className="row">
                            <div className="col-12 col-lg-8 d-flex flex-column">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h2 className="h5 fw-semibold mb-3">Recent Activity</h2>
                                        <ul className="list-unstyled activity-list">
                                            <li className="d-flex align-items-center mb-3">
                                                <Add size="20" className="activity-icon me-3" />
                                                <div>
                                                    <p className="mb-0">New Learner Added: <span className="fw-medium">John Doe</span></p>
                                                    <span className="text-muted small">2 hours ago</span>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-center mb-3">
                                                <Award size="20" className="activity-icon me-3" />
                                                <div>
                                                    <p className="mb-0">Certificate Issued for '<span className="fw-medium">Advanced Data Analysis</span>'</p>
                                                    <span className="text-muted small">1 day ago</span>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-center mb-3">
                                                <CalendarEdit size="20" className="activity-icon me-3" />
                                                <div>
                                                    <p className="mb-0">Session Scheduled: '<span className="fw-medium">Cybersecurity Basics</span>'</p>
                                                    <span className="text-muted small">3 days ago</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4 d-flex flex-column">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h2 className="h5 fw-semibold mb-3">Quick Actions</h2>
                                        <ul className="list-unstyled quick-actions-list">
                                            <li className="mb-3">
                                                <button className="btn-quick-action w-100 d-flex align-items-center">
                                                    <Add size="20" className="me-2" /> Add New Learner
                                                </button>
                                            </li>
                                            <li className="mb-3">
                                                <button className="btn-quick-action w-100 d-flex align-items-center">
                                                    <DocumentDownload size="20" className="me-2" /> Download Certificates
                                                </button>
                                            </li>
                                            <li>
                                                <button className="btn-quick-action w-100 d-flex align-items-center">
                                                    <CalendarEdit size="20" className="me-2" /> Schedule a Session
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrganizationDashboard;
