import axios from 'axios'
import Main1stage from '../Main1stage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css"
import { useSearchParams } from 'react-router-dom'
import addDays from "react-datepicker"
import fileTypeChecker from "file-type-checker"
import { useStateManager } from 'react-select'
import { Container, Form, FormGroup } from 'react-bootstrap'
import Select from 'react-select';
import AddStagestagiaire from '../Add forms/Add_stagestagiaire'
import { Modal } from 'react-bootstrap';
import ModifyStagestagiaire from './Modify_stagestagiaire'
import DeleteStagestagiaire from './Delete_stagestagiaire'
function UpdateProject() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [fileval, setfileval] = useState(true);
  const [filesliced, setfilesliced] = useState(null);
  const [browsefile, setbrowsefile] = useState(null);
  const [Date_register, setDate_register] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [mainSupervisor, setMainSupervisor] = useState(null);
  const [otherSupervisors, setOtherSupervisors] = useState([]);
  const [adminEntryId, setAdminEntryId] = useState(null);
  const [existingOtherIds, setExistingOtherIds] = useState([]);
  const[SujetPris,setsujetPris]=useState(false)
  
  const [formData, setformData] = useState({
    id: 0,
    Domain: "",
    Title: "",
    Speciality: "",
    is_taken: false,
    PDF_subject: null,
    Date_register: "",
    Supervisers: [],
  });

  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const stageid = searchparams.get('stage');

  async function fillProjectData() {
    await axios.get(`http://localhost:8000/api/Stages/?id__icontains=${stageid}`)
      .then(res => {
        const projectData = res.data.results[0];
        setsujetPris(projectData.is_taken)
        setformData({
          id: projectData.id,
          Domain: projectData.Domain,
          Title: projectData.Title,
          Speciality: projectData.Speciality,
          is_taken: projectData.is_taken,
          PDF_subject: projectData.PDF_subject,
          Date_register: projectData.Date_register,
        });

        // Update filesliced with the file name from the URL
        const fileParts = projectData.PDF_subject.split('/');
        setfilesliced(fileParts[fileParts.length - 1]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => { fillProjectData() }, []);

  function handleChecked(e) {
    setformData(prevData => ({ ...prevData, is_taken: e.target.checked }));
  }

  function handle_date(e) {
    setformData(prevData => ({ ...prevData, Date_register: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();

    let updatedata = new FormData();

    if (fileval !== true) {
      alert("Invalid file type");
      navigate("/Stage");
      return;
    }

    // Only send new file if user uploaded one
    if (browsefile) {
      updatedata.append('PDF_subject', browsefile);
    }

    if (!formData.Date_register) {
      alert("Please select a valid date.");
      return;
    }

    updatedata.append('Title', formData.Title);
    updatedata.append('Domain', formData.Domain);
    updatedata.append('Speciality', formData.Speciality);
    updatedata.append('is_taken', formData.is_taken);
    updatedata.append('Date_register', formData.Date_register);

    axios.patch(`http://localhost:8000/api/Stages/${formData.id}/`, updatedata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(res => {
        console.log("success")
        setsujetPris(formData.is_taken)
      })
      .catch(error => {
        console.log(error);
      });
  }


  function handle_files(e) {
    try {
      let file = e.target.files[0];
      console.log("file:", file);
      const reader = new FileReader();
      reader.onload = () => {
        const detectedFile = fileTypeChecker.detectFile(reader.result);
        console.log(detectedFile);
        if (detectedFile.mimeType === "application/pdf") {
          setbrowsefile(e.target.files[0]);
          setfileval(true);
        } else {
          alert("Only PDF are allowed");
          setfileval(false);
          file = null;
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error: ", err.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [stageid]);
  const fetchData = async () => {
    try {
      const [allSupRes, stageSupRes] = await Promise.all([
        axios.get('http://localhost:8000/api/Supervisers/'),
        axios.get(`http://localhost:8000/api/supstage/?project_id=${stageid}`)
      ]);

      const allSupervisors = allSupRes.data.results.map(s => ({
        value: s.id,
        label: `${s.first_name} ${s.last_name}`,
        id_member: s.Id_Membre,
      }));

      setSupervisors(allSupervisors);

      const main = stageSupRes.data.results.find(s => s.Role === 'Admin');
      const others = stageSupRes.data.results.filter(s => s.Role === 'Other');

      setMainSupervisor(
        main ? { value: main.supervisor_id, label: main.supervisor_name } : null
      );
      setAdminEntryId(main?.id || null);

      setOtherSupervisors(
        others.map(s => ({
          value: s.supervisor_id,
          label: s.supervisor_name
        }))
      );
      setExistingOtherIds(others.map(s => s.id));

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
useEffect(()=>{
  fillProjectData()
},[showModal===false,showModal3===false])
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update or create main supervisor
      if (mainSupervisor) {
        if (adminEntryId) {
          await axios.put(`http://localhost:8000/api/supstage/${adminEntryId}/`, {
            project_id: stageid,
            supervisor_id: mainSupervisor.value,
            Role: 'Admin',
          });
        } else {
          const res = await axios.post('http://localhost:8000/api/supstage/', {
            project_id: stageid,
            supervisor_id: mainSupervisor.value,
            Role: 'Admin',
          });
          setAdminEntryId(res.data.id);
        }
      }

      // Update or create other supervisors
      for (let i = 0; i < otherSupervisors.length; i++) {
        const supervisor = otherSupervisors[i];

        if (existingOtherIds[i]) {
          await axios.put(`http://localhost:8000/api/supstage/${existingOtherIds[i]}/`, {
            project_id: stageid,
            supervisor_id: supervisor.value,
            Role: 'Other',
          });
        } else {
          const res = await axios.post('http://localhost:8000/api/supstage/', {
            project_id: stageid,
            supervisor_id: supervisor.value,
            Role: 'Other',
          });
          existingOtherIds[i] = res.data.id;
        }
      }

      // Delete supervisors that are removed
      const selectedIds = otherSupervisors.map(s => s.value);
      for (let i = 0; i < existingOtherIds.length; i++) {
        const id = existingOtherIds[i];
        const supValue = otherSupervisors[i]?.value;
        if (!selectedIds.includes(supValue)) {
          await axios.delete(`http://localhost:8000/api/supstage/${id}/`);
        }
      }

      alert('Supervisors updated successfully!');
      fetchData(); // Refresh data after submit

    } catch (err) {
      console.error('Error updating supervisors:', err.response?.data || err);
      alert('Error while updating supervisors.');
    }
  };
function handleupdatesuject_pris(){
  setsujetPris(true)
  console.log("handleupdate")
}
useEffect(()=>{
  console.log(SujetPris)
},[SujetPris])
  return (
    <Container>
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      gap: "2rem",
      marginTop: "2rem",
    }}
  >
    {/* Modify Project Box - 500px width */}
    <div
      className="Add-modify"
      style={{
        width: "500px",
        backgroundColor: "#76ABDD",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-center text-white">Modify Project</h2>
      <Form className="d-flex flex-column justify-content-center align-items-center">
        <Main1stage
          name="Title"
          id="title"
          label="Title"
          type="text"
          value={formData.Title}
          onChange={(e) => setformData({ ...formData, Title: e.target.value })}
          required
        />
        <Main1stage
          name="Domain"
          id="Domain"
          label="Domain"
          type="text"
          value={formData.Domain}
          onChange={(e) => setformData({ ...formData, Domain: e.target.value })}
          required
        />
        <Main1stage
          name="Speciality"
          id="speciality"
          label="Speciality"
          type="text"
          value={formData.Speciality}
          onChange={(e) => setformData({ ...formData, Speciality: e.target.value })}
          required
        />
        <Main1stage
          name2={formData.PDF_subject}
          id2="PDF_subject"
          label="PDF of Project"
          type2="text"
          value2={filesliced}
          required
          readonly="readOnly"
          linkto={formData.PDF_subject}
          browse_edit="1"
          name1="New PDF_subject"
          id1="New_PDF_subject"
          type1="file"
          onChange={handle_files}
          accept="application/pdf"
        />
        <Main1stage
          name="project-taken"
          id="project-taken"
          checkbox="-input"
          label="Project is taken"
          checked={formData.is_taken}
          type="checkbox"
          required
          onChange={handleChecked}
        />
        <Main1stage
          name="Date_register"
          id="st_date"
          label="Date_register"
          type="date"
          value={formData.Date_register}
          onChange={handle_date}
          min="2024-07-25"
        />
        <Form.Group style={{ padding: "1rem" }}>
          <Form.Control
            className="btn btn-warning"
            value="Modify Project"
            readOnly
            onClick={submit}
            style={{
            
              color: "white",
              borderRadius: "4px",
              padding: "0.75rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          />
        </Form.Group>
      </Form>
    </div>

  
    <div
    
      
    >
      <div
       style={{
        width: "500px",
        height:"400px",
        backgroundColor: "#76ABDD",
        borderRadius: "8px",
        padding:"50px",
       margin:"0px"
      }}>

      
      
      <form onSubmit={handleSubmit}>
      <h4 className="mb-4 text-center text-white">
        Update Project Supervisors
      </h4>
        <div className="mb-4">
          <label>Main Supervisor:</label>
          <Select
            options={supervisors.filter((s) => s.id_member !== null)} // only member supervisors
            value={mainSupervisor}
            onChange={setMainSupervisor}
            isClearable
            placeholder="Select main supervisor"
            className="form-control"
          />
        </div>

        <div className="mb-4">
          <label>Other Supervisors:</label>
          <Select
            options={supervisors}
            value={otherSupervisors}
            onChange={setOtherSupervisors}
            isMulti
            placeholder="Select additional supervisors"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          className="btn btn-warning"
          style={{
            width: "150px",
            backgroundColor: "#ffbb33",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "4px",
            alignItems:"center",
            cursor: "pointer",
            margin:"0 30%"
          }}
        >
          Save
        </button>
      </form>
      </div>
      <div
 
    style={{
      display: "flex",
      justifyContent: "center", // Center align the action buttons
      marginTop: "1rem",
      backgroundColor:"#76ABDD",
      width:"500px",
      height:"200px",
      flexDirection:"column",
   
      alignItems:"center"
    }}
  >
    <button
      className="btn btn-warning mb-2"
      style={{
        width: "250px",
     
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0.75rem",
        cursor: "pointer",
      }}
      onClick={() => setShowModal(true)}
    >
      Add  New Intern 
    </button>
    <button
      className="btn btn-warning mb-2"
      style={{
        width: "250px",
        
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0.75rem",
        cursor: "pointer",
      }}
      disabled={SujetPris===false}
      onClick={() => setShowModal2(true)}
    >
      Modify existing Intern
    </button>
    <button
      className="btn btn-danger"
      style={{
        width: "250px",
        
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0.75rem",
        cursor: "pointer",
      }}
      disabled={SujetPris===false}
      onClick={() => setShowModal3(true)}
    >
      Delete existing Intern
    </button>
  </div>
  <div
    style={{display: "flex",
    justifyContent: "center", 
  alignItems:"center"
  }}
  >
  <button
      className="btn btn-warning"
      style={{
        width: "250px",
        
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "4px",
        padding: "0.75rem",
        cursor: "pointer",
     
      }}
      onClick={()=>{
        navigate('/admin-dashboard/Stage')
      }}
    >
      Finish
    </button></div>
  </div>
    </div>

    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <AddStagestagiaire
        projectid={stageid}
          onSupervisorAdded={handleupdatesuject_pris}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <Modal show={showModal2} onHide={() => setShowModal2(false)} size="lg">
        <ModifyStagestagiaire
        
          onCancel={() => setShowModal2(false)}
        />
      </Modal>
  {/* Action Buttons */}
  
  <Modal show={showModal3} onHide={() => setShowModal3(false)} size="lg">
        <DeleteStagestagiaire
        
          onCancel={() => setShowModal3(false)}
        />
      </Modal>
</Container>

  );
}
export default UpdateProject