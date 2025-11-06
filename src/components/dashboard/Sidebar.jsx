import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Element4, 
  Profile2User, 
  Book, 
  Calendar, 
  Award, 
  MagicStar, 
  Setting2, 
  Logout,
  People,
  Buildings,
  Chart,
  DocumentText,
  Category,
  Teacher,
  Monitor,
  Bookmark
} from 'iconsax-reactjs';
import { FaBookOpenReader } from "react-icons/fa6";
import LogoutButton from '../auth/LogoutButton';
import { useAuth } from '../../contexts/AuthContext';


function Sidebar() {
  const { user, accountType } = useAuth();
  const isOrganizationAdmin = accountType === 'organization' && user?.is_admin === true;
  const isOrganizationUser = accountType === 'organization' && !user?.is_admin;
  const isIndividualUser = accountType === 'individual';
  
  console.log('Sidebar Rendered - Account Type:', accountType, 'Is Admin:', isOrganizationAdmin);


  
  // Determine which menu to render
  const renderMenu = () => {
    if (isOrganizationAdmin) {
      return renderOrganizationAdminMenu();
    } else if (isOrganizationUser) {
      return renderOrganizationUserMenu();
    } else if (isIndividualUser) {
      return renderIndividualUserMenu();
    } else {
      return renderIndividualUserMenu(); // Default fallback
    }
  };

  // Get user type badge
  const getUserTypeBadge = () => {
    if (isOrganizationAdmin) return "Organization Admin";
    if (isOrganizationUser) return "Organization User";
    if (isIndividualUser) return "Individual User";
    return "User";
  };

  // Organization Admin Menu
  const renderOrganizationAdminMenu = () => (
    <nav className="sidebar-navigation">
      <ul className="sidebar-ul">
        <li>
          <Link to="/organization/dashboard" className="sidebar-ul-link active">
            <Element4 size="20" variant="Bulk" />
            <span>Admin Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/members" className="sidebar-ul-link">
            <People size="20" variant="Bulk" />
            <span>Manage Members</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/courses" className="sidebar-ul-link">
            <Category size="20" variant="Bulk" />
            <span>Manage Courses</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/training-programs" className="sidebar-ul-link">
            <Teacher size="20" variant="Bulk" />
            <span>Training Programs</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/analytics" className="sidebar-ul-link">
            <Chart size="20" variant="Bulk" />
            <span>Analytics & Reports</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/certificates" className="sidebar-ul-link">
            <Award size="20" variant="Bulk" />
            <span>Certificates</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/schedule" className="sidebar-ul-link">
            <Calendar size="20" variant="Bulk" />
            <span>Schedule Management</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/settings" className="sidebar-ul-link">
            <Buildings size="20" variant="Bulk" />
            <span>Organization Settings</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/ai-assistant" className="sidebar-ul-link">
            <MagicStar size="20" variant="Bulk" />
            <span>AI Assistant</span>
          </Link>
        </li>
      </ul>
    </nav>
  );

  // Organization User Menu (Non-Admin)
  const renderOrganizationUserMenu = () => (
    <nav className="sidebar-navigation">
      <ul className="sidebar-ul">
        <li>
          <Link to="/organization/dashboard" className="sidebar-ul-link active">
            <Element4 size="20" variant="Bulk" />
            <span>My Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/my-courses" className="sidebar-ul-link">
            <Book size="20" variant="Bulk" />
            <span>My Courses</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/training-catalog" className="sidebar-ul-link">
            <Category size="20" variant="Bulk" />
            <span>Training Catalog</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/library" className="sidebar-ul-link">
            <FaBookOpenReader size="20" />
            <span>Learning Library</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/schedule" className="sidebar-ul-link">
            <Calendar size="20" variant="Bulk" />
            <span>My Schedule</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/progress" className="sidebar-ul-link">
            <Chart size="20" variant="Bulk" />
            <span>My Progress</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/certificates" className="sidebar-ul-link">
            <Award size="20" variant="Bulk" />
            <span>My Certificates</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/bookmarks" className="sidebar-ul-link">
            <Bookmark size="20" variant="Bulk" />
            <span>Bookmarks</span>
          </Link>
        </li>
        <li>
          <Link to="/organization/ai-assistant" className="sidebar-ul-link">
            <MagicStar size="20" variant="Bulk" />
            <span>AI Assistant</span>
          </Link>
        </li>
      </ul>
    </nav>
  );

  // Individual User Menu
  const renderIndividualUserMenu = () => (
    <nav className="sidebar-navigation">
      <ul className="sidebar-ul">
        <li>
          <Link to="/dashboard" className="sidebar-ul-link active">
            <Element4 size="20" variant="Bulk" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/my-courses" className="sidebar-ul-link">
            <Book size="20" variant="Bulk" />
            <span>My Courses</span>
          </Link>
        </li>
        <li>
          <Link to="/browse-courses" className="sidebar-ul-link">
            <Category size="20" variant="Bulk" />
            <span>Browse Courses</span>
          </Link>
        </li>
        <li>
          <Link to="/library" className="sidebar-ul-link">
            <FaBookOpenReader size="20" />
            <span>Library</span>
          </Link>
        </li>
        <li>
          <Link to="/calendar" className="sidebar-ul-link">
            <Calendar size="20" variant="Bulk" />
            <span>Calendar</span>
          </Link>
        </li>
        <li>
          <Link to="/progress" className="sidebar-ul-link">
            <Chart size="20" variant="Bulk" />
            <span>My Progress</span>
          </Link>
        </li>
        <li>
          <Link to="/certificates" className="sidebar-ul-link">
            <Award size="20" variant="Bulk" />
            <span>Certificates</span>
          </Link>
        </li>
        <li>
          <Link to="/ai-tutor" className="sidebar-ul-link">
            <MagicStar size="20" variant="Bulk" />
            <span>AI Tutor</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className="sidebar-ul-link">
            <Profile2User size="20" variant="Bulk" />
            <span>My Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );



  return (
    <aside className="sidebar-dashboard">
      <div className="sidebar-logo">
        <h2 className='logo-text'>GRITINAI TRAINING HUB</h2>
        <p className='logo-subtext'> {getUserTypeBadge()}</p>
      </div>
      
      {renderMenu()}
      
      <div className="sidebar-bottom-links">
        <div className="logout-section">
          <Logout size="20" variant="Bulk" className='logout'/>
          <LogoutButton className="sidebar-ul-link"/>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
