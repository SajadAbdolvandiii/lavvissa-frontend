import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show loading spinner while authentication state is being determined
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
