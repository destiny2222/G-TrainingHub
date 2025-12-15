import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminOrgHeader from '../components/admin_organization_component/AdminOrgHeader';
import AdminOrgSidebar from '../components/admin_organization_component/AdminOrgSidebar';
// import './AdminLayout.css';

const OrganizationLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-layout organization-layout">
      <AdminOrgSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="admin-content">
        <AdminOrgHeader onMenuToggle={toggleSidebar} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizationLayout;
