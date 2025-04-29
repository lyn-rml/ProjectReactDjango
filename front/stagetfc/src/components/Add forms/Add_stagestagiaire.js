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
  const sujet_pris= searchparams.get('sujet_pris')
  const idNew= searchparams.get('idnew')
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
      const allInternsRes = await axios.get(`http://localhost:8000/api/Stagiaires/?available=true`);
      const allInternsData = allInternsRes.data.results || [];
  
      allInterns = allInternsData.map(s => ({
        value: s.id,
        label: `${s.Prenom} ${s.Nom}`,
        N_stage: s.N_stage,
      }));
  
      setSingleOptions(allInterns);
  
      // 1. If idNew is provided and matches an intern
      if (idNew) {
        const matchingIntern = allInterns.find(i => String(i.value) === String(idNew));
        if (matchingIntern) {
          setSingleSelectedOption(matchingIntern);
        }
      }
  
      // 2. Fetch interns already assigned to this stage
      const assignedRes = await axios.get(`http://localhost:8000/api/stagestagiaire/?Project_id=${id}`);
      assignedInterns = assignedRes.data || [];
  
      if (assignedInterns.length > 0 && !idNew) {
        const internData = assignedInterns[0];
        if (internData.stagiaire.N_stage && internData.stagiaire.N_stage.length > 0) {
          setSingleSelectedOption({
            value: internData.stagiaire.id,
            label: `${internData.stagiaire.Prenom} ${internData.stagiaire.Nom}`
          });
  
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
    data.append('Certified', 'False');
    data.append('Date_debut', Date_debut);
    data.append('Date_fin', Date_fin);

    // Si update est vrai, effectuer un PATCH, sinon un POST
    if (update) {
      axios.patch(`http://localhost:8000/api/stagestagiaire/${idupdate}/`, data)
        .then(() => {
          alert("Intern updated successfully");

          // Réinitialiser le formulaire après l'update
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
          alert("An error occurred while updating");
        });

    } else {
      // Si update est false, effectuer un POST
      axios.post('http://localhost:8000/api/stagestagiaire/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(() => {
          alert("Intern added successfully");

          // Réinitialiser le formulaire après le POST
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
  useEffect(() => {
    if (singleselectedoption && singleselectedoption.value) {
      const selectedStagiaireId = singleselectedoption.value;

      // Vérifier si N_stage a une longueur > 0
      const selectedStagiaire = singleoptions.find(option => option.value === selectedStagiaireId);

      if (selectedStagiaire && selectedStagiaire.N_stage && selectedStagiaire.N_stage.length > 0) {
        // Si N_stage existe, appeler l'API pour récupérer les informations du stagiaire
        axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__id=${selectedStagiaireId}`)
          .then(response => {
            const stagiaireData = response.data.results[0]; // Si plusieurs résultats, prends le premier
            console.log(stagiaireData); // Utiliser les données comme nécessaire, par exemple remplir le formulaire
            setUniversite(stagiaireData.Universite);
            setPromotion(stagiaireData.Promotion);
            setAnnee(stagiaireData.Annee);
            setAnnee_etude(stagiaireData.Annee_etude);
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
function handleaddintern(){
navigate(`/Add-intern/?addnew=${true}&stage=${id}&sujet_pris=${sujet_pris}`)
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
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }} >OR</span>
            <input
                type="button"
                className="form-control add-btn-2"
                value="Add Intern"
                onClick={handleaddintern}
              />
          </div>
          <Main1stage name="Universite" id="Universite" label="Université" type="text" value={Universite} onChange={e => setUniversite(e.target.value)} required />
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Promotion:</span>
            <Select
              options={promotionOptions}
              value={promotionOptions.find(option => option.value === Promotion)}
              onChange={selectedOption => setPromotion(selectedOption.value)}
              required
            />
          </div>
          {/* Dropdown for Year of the project */}
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Year of the project:</span>
            <Select
              options={[
                { value: 2021, label: "2021" },
                { value: 2022, label: "2022" },
                { value: 2023, label: "2023" },
                { value: 2024, label: "2024" },
                { value: 2025, label: "2025" },
              ]}
              value={Annee ? { value: Annee, label: Annee } : null}
              onChange={(selectedOption) => setAnnee(selectedOption.value)}
              required
            />
          </div>

          {/* Dropdown for College Year */}
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select college year:</span>
            <Select
              options={[
                { value: "1ère année", label: "1ère année" },
                { value: "2ème année", label: "2ème année" },
                { value: "3ème année", label: "3ème année" },
                { value: "4ème année", label: "4ème année" },
                { value: "5ème année", label: "5ème année" },
              ]}
              value={Annee_etude ? { value: Annee_etude, label: Annee_etude } : null}
              onChange={(selectedOption) => setAnnee_etude(selectedOption.value)}
              required
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
