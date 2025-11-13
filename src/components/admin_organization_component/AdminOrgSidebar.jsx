import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Element4, 
  People, 
  Category, 
  Teacher, 
  Chart, 
  Award, 
  Calendar, 
  Buildings, 
  MagicStar,
  Logout
} from 'iconsax-reactjs';
import LogoutButton from '../auth/LogoutButton';

function AdminOrgSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'sidebar-ul-link active' : 'sidebar-ul-link';
  };

  return (
    <aside className="sidebar-dashboard">
      <div className="sidebar-logo">
        <h2 className='logo-text'>GRITINAI TRAINING HUB</h2>
        <p className='logo-subtext'>Organization Admin</p>
      </div>
      
      <nav className="sidebar-navigation">
        <ul className="sidebar-ul">
          <li>
            <Link to="/organization/dashboard" className={isActive('/organization/dashboard')}>
              <Element4 size="20" variant="Bulk" />
              <span>Admin Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/members" className={isActive('/organization/members')}>
              <People size="20" variant="Bulk" />
              <span>Manage Members</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/training-programs" className={isActive('/organization/training-programs')}>
              <Teacher size="20" variant="Bulk" />
              <span>Training Programs</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/analytics" className={isActive('/organization/analytics')}>
              <Chart size="20" variant="Bulk" />
              <span>Analytics & Reports</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/certificates" className={isActive('/organization/certificates')}>
              <Award size="20" variant="Bulk" />
              <span>Certificates</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/schedule" className={isActive('/organization/schedule')}>
              <Calendar size="20" variant="Bulk" />
              <span>Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/settings" className={isActive('/organization/settings')}>
              <Buildings size="20" variant="Bulk" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/ai-assistant" className={isActive('/organization/ai-assistant')}>
              <MagicStar size="20" variant="Bulk" />
              <span>AI Assistant</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-bottom-links">
        <div className="logout-section">
          <Logout size="20" variant="Bulk" className='logout'/>
          <LogoutButton className="sidebar-ul-link"/>
        </div>
      </div>
    </aside>
  );
}

export default AdminOrgSidebar;