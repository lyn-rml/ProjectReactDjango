import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/sidebar';
import Nav from '../components/nav';
const Layout = ({ children }) => {
  return (
    <div className="d-flex">
     <div style={{width:"15%"}}>
    <Nav/>
    </div>
      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ width:"70%" }}>
        <Container fluid>
          {children} {/* This will render the specific page content */}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
