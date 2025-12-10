import { Link, useLocation } from "react-router-dom";
import {
  Profile2User,
  Element4,
  Book,
  Calendar,
  Award,
  MagicStar,
  Chart,
  Logout,
} from "iconsax-reactjs";
import { FaBookOpenReader } from "react-icons/fa6";
import LogoutButton from "../auth/LogoutButton";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "sidebar-ul-link active"
      : "sidebar-ul-link";
  };

  return (
    <aside className="sidebar-dashboard">
      <Link to="/">
        <div className="sidebar-logo">
          <img
            src="/logo.png"
            alt="GritinAI Logo"
            className="logo-img"
            style={{ width: "100px" }}
          />
        </div>
      </Link>

      <nav className="sidebar-navigation">
        <ul className="sidebar-ul">
          <li>
            <Link to="/dashboard" className={isActive("/dashboard")}>
              <Element4 size="20" variant="Bulk" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/my-courses" className={isActive("/my-courses")}>
              <Book size="20" variant="Bulk" />
              <span>My Courses</span>
            </Link>
          </li>
          <li>
            <Link to="/library" className={isActive("/library")}>
              <FaBookOpenReader size="20" />
              <span>Library</span>
            </Link>
          </li>
          {/* <li>
            <Link to="/calendar" className={isActive("/calendar")}>
              <Calendar size="20" variant="Bulk" />
              <span>Calendar</span>
            </Link>
          </li> */}
          <li>
            <Link to="/recap-videos" className={isActive("/recap-videos")}>
              <Chart size="20" variant="Bulk" />
              <span>Recap Videos</span>
            </Link>
          </li>
          <li>
            <Link to="/certificates" className={isActive("/certificates")}>
              <Award size="20" variant="Bulk" />
              <span>Certificates</span>
            </Link>
          </li>
          <li>
            <Link to="/ai-assistant" className={isActive("/ai-assistant")}>
              <MagicStar size="20" variant="Bulk" />
              <span>AI Assistant</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className={isActive("/profile")}>
              <Profile2User size="20" variant="Bulk" />
              <span>My Profile</span>
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
  );
}

export default Sidebar;
