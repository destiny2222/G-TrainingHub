import React from 'react';
import { Link } from 'react-router-dom';
import { Element4, Profile2User, Book, Calendar, Award, MagicStar, Setting2, Logout } from 'iconsax-reactjs';
import { FaBookOpenReader } from "react-icons/fa6";


function Sidebar() {
  return (
    <aside className="sidebar-dashboard">
      <div className="sidebar-logo">
        <h2 className='logo-text'>GRITINAI </h2>
        <p className='logo-subtext'>TRAINING HUB</p>
      </div>
      <nav className="sidebar-navigation">
        <ul className="sidebar-ul">
          <li>
            <Link to="#" className="sidebar-ul-link active">
              <Element4 size="20" variant="Bulk" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-ul-link">
              <Profile2User size="20" variant="Bulk" />
              <span>Courses</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-ul-link">
              <Book size="20" variant="Bulk" />
              <span>Training Catalog</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-ul-link">
              <FaBookOpenReader size="20" variant="Bulk" />
              <span>Library</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-ul-link">
              <Calendar size="20" variant="Bulk" />
              <span>Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-ul-link">
              <Award size="20" variant="Bulk" />
              <span>Certificates</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-ul-link">
              <MagicStar size="20" variant="Bulk" />
              <span>AI Assistant</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-ul-link">
              <Setting2 size="20" variant="Bulk" />
              <span>Setting</span>
            </Link>
          </li>
          
        </ul>
      </nav>
      <div className="sidebar-bottom-links">
        <Link to="#" className="sidebar-ul-link">
          <Logout size="20" variant="Bulk" className='logout'/>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
