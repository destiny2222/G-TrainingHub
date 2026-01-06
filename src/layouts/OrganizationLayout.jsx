import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminOrgHeader from '../components/admin_organization_component/AdminOrgHeader';
import AdminOrgSidebar from '../components/admin_organization_component/AdminOrgSidebar';
import MemberOrgSidebar from '../components/member_organization_component/MemberOrgSidebar';
import MemberOrgHeader from '../components/member_organization_component/MemberOrgHeader';
// import './AdminLayout.css';

const OrganizationLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, accountType } = useAuth(); // Destructure user and accountType from useAuth()


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
 const isOrganizationAdmin = accountType === 'organization' && user?.is_admin === true;
  return (
    
    <div className="admin-layout organization-layout">
      {isOrganizationAdmin ? (
        <AdminOrgSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      ) : (
        <MemberOrgSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      )}
      <div className="admin-content">
        {isOrganizationAdmin ? (
          <AdminOrgHeader onMenuToggle={toggleSidebar} />
        ) : (
          <MemberOrgHeader onMenuToggle={toggleSidebar} />
        )}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizationLayout;
