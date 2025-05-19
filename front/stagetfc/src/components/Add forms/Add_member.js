import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Main1stage from '../Main1stage';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageInfo from '../../mycomponent/paginationform';


function AddMember() {

  const [Autre_association, setAutre_association] = useState(false);
  const [fileval, setfileval] = useState(false);
  const [browsefile, setbrowsefile] = useState(null);
  const [datedebut, setdatedebut] = useState(new Date());
 const [userType, setUserType] = useState("newMember"); 
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
  const navigate = useNavigate();
const [selectedInternId, setSelectedInternId] = useState(null);
const [interns, setInterns] = useState([]);
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

  });
useEffect(() => {
  if (userType === "intern") {
    const fetchAllInterns = async () => {
      let allInterns = [];
      let nextUrl = `http://localhost:8000/api/Stagiaires/?id_membre_isnull=true`;

      try {
        while (nextUrl) {
          const response = await axios.get(nextUrl);
          const data = response.data;

          if (Array.isArray(data.results)) {
            allInterns = [...allInterns, ...data.results];
          }

          nextUrl = data.next;
        }

        setInterns(allInterns);
      } catch (error) {
        console.error("Failed to load interns", error);
        alert("Failed to load interns.");
      }
    };

    fetchAllInterns();
  }
}, [userType]);
  useEffect(() => {
    if (userType === "supervisor") {
      axios.get(`http://localhost:8000/api/Supervisers/?no_member=true`)
        .then(res => {
          setSupervisors(Array.isArray(res.data.results) ? res.data.results : []);
        })
        .catch(err => {
          console.error("Failed to load supervisors", err);
          alert("Failed to load supervisors.");
        });
    }
  }, [userType]);

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


  function handleChecked_autreassociation(e) {
    setAutre_association(e.target.checked);
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
    finalData.append("phone_number", formData.Telephone)
    finalData.append("profession", "no need")
    finalData.append('email', formData.Email)
    finalData.append("Date_of_birth", formattedDateOfBirth);
    finalData.append("is_another_association", Autre_association);
    finalData.append("Application_PDF", browsefile);
    finalData.append("is_sup", false);

    try {
      const res = await axios.post("http://localhost:8000/api/Membres/", finalData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("New member added successfully!");
      navigate("/admin-dashboard/Member");

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
    if (!formData2.Father_name || !formData2.Adresse) {
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
      navigate("/admin-dashboard/Member");

    } catch (error) {
      console.error("Error during create member from supervisor:", error);
      alert("An error occurred while creating the member.");
    }
  };



  async function handleSubmit(e) {
    if (userType==='newMember') {
      await createMember(e);
    } else if(userType==='supervisor') {
      
      await createMemberFromSupervisor(e);
    }
    else if(userType==='intern'){
  await createMemberFromIntern(e);
    }
  }

const createMemberFromIntern = async (e) => {
  e.preventDefault();

  if (!selectedInternId) {
    alert("Please select an intern.");
    return;
  }

  try {
    const res = await axios.post("http://localhost:8000/api/Stagiaires/create_member_from_intern/", {
      intern_id: selectedInternId,
      ...formData2
    });

    const newMemberId = res.data.member_id;
    if (!newMemberId) throw new Error("No member ID returned.");
    alert("Intern converted to member successfully!");
    navigate("/admin-dashboard/Member");

  } catch (error) {
    console.error("Error during conversion:", error);
    alert("An error occurred while converting the intern.");
  }
};

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new Member</h2>
        </div>
        <form className="form-add-modify" onSubmit={handleSubmit}>
          {/* Radio selection */}
          
      <div className="form-group">
  <label className='text-white'>
    <input
      type="radio"
      name="userType"
      value="supervisor"
      checked={userType === "supervisor"}
      onChange={() => setUserType("supervisor")}
    />
    Already Supervisor
  </label>
  <label className='text-white' style={{ marginLeft: '20px' }}>
    <input
      type="radio"
      name="userType"
      value="newMember"
      checked={userType === "newMember"}
      onChange={() => setUserType("newMember")}
    />
    New Member
  </label>
  <label className='text-white' style={{ marginLeft: '20px' }}>
    <input
      type="radio"
      name="userType"
      value="intern"
      checked={userType === "intern"}
      onChange={() => setUserType("intern")}
    />
    Intern to Member
  </label>
</div>



           {userType === "supervisor" && (
            <div className="space-y-4 ">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                <label className="text-white" style={{ marginBottom: "8px" }}>
                  Select Supervisor:
                </label>
                <select
                  style={{
                    width: "300px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                  value={selectedSupervisorId || ""}
                  onChange={(e) => setSelectedSupervisorId(e.target.value)}
                
                >
                  <option value="">Select</option>
                  {supervisors.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.first_name} {sup.last_name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Centered Additional Info */}
              <div className="flex justify-center">
                <div style={{ margin: "20px" }}>
                  <h1 className="text-white mt-4 text-xl font-semibold text-center">Additional info</h1>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Father Name</label>
                      <input
                        type="text"
                        name="Father_name"
                        value={formData.Father_name}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white" style={{ display: "block" }}>Date of birth:</label>
                      <DatePicker
                        selected={formData2.Date_of_birth}
                        onChange={handle_date1}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Place of Birth</label>
                      <input
                        type="text"
                        name="Place_of_birth"
                        value={formData.Place_of_birth}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white">Address</label>
                      <input
                        type="text"
                        name="Adresse"
                        value={formData.Adresse}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Blood Group</label>
                      <input
                        type="text"
                        name="Blood_type"
                        value={formData.Blood_type}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white">Job</label>
                      <input
                        type="text"
                        name="Work"
                        value={formData.Work}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Domain</label>
                      <input
                        type="text"
                        name="Domaine"
                        value={formData.Domaine}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-white">
                        <input
                          type="checkbox"
                          checked={Autre_association}
                          onChange={handleChecked_autreassociation}
                          style={{ margin: "30px" }}
                        />
                        another association
                      </label>
                    </div>


                  </div>
                  <div>
                    {/* Show input only if checkbox is checked */}
                    {Autre_association && (
                      <div className="form-group">
                        <label className="text-white">Association Name</label>
                        <input
                          type="text"
                          name="association_name"
                          value={formData.association_name}
                          onChange={handle}
                          className="form-control"
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label className="text-white">Application PDF</label>
                    <input
                      type="file"
                      name="Application_PDF"
                      onChange={handle_files}
                      className="form-control"
                      required
                      accept="application/pdf"
                    />
                  </div>
                </div>
              </div>

            </div>

          )}
   {userType === "newMember" && (
            <div className="flex justify-center">
            <div className="row">
              <div className="col-md-6">
                <label className="text-white">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="text-white">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
            </div>
          
            <div className="row">
              <div className="col-md-6">
                <label className="text-white">Father Name</label>
                <input
                  type="text"
                  name="Father_name"
                  value={formData.Father_name}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="text-white">Date of Birth</label>
                <DatePicker
                  selected={datedebut}
                  onChange={handle_date1}
                  dateFormat="yyyy-MM-dd"
                  required
                  className="form-control"
                />
              </div>
            </div>
          
            <div className="row">
              <div className="col-md-6">
                <label className="text-white">Place of Birth</label>
                <input
                  type="text"
                  name="Place_of_birth"
                  value={formData.Place_of_birth}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="text-white">Address</label>
                <input
                  type="text"
                  name="Adresse"
                  value={formData.Adresse}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
            </div>
          
            <div className="row">
              <div className="col-md-6">
                <label className="text-white">Blood Group</label>
                <input
                  type="text"
                  name="Blood_type"
                  value={formData.Blood_type}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="text-white">Job</label>
                <input
                  type="text"
                  name="Work"
                  value={formData.Work}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
            </div>
          
            <div className="row">
              <div className="col-md-6">
                <label className="text-white">Domain</label>
                <input
                  type="text"
                  name="Domaine"
                  value={formData.Domaine}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="text-white">Telephone</label>
                <input
                  type="text"
                  name="Telephone"
                  value={formData.Telephone}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
            </div>
          
            <div className="row">
              <div className="col-md-6">
                <label className="text-white">Email</label>
                <input
                  type="text"
                  name="Email"
                  value={formData.Email}
                  onChange={handle}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <label className="text-white">
                  <input
                    type="checkbox"
                    checked={Autre_association}
                    onChange={handleChecked_autreassociation}
                    className="me-2"
                  />
                  Belongs to another association
                </label>
              </div>
            </div>
          
            {Autre_association && (
              <div className="row">
                <div className="col-md-12">
                  <label className="text-white">Association Name</label>
                  <input
                    type="text"
                    name="association_name"
                    value={formData.association_name}
                    onChange={handle}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            )}
          
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="text-white">Application PDF</label>
                <input
                  type="file"
                  name="Application_PDF"
                  onChange={handle_files}
                  className="form-control"
                  required
                  accept="application/pdf"
                />
              </div>
            </div>
          </div>
          
          )}

          {userType === "intern" && (
  <div className="space-y-4">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
      <label className="text-white" style={{ marginBottom: "8px" }}>
        Select Intern:
      </label>
      <select
        style={{
          width: "300px",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
        value={selectedInternId || ""}
        onChange={(e) => setSelectedInternId(e.target.value)}
        required
      >
        <option value="">Select</option>
        {interns.map((intern) => (
          <option key={intern.id} value={intern.id}>
            {intern.first_name} {intern.last_name}
          </option>
        ))}
      </select>
    </div>

    <div className="flex justify-center">
                <div style={{ margin: "20px" }}>
                  <h1 className="text-white mt-4 text-xl font-semibold text-center">Additional info</h1>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Father Name</label>
                      <input
                        type="text"
                        name="Father_name"
                        value={formData.Father_name}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white" style={{ display: "block" }}>Date of birth:</label>
                      <DatePicker
                        selected={formData2.Date_of_birth}
                        onChange={handle_date1}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Place of Birth</label>
                      <input
                        type="text"
                        name="Place_of_birth"
                        value={formData.Place_of_birth}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white">Address</label>
                      <input
                        type="text"
                        name="Adresse"
                        value={formData.Adresse}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Blood Group</label>
                      <input
                        type="text"
                        name="Blood_type"
                        value={formData.Blood_type}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white">Job</label>
                      <input
                        type="text"
                        name="Work"
                        value={formData.Work}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="text-white">Domain</label>
                      <input
                        type="text"
                        name="Domaine"
                        value={formData.Domaine}
                        onChange={handle}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-white">
                        <input
                          type="checkbox"
                          checked={Autre_association}
                          onChange={handleChecked_autreassociation}
                          style={{ margin: "30px" }}
                        />
                        another association
                      </label>
                    </div>


                  </div>
                  <div>
                    {/* Show input only if checkbox is checked */}
                    {Autre_association && (
                      <div className="form-group">
                        <label className="text-white">Association Name</label>
                        <input
                          type="text"
                          name="association_name"
                          value={formData.association_name}
                          onChange={handle}
                          className="form-control"
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label className="text-white">Application PDF</label>
                    <input
                      type="file"
                      name="Application_PDF"
                      onChange={handle_files}
                      className="form-control"
                      required
                      accept="application/pdf"
                    />
                  </div>
                </div>
              </div>
  </div>
)}
          <div className='form-group' style={{ padding: "1rem" }}>
            <button className="form-control btn btn-warning" type="submit">Add new member</button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddMember;
