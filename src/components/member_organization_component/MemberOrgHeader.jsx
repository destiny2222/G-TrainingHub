import React from 'react';
import { SearchNormal1, Notification, Calendar } from 'iconsax-reactjs';
import { useAuth } from '../../contexts/AuthContext';
import userProfile from '../../assets/image/testimony/testim-3.jpg';

function MemberOrgHeader() {
  const { user } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="search-bar-container">
        <SearchNormal1 size="20" className="search-icon" />
        <input 
          type="text" 
          placeholder="Search courses, schedules, or resources..." 
          className="search-input" 
        />
      </div>
      <div className="header-actions">
        <Calendar size="24" className="calendar-icon" />
        <Notification size="24" className="notification-icon" />
        <div className="user-profile">
          <img 
            src={userProfile} 
            alt="Member Profile" 
            className="profile-img" 
          />
          <div className="user-info">
            <span className="user-name">{user?.name || 'Member'}</span>
            <span className="user-role">Organization Member</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MemberOrgHeader;