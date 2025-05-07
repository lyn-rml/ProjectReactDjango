import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import fileTypeChecker from 'file-type-checker';
import Main1stage from '../../components/Main1stage';
import Select from 'react-select';
import AddStagier from './Add_stagier';
import { Modal } from 'react-bootstrap';
function AddStagestagiaire({ onSupervisorAdded, onCancel,projectid }) {
  const menuPortalTarget = typeof window !== 'undefined' ? document.getElementById('root') : null;
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');

  const [update, setIsUpdated] = useState(false)
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
  const [idupdate, setidupdate] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [IdNewIntern,SetIdNewIntern]=useState(null)
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
      // Fetch all interns assigned to the project
      const assignedInternsRes = await axios.get(`http://localhost:8000/api/stagestagiaire/?Project_id=${id}`);
      assignedInterns = assignedInternsRes.data.results || [];
  
      // Extract intern IDs who are already assigned to the project
      const assignedInternIds = assignedInterns.map(intern => intern.intern_id);
  
      // Fetch all available interns
      const allInternsRes = await axios.get(`http://localhost:8000/api/Stagiaires/?available=true`);
      const allInternsData = allInternsRes.data.results || [];
  
      // Filter out interns who are already assigned to the project
      allInterns = allInternsData
        .filter(intern => {
          // Check if the intern is already assigned to any project
          const isAssignedToProject = intern.projects.some(project => project.id === projectid && project.interns.includes(intern.id));
  
          // If the intern is assigned to the current project, exclude them
          if (isAssignedToProject) {
            return false;
          }
  
          // Also exclude interns already assigned to the project we're managing
          return !assignedInternIds.includes(intern.id);
        })
        .map(s => ({
          value: s.id,
          label: `${s.first_name} ${s.last_name}`,
        }));
  
      setSingleOptions(allInterns);
  
      // If a new intern is being added, select it automatically
      if (IdNewIntern) {
        const matchingIntern = allInterns.find(i => String(i.value) === String(IdNewIntern));
        if (matchingIntern) {
          setSingleSelectedOption(matchingIntern);
        }
      }
    } catch (error) {
      console.error("Error fetching interns or stage data:", error);
    }
  }
  

  useEffect(() => {
    fill_interns();
  }, []);

useEffect(()=>{
  fill_interns();
  if (IdNewIntern) {
    const matchingIntern = singleoptions.find(i => String(i.value) === String(IdNewIntern));
    if (matchingIntern) {
      setSingleSelectedOption(matchingIntern);
    }
  }
},[IdNewIntern])

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
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth is 0-based
  
    let academicYear = '';
    if (month >= 7) {
      academicYear = `${year}-${year + 1}`;
    } else {
      academicYear = `${year - 1}-${year}`;
    }
  
    setAnnee_etude(academicYear);
  }, []);

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
    data.append('Project_id', id);
    data.append('intern_id', singleselectedoption.value);
    data.append('University', Universite);
    data.append('Promotion', Promotion);
    data.append('Project_year', Annee);
    data.append('Year_of_study', Annee_etude);
    data.append('PDF_Agreement', agreementfile);
    data.append('Certified', 'False');
    data.append('Start_Date', Date_debut);
    data.append('End_Date', Date_fin);
  
    // 🛠 PATCH the project first
    axios.patch(`http://localhost:8000/api/Stages/${id}/`, { is_taken: true })
      .then(() => {
        // 🔄 Then POST the intern-stage association
        return axios.post('http://localhost:8000/api/stagestagiaire/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      })
      .then(() => {
        alert("Intern added successfully");
  
        // Reset the form
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
        alert("An error occurred while adding intern or updating project.");
      });
  }
  



  // ➤ Fonction pour "Finish"
  function handleFinish() {
   
    onCancel();
  }
  useEffect(() => {
    if (singleselectedoption && singleselectedoption.value) {
      const selectedStagiaireId = singleselectedoption.value;

      // Vérifier si N_stage a une longueur > 0
      const selectedStagiaire = singleoptions.find(option => option.value === selectedStagiaireId);

      if (selectedStagiaire) {
        // Si N_stage existe, appeler l'API pour récupérer les informations du stagiaire
        axios.get(`http://localhost:8000/api/stagestagiaire/?intern_id=${selectedStagiaireId}`)
          .then(response => {
            const stagiaireData = response.data.results[0]; // Si plusieurs résultats, prends le premier
            console.log(stagiaireData); // Utiliser les données comme nécessaire, par exemple remplir le formulaire
            setUniversite(stagiaireData.University);
            setPromotion(stagiaireData.Promotion);
            setAnnee(stagiaireData.Project_year);
            setAnnee_etude(stagiaireData.Year_of_study);
            setidupdate(stagiaireData.id)
            // Mettre le flag isUpdated à true pour indiquer que c'est une mise à jour
            setIsUpdated(true);

          })
          .catch(error => {
            console.error("Erreur lors de la récupération des données du stagiaire :", error);
          });
      }
    }
  }, [singleselectedoption]);  // Cette logique se déclenche chaque fois que `singleselectedoption` change



  const promotionOptions = [
    { value: 'L1', label: 'L1' },
    { value: 'L2', label: 'L2' },
    { value: 'L3', label: 'L3' },
    { value: 'M1', label: 'M1' },
    { value: 'M2', label: 'M2' },
    { value: 'PHP', label: 'PHP' }
  ];

  return (
    <div
      className="Add-modify"
      style={{

        backgroundColor: "#76ABDD",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign:"center"
      }}

    >
      <h2 className="title-add-modify">Add new intern to the project:</h2>

      <div className="row">
        <div className="col-md-6">
        <label style={{ color: "white", }}>Select Existing old  intern:</label>
        <Select
              options={singleoptions}
              value={singleselectedoption}
              onChange={setSingleSelectedOption}
              required
              maxMenuHeight={220}
              menuPortalTarget={menuPortalTarget}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
        </div>
        <div className="col-md-6">
          <div className="form-group ">
            <label style={{ color: "white" }}>Or ADD New Intern:</label>
            <input
              type="button"
              className="form-control btn btn-warning"
              value="Add Intern"
              onClick={() => setShowModal(true)}

            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label htmlFor="Universite" style={{ color: "white", textAlign:"cente" }}>University</label>
          <input
            type="text"
            className="form-control"
            id="Universite"
            name="Universite"
            placeholder='Unversity'
            value={Universite}
            onChange={e => setUniversite(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <div className="form-group ">
            <label style={{ color: "white" }}>Select Promotion:</label>
            <Select
              options={promotionOptions}
              value={promotionOptions.find(option => option.value === Promotion)}
              onChange={selectedOption => setPromotion(selectedOption.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label style={{ color: "white" }}>Select Year of the project:</label>
            <input
             className="form-control"
  type="text"
  value={Annee}
  onChange={(e) => setAnnee(e.target.value)}
  placeholder="Enter academic year"
  required
/>     
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group ">
            <label style={{ color: "white", }}>Select college year:</label>
            <input
  type="text"
   className="form-control"
  value={Annee_etude}
  onChange={(e) => setAnnee_etude(e.target.value)}
  placeholder="Enter academic year"
  required
/>

          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label style={{ color: "white", fontSize: "1.25rem" }}>Start Date:</label>
            <input type="date" className="form-control" value={Date_debut} onChange={e => setDate_debut(e.target.value)} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label style={{ color: "white", fontSize: "1.25rem" }}>End Date:</label>
            <input type="date" className="form-control" value={Date_fin} onChange={e => setDate_fin(e.target.value)} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label style={{ color: "white", fontSize: "1.25rem" }}>PDF Agreement:</label>
            <input id="PDF_Agreement" type="file" className="form-control" accept="application/pdf" onChange={handle_file_agreement} />
          </div>
        </div>
      </div>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <AddStagier
         onCancel={() => setShowModal(false)}
         onSuccess={(id) => {
           console.log("New intern ID:", id);
           SetIdNewIntern(id)
           // Navigate or update state using the returned ID
         }}
        />
      </Modal>
    </div>

  );
}

export default AddStagestagiaire;
