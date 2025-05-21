import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function MemberDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les tokens et le type d'utilisateur
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("type_of_user");

    // Redirection vers la page de login
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#4e91c4", color: "white" }}
    >
      <h2 className="mb-4">Welcom Member!</h2>

      

      <Button
        variant="light"
        onClick={handleLogout}
        style={{ marginTop: "20px", fontWeight: "bold" }}
      >
        Logout
      </Button>
    </div>
  );
}

export default MemberDashboard;
