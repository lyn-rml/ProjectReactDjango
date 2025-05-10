import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fileTypeChecker from 'file-type-checker';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Select from 'react-select';
import { Modal } from 'react-bootstrap';
import AddSuperviserFromAddProject from './Add-superviser-fromAddProject';
function AddProject() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [fileValid, setFileValid] = useState(false);
  const [browseFile, setBrowseFile] = useState(null);
  const [registerDate, setRegisterDate] = useState(new Date());
  const [initialoptions, setinitialoptions] = useState([]);
  const [singleoptions, setsingleoptions] = useState([]);
  const [multioptions, setmultioptions] = useState([]);
  const [idProject, setIdProject] = useState([])
  const [singleselectedoption, setsingleselectedoption] = useState(null);
  const [multiselectedoptions, setmultiselectedoptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [supervisorInfo, setSupervisorInfo] = useState(null);
  const [openPlacementModal, setOpenPlacementModal] = useState(false);

  const handleAddSupervisor = (id, isMember) => {
    console.log('Supervisor ID:', id);
    console.log('Is Member:', isMember);
    setSupervisorInfo({ id, isMember });
    setShowModal(true); // IMPORTANT: show the modal
    // Now you can use the ID and isMember where you want
  };
  const [formData, setFormData] = useState({
    id: 0,
    Domain: "",
    Title: "",
    Speciality: "",
    is_taken: false,
    PDF_subject: null,
    Date_register: "",
  });
const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      if (detectedFile.mimeType === "application/pdf") {
        setBrowseFile(file);
        setFileValid(true);
      } else {
        alert("Only PDF files are allowed.");
        setFileValid(false);
        setBrowseFile(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDateChange = (date) => {
    setRegisterDate(date);
  };
  const validate = () => {
    const newErrors = {};
    const lettersOnly = /^[A-Za-z\s]+$/;

    if (!formData.Title || !lettersOnly.test(formData.Title)) {
      newErrors.Title = "Title is required and must contain only letters.";
    }

    if (!formData.Domain || !lettersOnly.test(formData.Domain)) {
      newErrors.Domain = "Domain is required and must contain only letters.";
    }

    if (!formData.Speciality || !lettersOnly.test(formData.Speciality)) {
      newErrors.Speciality = "Speciality is required and must contain only letters.";
    }

    

    if (!registerDate) {
      newErrors.RegisterDate = "Register date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const checkIfAdminSupervisorSelected = async () => {
  // Check if main supervisor is admin
  if (singleselectedoption) {
   return true
  }
else{
 return false;
}
 
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Check all validations
  const isValid = validate();

  if (!isValid) {
    console.log("Validation failed.");
    return;
  }

  if (!fileValid) {
    alert("Invalid file type. Please upload a PDF.");
    return;
  }

  if (!registerDate || !formData.Title || !formData.Domain || !formData.Speciality) {
    alert("Please fill all required fields.");
    return;
  }
 // ✅ Ensure admin supervisor is selected
  const hasAdminSupervisor = await checkIfAdminSupervisorSelected();
  if (!hasAdminSupervisor) {
    alert("You must add at least one admin supervisor before submitting.");
    return;
  }
  try {
    // 🔍 Get the latest stage ID (optional logic)
    const res = await axios.get('http://localhost:8000/api/Stages/');
  

    // 📦 Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append("Domain", formData.Domain);
    formDataToSend.append("Title", formData.Title);
    formDataToSend.append("Speciality", formData.Speciality);
    formDataToSend.append("Sujet_pris", formData.Sujet_pris);
    formDataToSend.append("Date_register", registerDate.toISOString().split('T')[0]);
    formDataToSend.append("PDF_subject", browseFile);

    // 🚀 Submit to backend
    const postRes = await axios.post('http://localhost:8000/api/Stages/', formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    console.log("Project added successfully:", postRes.data);

   const idProject = postRes.data.id;

    if (!idProject) {
      alert("Erreur : idProject introuvable.");
      return;
    }
return idProject;
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred while submitting the form.");
  }
};




  const [formDatasupper, setformDatasupper] = useState({
    stage: 0,
    superviser: 0,
    superviser_name: '',
    is_admin: false,
  });

  const [formdatasup, Setformdatasup] = useState({
    Nom: '',
    Prenom: '',
    Telephone: '',
    Email: '',
    Profession: '',
    Id_Membre: '',
  });
  async function handleChangesingle(selectedOption) {
    const info = (await axios.get(`http://localhost:8000/api/Membres/${selectedOption.value}/`)).data
    setsingleselectedoption(selectedOption);
    ensureMemberIsSupervisor(info.id, selectedOption.onlymembre);
    updateDropdownOptions(selectedOption, multiselectedoptions);

  }


  async function handleChangemulti(selectedOption) {
    const newSelected = selectedOption || [];
    setmultiselectedoptions(newSelected);

    for (const sel of newSelected) {
      if (sel.onlymembre === true) {
        await ensureMemberIsSupervisor(sel.value, sel.onlymembre);
      }
    }
    updateDropdownOptions(singleselectedoption, newSelected);

  }

  function updateDropdownOptions(singleSelected, multiSelected) {
    const filteredMulti = initialoptions.filter(opt =>
      (!singleSelected || opt.value !== singleSelected.value) &&
      !multiSelected.some(sel => sel.value === opt.value)
    );
    const filteredSingle = initialoptions.filter(opt =>
      opt.id_member !== 0 &&
      (!singleSelected || opt.value !== singleSelected.value) &&
      !multiSelected.some(sel => sel.value === opt.value)
    );
    setmultioptions(filteredMulti);
    setsingleoptions(filteredSingle);
  }

  async function fillSupervisers() {
    try {
      // Fetch all members who are also supervisors
      const membersResSupervisors = await axios.get('http://localhost:8000/api/Membres/members_as_supervisor/');
      const membersDataSupervisors = membersResSupervisors.data;

      // Check if the fetched data is an array
      const MembersSup = Array.isArray(membersDataSupervisors)
        ? membersDataSupervisors.map(m => ({
          value: m.id,
          label: `${m.first_name} ${m.last_name}`,
          ismember: true,  // This is a member and a supervisor
          onlymembre: false
        }))
        : [];

      // Fetch all members who are not supervisors
      const membersResNotSupervisors = await axios.get('http://localhost:8000/api/Membres/members_not_supervisor/');
      const membersDataNotSupervisors = membersResNotSupervisors.data;

      // Check if the fetched data is an array
      const OnlyMembers = Array.isArray(membersDataNotSupervisors)
        ? membersDataNotSupervisors.map(m => ({
          value: m.id,
          label: `${m.first_name} ${m.last_name}`,
          ismember: true,  // These are members but not supervisors
          onlymembre: true
        }))
        : [];

      // Fetch all supervisors who are not members (from the supervisors endpoint)
      const supervisorsRes = await axios.get('http://localhost:8000/api/Supervisers/?no_member=true');
      const supervisorsData = supervisorsRes.data.results;

      // Add the supervisors to the list
      const AllSupervisors = supervisorsData.map(s => ({
        value: s.id,
        label: `${s.first_name} ${s.last_name}`,
        ismember: false,  // These are supervisors, not members
        onlymembre: false
      }));

      // Combine all options for the Main Dropdown (Single Selection)
      const mainDropdownOptions = [...MembersSup, ...OnlyMembers];

      // Combine all options for the Additional Dropdown (Multiple Selection)
      const multiDropdownOptions = [...MembersSup, ...OnlyMembers, ...AllSupervisors];

      console.log('Main Dropdown Options:', mainDropdownOptions);
      console.log('Multi Dropdown Options:', multiDropdownOptions);

      // Set the options for the dropdowns
      setinitialoptions(mainDropdownOptions);  // For the main dropdown
      setmultioptions(multiDropdownOptions);   // For the multi-selection dropdown
      setsingleoptions(mainDropdownOptions);   // For the main dropdown as well

    } catch (error) {
      console.error('Error fetching supervisors or members:', error);
    }
  }



  useEffect(() => {

    fillSupervisers();


  }, []);
  const [readyToAutoSelect, setReadyToAutoSelect] = useState(false);

  useEffect(() => {
    if (!readyToAutoSelect || !supervisorInfo) return;

    console.log('Supervisor Info:', supervisorInfo);

    if (supervisorInfo.isMember === false) {
      const foundOption = multioptions.find(opt => opt.value === supervisorInfo.id);
      if (foundOption) {
        console.log("found non-member supervisor");
        setmultiselectedoptions(prev => [...prev, foundOption]);
      }
    } else if (supervisorInfo.isMember === true) {
      const foundOption = multioptions.find(opt => opt.value === supervisorInfo.id);
      if (singleselectedoption) {
        if (foundOption) {
          console.log("found member as supervisor, added to multi");
          setmultiselectedoptions(prev => [...prev, foundOption]);
        }
      } else {
        setOpenPlacementModal(true);
      }
    }

    setReadyToAutoSelect(false); // reset for future updates

  }, [multioptions, readyToAutoSelect, supervisorInfo, singleselectedoption]);
  useEffect(() => {
    if (supervisorInfo) {
      fillSupervisers().then(() => {
        setReadyToAutoSelect(true); // trigger next effect
      });
    }
  }, [supervisorInfo]);
  async function ensureMemberIsSupervisor(memberId, onlymembre) {
    try {
      console.log('function ensureMembre', memberId);

      const res = await axios.get(`http://localhost:8000/api/Membres/${memberId}/`);
      const memberData = res.data;

      if (memberData.is_superviser === false && onlymembre === true) {
        // onlymembre === true means we need to upgrade him to Supervisor
        await axios.post('http://localhost:8000/api/Supervisers/create_supervisor_from_member/', {
          member_id: memberId,
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          phone_number:memberData.phone_number,
          email:memberData.email,
          profession: memberData.profession
        });

        console.log('Member upgraded to Supervisor successfully.');
      } else {
        console.log('Member already a supervisor or not only member.');
      }
    } catch (error) {
      console.error('Error in ensureMemberIsSupervisor:', error.response ? error.response.data : error);
    }
  }

  async function submitSupervisors(projectId) {
    try {
      // 🔥 First, send the single selected supervisor as "Admin"
      console.log('add sup',projectId)
      if (singleselectedoption) {
        const adminPayload = {
          supervisor_id: singleselectedoption.value,
          project_id: projectId,
          Role: "Admin",
        };
        await axios.post('http://localhost:8000/api/supstage/', adminPayload);
        console.log("Admin supervisor added:", adminPayload);
      }

      // 🔥 Then, send all multi-selected supervisors as "Other"
      for (const sup of multiselectedoptions) {
        const otherPayload = {
          supervisor_id: sup.value,
          project_id: projectId,
          Role: "Other",
        };
        await axios.post('http://localhost:8000/api/supstage/', otherPayload);
        console.log("Other supervisor added:", otherPayload);
      }

      console.log("All supervisors submitted successfully!");
      navigate("/admin-dashboard/Stage")
    } catch (error) {
      console.error("Error submitting supervisors:", error);
    }
  }
  const handlePlaceInSingle = () => {
    const foundOption = initialoptions.find(opt => opt.value === supervisorInfo.id);
    if (foundOption) {
      setsingleselectedoption(foundOption);
    }
    setOpenPlacementModal(false);
  };

  const handlePlaceInMulti = () => {
    const foundOption = multioptions.find(opt => opt.value === supervisorInfo.id);
    if (foundOption) {
      setmultiselectedoptions(prev => [...prev, foundOption]);
    }
    setOpenPlacementModal(false);
  };

  async function FinishSubmit(e) {
    e.preventDefault()
  console.log("submitttttttttt")
    // handleSubmit doit être une fonction async qui retourne l'idProject (ou met à jour un state avec celui-ci)
    const id = await handleSubmit(e);
  console.log('IDDDD',id)
    if (id) {
      submitSupervisors(id);
    } else {
      console.error("Échec de la soumission : idProject introuvable.");
    }
  }
  return (
    <Container className="Add-modify">
      <Form  className="Add-modify-container">
        <Row>
          {/* Project Details Form */}
           <Col md={6}>
      <form onSubmit={handleSubmit} className="Add-modify-container">
        <div className="text-center title-add-modify">
          <h3>Project Details</h3>
        </div>
        <Card.Body>
          <Form.Group className="mb-3 text-center">
            <Form.Label className="text-white">Title</Form.Label>
            <Form.Control
              type="text"
              name="Title"
              value={formData.Title}
              onChange={handleInputChange}
              placeholder="Project title (letters only)"
            />
            <small className="text-muted">Enter the project title using letters only.</small>
            {errors.Title && <div className="text-danger">{errors.Title}</div>}
          </Form.Group>

          <Form.Group className="mb-3 text-center">
            <Form.Label className="text-white">Domain</Form.Label>
            <Form.Control
              type="text"
              name="Domain"
              value={formData.Domain}
              onChange={handleInputChange}
              placeholder="Domain (letters only)"
            />
            <small className="text-muted">Specify the domain of the project.</small>
            {errors.Domain && <div className="text-danger">{errors.Domain}</div>}
          </Form.Group>

          <Form.Group className="mb-3 text-center">
            <Form.Label className="text-white">Speciality</Form.Label>
            <Form.Control
              type="text"
              name="Speciality"
              value={formData.Speciality}
              onChange={handleInputChange}
              placeholder="Speciality (letters only)"
            />
            <small className="text-muted">Specialization related to the project.</small>
            {errors.Speciality && <div className="text-danger">{errors.Speciality}</div>}
          </Form.Group>

          <Form.Group className="mb-3 text-center">
            <Form.Label className="text-white">PDF of Project</Form.Label>
            <Form.Control
              type="file"
              name="PDF_subject"
              onChange={handleFileChange}
              accept="application/pdf"
            />
            <small className="text-muted">Upload the project document in PDF format.</small>
            {errors.PDF_subject && <div className="text-danger">{errors.PDF_subject}</div>}
          </Form.Group>

          <Form.Group className="mb-3 text-center">
            <Form.Label className="text-white" style={{ display: 'block' }}>
              Register Date
            </Form.Label>
            <DatePicker
              selected={registerDate}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              minDate={new Date()}
              className="form-control"
            />
            <small className="text-muted" style={{display:"block"}}>Choose the date of registration.</small>
            {errors.RegisterDate && <div className="text-danger">{errors.RegisterDate}</div>}
          </Form.Group>

          
        </Card.Body>
      </form>
    </Col>

          {/* Supervisor Details Form */}
          <Col md={6}>
            <div className="mb-4 " style={{margin:"20px"}}>
              <div >
                <div className="" >
                  <div className="top-add-modify">
                    <h2 className="title-add-modify">Add Supervisor</h2>
                  </div>
                  <div >
                    <div className="form-group">
                      <span style={{ color: 'white' }}>
                        Select Main Supervisor:
                      </span>
                      <Select
                        options={singleoptions}
                        value={singleselectedoption}
                        onChange={(selectedOption) => {
                          handleChangesingle(selectedOption);
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <span style={{ color: 'white' }}>
                        Select Other Supervisors:
                      </span>
                      <Select
                        options={multioptions}
                        value={multiselectedoptions}
                        onChange={handleChangemulti}
                        isMulti
                      />
                    </div>
                    <div className="form-group">
                      <span style={{ color: 'white', display: 'block' , textAlign:'center' }}>
                        Add other Supervisor:
                      </span>
                      <div style={{display:"flex",justifyContent:"center"}}>
                      <input
                        type="button"
                        className="btn btn-warning"
                        style={{ width: "150px" }}
                        value="Add Supervisors"
                        onClick={() => setShowModal(true)}
                      />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="text-center mb-4">
          <Button type="submit" className="btn btn-warning" style={{ width: "200px" }} onClick={(e) => FinishSubmit(e)} 
          >
            Finish Submission
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <AddSuperviserFromAddProject
          onSupervisorAdded={handleAddSupervisor}
          onCancel={() => setShowModal(false)}
        />
      </Modal>


      {openPlacementModal && (
        <Modal show={openPlacementModal} onHide={() => setOpenPlacementModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Choose the supervisor’s position</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>Would you like to add this supervisor as the main one or as an additional one?</p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                onClick={handlePlaceInSingle}
                style={{
                  backgroundColor: '#FFD740',
                  color: '#000',
                  border: 'none',
                  padding: '10px 30px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                }}
              >
                Main
              </Button>
              <Button
                onClick={handlePlaceInMulti}
                style={{
                  backgroundColor: '#FFD740',
                  color: '#000',
                  border: 'none',
                  padding: '10px 30px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                }}
              >
                other
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </Container>

  );
}

export default AddProject;
