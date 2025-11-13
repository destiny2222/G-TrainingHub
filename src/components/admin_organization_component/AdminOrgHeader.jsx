import React from 'react';
import { SearchNormal1, Notification, Setting2 } from 'iconsax-reactjs';
import { useAuth } from '../../contexts/AuthContext';
import userProfile from '../../assets/image/testimony/testim-3.jpg';

function AdminOrgHeader() {
  const { user } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="search-bar-container">
        <SearchNormal1 size="20" className="search-icon" />
        <input 
          type="text" 
          placeholder="Search members, courses, or analytics..." 
          className="search-input" 
        />
      </div>
      <div className="header-actions">
        <Notification size="24" className="notification-icon" />
        <Setting2 size="24" className="settings-icon" />
        <div className="user-profile">
          <img 
            src={userProfile} 
            alt="Admin Profile" 
            className="profile-img" 
          />
          <div className="user-info">
            {/* <span className="user-name">{user?.name || 'Admin'}</span> */}
            {/* <span className="user-role">Organization Admin</span> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminOrgHeader;