import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
  const chatVolumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Chat Volume',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
    ],
  };

  const userSatisfactionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'User Satisfaction',
        data: [80, 82, 75, 85, 90, 88, 92],
        fill: true,
        backgroundColor: 'rgba(153,102,255,0.2)',
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.4,
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
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="dashboard-body">
      <h1>Dashboard Overview</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h4>Total Users</h4>
          <p className="card-value">1,250</p>
        </div>
        <div className="card">
          <h4>New Applications</h4>
          <p className="card-value">3</p>
        </div>
        <div className="card">
          <h4>Active Courses</h4>
          <p className="card-value">42</p>
        </div>
        <div className="card">
          <h4>Pending Requests</h4>
          <p className="card-value">2</p>
        </div>
      </div>

      <h1>AI Chat Analytics</h1>
      <div className="ai-chat-analytics">
        <div className="card">
          <h4>Chat Volume</h4>
          <p className="card-value">1,234</p>
          <p className="card-sub-text">Last 30 days <span className="positive">+10%</span></p>
          <div className="chart-container">
            <Line data={chatVolumeData} options={chartOptions} />
          </div>
        </div>
        <div className="card">
          <h4>User Satisfaction</h4>
          <p className="card-value">85%</p>
          <p className="card-sub-text">Last 30 days <span className="positive">+5%</span></p>
          <div className="chart-container">
            <Line data={userSatisfactionData} options={chartOptions} />
          </div>
        </div>
      </div>

      <h1>User Management</h1>
      <div className="user-management-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john.doe@example.com</td>
              <td>ABC Corp</td>
              <td>Admin</td>
              <td><span className="status active">Active</span></td>
              <td><button className="action-button">Edit</button> <button className="action-button delete">Delete</button></td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane.smith@example.com</td>
              <td>XYZ Inc</td>
              <td>User</td>
              <td><span className="status inactive">Inactive</span></td>
              <td><button className="action-button">Edit</button> <button className="action-button delete">Delete</button></td>
            </tr>
            <tr>
              <td>Peter Jones</td>
              <td>peter.jones@example.com</td>
              <td>123 Industries</td>
              <td>Mentor</td>
              <td><span className="status active">Active</span></td>
              <td><button className="action-button">Edit</button> <button className="action-button delete">Delete</button></td>
            </tr>
            <tr>
              <td>David Williams</td>
              <td>david.williams@example.com</td>
              <td></td>
              <td>Admin</td>
              <td><span className="status pending">Pending</span></td>
              <td><button className="action-button">Approve</button> <button className="action-button delete">Reject</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
