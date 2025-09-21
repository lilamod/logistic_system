  import React from 'react';
  import { Route, Navigate } from 'react-router-dom';

  const ProtectedRoute = ({ element: Component, ...rest }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    return (
      <Route
        {...rest}
        element={isLoggedIn ? Component : <Navigate to="/login" />} // Use Navigate for redirect
      />
    );
  };

  export default ProtectedRoute;
