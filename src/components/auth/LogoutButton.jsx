import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className = '', children = 'Logout' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-red hover:text-red-800 ${className}`}
    >
      {children}
    </button>
  );
};

export default LogoutButton;