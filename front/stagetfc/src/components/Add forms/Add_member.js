import axios from 'axios';
import React, { useState } from 'react';
import Main1stage from '../Main1stage';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddMember() {
  const [a_paye, seta_paye] = useState(false);
  const [Autre_association, setAutre_association] = useState(false);
  const [fileval, setfileval] = useState(false);
  const [browsefile, setbrowsefile] = useState(null);
  const [datedebut, setdatedebut] = useState(new Date());
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    is_sup: false,
    Nom: "",
    Prenom: "",
    Nom_pere: "",
    Date_naissance: "",
    Lieu_naissance: "",
    Telephone: "",
    Adresse: "",
    Groupe_sanguin: "",
    Travail: "",
    Profession: "",
    Domaine: "",
    Email: "",
    Autre_association: false,
    Nom_autre_association: "",
    Application_PDF: null,
    A_paye: false,
  });

  function handle(e) {
    const { name, value } = e.target;
    setformData(prev => ({ ...prev, [name]: value }));
  }

  function handle_files(e) {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setbrowsefile(file);
      setfileval(true);
    } else {
      alert("Only PDF files are allowed.");
      setfileval(false);
    }
  }

  function handle_date1(date) {
    setdatedebut(date);
  }

  function handleChecked_apaye(e) {
    seta_paye(e.target.checked);
  }

  function handleChecked_autreassociation(e) {
    setAutre_association(e.target.checked);
  }

  async function submit(e) {
    e.preventDefault();

    if (!fileval) {
      alert("Invalid file type.");
      return;
    }

    const requiredFields = ["Nom", "Prenom", "Nom_pere", "Lieu_naissance", "Telephone", "Adresse", "Groupe_sanguin", "Travail", "Profession", "Domaine", "Email"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }

    if (Autre_association && !formData.Nom_autre_association) {
      alert("Please provide the name of the other association.");
      return;
    }

    // Format date
    const year = datedebut.getFullYear();
    const month = String(datedebut.getMonth() + 1).padStart(2, '0');
    const day = String(datedebut.getDate()).padStart(2, '0');

    const finalData = new FormData();
    finalData.append("Nom", formData.Nom);
    finalData.append("Prenom", formData.Prenom);
    finalData.append("Nom_pere", formData.Nom_pere);
    finalData.append("Date_naissance", `${year}-${month}-${day}`);
    finalData.append("Lieu_naissance", formData.Lieu_naissance);
    finalData.append("Telephone", formData.Telephone);
    finalData.append("Adresse", formData.Adresse);
    finalData.append("Groupe_sanguin", formData.Groupe_sanguin);
    finalData.append("Travail", formData.Travail);
    finalData.append("Profession", formData.Profession);
    finalData.append("Domaine", formData.Domaine);
    finalData.append("Email", formData.Email);
    finalData.append("Autre_association", Autre_association);
    finalData.append("Nom_autre_association", formData.Nom_autre_association);
    finalData.append("Application_PDF", browsefile);
    finalData.append("A_paye", a_paye);
    finalData.append("is_sup", formData.is_sup);

    try {
      const res = await axios.post("http://localhost:8000/api/Membres/", finalData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("New member added!");
      navigate("/Member");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new Member</h2>
        </div>
        <form className="form-add-modify" onSubmit={submit}>
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
          <Main1stage name="Autre_association" id="Autre_association" checkbox="-input" label="Other association" checked={(Autre_association===true)?true:false} type="checkbox" value={Autre_association} onChange={handleChecked_autreassociation}/>
          <Main1stage name="Nom_autre_association" label="Name of Other Association" type="text" value={formData.Nom_autre_association} onChange={handle} />
          <Main1stage name="Application_PDF" label="Application PDF" type="file" onChange={handle_files} required accept="application/pdf" />
          <Main1stage name="A_paye" id="A_paye" checkbox="-input" label="Member had payed" checked={(a_paye===true)?true:false} type="checkbox" required="required" value={a_paye} onChange={handleChecked_apaye}/>
          <div className='form-group' style={{ padding: "1rem" }}>
            <button className="form-control add-btn" type="submit">Add new member</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMember;
