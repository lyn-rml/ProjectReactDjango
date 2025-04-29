import React from "react";
import { Navigate } from "react-router-dom";

function MemberDashboard() {
  const userType = localStorage.getItem("user_type");

  // Redirect anyone who is not a "member" back to home/login
  if (userType !== "member") {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h2>Hello Member</h2>
      {/* You can put member-specific content here */}
    </div>
  );
}

export default MemberDashboard;
