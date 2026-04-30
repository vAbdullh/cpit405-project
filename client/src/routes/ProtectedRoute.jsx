import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If not authenticated, redirect to the auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Otherwise, render the child routes
  return <Outlet />;
}
