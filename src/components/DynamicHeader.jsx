import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import all header components
import DashboardHeader from './user_component/DashboardHeader';
import AdminOrgHeader from './admin_organization_component/AdminOrgHeader';
import MemberOrgHeader from './member_organization_component/MemberOrgHeader';
import AdminHeader from './admin/AdminHeader';

function DynamicHeader() {
  const { user, accountType } = useAuth();
  
  // System admin check
  if (user?.role === 'admin' || user?.is_system_admin) {
    return <AdminHeader />;
  }
  
  // Organization users
  if (accountType === 'organization') {
    if (user?.is_admin === true) {
      return <AdminOrgHeader />;
    } else {
      return <MemberOrgHeader />;
    }
  }
  
  // Individual users (default)
  return <DashboardHeader />;
}

export default DynamicHeader;