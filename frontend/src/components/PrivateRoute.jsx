import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protects routes by checking for a stored JWT token.
 * If token exists, renders children; otherwise redirects to /login.
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
