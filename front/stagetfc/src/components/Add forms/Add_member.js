import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Main1stage from '../Main1stage';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageInfo from '../../mycomponent/paginationform';
function AddMember() {
  const [a_paye, seta_paye] = useState(false);
  const [Autre_association, setAutre_association] = useState(false);
  const [fileval, setfileval] = useState(false);
  const [browsefile, setbrowsefile] = useState(null);
  const [datedebut, setdatedebut] = useState(new Date());
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    is_sup: true,
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

  useEffect(() => {
    if (isSupervisor) {
      axios.get(`http://localhost:8000/api/Supervisers/?id_member=0`)
      .then(res => {
        console.log("Supervisor API response:", res.data);
        setSupervisors(Array.isArray(res.data.results) ? res.data.results : []);
      })
        .catch(err => {
          console.error("Failed to load supervisors", err);
          alert("Failed to load supervisors.");
        });
    }
  }, [isSupervisor]);

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

  function handleRadioChange(e) {
    setIsSupervisor(e.target.value === "supervisor");
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

    const year = datedebut.getFullYear();
    const month = String(datedebut.getMonth() + 1).padStart(2, '0');
    const day = String(datedebut.getDate()).padStart(2, '0');

    const finalData = new FormData();
    for (const key in formData) {
      finalData.append(key, formData[key]);
    }
    finalData.append("Date_naissance", `${year}-${month}-${day}`);
    finalData.append("Autre_association", Autre_association);
    finalData.append("Application_PDF", browsefile);
    finalData.append("A_paye", a_paye);
    finalData.append("is_sup", true);

    try {
      const res = await axios.post("http://localhost:8000/api/Membres/", finalData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const newMemberId = res.data.id;

      if (isSupervisor && selectedSupervisorId) {
        await axios.patch(`http://localhost:8000/api/Supervisers/${selectedSupervisorId}/`, {
          Id_Membre: newMemberId
        })
        .then(() => {
          alert("Supervisor updated with new member ID!");
        })
        .catch(error => {
          console.error("PATCH error:", error.response?.data || error.message);
        })
      }

      alert("New member added!");
      navigate("/Member");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  }

  async function addsup_member(e) {
    e.preventDefault();

    if (!selectedSupervisorId) {
      alert("Please select a supervisor.");
      return;
    }

    const requiredFields = ["Nom_pere", "Lieu_naissance", "Adresse", "Groupe_sanguin", "Travail", "Domaine",];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }

    if (Autre_association && !formData.Nom_autre_association) {
      alert("Please enter the name of the other association.");
      return;
    }

    if (!fileval || !browsefile) {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      const supRes = await axios.get(`http://localhost:8000/api/Supervisers/${selectedSupervisorId}/`);
      const supervisor = supRes.data;

      const year = datedebut.getFullYear();
      const month = String(datedebut.getMonth() + 1).padStart(2, '0');
      const day = String(datedebut.getDate()).padStart(2, '0');

      const newForm = new FormData();
      newForm.append("Nom", supervisor.Nom);
      newForm.append("Prenom", supervisor.Prenom);
      newForm.append("Telephone", supervisor.Telephone);
      newForm.append("Profession", supervisor.Profession);
      newForm.append("Nom_pere", formData.Nom_pere);
      newForm.append("Date_naissance", `${year}-${month}-${day}`);
      newForm.append("Lieu_naissance", formData.Lieu_naissance);
      newForm.append("Adresse", formData.Adresse);
      newForm.append("Groupe_sanguin", formData.Groupe_sanguin);
      newForm.append("Travail", formData.Travail);
      newForm.append("Domaine", formData.Domaine);
      newForm.append("Email", supervisor.Email);
      newForm.append("Autre_association", Autre_association);
      newForm.append("Nom_autre_association", formData.Nom_autre_association || "");
      newForm.append("Application_PDF", browsefile);
      newForm.append("A_paye", false);
      newForm.append("is_sup", true);

      const postRes = await axios.post("http://localhost:8000/api/Membres/", newForm, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const newMember = postRes.data;

      await axios.patch(`http://localhost:8000/api/Supervisers/${selectedSupervisorId}/`, {
        Id_Membre: newMember.id
      });

      alert("Supervisor successfully added as a member!");
      navigate("/Member");
    } catch (error) {
      console.error("Error adding supervisor as a member:", error);
      alert("Something went wrong while adding the supervisor.");
    }
  }

  const handleSubmit = (e) => {
    if (isSupervisor) {
      addsup_member(e);
    } else {
      submit(e);
    }
  };

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new Member</h2>
        </div>
        <form className="form-add-modify" onSubmit={handleSubmit}>
          {/* Radio selection */}
          <div className="form-group">
            <label className='text-white '>
              <input
                type="radio"
                name="supervisorStatus"
                value="supervisor"
                checked={isSupervisor === true}
                onChange={handleRadioChange}
              />
              Already Supervisor
            </label>
            <label className='text-white '>
              <input
                type="radio"
                name="supervisorStatus"
                value="newMember"
                checked={isSupervisor === false}
                onChange={handleRadioChange}
              />
              New Member
            </label>
          </div>

        
                  {isSupervisor ? (
                  <div className="space-y-4 ">
                  <label className="text-white">Select Supervisor:</label>
                  <select
                    className="form-control px-3 py-2 rounded"
                    value={selectedSupervisorId || ""}
                    onChange={(e) => setSelectedSupervisorId(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {supervisors.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.Nom} {sup.Prenom}
                      </option>
                    ))}
                  </select>
                
                  {/* Centered Additional Info */}
                  <div className="flex justify-center">
                    <div style={{ width: "500px", display:"flex",flexDirection:'column',justifyContent:"center"}} >
                      <h1 className="text-white mt-4 text-xl font-semibold">Additional info</h1>
                
                      <Main1stage name="Nom_pere" label="Father Name" type="text" value={formData.Nom_pere} onChange={handle} required />
                
                      <div className="form-group add-modif">
                        <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Date of birth:</span>
                        <DatePicker
                          className="w-full px-3 py-2 rounded"
                          selected={datedebut}
                          onChange={handle_date1}
                          dateFormat="yyyy-MM-dd"
                          required
                        />
                      </div>
                
                      <div>
                        <Main1stage name="Lieu_naissance" label="Place of birth" type="text" value={formData.Lieu_naissance} onChange={handle} required />
                      </div>
                
                      <Main1stage name="Adresse" label="Address" type="text" value={formData.Adresse} onChange={handle} required />
                      <Main1stage name="Groupe_sanguin" label="Blood Group" type="text" value={formData.Groupe_sanguin} onChange={handle} required />
                      <Main1stage name="Travail" label="Job" type="text" value={formData.Travail} onChange={handle} required />
                      <Main1stage name="Domaine" label="Domain" type="text" value={formData.Domaine} onChange={handle} required />
                
                      <Main1stage
                        name="Autre_association"
                        id="Autre_association"
                        checkbox="-input"
                        label="Other association"
                        checked={Autre_association}
                        type="checkbox"
                        value={Autre_association}
                        onChange={handleChecked_autreassociation}
                      />
                
                      <Main1stage name="Nom_autre_association" label="Name of Other Association" type="text" value={formData.Nom_autre_association} onChange={handle} />
                      <Main1stage
                        name="Application_PDF"
                        label="Application PDF"
                        type="file"
                        onChange={handle_files}
                        required
                        accept="application/pdf"
                      />
                    </div>
                  </div>
                </div>
                
                  ) : (
                    <>
                      <Main1stage name="Nom" label="First Name" type="text" value={formData.Nom} onChange={handle} required />
                      <Main1stage name="Prenom" label="Last Name" type="text" value={formData.Prenom} onChange={handle} required />
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
                      <Main1stage name="Autre_association" id="Autre_association" checkbox="-input" label="Other association" checked={Autre_association} type="checkbox" value={Autre_association} onChange={handleChecked_autreassociation} />
                      <Main1stage name="Nom_autre_association" label="Name of Other Association" type="text" value={formData.Nom_autre_association} onChange={handle} />
                      <Main1stage name="Application_PDF" label="Application PDF" type="file" onChange={handle_files} required accept="application/pdf" />
                      <Main1stage name="A_paye" id="A_paye" checkbox="-input" label="Member had payed" checked={a_paye} type="checkbox"  value={a_paye} onChange={handleChecked_apaye} />
                    </>
                  )}
          <div className='form-group' style={{ padding: "1rem" }}>
            <button className="form-control add-btn" type="submit">Add new member</button>
          </div>
        </form>
        <div className="d-flex justify-content-center gap-3">
                <PageInfo index={1} pageNumber={1} />
                </div>
      </div>
    </div>
  );
}

export default AddMember;
