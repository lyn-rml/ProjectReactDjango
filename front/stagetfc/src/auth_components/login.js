import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card } from "react-bootstrap";
import logo from "../components/photos/logo1.png";

const LoginPage = () => {
  const [username, setusername] = useState(''); // ID instead of username
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: username, // Note: 'username' expected by backend, but we take it from 'id'
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
        setError("Unknown user type.");
      }
    } catch (err) {
      console.error(err);
      setError('Incorrect ID or password.');
    }
  };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: "#1a1325" }}>
      {/* Left side - Logo */}
      <div className="d-flex align-items-center justify-content-center bg-white w-50">
        <img
          src={logo}
          alt="Logo"
          style={{ width: "70%", maxWidth: "600px" }}
        />
      </div>

      {/* Right side - Login Form */}
      <div className="d-flex align-items-center justify-content-center w-50" style={{ backgroundColor: "#71a8db" }}>
        <Card style={{ width: "500px", borderRadius: "20px", padding: "30px" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            <p className="text-center text-muted mb-4">Welcome back! Please log in to your account</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formId">
                <Form.Label>UserName</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  
                />
                <a href="/forgot-password" className="text-decoration-none">Forgot Password?</a>
              </div>

              <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor:" #71a8db", border: "none" }}>
                Log In
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
