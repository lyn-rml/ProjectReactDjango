import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Main1stage from '../Main1stage';

function AddStagier({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profession: '',
    available: true,
  });

  function handle(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    const { first_name, last_name, email, phone_number, profession } = formData;

    if (first_name && last_name && email && phone_number && profession) {
      try {
        const response = await axios.post('http://localhost:8000/api/Stagiaires/', formData);
        const internId = response.data.id;

        if (internId) {
          alert("New intern added!");
          onSuccess?.(internId); // return ID to parent
          onCancel?.(); // close modal
        } else {
          alert("Intern added, but no ID returned!");
        }
      } catch (error) {
        console.error("Error adding intern:", error);
        alert("An error occurred while adding the intern.");
      }
    } else {
      alert("All fields are required!");
    }
  }

  return (

  
        <form onSubmit={submit} className=" Add-modify"
        style={{

          backgroundColor: "#76ABDD",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign:"center",
          display:"flex",
          justifyContent:"center",
          flexDirection:"column",
          alignItems:"center"
        }}
        >
        <h2 className="title-add-modify">Add new Intern</h2>
          <Main1stage name="first_name" id="Nom" label="Last Name" type="text" value={formData.first_name} onChange={handle} required />
          <Main1stage name="last_name" id="Prenom" label="First Name" type="text" value={formData.last_name} onChange={handle} required />
          <Main1stage name="email" id="Email" label="Email" type="email" value={formData.email} onChange={handle} required />
          <Main1stage name="phone_number" id="Telephone" label="Phone number" type="text" value={formData.phone_number} onChange={handle} required />
          <Main1stage name="profession" id="profession" label="Profession" type="text" value={formData.profession} onChange={handle} required />
          
          <div className="form-group" style={{ padding: "1rem",display:"flex",justifyContent:"center" }}>
            <button type="submit" className="form-control btn btn-warning " style={{width:"200px"}}>
              Add Intern
            </button>
            <button type="button" onClick={onCancel} className="form-control btn btn-secondary mt-2" style={{width:"200px"}}>
              Cancel
            </button>
          </div>
        </form>
     

  );
}

export default AddStagier;
