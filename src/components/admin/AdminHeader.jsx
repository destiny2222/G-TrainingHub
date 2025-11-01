import React from 'react';
import { SearchNormal1, User, HamburgerMenu } from 'iconsax-reactjs';
import '../../assets/css/style.css'; // Assuming shared styles

const AdminHeader = ({ onMenuClick }) => {
  return (
    <div className="dashboard-header">
      <button className="hamburger-menu" onClick={onMenuClick}>
        <HamburgerMenu size="24" variant="Outline" />
      </button>
      <div className="search-bar">
        <SearchNormal1 size="20" variant="Outline" />
        <input type="text" placeholder="Search users, organizations, courses..." />
      </div>
      <div className="header-icons">
        {/* Placeholder for user profile/settings icon */}
        <User size="20" variant="Outline" />
      </div>
    </div>
  );
};

export default AdminHeader;
