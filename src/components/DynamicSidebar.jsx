import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import all sidebar components
import Sidebar from './user_component/Sidebar';
import AdminOrgSidebar from './admin_organization_component/AdminOrgSidebar';
import MemberOrgSidebar from './member_organization_component/MemberOrgSidebar';
import AdminSidebar from './admin/AdminSidebar';

function DynamicSidebar({ isOpen, onClose }) {
  const { user, accountType } = useAuth();
  
  // System admin check
  if (user?.role === 'admin' || user?.is_system_admin) {
    return <AdminSidebar isOpen={isOpen} onClose={onClose} />;
  }
  
  // Organization users
  if (accountType === 'organization') {
    if (user?.is_admin === true) {
      return <AdminOrgSidebar isOpen={isOpen} onClose={onClose} />;
    } else {
      return <MemberOrgSidebar isOpen={isOpen} onClose={onClose} />;
    }
  }
  
  // Individual users (default)
  return <Sidebar isOpen={isOpen} onClose={onClose} />;
}

export default DynamicSidebar;