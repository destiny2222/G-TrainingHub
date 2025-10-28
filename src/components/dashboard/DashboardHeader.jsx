import React from 'react';
import { SearchNormal1, Notification } from 'iconsax-reactjs';
import userProfile from '../../assets/image/testimony/testim-3.jpg'; // Assuming a default profile image


function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="search-bar-container">
        <SearchNormal1 size="20" className="search-icon" />
        <input type="text" placeholder="Search for learners or courses" className="search-input" />
      </div>
      <div className="header-actions">
        <Notification size="24" className="notification-icon" />
        <div className="user-profile">
          <img src={userProfile} alt="User Profile" className="profile-img" />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
