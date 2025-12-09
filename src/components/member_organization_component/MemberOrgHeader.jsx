import React from 'react';
import { SearchNormal1, Notification, Calendar } from 'iconsax-reactjs';
import { useAuth } from '../../contexts/AuthContext';
import userProfile from '../../assets/image/testimony/testim-3.jpg';

function MemberOrgHeader() {
  const { user } = useAuth();

  return (
    <header className="dashboard-header">
      
      {/* <div className="header-actions">
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
      </div> */}
      <div className="header-actions">
        {/* <Notification size="24" className="notification-icon" /> */}
        <div className="user-profile d-flex align-items-center gap-3">
          <img src={userProfile} alt="Admin Profile" className="profile-img" />
          <div className="user-info pt-3">
            <span className="user-name">{"Admin"}</span>
            <p className="user-role" style={{ fontSize: "12px" }}>
              Organization Member
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MemberOrgHeader;