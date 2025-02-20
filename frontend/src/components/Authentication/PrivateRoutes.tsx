import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRole,
}) => {
  const role = localStorage.getItem("role");
  const isAuthenticated = !!localStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole && role !== "ADMIN") {
    return <>Not Found</>;
  }

  return <>{children}</>;
};

export default PrivateRoute;
