import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles }) => {
  const { profile, loading } = useAuth();

  if (loading) return <Loading fullScreen />;
  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
