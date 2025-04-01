import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/sidebar';

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar on all pages */}
    <Sidebar/>
      
      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "40px" }}>
        <Container fluid>
          {children} {/* This will render the specific page content */}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
