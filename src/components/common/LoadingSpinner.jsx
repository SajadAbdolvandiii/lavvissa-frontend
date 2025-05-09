import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  size = "medium",
  color = "dark",
  fullPage = false,
  text = "در حال بارگذاری...",
}) => {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${color}`;

  if (fullPage) {
    return (
      <div className="full-page-spinner">
        <div className={`spinner ${sizeClass} ${colorClass}`}></div>
        {text && <p className="spinner-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass} ${colorClass}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
