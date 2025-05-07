import axios from 'axios';
import React, { useState } from 'react';
import {useSearchParams, useNavigate } from 'react-router-dom';
import Main1stage from '../Main1stage';

function AddStagierVersion1() {

  
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();

  const id = searchparams.get('stage');
  const sujet_pris= searchparams.get('sujet_pris')
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profession:'',
    available: true, 
  });
  
  function handle(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
  
    const { first_name, last_name, email, phone_number,profession } = formData;
    const addnew = searchparams.get('addnew'); // ✅ Get 'existe' from URL
  
    if (first_name && last_name && email && phone_number,profession) {
      try {
        const response = await axios.post('http://localhost:8000/api/Stagiaires/', formData);
        const internId = response.data.id;
  
        if (internId) {
          alert("New intern added!");
  
          // ✅ Check both 'addnew' and 'existe' query params
         
            navigate(`/admin-dashboard/Add_Project_to_intern/?id=${internId}&index=${index}`);
          
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
          <Main1stage name="first_name" id="Nom" label="Last Name" type="text" value={formData.first_name} onChange={handle} required />
          <Main1stage name="last_name" id="Prenom" label="First Name" type="text" value={formData.last_name} onChange={handle} required />
          <Main1stage name="email" id="Email" label="Email" type="email" value={formData.email} onChange={handle} required />
          <Main1stage name="phone_number" id="Telephone" label="Phone number" type="text" value={formData.phone_number} onChange={handle} required />
          <Main1stage name="profession" id="profession" label="profession" type="text" value={formData.profession} onChange={handle} required />
          <div className='form-group' style={{ padding: "1rem" }}>
          <button type="submit" className="form-control btn btn-warning">
    Next Step Add intern project
    </button>
          </div>
        </form>
       
      </div>
    </div>
  );
}

export default AddStagierVersion1;
