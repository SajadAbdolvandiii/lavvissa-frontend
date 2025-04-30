import React, { createContext, useState, useContext, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Helper functions for common toast types
  const showSuccess = useCallback(
    (message, duration = 3000) => {
      return addToast(message, "success", duration);
    },
    [addToast]
  );

  const showError = useCallback(
    (message, duration = 3000) => {
      return addToast(message, "error", duration);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => {
      return addToast(message, "info", duration);
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, showSuccess, showError, showInfo }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
