import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Main1stage from '../Main1stage';
import Select from 'react-select';
import fileTypeChecker from 'file-type-checker';

function AddStagestagiaire() {
  const menuPortalTarget = document.getElementById('root');
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');
  const id_intern = searchparams.get('intern');
  const stageid = sessionStorage.getItem('id');

  const [singleoptions, setSingleOptions] = useState([]);
  const [agreementfile, setAgreementFile] = useState(null);
  const [agreementval, setAgreementVal] = useState(false);
  const [Annee, setAnnee] = useState(null);
  const [Annee_etude, setAnnee_etude] = useState(null);
  const [Universite, setUniversite] = useState("");
  const [Promotion, setPromotion] = useState("");
  const [singleselectedoption, setSingleSelectedOption] = useState(null);
  const [yearoptions, setYearOptions] = useState([]);
  const [collegeyearoptions, setCollegeYearOptions] = useState([]);
  const [Date_debut, setDate_debut] = useState("");
  const [Date_fin, setDate_fin] = useState("");

  const [formData, setFormData] = useState({
    stage: 0,
    stagiaire: 0,
    Universite: "",
    Annee_etude: "",
    Annee: 0,
    PDF_Agreement: null,
    Certified: false,
    Code: null,
    Rapport: null,
    Presentation: null,
    Promotion: "",
    Date_debut: '',
    Date_fin: '',
  });

  async function fill_interns() {
    let allInterns = [];
    let assignedInterns = [];
  
    // Fetch all interns from the API
    await axios.get('http://localhost:8000/api/Stagiaires/')
      .then(res => {
        allInterns = res.data.results.map(s => ({
          value: s.id,
          label: `${s.Prenom} ${s.Nom}`
        }));
        console.log("All interns:", allInterns);  // Debugging log
        setSingleOptions(allInterns);
      });
  
    // Fetch the assigned interns based on the stage ID
    await axios.get(`http://localhost:8000/api/stagestagiaire/?stage__id=${id}`)
      .then(res => {
        assignedInterns = res.data.map(entry => entry.stagiaire_id);
        console.log("Assigned interns:", assignedInterns);  // Debugging log
      });
  
    // Filter out assigned interns
    const filtered = allInterns.filter(opt => !assignedInterns.includes(opt.value));
    console.log("Filtered interns:", filtered);  // Debugging log
    
    // Update the state to re-render the options
    setSingleOptions(filtered);
    
    // Check if options are being updated correctly
    console.log("Updated singleoptions state:", filtered); // Debugging log
  
    const years = [];
    const studyYears = [];
    for (let i = 1950; i < 2200; i++) {
      years.push({ value: i, label: `${i}` });
      studyYears.push({ value: i, label: `${i}-${i + 1}` });
    }
    setYearOptions(years);
    setCollegeYearOptions(studyYears);
  }
  

  useEffect(() => {
    fill_interns();
  }, []);

  function handle_file_agreement(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      if (detectedFile.mimeType === "application/pdf") {
        setAgreementFile(file);
        setAgreementVal(true);
      } else {
        alert("Only PDF files are allowed.");
        setAgreementVal(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const value = e.target.value;
  
    if (!agreementval || !agreementfile) {
      alert("Invalid file type");
      return;
    }
    if (!Annee || !Annee_etude || !singleselectedoption) {
      alert("Invalid data");
      return;
    }
  
    const data = new FormData();
    data.append('stage', stageid);
    data.append('stagiaire', singleselectedoption.value);
    data.append('Universite', Universite);
    data.append('Promotion', Promotion);
    data.append('Annee', Annee.value);
    data.append('Annee_etude', Annee_etude.label);
    data.append('PDF_Agreement', agreementfile);
    data.append('Certified', false);
    data.append('Date_debut', Date_debut);
    data.append('Date_fin', Date_fin);
  
    axios.post('http://localhost:8000/api/stagestagiaire/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(res => {
      if (value === "Add more interns") {
        alert("Intern added successfully");
        window.location.reload();
      } else {
        // PATCH sujet_pris à true si "Finish" est cliqué
        axios.patch(`http://localhost:8000/api/Stages/${stageid}/`, {
          sujet_pris: true
        })
        .then(() => {
          alert("Intern added and sujet_pris updated!");
          navigate("/Stage");
        })
        .catch(err => {
          console.error("Failed to update sujet_pris:", err);
          alert("Intern added, but failed to update sujet_pris.");
          navigate("/Stage");
        });
      }
    })
    .catch(error => {
      console.error(error);
      alert("An error occurred");
    });
  }
  

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new intern to the project:</h2>
        </div>
        <form className="form-add-modify" encType="multipart/form-data">
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select new intern:</span>
            <Select
  options={singleoptions}
  value={singleselectedoption}
  onChange={setSingleSelectedOption}
  required
  maxMenuHeight={220}
  menuPortalTarget={menuPortalTarget}
/>

          </div>
          <Main1stage name="Universite" id="Universite" label="Université" type="text" value={Universite} onChange={e => setUniversite(e.target.value)} required />
          <Main1stage name="Promotion" id="Promotion" label="Promotion" type="text" value={Promotion} onChange={e => setPromotion(e.target.value)} required />
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Year of the project:</span>
            <Select options={yearoptions} value={Annee} onChange={setAnnee} required />
          </div>
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select college year:</span>
            <Select options={collegeyearoptions} value={Annee_etude} onChange={setAnnee_etude} required />
          </div>
          <Main1stage name="Date_debut" id="Date_debut" label="Date de début" type="date" value={Date_debut} onChange={e => setDate_debut(e.target.value)} required />
          <Main1stage name="Date_fin" id="Date_fin" label="Date de fin" type="date" value={Date_fin} onChange={e => setDate_fin(e.target.value)} required />
          <Main1stage name="PDF_Agreement" id="PDF_Agreement" label="PDF of Agreement" type="file" onChange={handle_file_agreement} required accept="application/pdf" />
          <div className="form-group" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <input type="button" className="form-control add-btn-2" value="Add more interns" onClick={handleSubmit} />
              <input type="button" className="form-control add-btn-2" value="Finish" onClick={handleSubmit} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStagestagiaire;
