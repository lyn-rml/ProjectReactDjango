import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
  const userType = localStorage.getItem('user_type');

  if (userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateAdminRoute;
