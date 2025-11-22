import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DynamicHeader from '../components/DynamicHeader';
import DynamicSidebar from '../components/DynamicSidebar';
import '../assets/css/style.css'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <DynamicSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="dashboard-content">
        <DynamicHeader onMenuToggle={toggleSidebar} />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
