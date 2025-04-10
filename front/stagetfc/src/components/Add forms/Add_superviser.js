import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Main1stage from '../Main1stage';
import PageInfo from '../../mycomponent/paginationform';
function AddSuperviser() {
  const menuPortalTarget = document.getElementById('root');
  const navigate = useNavigate();

  const [readonly, setReadonly] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [singleOptions, setSingleOptions] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [formData, setFormData] = useState({
    Nom: "",
    Prenom: "",
    Profession: "",
    Email: "",
    Telephone: "",
    Id_Membre: null,
  });

  async function fetchMembers() {
    let options = [{ value: 0, label: "Not a member" }];
    try {
      const res = await axios.get(`http://localhost:8000/api/Membres/?is_sup=false`);
      console.log("API Response:", res.data); // Check the full response
      
      if (Array.isArray(res.data.results)) {
        res.data.results.forEach(member => {
          options.push({
            value: member.id,
            label: `${member.Prenom} ${member.Nom}`,
          });
        });
        console.log("Final Options:", options); // Check the options being built
        setSingleOptions(options);  // Update state with options
      } else {
        console.error("Expected 'results' to be an array but got:", res.data.results);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }
  function handleMemberChange(selectedOption) {
  setSelectedMember(selectedOption);
  
  if (selectedOption.value === 0) {
    // If "Not a member" is selected, reset the member fields and set Id_Membre to null
    setFormData({
      Nom: "",
      Prenom: "",
      Profession: "",
      Email: "",
      Telephone: "",
      Id_Membre: 0,  // Ensure it's null when not a member
    });
    setReadonly(false); // Enable editing for other fields
  } else {
    // Fetch member data and update form with member details
    axios.get(`http://localhost:8000/api/Membres/${selectedOption.value}/`)
      .then(res => {
        setFormData({
          Nom: res.data.Nom,
          Prenom: res.data.Prenom,
          Profession: res.data.Profession,
          Email: res.data.Email,
          Telephone: res.data.Telephone,
          Id_Membre: res.data.id,  
        });
        setReadonly(true); 
      })
      .catch(error => console.log(error));
  }
}

function handleSubmit(e) {
  e.preventDefault();

  if (!formData.Nom || !formData.Prenom || !formData.Profession || !formData.Email || !formData.Telephone ) {
    alert("Please fill in all fields.");
    return;
  }

  console.log("Final formData before POST:", formData)
  axios.post('http://localhost:8000/api/Supervisers/', formData, {
    headers: { "Content-Type": "application/json" },
  })
  .then(res => {
    console.log("create successfully.");
    alert("Supervisor created successfully!");

    if (formData.Id_Membre !== null) {
      // Explicitly update the member with is_sup: true
      axios.patch(`http://localhost:8000/api/Membres/${formData.Id_Membre}/`, { is_sup: true })
        .then(() => {
          console.log("Member updated successfully.");
          navigate("/Superviser");
        })
        .catch(error => console.error("Error updating member:", error));
    } else {
      navigate("/Superviser");
    }
  })
  .catch(error => console.error("Error creating supervisor:", error));
}
  

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name.charAt(0).toUpperCase() + name.slice(1)]: value,
    }));
  }


  function handleMemberSelection(isMemberSelected) {
    setIsMember(isMemberSelected);
    setSelectedMember(null);
    setReadonly(false);
    setFormData({
      Nom: "",
      Prenom: "",
      Profession: "",
      Email: "",
      Telephone: "",
      Id_Membre: isMemberSelected,
    });
  }


  return (
    
    <div className="Add-modify">
      {console.log("all membres",singleOptions)}

      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new Superviser</h2>
        </div>

        <form className="form-add-modify" onSubmit={handleSubmit}>
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Supervisor Type:</span>
            <div>
              <label style={{ color: "white"}}>
                <input type="radio" name="superviserType" value="member" checked={isMember} onChange={() => handleMemberSelection(true)} />
                Member
              </label>
              <label style={{ marginLeft: "1rem",color: "white" }}>
                <input type="radio" name="superviserType" value="notMember" checked={!isMember} onChange={() => handleMemberSelection(false)} />
                Not a Member
              </label>
            </div>
          </div>

          {isMember && (
            <div className="form-group add-modif">
              <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Member:</span>
              <Select
                options={singleOptions}
                value={selectedMember}
                onChange={handleMemberChange}
                menuPortalTarget={menuPortalTarget}
                maxMenuHeight={220}
                required
              />
            </div>
          )}

          {!isMember && (
            <>
              <Main1stage name="Nom" label="Nom" type="text" value={formData.Nom} onChange={handleInputChange} required />
              <Main1stage name="Prenom" label="Prenom" type="text" value={formData.Prenom} onChange={handleInputChange} required />
              <Main1stage name="Profession" label="Profession" type="text" value={formData.Profession} onChange={handleInputChange} required />
              <Main1stage name="Email" label="Email" type="email" value={formData.Email} onChange={handleInputChange} required />
              <Main1stage name="Telephone" label="Telephone" type="text" value={formData.Telephone} onChange={handleInputChange} required />
            </>
          )}

          <div className="form-group" style={{ padding: "1rem" }}>
            <input type="submit" className="form-control add-btn" value="Add new Superviser" />
          </div>
        </form>
        <div className="d-flex justify-content-center gap-3">
                <PageInfo index={1} pageNumber={1} />
                </div>
      </div>
    </div>
  );
}

export default AddSuperviser;
