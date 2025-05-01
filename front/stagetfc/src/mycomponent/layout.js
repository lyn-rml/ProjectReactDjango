import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/sidebar';
import Nav from '../components/nav';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin-dashboard/Add-project/") {
      document.body.style.backgroundColor = "#fff"; // light gray
    } else if (location.pathname === "/admin-dashboard/") {
      document.body.style.backgroundColor = "#76ABDD"; // light blue

    } else if(location.pathname==="/admin-dashboard/Stage") {
      document.body.style.backgroundColor = "#76ABDD"; // default white
    }else if(location.pathname==="/admin-dashboard/Stagiaire") {
      document.body.style.backgroundColor = "#76ABDD"; // default white
    }
    else if(location.pathname==="/admin-dashboard/Superviser") {
      document.body.style.backgroundColor = "#76ABDD"; // default white
    }


    // Optional: Clean up when component unmounts
    return () => {
      document.body.style.backgroundColor = "white";
    };
  }, [location]);

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
