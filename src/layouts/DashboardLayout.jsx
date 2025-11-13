import React from 'react';
import { Outlet } from 'react-router-dom';
import DynamicHeader from '../components/DynamicHeader';
import DynamicSidebar from '../components/DynamicSidebar';
import '../assets/css/style.css'

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DynamicSidebar />
      <div className="dashboard-content">
        <DynamicHeader />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
