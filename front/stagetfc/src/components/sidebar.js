import React, { useState, useEffect } from "react";
import { Navbar, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaBars, FaHome, FaProjectDiagram, FaUserGraduate, FaUserTie, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Tooltip wrapper function
  const renderTooltip = (text) => (
    <Tooltip id={`tooltip-${text}`}>{text}</Tooltip>
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
          <OverlayTrigger placement="right" overlay={renderTooltip("Home")} delay={{ show: 250, hide: 400 }}>
            <Nav.Link href="/"><FaHome /> {!collapsed && "Home"}</Nav.Link>
          </OverlayTrigger>
        </Nav.Item>

        {/* Project */}
        <Nav.Item>
          <OverlayTrigger placement="right" overlay={renderTooltip("Project")} delay={{ show: 250, hide: 400 }}>
            <Nav.Link href="/Stage"><FaProjectDiagram /> {!collapsed && "Project"}</Nav.Link>
          </OverlayTrigger>
        </Nav.Item>

        {/* Intern */}
        <Nav.Item>
          <OverlayTrigger placement="right" overlay={renderTooltip("Intern")} delay={{ show: 250, hide: 400 }}>
            <Nav.Link href="/Stagiaire"><FaUserGraduate /> {!collapsed && "Intern"}</Nav.Link>
          </OverlayTrigger>
        </Nav.Item>

        {/* Supervisor */}
        <Nav.Item>
          <OverlayTrigger placement="right" overlay={renderTooltip("Supervisor")} delay={{ show: 250, hide: 400 }}>
            <Nav.Link href="/Superviser"><FaUserTie /> {!collapsed && "Supervisor"}</Nav.Link>
          </OverlayTrigger>
        </Nav.Item>

        {/* Members */}
        <Nav.Item>
          <OverlayTrigger placement="right" overlay={renderTooltip("Members")} delay={{ show: 250, hide: 400 }}>
            <Nav.Link href="/Member"><FaUsers /> {!collapsed && "Members"}</Nav.Link>
          </OverlayTrigger>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
