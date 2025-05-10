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
  };

  const handleInputChangeNonMember = (e) => {
    const { name, value } = e.target;
    setFormDataNonMember((prev) => ({ ...prev, [name]: value }));
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
      <h4>Add New Supervisor</h4>
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', margin: '0 auto',justifyContent:"center" }}>
        <label>
          <input
            type="radio"
            name="supervisorType"
            checked={isMember}
            onChange={() => handleMemberSelection(true)}
          /> Member
        </label>
        <label>
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
          <input className="form-control" name="first_name" placeholder="First Name" type="text" value={formDataMember.first_name} onChange={handleInputChangeMember} required />
          <input className="form-control" name="last_name" placeholder="Last Name" type="text" value={formDataMember.last_name} onChange={handleInputChangeMember} required />
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <input className="form-control" name="Father_name" placeholder="Father Name" type="text" value={formDataMember.Father_name} onChange={handleInputChangeMember} required />
          <div className="form-group">
            <label style={{ display: "block", color: "white", textAlign: "center" }}>Date of Birth:</label>
            <DatePicker
              selected={datedebut}
              onChange={(date) => setDateDebut(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <input className="form-control" name="place_of_birth" placeholder="Place of Birth" type="text" value={formDataMember.place_of_birth} onChange={handleInputChangeMember} required />
          <input className="form-control" name="phone_number" placeholder="Phone Number" type="text" value={formDataMember.phone_number} onChange={handleInputChangeMember} required />
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <input className="form-control" name="Adresse" placeholder="Address" type="text" value={formDataMember.Adresse} onChange={handleInputChangeMember} required />
          <input className="form-control" name="Blood_type" placeholder="Blood Type" type="text" value={formDataMember.Blood_type} onChange={handleInputChangeMember} required />
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <input className="form-control" name="work" placeholder="Work" type="text" value={formDataMember.work} onChange={handleInputChangeMember} required />
          <input className="form-control" name="profession" placeholder="Profession" type="text" value={formDataMember.profession} onChange={handleInputChangeMember} required />
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <input className="form-control" name="Domaine" placeholder="Domain" type="text" value={formDataMember.Domaine} onChange={handleInputChangeMember} required />
          <input className="form-control" name="email" placeholder="Email" type="email" value={formDataMember.email} onChange={handleInputChangeMember} required />
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px", alignItems: "center" }}>
          <div className="form-group mt-2">
            <label>
              <input
                type="checkbox"
                checked={autreAssociation}
                onChange={() => setAutreAssociation(!autreAssociation)}
              />{" "}
              Other Association
            </label>
          </div>

          {autreAssociation && (
            <input className="form-control" name="association_name" placeholder="Association Name" type="text" value={formDataMember.association_name} onChange={handleInputChangeMember} />
          )}
        </div>

        <div className="form-group mt-3 w-100">
          <label style={{ color: "white" }}>Application PDF</label>
          <input className="form-control" name="Application_PDF" type="file" onChange={handleFileChange} required accept="application/pdf" />
        </div>

        <div className="mt-4 text-center">
          <button type="submit" className="btn btn-warning" style={{ width: "150px", marginRight: "10px" }}>
            Add Member & Supervisor
          </button>
          <button type="button" className="btn btn-warning" style={{ width: "150px" }} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
      )}
       {isMember===false &&  (
        <form onSubmit={handleSubmitNonMember}>
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
          <Main1stage name="first_name" label="First Name" type="text" value={formDataNonMember.first_name} onChange={handleInputChangeNonMember} required />
            <Main1stage name="last_name" label="Last Name" type="text" value={formDataNonMember.last_name} onChange={handleInputChangeNonMember} required />
            <Main1stage name="profession" label="Profession" type="text" value={formDataNonMember.profession} onChange={handleInputChangeNonMember} required />
            <Main1stage name="email" label="Email" type="email" value={formDataNonMember.email} onChange={handleInputChangeNonMember} required />
            <Main1stage name="phone_number" label="Phone Number" type="text" value={formDataNonMember.phone_number} onChange={handleInputChangeNonMember} required />
          <div className="mt-4 text-center">
            <button type="submit"  className=" btn btn-warning" style={{width:"150px"}}>Add Supervisor</button>
            <button type="button"  className=" btn btn-warning" style={{width:"150px"}} onClick={onCancel}>Cancel</button>
          </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddSuperviserFromAddProject;
