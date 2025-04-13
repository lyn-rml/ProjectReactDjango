import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import fileTypeChecker from 'file-type-checker';
import Main1stage from '../../components/Main1stage';
import Select from 'react-select';
function AddStagestagiaire() {
  const menuPortalTarget = document.getElementById('root');
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');
  const stageid = sessionStorage.getItem('id');

  const [singleoptions, setSingleOptions] = useState([]);
  const [agreementfile, setAgreementFile] = useState(null);
  const [agreementval, setAgreementVal] = useState(false);
  const [Annee, setAnnee] = useState(null);
  const [Annee_etude, setAnnee_etude] = useState(null);
  const [Universite, setUniversite] = useState('');
  const [Promotion, setPromotion] = useState('');
  const [singleselectedoption, setSingleSelectedOption] = useState(null);
  const [Date_debut, setDate_debut] = useState('');
  const [Date_fin, setDate_fin] = useState('');

  const [formData, setFormData] = useState({
    stage: 0,
    stagiaire: 0,
    Universite: '',
    Annee_etude: '',
    Annee: 0,
    PDF_Agreement: null,
    Certified: false,
    Code: null,
    Rapport: null,
    Presentation: null,
    Promotion: '',
    Date_debut: '',
    Date_fin: '',
  });

  // Function to fetch interns and populate dropdown options
  async function fill_interns() {
    let allInterns = [];
    let assignedInterns = [];
  
    try {
      // 1. Fetch all available interns (excluding the ones already assigned to the stage)
      const allInternsRes = await axios.get(`http://localhost:8000/api/Stagiaires/?available=true&N_stage!=${id}`);
      const allInternsData = allInternsRes.data.results || [];
  
      // Map all interns into options for select dropdown
      allInterns = allInternsData.map(s => ({
        value: s.id,
        label: `${s.Prenom} ${s.Nom}`,
        N_stage: s.N_stage, // Include N_stage field for checking emptiness
      }));
      setSingleOptions(allInterns);
  
      // 2. Check if any intern is already assigned to the stage
      const assignedRes = await axios.get(`http://localhost:8000/api/stagestagiaire/?stage__id=${id}`);
      assignedInterns = assignedRes.data || [];
  
      // 3. Check if there's any intern with non-empty `N_stage` and auto-fill the form for that intern
      if (assignedInterns.length > 0) {
        const internData = assignedInterns[0];  // Assuming only one intern is assigned to this stage
  
        if (internData.stagiaire.N_stage && internData.stagiaire.N_stage.length > 0) {
          // Intern has valid `N_stage`, so fetch related data for this intern
          setSingleSelectedOption({
            value: internData.stagiaire.id,
            label: `${internData.stagiaire.Prenom} ${internData.stagiaire.Nom}`
          });
  
          // Fetch data related to this intern and pre-fill the form fields
          setUniversite(internData.Universite);
          setPromotion(internData.Promotion);
          setAnnee(internData.Annee);
          setAnnee_etude(internData.Annee_etude);
          setDate_debut(internData.Date_debut);
          setDate_fin(internData.Date_fin);
        }
      }
  
    } catch (error) {
      console.error("Error fetching interns or stage data:", error);
    }
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

  // ➤ Fonction pour "Add More Interns"
function handleAddMore() {
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
  data.append('Annee', Annee);
  data.append('Annee_etude', Annee_etude);
  data.append('PDF_Agreement', agreementfile);
  data.append('Certified', false);
  data.append('Date_debut', Date_debut);
  data.append('Date_fin', Date_fin);

  axios.post('http://localhost:8000/api/stagestagiaire/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  .then(() => {
    alert("Intern added successfully");

    // Reset form
    setAgreementFile(null);
    setAgreementVal(false);
    setAnnee('');
    setAnnee_etude('');
    setUniversite('');
    setPromotion('');
    setSingleSelectedOption(null);
    setDate_debut('');
    setDate_fin('');
    document.getElementById("PDF_Agreement").value = null;
  })
  .catch(error => {
    console.error(error);
    alert("An error occurred");
  });
}

// ➤ Fonction pour "Finish"
function handleFinish() {
  // Ici, on suppose que la soumission est déjà faite avant (sinon tu peux faire le post ici aussi)
  axios.patch(`http://localhost:8000/api/Stages/${stageid}/`, {
    sujet_pris: true
  })
  .then(() => {
    alert("Intern added and sujet_pris updated!");
    navigate(`/Modify-project-stagiers?stage=${stageid}&sujet_pris=true`);
  })
  .catch(err => {
    console.error("Failed to update sujet_pris:", err);
    alert("Intern added, but failed to update sujet_pris.");
    navigate(`/Modify-project-stagiers?stage=${stageid}&sujet_pris=true`);
  });
}

  

  const promotionOptions = [
    { value: 'L1', label: 'L1' },
    { value: 'L2', label: 'L2' },
    { value: 'L3', label: 'L3' },
    { value: 'M1', label: 'M1' },
    { value: 'M2', label: 'M2' },
    { value: 'PHP', label: 'PHP' }
  ];

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
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Promotion:</span>
            <Select
              options={promotionOptions}
              value={Promotion}
              onChange={selectedOption => setPromotion(selectedOption.value)}
              required
            />
          </div>
          {/* Replace dropdown with text input for Year of the project */}
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Enter Year of the project:</span>
            <input
              type="number"
              value={Annee}
              onChange={(e) => setAnnee(e.target.value)}  
              required
              placeholder="Enter Year"
            />
          </div>

          {/* Replace dropdown with text input for College Year */}
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Enter college year:</span>
            <input
              type="text"
              value={Annee_etude || ''}
              onChange={(e) => setAnnee_etude(e.target.value)} 
              required
              placeholder="Enter College Year"
            />
          </div>

          <Main1stage name="Date_debut" id="Date_debut" label="Date de début" type="date" value={Date_debut} onChange={e => setDate_debut(e.target.value)} required />
          <Main1stage name="Date_fin" id="Date_fin" label="Date de fin" type="date" value={Date_fin} onChange={e => setDate_fin(e.target.value)} required />
          <Main1stage name="PDF_Agreement" id="PDF_Agreement" label="PDF of Agreement" type="file" onChange={handle_file_agreement} required accept="application/pdf" />
          <div className="form-group" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <input
  type="button"
  className="form-control add-btn-2"
  value="Add more interns"
  onClick={handleAddMore}
/>

<input
  type="button"
  className="form-control add-btn-2"
  value="Finish"
  onClick={handleFinish}
/>


            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStagestagiaire;
