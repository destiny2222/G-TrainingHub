import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminAuthGuard = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');

  // If no admin token exists, redirect to login page
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, render the protected component
  return children;
};

export default AdminAuthGuard;
