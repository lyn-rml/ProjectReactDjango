import axios from 'axios';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Main1stage from '../Main1stage';

function AddSuperviserFromAddProject({ onSupervisorAdded, onCancel }) {
  const [isMember, setIsMember] = useState(false);
  const [fileval, setfileval] = useState(false);
  const [browsefile, setBrowsefile] = useState(null);
  const [datedebut, setDateDebut] = useState(new Date());
  const [autreAssociation, setAutreAssociation] = useState(false);
  const [errors, setErrors] = useState({});
  const [formDataMember, setFormDataMember] = useState({
    first_name: '',
    last_name: '',
    father_name: '',
    place_of_birth: '',
    phone_number: '',
    Adresse: '',
    Blood_type: '',
    work: '',
    profession: '',
    Domaine: '',
    email: '',
    is_another_association: false,
    association_name: '',
    Application_PDF: null,
  });

  const [formDataNonMember, setFormDataNonMember] = useState({
    first_name: '',
    last_name: '',
    profession: '',
    email: '',
    phone_number: '',
  });

  const handleMemberSelection = (isMemberSelected) => {
    setIsMember(isMemberSelected);
  };

  const handleInputChangeMember = (e) => {
    const { name, value } = e.target;
    setFormDataMember((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);

  };

  const handleInputChangeNonMember = (e) => {
    const { name, value } = e.target;
    setFormDataNonMember((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);

  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setBrowsefile(file);
      setfileval(true);
    } else {
      alert('Only PDF files are allowed.');
      setfileval(false);
    }
  };

  const handleSubmitNonMember = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error); // renvoie true si au moins une erreur est non vide

if (hasErrors) {
  console.log("Form contains errors");
  alert("Please fix the highlighted errors.");
  return;
}
    try {
      const response = await axios.post('http://localhost:8000/api/Supervisers/', formDataNonMember, {
        headers: { "Content-Type": "application/json" },
      });
      const newSupervisorId = response.data.id;
      onSupervisorAdded(newSupervisorId, false);
      onCancel();  // Call parent's close
    } catch (error) {
      console.error('Error creating supervisor:', error);
      alert('Something went wrong.');
    }
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();

    if (!fileval) {
      alert('Invalid file type.');
      return;
    }
const hasErrors = Object.values(errors).some((error) => error); // renvoie true si au moins une erreur est non vide

if (hasErrors) {
  console.log("Form contains errors");
  alert("Please fix the highlighted errors.");
  return;
}
    const year = datedebut.getFullYear();
    const month = String(datedebut.getMonth() + 1).padStart(2, '0');
    const day = String(datedebut.getDate()).padStart(2, '0');

    // Prepare shared FormData for supervisor creation
    const finalData = new FormData();
    Object.entries(formDataMember).forEach(([key, val]) => {
      if (val !== null) finalData.append(key, val);
    });
    finalData.append('Date_of_birth', `${year}-${month}-${day}`);
    finalData.append('Application_PDF', browsefile);
    finalData.append('is_another_association', autreAssociation);

    try {
      // Step 1: Create Supervisor
      const response = await axios.post('http://localhost:8000/api/Supervisers/', finalData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newSupervisorId = response.data.id;

      // Step 2: Prepare a new FormData for Member creation
      const memberData = new FormData();
      memberData.append('supervisor_id', newSupervisorId); // 👈 Important
      memberData.append('Father_name', formDataMember.Father_name);
      memberData.append('Date_of_birth', `${year}-${month}-${day}`);
      memberData.append('Place_of_birth', formDataMember.Place_of_birth);
      memberData.append('Adresse', formDataMember.Adresse);
      memberData.append('Blood_type', formDataMember.Blood_type);
      memberData.append('Work', formDataMember.Work);
      memberData.append('Domaine', formDataMember.Domaine);
      memberData.append('is_another_association', autreAssociation);
      if (formDataMember.association_name) {
        memberData.append('association_name', formDataMember.association_name);
      }

      // Step 3: Create Member from Supervisor
      await axios.post('http://localhost:8000/api/Membres/create_member_from_supervisor/', memberData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Notify parent and close
      onSupervisorAdded(newSupervisorId, true);
      onCancel();
    } catch (error) {
      console.error('Error creating member and supervisor:', error);
      alert('Something went wrong.');
    }
  };
  const validateField = (name, value) => {
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    const phoneRegex = /^(\d{2} \d{3} \d{3})$/;
    const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;

    let error = '';

    switch (name) {
      case 'first_name':
      case 'last_name':
      case 'Father_name':
      case 'place_of_birth':
      case 'work':
      case 'profession':
      case 'Domaine':
      case 'association_name':
      case 'Adresse':
        if (!nameRegex.test(value)) {
          error = 'Only letters and spaces allowed.';
        }
        break;
      case 'phone_number':
        if (!phoneRegex.test(value)) {
          error = 'Phone format must be 00 000 000.';
        }
        break;
      case 'Blood_type':
        if (!bloodTypeRegex.test(value)) {
          error = 'Format must be A+, AB-, O+...';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#76ABDD',
      padding: '30px',
      borderRadius: '1rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      zIndex: 1000,
      maxHeight: '90vh',
      overflowY: 'auto',
      width: '600px'
    }}>
      <h4 style={{display:'flex',justifyContent:"center", color:"white"}}>Add New Supervisor</h4>
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', margin: '0 auto', justifyContent: "center" }}>
        <label
        style={{ color: '#f0f0f0',margin:"10px" }}
        >
          <input
            type="radio"
            name="supervisorType"
            checked={isMember}
            onChange={() => handleMemberSelection(true)}
          /> Member
        </label>
        <label
        style={{ color: '#f0f0f0' }}
        >
          <input
            type="radio"
            name="supervisorType"
            checked={!isMember}
            onChange={() => handleMemberSelection(false)}
          /> Not a Member
        </label>
      </div>

      {isMember && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <form onSubmit={handleSubmitMember}>
            <div
              style={{
                width: "100%",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0 auto",
              }}
            >
              <div style={{ display: "flex", gap: "20px" }}>
                <div>
                  <input className="form-control" name="first_name" placeholder="First Name" type="text" value={formDataMember.first_name} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.first_name && <div style={{ color: 'red' }}>{errors.first_name}</div>}
                </div>
                <div>
                  <input className="form-control" name="last_name" placeholder="Last Name" type="text" value={formDataMember.last_name} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.last_name && <div style={{ color: 'red' }}>{errors.last_name}</div>}
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                <div>
                  <input className="form-control" name="Father_name" placeholder="Father Name" type="text" value={formDataMember.Father_name} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.Father_name && <div style={{ color: 'red' }}>{errors.Father_name}</div>}
                </div>
                <div>
                <div className="form-group">
                  
                  <DatePicker
                    selected={datedebut}
                    onChange={(date) => setDateDebut(date)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    required
                    
                  />
  <small style={{ color: '#f0f0f0' , display:"block"}}>Date of birth.</small>
                </div>

                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                <div>
                  <input className="form-control" name="place_of_birth" placeholder="Place of Birth" type="text" value={formDataMember.place_of_birth} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.place_of_birth && <div style={{ color: 'red' }}>{errors.place_of_birth}</div>}
                </div>
                <div>
                  <input className="form-control" name="phone_number" placeholder="Phone Number" type="text" value={formDataMember.phone_number} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Format: 00 000 000</small>
                  {errors.phone_number && <div style={{ color: 'red' }}>{errors.phone_number}</div>}</div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                <div>
                  <input className="form-control" name="Adresse" placeholder="Address" type="text" value={formDataMember.Adresse} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.Adresse && <div style={{ color: 'red' }}>{errors.Adresse}</div>}
                </div>
                <div>
                  <input className="form-control" name="Blood_type" placeholder="Blood Type" type="text" value={formDataMember.Blood_type} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Format O+.</small>
                  {errors.Blood_type && <div style={{ color: 'red' }}>{errors.Blood_type}</div>}
                </div>

              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                 <div>
                  <input className="form-control" name="work" placeholder="Work" type="text" value={formDataMember.work} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.work && <div style={{ color: 'red' }}>{errors.work}</div>}
                </div>
                <div>
                  <input className="form-control" name="profession" placeholder="Profession" type="text" value={formDataMember.profession} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.profession && <div style={{ color: 'red' }}>{errors.profession}</div>}
                </div>
               
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                   <div>
                 <input className="form-control" name="Domaine" placeholder="Domain" type="text" value={formDataMember.Domaine} onChange={handleInputChangeMember} required />
                  <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.Domaine && <div style={{ color: 'red' }}>{errors.Domaine}</div>}
                </div>
               <div>
                <input className="form-control" name="email" placeholder="Email" type="email" value={formDataMember.email} onChange={handleInputChangeMember} required />
           <small style={{ color: '#f0f0f0' }}>Format user@gmail.com.</small>
              </div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "15px", alignItems: "center" }}>
                <div className="form-group ">
                  <label style={{ color: '#f0f0f0',margin:"30px" }} >
                    <input
                      type="checkbox"
                      checked={autreAssociation}
                      onChange={() => setAutreAssociation(!autreAssociation)}
                    />
                    Other Association
                  </label>
                </div>

                {autreAssociation && (
                  <div>
                  <input className="form-control" name="association_name" placeholder="Association Name" type="text" value={formDataMember.association_name} onChange={handleInputChangeMember} />
              <small style={{ color: '#f0f0f0' }}>Only letters and spaces allowed.</small>
                  {errors.association_name && <div style={{ color: 'red' }}>{errors.association_name}</div>}
               </div>
               )}
              </div>

              <div className="form-group mt-3 w-100">
                <label style={{ color: "white" }}>Application PDF</label>
                <input className="form-control" name="Application_PDF" type="file" onChange={handleFileChange} required accept="application/pdf" />
            <small style={{ color: '#f0f0f0' }}>Only PDFs  allowed.</small>
              </div>

              <div className="mt-4 text-center">
                <button type="submit" className="btn btn-warning" style={{ width: "150px", marginRight: "10px" }}>
                  Add 
                </button>
                <button type="button" className="btn btn-warning" style={{ width: "150px" }} onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
     {isMember === false && (
  <form onSubmit={handleSubmitNonMember}>
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        margin: '0 auto',
      }}
    >
      {/* First Name */}
      <div className="form-group w-100">
       
        <input
          className="form-control"
          id="first_name"
          name="first_name"
          placeholder="First Name"
          type="text"
          value={formDataNonMember.first_name}
          onChange={handleInputChangeNonMember}
          required
        />
        <small className="form-text text-white">Only letters and spaces allowed.</small>
        {errors.first_name && <div style={{ color: 'red' }}>{errors.first_name}</div>}
      </div>

      {/* Last Name */}
      <div className="form-group w-100">
        
        <input
          className="form-control"
          id="last_name"
          name="last_name"
          placeholder="Last Name"
          type="text"
          value={formDataNonMember.last_name}
          onChange={handleInputChangeNonMember}
          required
        />
        <small className="form-text text-white">Only letters and spaces allowed.</small>
        {errors.last_name && <div style={{ color: 'red' }}>{errors.last_name}</div>}
      </div>

      {/* Profession */}
      <div className="form-group w-100">
        
        <input
          className="form-control"
          id="profession"
          name="profession"
          placeholder="Profession"
          type="text"
          value={formDataNonMember.profession}
          onChange={handleInputChangeNonMember}
          required
        />
        <small className="form-text text-white">Only letters and spaces allowed.</small>
        {errors.profession && <div style={{ color: 'red' }}>{errors.profession}</div>}
      </div>

      {/* Email */}
      <div className="form-group w-100">
    
        <input
          className="form-control"
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          value={formDataNonMember.email}
          onChange={handleInputChangeNonMember}
          required
        />
        <small className="form-text text-white">Format: user@gmail.com</small>
      </div>

      {/* Phone Number */}
      <div className="form-group w-100">
        
        <input
          className="form-control"
          id="phone_number"
          name="phone_number"
          placeholder="Phone Number"
          type="text"
          value={formDataNonMember.phone_number}
          onChange={handleInputChangeNonMember}
          required
        />
        <small className="form-text text-white">Format: 00 000 000</small>
        {errors.phone_number && <div style={{ color: 'red' }}>{errors.phone_number}</div>}
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button type="submit" className="btn btn-warning" style={{ width: '150px' }}>
          Add 
        </button>
        <button type="button" className="btn btn-secondary" style={{ width: '150px' }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </form>
)}

    </div>
  );
}

export default AddSuperviserFromAddProject;
