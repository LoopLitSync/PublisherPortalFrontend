// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '../KeycloakContext'; // Import the useKeycloak hook
 
interface ProtectedRouteProps {
  children: React.ReactNode;
}
 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak(); // Get both keycloak and initialized
 
  if (!initialized) {
    // Wait until Keycloak is initialized
    return <div>Loading...</div>;
  }
 
  if (keycloak === null || !keycloak.authenticated) {
    // If Keycloak is not initialized or not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }
 
  // If authenticated, render the protected content
  return <>{children}</>;
};
 
export default ProtectedRoute;