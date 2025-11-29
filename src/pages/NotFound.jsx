import React from "react";
import { IoArrowBack } from "react-icons/io5";
import "./NotFound.css";

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="not-found-btn" onClick={handleGoBack}>
          Go Back <IoArrowBack />
        </button>
      </div>
    </div>
  );
};

export default NotFound;
