import React from "react";

const UnpaidMembersCards = ({ members }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center", padding: "20px" }}>
      {members.length > 0 ? (
        members.map((member) => (
          <div key={member.id} style={{ border: "2px solid red", borderRadius: "10px", padding: "15px", width: "250px", textAlign: "center", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
            <h4 style={{ color: "red", marginBottom: "10px" }}>{member.Nom} {member.Prenom}</h4>
            <p><strong>Père:</strong> {member.Nom_pere}</p>
            <p>📞 {member.Telephone}</p>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "gray", width: "100%" }}>Aucun membre impayé.</p>
      )}
    </div>
  );
};

export default UnpaidMembersCards;
