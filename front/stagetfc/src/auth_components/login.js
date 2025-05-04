import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Card } from "react-bootstrap";
import logo from "../components/photos/logo1.png";
import { Eye, EyeSlash } from 'react-bootstrap-icons'; // If you need the eye icons

const LoginPage = () => {
  const [username, setusername] = useState(''); // ID instead of username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle form submission here (authentication logic can be added)
  const handleLogin = (e) => {
    e.preventDefault();
    
    // You can add your own logic here, like checking the username and password
    
    if (username && password) {
      // Redirect to a different route after successful login
      navigate("/admin-dashboard/");
    } else {
      setError("Please fill in all fields.");
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

              <Form.Group className="mb-3" controlId="formPassword" style={{ position: "relative" }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: "40px" }} // space for the icon on the right
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "gray",
                  }}
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </div>
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <a href="/forgot-password" className="text-decoration-none">Forgot Password?</a>
              </div>

              <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: " #71a8db", border: "none" }}>
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
