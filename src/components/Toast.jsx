import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {type === "success" && <span className="toast-icon">✓</span>}
      {type === "error" && <span className="toast-icon">×</span>}
      {type === "info" && <span className="toast-icon">ℹ</span>}
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
