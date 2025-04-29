import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fileTypeChecker from 'file-type-checker';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Select from 'react-select';
import { Modal} from 'react-bootstrap';
import AddSuperviserFromAddProject from './Add-superviser-fromAddProject';
function AddProject() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [fileValid, setFileValid] = useState(false);
    const [browseFile, setBrowseFile] = useState(null);
    const [registerDate, setRegisterDate] = useState(new Date());
    const [step, setStep] = useState(1);
    const [initialoptions, setinitialoptions] = useState([]);
    const [singleoptions, setsingleoptions] = useState([]);
    const [multioptions, setmultioptions] = useState([]);
const [idProject,setIdProject]=useState([])
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fileValid) {
            alert("Invalid file type. Please upload a PDF.");
            return;
        }

        if (!registerDate || !formData.Title || !formData.Domain || !formData.Speciality) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const res = await axios.get('http://localhost:8000/api/Stages/');
            const lastId = Array.isArray(res.data.results)
                ? res.data.results.reduce((max, stage) => Math.max(max, stage.id), 0)
                : 0;

            const formDataToSend = new FormData();
            formDataToSend.append("Domain", formData.Domain);
            formDataToSend.append("Title", formData.Title);
            formDataToSend.append("Speciality", formData.Speciality);
            formDataToSend.append("Sujet_pris", formData.Sujet_pris);
            formDataToSend.append("Date_register", registerDate.toISOString().split('T')[0]);
            formDataToSend.append("PDF_subject", browseFile);

            const postRes = await axios.post('http://localhost:8000/api/Stages/', formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("Project added successfully:", postRes.data);

            if (postRes.data.id) {
                setStep(2); // Move to next step
                setIdProject(postRes.data.id)
            } else {
                console.error("No ID returned from API.");
            }
        } catch (error) {
            console.error("Error:", error);
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
        if (step === 2) {
            fillSupervisers();
        }

    }, [step]);
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
                    member_id: memberId
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

    return (
        <Container className="Add-modify">
        <Row>
          {/* Project Details Form */}
          <Col md={6}>
            <div className="Add-modify-container">
              <div className="text-center title-add-modify">
                <h3>Project Details</h3>
              </div>
              <Card.Body>
                <Form onSubmit={handleSubmit} className="form-add-modify">
                  <Form.Group className="mb-3 text-center">
                    <Form.Label className="text-white">Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="Title"
                      value={formData.Title}
                      onChange={handleInputChange}
                      required
                      disabled={step === 2}
                      placeholder="Title"
                      style={{ width: '300px' }}
                    />
                  </Form.Group>
  
                  <Form.Group className="mb-3 text-center">
                    <Form.Label className="text-white">Domain</Form.Label>
                    <Form.Control
                      type="text"
                      name="Domain"
                      value={formData.Domain}
                      onChange={handleInputChange}
                      required
                      disabled={step === 2}
                      placeholder="Domain"
                      style={{ width: '300px' }}
                    />
                  </Form.Group>
  
                  <Form.Group className="mb-3 text-center">
                    <Form.Label className="text-white">Speciality</Form.Label>
                    <Form.Control
                      type="text"
                      name="Speciality"
                      value={formData.Speciality}
                      onChange={handleInputChange}
                      required
                      disabled={step === 2}
                      placeholder="Speciality"
                      style={{ width: '300px' }}
                    />
                  </Form.Group>
  
                  <Form.Group className="mb-3 text-center">
                    <Form.Label className="text-white">PDF of Project</Form.Label>
                    <Form.Control
                      type="file"
                      name="PDF_subject"
                      onChange={handleFileChange}
                      accept="application/pdf"
                      required
                      disabled={step === 2}
                      style={{ width: '300px' }}
                    />
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
                      disabled={step === 2}
                      className="form-control"
                      required
                    />
                  </Form.Group>
  
                  {step === 1 && (
                    <Button  type="submit" className="btn btn-warning" style={{width:"150px"}}>
                      Next Step:<br></br> Add Supervisor
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </div>
          </Col>
  
          {/* Supervisor Details Form */}
          <Col md={6}>
            <div className="mb-4 Add-modify-container">
              <div className="Add-modify">
                <div className="Add-modify-container">
                  <div className="top-add-modify">
                    <h2 className="title-add-modify">Add Supervisor</h2>
                  </div>
                  <form method="post" className="form-add-modify" encType="multipart/form-data">
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
                        isDisabled={step === 1}
                      />
                    </div>
                    <div className="form-group ">
                      <span style={{ color: 'white' }}>
                        Select Other Supervisors:
                      </span>
                      <Select
                        options={multioptions}
                        value={multiselectedoptions}
                        onChange={handleChangemulti}
                        isMulti
                        isDisabled={step === 1}
                      />
                    </div>
                    <div className="form-group ">
                      <span style={{ color: 'white' , display:"block"}}>
                        Add other Supervisor:
                      </span>
                      <input
                        type="button"
                        className=" btn btn-warning" style={{width:"150px"}}
                        value="Add Supervisors"
                        onClick={() => setShowModal(true)}
                        disabled={step === 1}
                      />
                    </div>
                    <div className="form-group" style={{ padding: '1rem' }}>
                      <input
                        type="button"
                        className="btn btn-warning" style={{width:"150px"}}
                        value="Finish"
                        onClick={() => {
                          submitSupervisors(idProject);
                        }}
                        disabled={step === 1}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Col>
        </Row>
  
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
