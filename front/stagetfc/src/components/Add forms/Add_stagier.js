import axios from 'axios';
import React, { useState } from 'react';
import {useSearchParams, useNavigate } from 'react-router-dom';
import Main1stage from '../Main1stage';
import PageInfo from '../../mycomponent/paginationform';
function AddStagier() {
  let index=1
  let pageNumber=2
  
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const addnew = searchparams.get('addnew');
  const id = searchparams.get('stage');
  const sujet_pris= searchparams.get('sujet_pris')
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    Email: '',
    Telephone: '',
    N_stage: 0,
    available: true, 
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
    e.preventDefault();
  
    const { Nom, Prenom, Email, Telephone } = formData;
    const addnew = searchparams.get('addnew'); // ✅ Get 'existe' from URL
  
    if (Nom && Prenom && Email && Telephone) {
      try {
        const response = await axios.post('http://localhost:8000/api/Stagiaires/', formData);
        const internId = response.data.id;
  
        if (internId) {
          alert("New intern added!");
  
          // ✅ Check both 'addnew' and 'existe' query params
          if (addnew === 'true') {
            navigate(`/Add-intern-project?stage=${id}&sujet_pris=${sujet_pris}&idnew=${internId}`);
          } else {
            navigate(`/Add_Project_to_intern/?id=${internId}&index=${index}`);
          }
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
      {addnew ? "Add New Intern" : "Next Step Add intern project"}
    </button>
          </div>
        </form>
        <div className="d-flex justify-content-center gap-3">
        <PageInfo index={addnew ? 1 : index} pageNumber={addnew ? 1 : pageNumber} />
                </div>
      </div>
    </div>
  );
}

export default AddStagier;
