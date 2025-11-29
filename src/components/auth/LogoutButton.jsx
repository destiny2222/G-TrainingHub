import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ className = "", children = "Logout" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      style={{ backgroundColor: "transparent", color: "red", border: "none" }}
    >
      {children}
    </button>
  );
};

export default LogoutButton;
