import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from "../components/photos/logo1.png";
import axios from 'axios';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const navLinks = [
    { path: '/admin-dashboard/', label: 'Home', exact: true },
    { path: '/admin-dashboard/Stage', label: 'Projects' },
    { path: '/admin-dashboard/Stagiaire', label: 'Internships' },
    { path: '/admin-dashboard/Superviser', label: 'Supervisors' },
    { path: '/admin-dashboard/Member', label: 'Members' }
  ];

  // Get user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const res = await axios.get('http://localhost:8000/api/get_me/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(res.data);
        } catch (err) {
          console.error('Error fetching user:', err);
          navigate('/login'); // in case token is invalid
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column justify-content-between sidebar p-3">
      {/* Top Section */}
      <div>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo" className="img-fluid sidebar-logo" />
        </div>
        <nav className="nav flex-column">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.exact}
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <div className="d-flex align-items-center mb-3">
          <div
            className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            {user?.username?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="ms-2">
            <div className="fw-bold">{user?.username || 'User'}</div>
            <div className="text-primary small">{user?.type_of_user || ''}</div>
          </div>
        </div>
        <div className="d-flex align-items-center" role="button" onClick={handleLogout}>
          <span className="me-2">↩</span>
          <span className="nav-link sidebar-link">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Nav;
