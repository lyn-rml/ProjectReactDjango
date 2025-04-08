import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Main1stage from '../Main1stage';

function AddStagier() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    Email: '',
    Telephone: '',
    N_stage: 0,
  });

  function handle(e) {
    const { name, value } = e.target;
    const modName = name[0].toUpperCase() + name.slice(1);
    setFormData(prev => ({
      ...prev,
      [modName]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault(); // ✅ Prevent default form submission

    const { Nom, Prenom, Email, Telephone } = formData;

    if (Nom && Prenom && Email && Telephone) {
      try {
        const response = await axios.post('http://localhost:8000/api/Stagiaires/', formData);

        const internId = response.data.id;

        if (internId) {
          alert("New intern added!");
          navigate(`/Add_Project_to_intern/?id=${internId}`); 
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
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new Intern</h2>
        </div>

        <form onSubmit={submit} className="form-add-modify">
          <Main1stage name="Nom" id="Nom" label="Last Name" type="text" value={formData.Nom} onChange={handle} required />
          <Main1stage name="Prenom" id="Prenom" label="First Name" type="text" value={formData.Prenom} onChange={handle} required />
          <Main1stage name="Email" id="Email" label="Email" type="email" value={formData.Email} onChange={handle} required />
          <Main1stage name="telephone" id="Telephone" label="Phone number" type="text" value={formData.Telephone} onChange={handle} required />

          <div className='form-group' style={{ padding: "1rem" }}>
            <button type="submit" className="form-control add-btn">
              Add new Intern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStagier;
