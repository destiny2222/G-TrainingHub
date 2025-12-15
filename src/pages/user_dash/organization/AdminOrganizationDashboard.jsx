// AdminOrganizationDashboard.jsx - For organization admins
import React, { useEffect, useState } from "react";
import { Add, DocumentDownload, CalendarEdit, Award, Stickynote } from "iconsax-reactjs";
import {  Chart as ChartJS, CategoryScale,LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";   
import { fetchOrganisationAnalytics } from "../../../redux/slices/admin_organisation/analyticsSlice";
import { Link } from "react-router-dom";
import { fetchOrg } from "../../../redux/slices/admin_organisation/organisationSlice.js";
import RequestCustom from "../RequestCustom.jsx";
import ScheduleSession from "../organization/ScheduleSession/ScheduleSession.jsx";
import { File } from "lucide-react";
import { fetchActivities } from "../../../redux/slices/activities/org/activitiesSlice.js";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function AdminOrganizationDashboard() {
  const dispatch = useDispatch();
  const analytics = useSelector((state) => state.analytics.analyticsData);
  const loading = useSelector((state) => state.analytics.loading);
  const error = useSelector((state) => state.analytics.error);
  const organization = useSelector((state) => state.org.organization);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const activities = useSelector((state) => state.activities.activities);
  const activitiesLoading = useSelector((state) => state.activities.loading);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  // console.log('Activities:', activities);

  useEffect(() => {
    dispatch(fetchOrganisationAnalytics());
    dispatch(fetchOrg());
  }, [dispatch]);

  const trainingProgress = analytics?.training_progress || [];

  const chartData = {
    labels: trainingProgress.map((item) => item.month),
    datasets: [
      {
        fill: true,
        label: "Training Progress",
        data: trainingProgress.map((item) => item.count),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="organization-dashboard-main-section">
      <div className="container p-4 min-vh-100">
        {/* Welcome Section */}
        <section className=" mb-4 d-lg-flex  justify-content-between align-items-center ">
          <div className="welcome-head mb-4 mb-lg-0">
            <h1 className="welcome-text-title">Welcome, {organization?.name || "Acme Inc."}</h1>
          </div>
          <div className="d-flex flex-wrap justify-content-lg-end ">
            <button 
              className="btn-request-training d-flex align-items-center mb-2"
              onClick={() => setIsModalOpen(true)}
            >
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
                <h2 className="h3 fw-bold">
                  {loading ? (
                    <div className="spinner"></div>
                  ) : error ? (
                    "Error"
                  ) : (
                    analytics?.total_learners || "0"
                  )}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted mb-1">Active Training</p>
                <h2 className="h3 fw-bold">
                  {loading ? (
                    <div className="spinner"></div>
                  ) : error ? (
                    "Error"
                  ) : (
                    analytics?.active_training || "0"
                  )}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted mb-1">Completion Rate</p>
                <h2 className="h3 fw-bold">
                  {loading ? (
                    <div className="spinner"></div>
                  ) : error ? (
                    "Error"
                  ) : (
                    analytics?.completion_rate || "0%"
                  )}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted mb-1">Pending Requests</p>
                <h2 className="h3 fw-bold">
                  {loading ? (
                    <div className="spinner"></div>
                  ) : error ? (
                    "Error"
                  ) : (
                    analytics?.pending_requests || "0"
                  )}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Training Progress and Upcoming Sessions */}
        <div className="row mb-4">
          <div className="col-12 col-lg-12 d-flex flex-column">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 fw-semibold mb-3">Training Progress</h2>
                <div style={{ height: "250px" }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-12 col-lg-4 d-flex flex-column">
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
                      <h4 className="h6 fw-medium mb-0">
                        Project Management 101
                      </h4>
                      <p className="text-muted small mb-0">
                        Virtual | 10:00 AM - 12:00 PM
                      </p>
                    </div>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <div className="date-badge me-3">
                      <span className="month">AUG</span>
                      <span className="day">05</span>
                    </div>
                    <div>
                      <h4 className="h6 fw-medium mb-0">
                        Leadership Skills Workshop
                      </h4>
                      <p className="text-muted small mb-0">
                        On-site | 9:00 AM - 4:00 PM
                      </p>
                    </div>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <div className="date-badge me-3">
                      <span className="month">AUG</span>
                      <span className="day">12</span>
                    </div>
                    <div>
                      <h4 className="h6 fw-medium mb-0">
                        Advanced Excel Techniques
                      </h4>
                      <p className="text-muted small mb-0">
                        Virtual | 1:00 PM - 3:00 PM
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="row">
          <div className="col-12 col-lg-8 d-flex flex-column">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 fw-semibold mb-3">Recent Activity</h2>
                <ul className="list-unstyled activity-list">
                  {activitiesLoading ? (
                    // Skeleton loading state
                    [...Array(3)].map((_, index) => (
                      <li key={index} className="d-flex align-items-center mb-3">
                        <Skeleton circle width={20} height={20} className="me-3" />
                        <div style={{ flex: 1 }}>
                          <p className="mb-1">
                            <Skeleton width="80%" />
                          </p>
                          <Skeleton width="30%" height={12} />
                        </div>
                      </li>
                    ))
                  ) : activities.length > 0 ? (
                    activities.map((activity) => (
                      <li key={activity.id} className="d-flex align-items-center mb-3">
                        {activity.event === 'created' && activity.subject?.type === 'User' && (
                          <Add size="20" className="activity-icon me-3" />
                        )}
                        {activity.event === 'created' && activity.subject?.type === 'Organization' && (
                          <Add size="20" className="activity-icon me-3" />
                        )}
                        {activity.event === 'created' && activity.subject?.type === 'ScheduleSession' && (
                          <Add size="20" className="activity-icon me-3" />
                        )}
                        {activity.event === 'created' && activity.subject?.type === 'CustomTraining' && (
                          <Add size="20" className="activity-icon me-3" />
                        )}
                        {activity.event === 'created' && activity.subject?.type === 'Enrollment' && (
                          <Add size="20" className="activity-icon me-3" />
                        )}

                        {activity.event === 'updated' && (
                          <CalendarEdit size="20" className="activity-icon me-3" />
                        )}
                        {activity.event === 'completed' && (
                          <Award size="20" className="activity-icon me-3" />
                        )}
                        <div>
                          <p className="mb-0">
                            {activity.description}:{" "}
                            <span className="fw-medium">{activity.subject?.name}</span>
                          </p>
                          <span className="text-muted small">{activity.time_ago}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="d-flex align-items-center mb-3">
                      <div>
                        <p className="text-muted mb-0">No recent activities</p>
                      </div>
                    </li>
                  )}
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
                    <Link to="/organization/members">
                      <button className="btn-quick-action w-100 d-flex align-items-center">
                        <Add size="20" className="me-2" /> Add New Member
                      </button>
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link to='/organization/training-programs' className="btn-quick-action w-100 d-flex align-items-center">
                      <Stickynote size="20" className="me-2" /> Training Report
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="btn-quick-action w-100 d-flex align-items-center"
                      onClick={() => setIsScheduleModalOpen(true)}
                    >
                      <CalendarEdit size="20" className="me-2" /> Schedule a
                      Session
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Custom Training Modal */}
      <RequestCustom 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Schedule Session Modal */}
      <ScheduleSession 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
      />
    </div>
  );
}

export default AdminOrganizationDashboard;