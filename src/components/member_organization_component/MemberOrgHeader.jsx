import React from 'react';
import { SearchNormal1, Notification, Calendar, HamburgerMenu } from 'iconsax-reactjs';
import { useFetchUser } from "./../../utils/useUserStore";

function MemberOrgHeader({ onMenuToggle }) {
  const user = useFetchUser();

  return (
    <header className="dashboard-header">
      <div className="header-left-section">
        <button className="hamburger-menu-btn" onClick={onMenuToggle}>
          <HamburgerMenu size="24" />
        </button>
      </div>
      
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
      <div className="header-actions d-flex align-items-center gap-4">
        {/* <Notification size="24" className="notification-icon" /> */}
        <div className="user-profile d-flex align-items-center gap-3">
          <img  src={user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`}   alt="User Profile"  className="profile-img" />
          {/* <div className="user-info pt-3">
            <span className="user-name">{user?.name}</span>
            <p className="user-role" style={{ fontSize: "12px" }}>
              Organization Member
            </p>
          </div> */}
        </div>
      </div>
    </header>
  );
}

export default MemberOrgHeader;