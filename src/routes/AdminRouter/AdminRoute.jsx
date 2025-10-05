// src/routes/AdminRoute.jsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isAllowed = !!(user?.isSuperuser || user?.isStaff);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please login to access this page.");
    } else if (!isAllowed) {
      toast.error("You do not have permission to access this page.");
    }
  }, [isAuthenticated, isAllowed]);

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  if (!isAllowed) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default AdminRoute;
