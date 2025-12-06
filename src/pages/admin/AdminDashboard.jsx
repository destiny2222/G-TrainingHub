import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {  Chart as ChartJS,  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganisationAnalytics } from '../../redux/slices/super_admin/analyticsSlice';
import {  fetchUserManagement } from '../../redux/slices/super_admin/userManagementSlice';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const analyticsData = useSelector((state) => state.adminAnalytics.analyticsData);
  const userManagementData = useSelector((state) => state.userManagement.userManagement);
  useEffect(() => {
    dispatch(fetchOrganisationAnalytics());
    dispatch(fetchUserManagement());
  }, [dispatch]);


  // const userSatisfactionData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  //   datasets: [
  //     {
  //       label: 'User Satisfaction',
  //       data: [80, 82, 75, 85, 90, 88, 92],
  //       fill: true,
  //       backgroundColor: 'rgba(153,102,255,0.2)',
  //       borderColor: 'rgba(153,102,255,1)',
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //     title: {
  //       display: false,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       display: false,
  //     },
  //     y: {
  //       display: false,
  //     },
  //   },
  // };

  return (
    <div className="dashboard-body">
      <h1>Dashboard Overview</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h4>Total Users</h4>
          <p className="card-value">{analyticsData?.total_users || 0}</p>
        </div>
        <div className="card">
          <h4>Total Courses</h4>
          <p className="card-value">{analyticsData?.total_courses}</p>
        </div>
        <div className="card">
          <h4>Total Cohort</h4>
          <p className="card-value">{analyticsData?.total_cohorts}</p>
        </div>
        <div className="card">
          <h4> Active Cohort</h4>
          <p className="card-value">{analyticsData?.active_cohorts}</p>
        </div>
      </div>

      {/* <div className="ai-chat-analytics w-100">
        <div className="card">
          <h4>User Satisfaction</h4>
          <p className="card-value">85%</p>
          <p className="card-sub-text">Last 30 days <span className="positive">+5%</span></p>
          <div className="chart-container">
            <Line data={userSatisfactionData} options={chartOptions} />
          </div>
        </div>
      </div> */}

      <h1>User Management</h1>
      <div className="user-management-table">
        <div className="table-responsive">

        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userManagementData && userManagementData.length > 0 ? (
              userManagementData.map((user) => (
                <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user?.organization}</td>
                <td>{user.role}</td>
                <td>
                  <button className="action-button">Edit</button> 
                  <button className="action-button delete">Delete</button>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
