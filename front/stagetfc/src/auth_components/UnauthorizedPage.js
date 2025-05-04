// UnauthorizedPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">403 - Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;