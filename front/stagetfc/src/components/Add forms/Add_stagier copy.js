import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Main1stage from '../Main1stage';

function AddStagierVersion1() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');
  const sujet_pris = searchparams.get('sujet_pris');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profession: '',
    available: true,
  });

  const [errors, setErrors] = useState({});

  const handle = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{2} \d{3} \d{3}$/;

    if (!formData.first_name.trim() || !nameRegex.test(formData.first_name))
      newErrors.first_name = "First name must contain only letters.";
    if (!formData.last_name.trim() || !nameRegex.test(formData.last_name))
      newErrors.last_name = "Last name must contain only letters.";
    if (!formData.email.trim() || !emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address.";
    if (!formData.phone_number.trim() || !phoneRegex.test(formData.phone_number))
      newErrors.phone_number = "Phone number must be in format: 07 123 123.";
    if (!formData.profession.trim() || !nameRegex.test(formData.profession))
      newErrors.profession = "Profession must contain only letters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:8000/api/Stagiaires/', formData);
      const internId = response.data.id;

      if (internId) {
        alert("New intern added!");
        navigate(`/admin-dashboard/Add_Project_to_intern/?id=${internId}`);
      }
    } catch (error) {
      console.error("Error adding intern:", error);
      alert("An error occurred while adding the intern.");
    }
  };

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new Intern</h2>
        </div>

        <form onSubmit={submit} className="form-add-modify">
          <Main1stage name="first_name" id="Nom" label="Last Name" type="text" value={formData.first_name} onChange={handle} required />
          {errors.first_name && <p className="text-danger">{errors.first_name}</p>}

          <Main1stage name="last_name" id="Prenom" label="First Name" type="text" value={formData.last_name} onChange={handle} required />
          {errors.last_name && <p className="text-danger">{errors.last_name}</p>}

          <Main1stage name="email" id="Email" label="Email" type="email" value={formData.email} onChange={handle} required />
          {errors.email && <p className="text-danger">{errors.email}</p>}

          <Main1stage name="phone_number" id="Telephone" label="Phone number" type="text" value={formData.phone_number} onChange={handle} required />
          {errors.phone_number && <p className="text-danger">{errors.phone_number}</p>}

          <Main1stage name="profession" id="profession" label="Profession" type="text" value={formData.profession} onChange={handle} required />
          {errors.profession && <p className="text-danger">{errors.profession}</p>}

          <div className='form-group' style={{ padding: "1rem" }}>
            <button type="submit" className="form-control btn btn-warning">
              Next Step: Add intern project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStagierVersion1;
