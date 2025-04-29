import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Main1stage from '../Main1stage';

function AddSuperviserFromAddProject({ show, onSupervisorAdded }) {
  const [isMember, setIsMember] = useState(false);
  const [fileval, setfileval] = useState(false);
  const [browsefile, setBrowsefile] = useState(null);
  const [datedebut, setDateDebut] = useState(new Date());
  const [autreAssociation, setAutreAssociation] = useState(false);

  const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);

  const [formDataMember, setFormDataMember] = useState({
    first_name: '',
    last_name: '',
    Father_name: '',
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
      handleClose();
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

    const finalData = new FormData();
    Object.entries(formDataMember).forEach(([key, val]) => {
      if (val !== null) finalData.append(key, val);
    });
    finalData.append('Date_of_birth', `${year}-${month}-${day}`);
    finalData.append('Application_PDF', browsefile);
    finalData.append('is_another_association', autreAssociation);

    try {
      const response = await axios.post('http://localhost:8000/api/Membres/create_member_and_supervisor/', finalData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newSupervisorId = response.data.id;
      onSupervisorAdded(newSupervisorId, true);
      handleClose();
    } catch (error) {
      console.error('Error creating member and supervisor:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Supervisor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-3 mb-4">
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

        {isMember ? (
          <form onSubmit={handleSubmitMember}>
            <Main1stage name="first_name" label="First Name" type="text" value={formDataMember.first_name} onChange={handleInputChangeMember} required />
            <Main1stage name="last_name" label="Last Name" type="text" value={formDataMember.last_name} onChange={handleInputChangeMember} required />
            <Main1stage name="Father_name" label="Father Name" type="text" value={formDataMember.Father_name} onChange={handleInputChangeMember} required />
            
            <div className="form-group">
              <label>Date of Birth:</label>
              <DatePicker selected={datedebut} onChange={(date) => setDateDebut(date)} dateFormat="yyyy-MM-dd" required />
            </div>

            <Main1stage name="place_of_birth" label="Place of Birth" type="text" value={formDataMember.place_of_birth} onChange={handleInputChangeMember} required />
            <Main1stage name="phone_number" label="Phone Number" type="text" value={formDataMember.phone_number} onChange={handleInputChangeMember} required />
            <Main1stage name="Adresse" label="Address" type="text" value={formDataMember.Adresse} onChange={handleInputChangeMember} required />
            <Main1stage name="Blood_type" label="Blood Type" type="text" value={formDataMember.Blood_type} onChange={handleInputChangeMember} required />
            <Main1stage name="work" label="Work" type="text" value={formDataMember.work} onChange={handleInputChangeMember} required />
            <Main1stage name="profession" label="Profession" type="text" value={formDataMember.profession} onChange={handleInputChangeMember} required />
            <Main1stage name="Domaine" label="Domain" type="text" value={formDataMember.Domaine} onChange={handleInputChangeMember} required />
            <Main1stage name="email" label="Email" type="email" value={formDataMember.email} onChange={handleInputChangeMember} required />

            <div className="form-group mt-2">
              <label>
                <input
                  type="checkbox"
                  checked={autreAssociation}
                  onChange={() => setAutreAssociation(!autreAssociation)}
                /> Other Association
              </label>
            </div>

            {autreAssociation && (
              <Main1stage name="association_name" label="Association Name" type="text" value={formDataMember.association_name} onChange={handleInputChangeMember} />
            )}

            <Main1stage name="Application_PDF" label="Application PDF" type="file" onChange={handleFileChange} required accept="application/pdf" />

            <div className="mt-4 text-center">
              <Button type="submit" variant="primary">Add Member & Supervisor</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitNonMember}>
            <Main1stage name="first_name" label="First Name" type="text" value={formDataNonMember.first_name} onChange={handleInputChangeNonMember} required />
            <Main1stage name="last_name" label="Last Name" type="text" value={formDataNonMember.last_name} onChange={handleInputChangeNonMember} required />
            <Main1stage name="profession" label="Profession" type="text" value={formDataNonMember.profession} onChange={handleInputChangeNonMember} required />
            <Main1stage name="email" label="Email" type="email" value={formDataNonMember.email} onChange={handleInputChangeNonMember} required />
            <Main1stage name="phone_number" label="Phone Number" type="text" value={formDataNonMember.phone_number} onChange={handleInputChangeNonMember} required />

            <div className="mt-4 text-center">
              <Button type="submit" variant="primary">Add Supervisor</Button>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default AddSuperviserFromAddProject;
