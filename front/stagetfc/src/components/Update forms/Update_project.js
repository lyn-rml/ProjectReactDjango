import axios from 'axios'
import Main1stage from '../Main1stage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css"
import { useSearchParams } from 'react-router-dom'
import addDays from "react-datepicker"
import fileTypeChecker from "file-type-checker"
import { useStateManager } from 'react-select'
import { Form, FormGroup } from 'react-bootstrap'
function UpdateProject() {
  const [fileval, setfileval] = useState(true);
  const [filesliced, setfilesliced] = useState(null);
  const [browsefile, setbrowsefile] = useState(null);
  const [Date_register, setDate_register] = useState(null);

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
      navigate(`/admin-dashboard/Modify-project-supervisers?stage=${stageid}&sujet_pris=${formData.is_taken}`);
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
  
  return (
    <div className="Add-modify">
      <h1 style={{ color: "transparent" }}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
      <div className="Add-modify-container">
        <h2 className="text-center text-white">Modify project</h2>
        <Form className="d-flex flex-column justify-content-center  align-items-center">
          <Main1stage name="Title" id="title" label="Title" type="text" value={formData.Title} onChange={e => setformData({ ...formData, Title: e.target.value })} required />
          <Main1stage name="Domain" id="Domain" label="Domain" type="text" value={formData.Domain} onChange={e => setformData({ ...formData, Domain: e.target.value })} required />
          <Main1stage name="Speciality" id="speciality" label="Speciality" type="text" value={formData.Speciality} onChange={e => setformData({ ...formData, Speciality: e.target.value })} required />
          
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
            <Form.Control className="add-btn" value="Modify Project" readOnly onClick={submit} />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
export default UpdateProject