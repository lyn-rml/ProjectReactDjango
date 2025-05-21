import axios from 'axios';
import React, { useState } from 'react';
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

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{2} \d{3} \d{3}$/;

    if (!nameRegex.test(formData.first_name)) {
      newErrors.first_name = 'First name must contain only letters.';
    }

    if (!nameRegex.test(formData.last_name)) {
      newErrors.last_name = 'Last name must contain only letters.';
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be in format: dd ddd ddd.';
    }

    if (!nameRegex.test(formData.profession)) {
      newErrors.profession = 'Profession must contain only letters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handle(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:8000/api/Stagiaires/', formData);
      const internId = response.data.id;

      if (internId) {
        alert("New intern added!");
        onSuccess?.(internId);
        onCancel?.();
      } else {
        alert("Intern added, but no ID returned!");
      }
    } catch (error) {
      console.error("Error adding intern:", error);
      alert("An error occurred while adding the intern.");
    }
  }

  return (
    <form onSubmit={submit} className="Add-modify"
      style={{
        backgroundColor: "#76ABDD",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <h2 className="title-add-modify">Add new Intern</h2>

      <Main1stage name="first_name" id="Nom" label="Last Name" type="text" value={formData.first_name} onChange={handle} required />
      {errors.first_name && <div className="text-danger">{errors.first_name}</div>}

      <Main1stage name="last_name" id="Prenom" label="First Name" type="text" value={formData.last_name} onChange={handle} required />
      {errors.last_name && <div className="text-danger">{errors.last_name}</div>}

      <Main1stage name="email" id="Email" label="Email" type="email" value={formData.email} onChange={handle} required />
      {errors.email && <div className="text-danger">{errors.email}</div>}

      <Main1stage name="phone_number" id="Telephone" label="Phone number" type="text" value={formData.phone_number} onChange={handle} required />
     <span className='text-white'>ex: 03 123 456</span>
      {errors.phone_number && <div className="text-danger">{errors.phone_number}</div>}

      <Main1stage name="profession" id="profession" label="Profession" type="text" value={formData.profession} onChange={handle} required />
      {errors.profession && <div className="text-danger">{errors.profession}</div>}

      <div className="form-group" style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
        <button type="submit" className="form-control btn btn-warning" style={{ width: "200px" }}>
          Add Intern
        </button>
        <button type="button" onClick={onCancel} className="form-control btn btn-secondary mt-2" style={{ width: "200px" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddStagier;
