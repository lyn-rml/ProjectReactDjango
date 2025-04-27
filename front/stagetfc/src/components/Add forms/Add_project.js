import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fileTypeChecker from 'file-type-checker';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import Select from 'react-select';
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

        // Filter multioptions to exclude the selected main
        const filteredMulti = initialoptions.filter(opt => opt.value !== selectedOption.value);
        setmultioptions(filteredMulti);

        // Filter singleoptions to exclude selected main + already selected multi
        const updatedSingleOptions = initialoptions
            .filter(opt => opt.id_member !== 0)
            .filter(opt => opt.value !== selectedOption.value)
            .filter(opt => !multiselectedoptions.some(sel => sel.value === opt.value));

        setsingleoptions(updatedSingleOptions);
    }


    async function handleChangemulti(selectedOption) {
        const newSelected = selectedOption || [];
        setmultiselectedoptions(newSelected);
    
        // 🔥 Check if any selected option is "onlymembre"
        for (const sel of newSelected) {
            if (sel.onlymembre === true) {
                await ensureMemberIsSupervisor(sel.value, sel.onlymembre);
                // After upgrading the member to supervisor, you might want to refresh your options from backend if needed
            }
        }
    
        // ✅ Now continue your normal filtering
        let filtered = initialoptions;
        newSelected.forEach((sel) => {
            filtered = filtered.filter((opt) => opt.value !== sel.value);
        });
        setmultioptions(filtered);
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
    const handleRedirectToAddSupervisor = () => {
        navigate(`/admin-dashboard/Add-superviser-fromAddProject?id=${idProject}`);
      };

    return (
        <div className="Add-modify">
            <Row>
                {/* Project Details Form */}
                <Col md={6}>
                    <div className="Add-modify-container">
                        <div className="text-center title-add-modify">
                            <h3>Project Details</h3>
                        </div>
                        <Card.Body>
                            <Form onSubmit={handleSubmit} className='form-add-modify'>
                                <Form.Group className="mb-3 text-center ">
                                    <Form.Label className='text-white'>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Title"
                                        value={formData.Title}
                                        onChange={handleInputChange}
                                        required
                                        disabled={step === 2}
                                        placeholder='Title'

                                        style={{ width: "300px" }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 text-center">
                                    <Form.Label className='text-white'>Domain</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Domain"
                                        value={formData.Domain}
                                        onChange={handleInputChange}
                                        required
                                        disabled={step === 2}
                                        placeholder='Domain'
                                        style={{ width: "300px" }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 text-center">
                                    <Form.Label className='text-white'>Speciality</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Speciality"
                                        value={formData.Speciality}
                                        onChange={handleInputChange}
                                        required
                                        disabled={step === 2}
                                        placeholder='Speciality'
                                        style={{ width: "300px" }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 text-center">
                                    <Form.Label className='text-white'>PDF of Project</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="PDF_subject"
                                        onChange={handleFileChange}
                                        accept="application/pdf"
                                        required
                                        disabled={step === 2}
                                        style={{ width: "300px" }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 text-center">
                                    <Form.Label className='text-white' style={{ display: "block" }}>Register Date</Form.Label>

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

                                <Button variant="primary" type="submit" className="add-btn">
                                    Next Step: Add Supervisor
                                </Button>
                            </Form>
                        </Card.Body>
                    </div>
                </Col>

                {/* Supervisor Details Form - Step 2 */}
                {step === 2 && (
                    <Col md={6}>
                        <div className="mb-4 Add-modify-container">
                            <div className="Add-modify">

                                <div className="Add-modify-container">
                                    <div className="top-add-modify">

                                        <h2 className="title-add-modify">Add Supervisor</h2>

                                    </div>
                                    <form method="post" className="form-add-modify" encType="multipart/form-data">
                                        <div className="form-group add-modif">
                                            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Main Supervisor:</span>
                                            <Select
                                                options={singleoptions}
                                                value={singleselectedoption}
                                                onChange={(selectedOption) => {
                                                    handleChangesingle(selectedOption);

                                                }}
                                                required
                                            />
                                        </div>
                                        <div className="form-group add-modif">
                                            <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Select Other Supervisors:</span>
                                            <Select
                                                options={multioptions}
                                                value={multiselectedoptions}
                                                onChange={handleChangemulti}
                                                isMulti
                                            />
                                        </div>
                                        <div className="form-group add-modif">
                                            <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Add other Supervisor:</span>
                                            <input
                                                type="button"
                                                className="form-control add-btn"
                                                value="Add Supervisors"
                                                onClick={handleRedirectToAddSupervisor}
                                            />
                                        </div>
                                        <div className='form-group' style={{ padding: "1rem" }}>
                                            <input
                                                type="button"
                                                className="form-control add-btn"
                                                value="Finish"
                                                onClick={()=>{submitSupervisors(idProject)}}
                                            />
                                        </div>
                                    </form>


                                </div>
                            </div>
                        </div>
                    </Col>
                )}
            </Row>
        </div>
    );
}

export default AddProject;
