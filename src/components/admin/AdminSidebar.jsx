import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { Category, Building4, UserSquare, Book, Calendar, Award, Chart1, ClipboardText } from 'iconsax-reactjs';
import '../../assets/css/style.css'; 
import LogoutButton from '../auth/LogoutButton';
import Logo from '../../assets/image/logo/logo.png'

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <div className={`sidebar admin_sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={Logo} alt="GritinAI Logo" className="logo-img" style={{ width: "100px" }} />
        </div>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''} onClick={onClose}>
            <Category size="20" variant="Outline" /> Dashboard
          </Link>
        </li>
        <h4>User Management</h4>
        <li>
          <Link to="/admin/organizations" className={isActive('/admin/organizations') ? 'active' : ''} onClick={onClose}>
            <Building4 size="20" variant="Outline" /> Organization Management
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''} onClick={onClose}>
            <UserSquare size="20" variant="Outline" /> User Management
          </Link>
        </li>
        <li>
          <Link to="/admin/courses" className={isActive('/admin/courses') ? 'active' : ''} onClick={onClose}>
            <Book size="20" variant="Outline" /> Course 
          </Link>
        </li>
        <li>
          <Link to="/admin/cohorts" className={isActive('/admin/cohorts') ? 'active' : ''} onClick={onClose}>
            <Calendar size="20" variant="Outline" /> Cohorts
          </Link>
        </li>
        <li>
          <Link to="/admin/class-recap-materials" className={isActive('/admin/class-recap-materials') ? 'active' : ''} onClick={onClose}>
            <ClipboardText size="20" variant="Outline" /> Recap Material
          </Link>
        </li>
        <li>
          <Link to="/admin/library" className={isActive('/admin/library') ? 'active' : ''} onClick={onClose}>
            <ClipboardText size="20" variant="Outline" /> Library
          </Link>
        </li>
        <li>
          <Link to="/admin/enrollments" className={isActive('/admin/enrollments') ? 'active' : ''} onClick={onClose}>
            <Award size="20" variant="Outline" /> Enroll User 
          </Link>
        </li>
        <li>
          <Link to="/admin/schedule-sessions" className={isActive('/admin/schedule-sessions') ? 'active' : ''} onClick={onClose}>
            <Chart1 size="20" variant="Outline" /> Schedule Sessions
          </Link>
        </li>
        <li>
          <Link to="/admin/organization-requests" className={isActive('/admin/organization-requests') ? 'active' : ''} onClick={onClose}>
            <ClipboardText size="20" variant="Outline" /> Organization Requests
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <LogoutButton  className="logout-button"/>
      </div>
    </div>
  );
};

export default AdminSidebar;
