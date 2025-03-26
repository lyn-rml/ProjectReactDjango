import React, { useState, useEffect } from "react";
import { Navbar, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaBars, FaHome, FaProjectDiagram, FaUserGraduate, FaUserTie, FaUser, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992); // Detect screen size

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tooltip wrapper function (Only for small screens)
  const renderTooltip = (text) => (
    <Tooltip id="tooltip">{text}</Tooltip>
  );

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>
      <Nav className="flex-column">
        {/* Home */}
        <Nav.Item>
          {isMobile ? (
            <OverlayTrigger placement="right" overlay={renderTooltip("Home")} delay={{ show: 250, hide: 400 }}>
              <Nav.Link href="#"><FaHome /> {!collapsed && "Home"}</Nav.Link>
            </OverlayTrigger>
          ) : (
            <Nav.Link href="#"><FaHome /> {!collapsed && "Home"}</Nav.Link>
          )}
        </Nav.Item>

        {/* Project */}
        <Nav.Item>
          {isMobile ? (
            <OverlayTrigger placement="right" overlay={renderTooltip("Project")} delay={{ show: 250, hide: 400 }}>
              <Nav.Link href="#"><FaProjectDiagram /> {!collapsed && "Project"}</Nav.Link>
            </OverlayTrigger>
          ) : (
            <Nav.Link href="#"><FaProjectDiagram /> {!collapsed && "Project"}</Nav.Link>
          )}
        </Nav.Item>

        {/* Intern */}
        <Nav.Item>
          {isMobile ? (
            <OverlayTrigger placement="right" overlay={renderTooltip("Intern")} delay={{ show: 250, hide: 400 }}>
              <Nav.Link href="#"><FaUserGraduate /> {!collapsed && "Intern"}</Nav.Link>
            </OverlayTrigger>
          ) : (
            <Nav.Link href="#"><FaUserGraduate /> {!collapsed && "Intern"}</Nav.Link>
          )}
        </Nav.Item>

        {/* Supervisor */}
        <Nav.Item>
          {isMobile ? (
            <OverlayTrigger placement="right" overlay={renderTooltip("Supervisor")} delay={{ show: 250, hide: 400 }}>
              <Nav.Link href="#"><FaUserTie /> {!collapsed && "Supervisor"}</Nav.Link>
            </OverlayTrigger>
          ) : (
            <Nav.Link href="#"><FaUserTie /> {!collapsed && "Supervisor"}</Nav.Link>
          )}
        </Nav.Item>

        {/* Members */}
        <Nav.Item>
          {isMobile ? (
            <OverlayTrigger placement="right" overlay={renderTooltip("Members")} delay={{ show: 250, hide: 400 }}>
              <Nav.Link href="#"><FaUsers /> {!collapsed && "Members"}</Nav.Link>
            </OverlayTrigger>
          ) : (
            <Nav.Link href="#"><FaUsers /> {!collapsed && "Members"}</Nav.Link>
          )}
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
