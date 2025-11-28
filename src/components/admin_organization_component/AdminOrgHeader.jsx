import React from "react";
import {
  SearchNormal1,
  Notification,
  Setting2,
  HamburgerMenu,
} from "iconsax-reactjs";
import userProfile from "../../assets/image/testimony/testim-3.jpg";

function AdminOrgHeader({ onMenuToggle }) {
  return (
    <header className="dashboard-header py-4">
      <div className="header-left-section">
        <button
          className="hamburger-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <HamburgerMenu size="24" />
        </button>
        <div className="search-bar-container">
          <SearchNormal1
            size="20"
            className="search-icon"
            style={{
              position: "static",
              transform: "translateY(0)",
            }}
          />
          <input
            id="search-input"
            type="text"
            placeholder="Search members, courses, or analytics..."
            className="search-input"
          />
        </div>
      </div>
      <div className="header-actions">
        {/* <Notification size="24" className="notification-icon" /> */}
        <div className="user-profile d-flex align-items-center gap-3">
          <img src={userProfile} alt="Admin Profile" className="profile-img" />
          <div className="user-info pt-3">
            <span className="user-name">{"Admin"}</span>
            <p className="user-role" style={{ fontSize: "12px" }}>
              Organization Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminOrgHeader;
