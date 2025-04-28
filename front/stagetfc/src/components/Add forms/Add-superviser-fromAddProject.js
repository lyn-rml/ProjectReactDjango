import axios from 'axios';
import React, { useState } from 'react';
import Main1stage from '../Main1stage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PageInfo from '../../mycomponent/paginationform';

function AddSuperviserFromAddProject() {
  const [searchParams] = useSearchParams();

  const stageid = searchParams.get('id');


 
  const navigate = useNavigate();


  const [readonly, setReadonly] = useState(false);

  const [Autre_association, setAutre_association] = useState(false);
  const [fileval, setfileval] = useState(false);
  const [browsefile, setbrowsefile] = useState(null);
  const [datedebut, setdatedebut] = useState(new Date());

  const [formData, setformData] = useState({
   first_name: "",
    last_name: "",
    father_name: "",
    Date_of_birth: "",
    place_of_birth: "",
    phone_number: "",
    Adresse: "",
    blood_type: "",
    work: "",
    profession: "",
    Domaine: "",
    email: "",
    is_another_association: false,
    association_name: "",
    Application_PDF: null,
  });

  const [formDataNonMember, setFormDataNonMember] = useState({
   first_name: "",
    last_name: "",
    Profession: "",
    email: "",
    phone_number: "",
    Id_Membre: null,
  });

  const handleMemberSelection = (isMemberSelected) => {
    setIsMember(isMemberSelected);
    setReadonly(false);
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeNonMember = (e) => {
    const { name, value } = e.target;
    setFormDataNonMember((prev) => ({ ...prev, [name]: value }));
  };

  const handle_files = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setbrowsefile(file);
      setfileval(true);
    } else {
      alert("Only PDF files are allowed.");
      setfileval(false);
    }
  };

  const handleChecked_apaye = (e) => seta_paye(e.target.checked);
  const handleChecked_autreassociation = (e) => setAutre_association(e.target.checked);
  const handle_date1 = (date) => setdatedebut(date);

  const handleSubmitNonMember = async (e) => {
    e.preventDefault();
    if (
      !formDataNonMember.first_name ||
      !formDataNonMember.last_name ||
      !formDataNonMember.Profession ||
      !formDataNonMember.email ||
      !formDataNonMember.phone_number
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/Supervisers/', formDataNonMember, {
        headers: { "Content-Type": "application/json" },
      });

      const newSupervisorId = response.data.id;

      const stored = JSON.parse(localStorage.getItem('newSupervisors')) || [];
    localStorage.setItem('newSupervisors', JSON.stringify([...stored, newSupervisorId]));

    alert("Supervisor created successfully!");

    navigate(`/admin-dashboard/add-project/?id=${stageid}`);
    } catch (error) {
      console.error("Error creating supervisor:", error);
      alert("Something went wrong while creating the supervisor.");
    }
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();

    if (!fileval) {
      alert("Invalid file type.");
      return;
    }

    const requiredFields = ["first_name", "last_name", "father_name", "place_of_birth", "phone_number", "Adresse", "Blood_type", "work", "Profession", "Domaine", "email"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }

    if (is_another_association && !formData.association_name) {
      alert("Please provide the name of the other association.");
      return;
    }

    const year = datedebut.getFullYear();
    const month = String(datedebut.getMonth() + 1).padStart(2, '0');
    const day = String(datedebut.getDate()).padStart(2, '0');

    const finalData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null) finalData.append(key, val);
    });
    finalData.append("Date_of_birth", `${year}-${month}-${day}`);
    finalData.append("Application_PDF", browsefile);

    finalData.append("is_another_association", Autre_association);

    try {
      const res = await axios.post("http://localhost:8000/api/Membres/create_member_and_supervisor/", finalData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newSupervisorId = res.data.id;

     
      const stored = JSON.parse(localStorage.getItem('newSupervisors')) || [];
      localStorage.setItem('newSupervisors', JSON.stringify([...stored, newSupervisorId]));
  
      alert("Member and Supervisor created successfully!");
  
      navigate(`/admin-dashboard/add-project/?id=${stageid}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="Add-modify">
      <div className="Add-modify-container" >
        <div className="top-add-modify" style={{margin:"0 auto "}} >
          <h2 className="title-add-modify" >Add new Superviser</h2>
          <div className="form-add-modify">
          <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>
            Supervisor Type:
          </span>
          <div className="d-flex gap-3 mt-2">
            <label style={{ color: "white" }}>
              <input
                type="radio"
                name="superviserType"
                checked={isMember}
                onChange={() => handleMemberSelection(true)}
              />
              Member
            </label>
            <label style={{ color: "white" }}>
              <input
                type="radio"
                name="superviserType"
                checked={!isMember}
                onChange={() => handleMemberSelection(false)}
              />
              Not a Member
            </label>
          </div>
        </div>
        </div>
       


        {isMember ? (
          <form className="form-add-modify" onSubmit={handleSubmitMember}>
            {/* Champs du membre */}
            <Main1stage name="Nom" label="Last Name" type="text" value={formData.Nom} onChange={handle} required />
            <Main1stage name="Prenom" label="First Name" type="text" value={formData.Prenom} onChange={handle} required />
            <Main1stage name="Nom_pere" label="Father Name" type="text" value={formData.Nom_pere} onChange={handle} required />
            <div className="form-group add-modif">
              <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Date of birth:</span>
              <DatePicker selected={datedebut} onChange={handle_date1} dateFormat="yyyy-MM-dd" required />
            </div>
            <Main1stage name="Lieu_naissance" label="Place of birth" type="text" value={formData.Lieu_naissance} onChange={handle} required />
            <Main1stage name="Telephone" label="Phone number" type="text" value={formData.Telephone} onChange={handle} required />
            <Main1stage name="Adresse" label="Address" type="text" value={formData.Adresse} onChange={handle} required />
            <Main1stage name="Groupe_sanguin" label="Blood Group" type="text" value={formData.Groupe_sanguin} onChange={handle} required />
            <Main1stage name="Travail" label="Job" type="text" value={formData.Travail} onChange={handle} required />
            <Main1stage name="Profession" label="Profession" type="text" value={formData.Profession} onChange={handle} required />
            <Main1stage name="Domaine" label="Domain" type="text" value={formData.Domaine} onChange={handle} required />
            <Main1stage name="Email" label="Email" type="email" value={formData.Email} onChange={handle} required />
            <div class="d-flex justify-content-center gap-3">
  <div>
            <Main1stage name="Autre_association" checkbox="-input" label="Other association" type="checkbox" checked={Autre_association} onChange={handleChecked_autreassociation} className="w-50" /></div></div>.
            {Autre_association && (
              <Main1stage name="Nom_autre_association" label="Name of Other Association" type="text" value={formData.Nom_autre_association} onChange={handle} />
            )}
            <Main1stage name="Application_PDF" label="Application PDF" type="file" onChange={handle_files} required accept="application/pdf" />
            <div class="d-flex justify-content-center gap-3">
            <div>
            <Main1stage name="A_paye" checkbox="-input" label="Member had paid" type="checkbox" checked={a_paye} onChange={handleChecked_apaye} className="" /></div></div>
            <div className="form-group" style={{ padding: "1rem" }}>
              <button className="form-control add-btn" type="submit">Add new member & supervisor</button>
            </div>
          </form>
        ) : (
          <form className="form-add-modify" onSubmit={handleSubmitNonMember}>
            <Main1stage name="Nom" label="Nom" type="text" value={formDataNonMember.Nom} onChange={handleInputChangeNonMember} required />
            <Main1stage name="Prenom" label="Prenom" type="text" value={formDataNonMember.Prenom} onChange={handleInputChangeNonMember} required />
            <Main1stage name="Profession" label="Profession" type="text" value={formDataNonMember.Profession} onChange={handleInputChangeNonMember} required />
            <Main1stage name="Email" label="Email" type="email" value={formDataNonMember.Email} onChange={handleInputChangeNonMember} required />
            <Main1stage name="Telephone" label="Telephone" type="text" value={formDataNonMember.Telephone} onChange={handleInputChangeNonMember} required />
            <div className="form-group" style={{ padding: "1rem" }}>
              <button className="form-control add-btn" type="submit">Add new Supervisor</button>
            </div>
          </form>
        )}

        <div className="d-flex justify-content-center gap-3">
          <PageInfo index={index} pageNumber={pageNumber} />
        </div>
      </div>
    </div>
  );
}

export default AddSuperviserFromAddProject;
