import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../components/photos/logo1.png";
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });

      const { access, refresh } = response.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      const userInfo = await axios.get('http://localhost:8000/api/get_me/', {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });

      const { type_of_user } = userInfo.data;
      localStorage.setItem('user_type', type_of_user);

      if (type_of_user === 'admin') {
        navigate('/admin-dashboard/');
      } else if (type_of_user === 'member') {
        navigate('/member-dashboard/');
      } else {
        setError("Type d'utilisateur inconnu.");
      }
    } catch (err) {
      console.error(err);
      setError('Nom d’utilisateur ou mot de passe incorrect.');
    }
  };

  return (
    
    <div className="d-flex vh-100" style={{ backgroundColor: "#1a1325" }}>
      {/* Left Side - Logo */}
      <div className="d-flex align-items-center justify-content-center bg-white w-50">
        <img
          src={logo}  // Replace this path with your actual logo file path
          alt="CHEHIM Logo"
          style={{ width: "70%", maxWidth: "600px" }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="d-flex align-items-center justify-content-center w-50" style={{ backgroundColor: "#71a8db" }}>
        <div style={{ width: "80%", maxWidth: "400px", color: "#fff" }}>
          <h5 className="text-center mb-4">Welcom To Together For Chehim Management System</h5>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="username">UserName </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-warning w-100 mt-3">
              Get started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
