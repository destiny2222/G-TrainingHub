import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Category, Building4, UserSquare, Book, Calendar, Award, Chart1, ClipboardText } from 'iconsax-reactjs';
import '../../assets/css/style.css'; // Assuming shared styles

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin</h3>
        <p>GRITINAI</p>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/admin/dashboard" className="active">
            <Category size="20" variant="Outline" /> Dashboard
          </Link>
        </li>
        <li>
          <h4>User Management</h4>
          <ul>
            <li>
              <Link to="/admin/organization-management">
                <Building4 size="20" variant="Outline" /> Organization Management
              </Link>
            </li>
            <li>
              <Link to="/admin/mentor-applications">
                <UserSquare size="20" variant="Outline" /> Mentor Applications <span className="badge">3</span>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/admin/course-content">
            <Book size="20" variant="Outline" /> Course Content
          </Link>
        </li>
        <li>
          <Link to="/admin/cohorts-sessions">
            <Calendar size="20" variant="Outline" /> Cohorts & Sessions
          </Link>
        </li>
        <li>
          <Link to="/admin/certificate-issuance">
            <Award size="20" variant="Outline" /> Certificate Issuance
          </Link>
        </li>
        <li>
          <Link to="/admin/ai-chat-analytics">
            <Chart1 size="20" variant="Outline" /> AI Chat Analytics
          </Link>
        </li>
        <li>
          <Link to="/admin/organization-requests">
            <ClipboardText size="20" variant="Outline" /> Organization Requests <span className="badge">2</span>
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default AdminSidebar;
