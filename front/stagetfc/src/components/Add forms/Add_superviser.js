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
    first_name: "",
    last_name: "",
    profession: "",
    email: "",
    phone_number: "",
    Id_Membre: 0,
  });

  async function fetchMembers() {
    let options = [];
    try {
      const res = await axios.get(`http://localhost:8000/api/Membres/members_not_supervisor/`);
      if (Array.isArray(res.data)) {
        res.data.forEach(member => {
          options.push({
            value: member.id,
            label: `${member.first_name} ${member.last_name}`,
          });
        });
        setSingleOptions(options);
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
      setFormData({
        first_name: "",
        last_name: "",
        profession: "",
        email: "",
        phone_number: "",
        Id_Membre: 0,
      });
      setReadonly(false);
    } else {
      axios.get(`http://localhost:8000/api/Membres/${selectedOption.value}/`)
        .then(res => {
          setFormData({
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            profession: res.data.profession,
            email: res.data.email,
            phone_number: res.data.phone_number,
            Id_Membre: res.data.id,
          });
          setReadonly(true);
        })
        .catch(error => console.log(error));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  
    const { first_name, last_name, profession, email, phone_number, Id_Membre } = formData;
  
    if (!first_name || !last_name || !profession || !email || !phone_number) {
      alert("Please fill in all fields.");
      return;
    }
  
    const payload = {
      first_name,
      last_name,
      profession,
      email,
      phone_number,
    };
  
    // 🟢 If the supervisor is a member, call the custom endpoint
    if (isMember && Id_Membre !== 0) {
      axios.post("http://localhost:8000/api/Supervisers/create_supervisor_from_member/", {
        ...payload,
        member_id: Id_Membre,  // ✅ Add member_id here
      })
        .then(() => {
          alert("Supervisor created from member successfully!");
          navigate("/admin-dashboard/Superviser");
        })
        .catch(error => {
          console.error("Error creating supervisor from member:", error);
          alert("Failed to create supervisor from member.");
        });
    } else {
      // 🔵 If not a member, use the normal endpoint
      axios.post("http://localhost:8000/api/Supervisers/", {
        ...payload,
        Id_Membre: null,
      }, {
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          alert("Supervisor created successfully!");
          navigate("/admin-dashboard/Superviser");
        })
        .catch(error => {
          console.error("Error creating supervisor:", error);
          alert("Failed to create supervisor.");
        });
    }
  }
  

  useEffect(() => {
    fetchMembers();
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleMemberSelection(isMemberSelected) {
    setIsMember(isMemberSelected);
    setSelectedMember(null);
    setReadonly(false);
    setFormData({
      first_name: "",
      last_name: "",
      profession: "",
      email: "",
      phone_number: "",
      Id_Membre: isMemberSelected 
    });
  }

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Add new Supervisor</h2>
        </div>

        <form className="form-add-modify" onSubmit={handleSubmit}>
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Supervisor Type:</span>
            <div>
              <label style={{ color: "white" }}>
                <input type="radio" name="superviserType" value="member" checked={isMember} onChange={() => handleMemberSelection(true)} />
                Member
              </label>
              <label style={{ marginLeft: "1rem", color: "white" }}>
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
              <Main1stage name="first_name" label="First Name" type="text" value={formData.first_name} onChange={handleInputChange} required />
              <Main1stage name="last_name" label="Last Name" type="text" value={formData.last_name} onChange={handleInputChange} required />
              <Main1stage name="profession" label="Profession" type="text" value={formData.profession} onChange={handleInputChange} required />
              <Main1stage name="email" label="Email" type="email" value={formData.email} onChange={handleInputChange} required />
              <Main1stage name="phone_number" label="Phone Number" type="text" value={formData.phone_number} onChange={handleInputChange} required />
            </>
          )}

          <div className="form-group" style={{ padding: "1rem" }}>
            <input type="submit" className="form-control  btn btn-warning" value="Add new Supervisor" />
          </div>
        </form>
       
      </div>
    </div>
  );
}

export default AddSuperviser;
