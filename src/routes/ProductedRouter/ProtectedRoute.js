import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      const path = location.pathname.split("/")[1] || "this page";
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      toast.warning(`Please login to see ${name}`);
    }
  }, [isAuthenticated, location]);

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/Login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
