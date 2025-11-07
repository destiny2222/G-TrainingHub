import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Element4, 
  Book, 
  Category, 
  Calendar, 
  Chart, 
  Award, 
  Bookmark, 
  MagicStar,
  Logout
} from 'iconsax-reactjs';
import { FaBookOpenReader } from "react-icons/fa6";
import LogoutButton from '../auth/LogoutButton';

function MemberOrgSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'sidebar-ul-link active' : 'sidebar-ul-link';
  };

  return (
    <aside className="sidebar-dashboard">
      <div className="sidebar-logo">
        <h2 className='logo-text'>GRITINAI TRAINING HUB</h2>
        <p className='logo-subtext'>Organization Member</p>
      </div>
      
      <nav className="sidebar-navigation">
        <ul className="sidebar-ul">
          <li>
            <Link to="/organization/dashboard" className={isActive('/organization/dashboard')}>
              <Element4 size="20" variant="Bulk" />
              <span>My Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/my-courses" className={isActive('/organization/my-courses')}>
              <Book size="20" variant="Bulk" />
              <span>My Courses</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/training-catalog" className={isActive('/organization/training-catalog')}>
              <Category size="20" variant="Bulk" />
              <span>Training Catalog</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/library" className={isActive('/organization/library')}>
              <FaBookOpenReader size="20" />
              <span>Learning Library</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/schedule" className={isActive('/organization/schedule')}>
              <Calendar size="20" variant="Bulk" />
              <span>My Schedule</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/progress" className={isActive('/organization/progress')}>
              <Chart size="20" variant="Bulk" />
              <span>My Progress</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/certificates" className={isActive('/organization/certificates')}>
              <Award size="20" variant="Bulk" />
              <span>My Certificates</span>
            </Link>
          </li>
          <li>
            <Link to="/organization/bookmarks" className={isActive('/organization/bookmarks')}>
              <Bookmark size="20" variant="Bulk" />
              <span>Bookmarks</span>
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

export default MemberOrgSidebar;