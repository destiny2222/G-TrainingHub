import React from 'react';
import { SearchNormal1, Notification, Award } from 'iconsax-reactjs';
import { useAuth } from '../../contexts/AuthContext';
import userProfile from '../../assets/image/testimony/testim-3.jpg';

function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="search-bar-container">
        <SearchNormal1 size="20" className="search-icon" />
        <input 
          type="text" 
          placeholder="Search for courses or learning materials..." 
          className="search-input" 
        />
      </div>
      <div className="header-actions">
        <Award size="24" className="achievement-icon" />
        <Notification size="24" className="notification-icon" />
        <div className="user-profile">
          <img 
            src={userProfile} 
            alt="User Profile" 
            className="profile-img" 
          />
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">Individual Learner</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
