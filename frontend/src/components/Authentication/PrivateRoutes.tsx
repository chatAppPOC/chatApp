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
  const role = sessionStorage.getItem("role");
  const isAuthenticated = !!sessionStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole && role !== "ADMIN") {
    return <>Not Found</>;
  }

  return <>{children}</>;
};

export default PrivateRoute;
