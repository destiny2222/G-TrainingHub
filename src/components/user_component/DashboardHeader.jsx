import { useState } from "react";
import { SearchNormal1, Notification, Award } from "iconsax-reactjs";
// import userProfile from "../../assets/image/testimony/testim-3.jpg";
import { useFetchUser } from "./../../utils/useUserStore"

function DashboardHeader() {
  const user = useFetchUser();
  const [userProfile] = useState(user?.profile_picture)
  return (
    <header className="dashboard-header">
      {/* <div className="search-bar-container">
        <SearchNormal1 size="20" className="search-icon" />
        <input
          type="text"
          placeholder="Search for courses or learning materials..."
          className="search-input"
        />
      </div> */}
      <div className="header-actions d-flex align-items-center gap-4">
        <Notification size="24" className="notification-icon" />
        <div className="user-profile d-flex align-items-center gap-3 pt-2">
          <img  src={userProfile}   alt="User Profile"  className="profile-img" />
          <div className="user-info pt-3">
            <span className="user-name">{ user?.name}</span>
            <p className="user-role">Learner</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
