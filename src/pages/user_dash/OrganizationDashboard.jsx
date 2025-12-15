import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminOrganizationDashboard from './organization/AdminOrganizationDashboard';
import MemberOrganizationDashboard from './organization/MemberOrganizationDashboard';

function OrganizationDashboard() {
  const { user } = useAuth();
  
  // Check if user is organization admin
  if (user?.is_admin === true) {
    return <AdminOrganizationDashboard />;
  }
  
  // Default to member dashboard
  return <MemberOrganizationDashboard />;
}

export default OrganizationDashboard;