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
    first_name: "",
    last_name: "",
    Father_name: "",
    Date_of_birth: "",
    Place_of_birth: "",
    Adresse: "",
    Blood_type: "",
    Work: "",
    Domaine: "",
    Telephone: "",
    Email: "",
    is_another_association: false,
    association_name: "",
    Application_PDF: null,
    A_paye: false,
  });

  useEffect(() => {
    if (isSupervisor) {
      axios.get(`http://localhost:8000/api/Supervisers/?no_member=true`)
        .then(res => {
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

  async function createMember(e) {
    e.preventDefault();

    if (!fileval) {
      alert("Invalid file type.");
      return;
    }

  


    if (Autre_association && !formData.association_name) {
      alert("Please provide the name of the other association.");
      return;
    }

    if (!datedebut) {
      alert("Please select the date of birth.");
      return;
    }

    const year = datedebut.getFullYear();
    const month = String(datedebut.getMonth() + 1).padStart(2, '0');
    const day = String(datedebut.getDate()).padStart(2, '0');
    const formattedDateOfBirth = `${year}-${month}-${day}`;

    const finalData = new FormData();
    for (const key in formData) {
      finalData.append(key, formData[key]);
    }
    finalData.append("phone_number",formData.Telephone)
    finalData.append("profession","no need")
    finalData.append('email',formData.Email)
    finalData.append("Date_of_birth", formattedDateOfBirth);
    finalData.append("is_another_association", Autre_association);
    finalData.append("Application_PDF", browsefile);
    finalData.append("member_payed", a_paye);
    finalData.append("is_sup", false);

    try {
      const res = await axios.post("http://localhost:8000/api/Membres/", finalData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("New member added successfully!");
      navigate("/Member");

    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong during submission.");
    }
  }
  const year = datedebut.getFullYear();
    const month = String(datedebut.getMonth() + 1).padStart(2, '0');
    const day = String(datedebut.getDate()).padStart(2, '0');
    const formattedDateOfBirth = `${year}-${month}-${day}`;
  const formData2 = {
    Father_name: formData.Father_name,
    Date_of_birth: formattedDateOfBirth,
    Place_of_birth: formData.Place_of_birth,
    Adresse: formData.Adresse,
    Blood_type: formData.Blood_type,
    Work: formData.Work,
    Domaine: formData.Domaine,
    is_another_association: formData.is_another_association,
    association_name: formData.association_name,
};
  const createMemberFromSupervisor = async (e) => {
    e.preventDefault();
    if (!formData2.Father_name  || !formData2.Adresse) {
      alert("Please fill out all required fields.");
      return;
    }
    // Get the form data from the state (assuming formData contains the necessary data)
   

    // Ensure the selectedSupervisorId is set
    if (!selectedSupervisorId) {
        alert("Please select a supervisor.");
        return;
    }

    try {
        // 1. Create the new member from supervisor data
        const postResponse = await axios.post('http://localhost:8000/api/Membres/create_member_from_supervisor/', {
            supervisor_id: selectedSupervisorId, // Pass the selected supervisor ID
            ...formData2 // Spread other form data
        });

        console.log("Create Member Response:", postResponse.data);
        
        const newMemberId = postResponse.data.member_id; // Ensure this field is returned from the backend

        if (!newMemberId) {
            throw new Error("No member ID returned after creating the member.");
        }

        // Optionally, handle other actions, such as updating the UI or redirecting
        alert("Member created successfully! Member ID: " + newMemberId);

    } catch (error) {
        console.error("Error during create member from supervisor:", error);
        alert("An error occurred while creating the member.");
    }
};

  

  async function handleSubmit(e) {
    if (isSupervisor) {
      await createMemberFromSupervisor(e);
    } else {
      await createMember(e);
    }
  }


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
                  <label className="text-white" style={{marginLeft:"300px"}}>Select Supervisor:</label>
                  <select
                    className="form-control px-3 py-2 rounded flex justify-center"
                    style={{maxWidth:"400px",marginLeft:"300px"}}
                    value={selectedSupervisorId || ""}
                    onChange={(e) => setSelectedSupervisorId(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {supervisors.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.first_name} {sup.last_name}
                      </option>
                    ))}
                  </select>
                
                  {/* Centered Additional Info */}
                  <div className="flex justify-center ">
                    <div  className='form-add-modify' >
                      <h1 className="text-white mt-4 text-xl font-semibold">Additional info</h1>
                
                      <Main1stage name="Father_name" label="Father Name" type="text" value={formData.Father_name} onChange={handle} required />
                
                     
                      <div className="form-group add-modif">
                        <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Date of birth:</span>
                        <DatePicker selected={formData2.Date_of_birth} onChange={handle_date1} dateFormat="yyyy-MM-dd" required />
                      </div>
                      
                
                      <div>
                        <Main1stage name="Place_of_birth" label="Place of birth" type="text" value={formData.Place_of_birth} onChange={handle} required />
                      </div>
                
                      <Main1stage name="Adresse" label="Address" type="text" value={formData.Adresse} onChange={handle} required />
                      <Main1stage name="Blood_type" label="Blood Group" type="text" value={formData.Blood_type} onChange={handle} required />
                      <Main1stage name="Work" label="Job" type="text" value={formData.Work} onChange={handle} required />
                      <Main1stage name="Domaine" label="Domain" type="text" value={formData.Domaine} onChange={handle} required />
                
                      <Main1stage
                        name="Autre_association"
                        id="Autre_association"
                        checkbox="-input"
                        label="Other association"
                        checked={formData.is_another_association}
                        type="checkbox"
                        value={formData.is_another_association}
                        onChange={handleChecked_autreassociation}
                      />
                
                      <Main1stage name="association" label="Name of Other Association" type="text" value={formData.association_name} onChange={handle} />
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

                      <Main1stage name="first_name" label="First Name" type="text" value={formData.first_name} onChange={handle} required />
                      <Main1stage name="last_name" label="Last Name" type="text" value={formData.last_name} onChange={handle} required />
                      <Main1stage name="Father_name" label="Father Name" type="text" value={formData.Father_name} onChange={handle} required />
        
                      <div className="form-group add-modif">
                        <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Date of birth:</span>
                        <DatePicker selected={datedebut} onChange={handle_date1} dateFormat="yyyy-MM-dd" required />
                      </div>
        
                      <div>
                        <Main1stage name="Place_of_birth" label="Place of birth" type="text" value={formData.Place_of_birth} onChange={handle} required />
                      </div>
                
                      <Main1stage name="Adresse" label="Address" type="text" value={formData.Adresse} onChange={handle} required />
                      <Main1stage name="Blood_type" label="Blood Group" type="text" value={formData.Blood_type} onChange={handle} required />
                      <Main1stage name="Work" label="Job" type="text" value={formData.Work} onChange={handle} required />
                      <Main1stage name="Domaine" label="Domain" type="text" value={formData.Domaine} onChange={handle} required />
                      <Main1stage name="Telephone" label="Telephone" type="text" value={formData.Telephone} onChange={handle} required />
                      <Main1stage name="Email" label="Email" type="text" value={formData.Email} onChange={handle} required />
              
                      <Main1stage
                        name="Autre_association"
                        id="Autre_association"
                        checkbox="-input"
                        label="Other association"
                        checked={formData.is_another_association}
                        type="checkbox"
                        value={formData.is_another_association}
                        onChange={handleChecked_autreassociation}
                      />
                
                      <Main1stage name="association" label="Name of Other Association" type="text" value={formData.association_name} onChange={handle} />
                      <Main1stage
                        name="Application_PDF"
                        label="Application PDF"
                        type="file"
                        onChange={handle_files}
                        required
                        accept="application/pdf"
                      />
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
