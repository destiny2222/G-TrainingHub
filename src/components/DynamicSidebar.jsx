import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import all sidebar components
import Sidebar from './user_component/Sidebar';
import AdminOrgSidebar from './admin_organization_component/AdminOrgSidebar';
import MemberOrgSidebar from './member_organization_component/MemberOrgSidebar';
import AdminSidebar from './admin/AdminSidebar';

function DynamicSidebar() {
  const { user, accountType } = useAuth();
  
  // System admin check
  if (user?.role === 'admin' || user?.is_system_admin) {
    return <AdminSidebar />;
  }
  
  // Organization users
  if (accountType === 'organization') {
    if (user?.is_admin === true) {
      return <AdminOrgSidebar />;
    } else {
      return <MemberOrgSidebar />;
    }
  }
  
  // Individual users (default)
  return <Sidebar />;
}

export default DynamicSidebar;