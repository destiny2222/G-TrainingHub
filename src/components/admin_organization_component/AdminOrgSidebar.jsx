import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Element4,
  People,
  Teacher,
  Award,
  Buildings,
  MagicStar,
  Logout,
  CloseCircle,
} from "iconsax-reactjs";
import LogoutButton from "../auth/LogoutButton";

function AdminOrgSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "sidebar-ul-link active"
      : "sidebar-ul-link";
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      <aside className="sidebar-dashboard">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="/logo.png"
              alt=""
              className="logo-img"
              style={{ width: "100px" }}
            />
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseCircle size="28" variant="Bulk" />
          </button>
        </div>

        <nav className="sidebar-navigation">
          <ul className="sidebar-ul">
            <li>
              <Link
                to="/organization/dashboard"
                className={isActive("/organization/dashboard")}
                onClick={handleLinkClick}
              >
                <Element4 size="20" variant="Bulk" />
                <span>Analytics & Reports</span>
              </Link>
            </li>
            <li>
              <Link
                to="/organization/members"
                className={isActive("/organization/members")}
                onClick={handleLinkClick}
              >
                <People size="20" variant="Bulk" />
                <span>Manage Members</span>
              </Link>
            </li>
            <li>
              <Link
                to="/organization/training-programs"
                className={isActive("/organization/training-programs")}
                onClick={handleLinkClick}
              >
                <Teacher size="20" variant="Bulk" />
                <span>Training Programs</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to="/organization/certificates"
                className={isActive("/organization/certificates")}
                onClick={handleLinkClick}
              >
                <Award size="20" variant="Bulk" />
                <span>Certificates</span>
              </Link>
            </li> */}
            <li>
              <Link
                to="/organization/settings"
                className={isActive("/organization/settings")}
                onClick={handleLinkClick}
              >
                <Buildings size="20" variant="Bulk" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link
                to="/ai-assistant"
                className={isActive("/ai-assistant")}
                onClick={handleLinkClick}
              >
                <MagicStar size="20" variant="Bulk" />
                <span>AI Assistant</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-bottom-links">
          <div className="logout-section">
            <Logout size="20" variant="Bulk" className="logout" />
            <LogoutButton className="sidebar-ul-link" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminOrgSidebar;
