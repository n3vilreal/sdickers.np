import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../auth";
export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
