import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSearchParams, useNavigate } from 'react-router-dom';

function AddSupstage() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const stageid = searchparams.get('id');

  const [initialoptions, setinitialoptions] = useState([]);
  const [singleoptions, setsingleoptions] = useState([]);
  const [multioptions, setmultioptions] = useState([]);

  const [singleselectedoption, setsingleselectedoption] = useState(null);
  const [multiselectedoptions, setmultiselectedoptions] = useState([]);

  const [formData, setformData] = useState({
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

  async function fillSupervisers() {
    try {
      console.log("Fetching members and supervisors...");

      const [membersRes, supervisorsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/Membres/'),
        axios.get('http://localhost:8000/api/Supervisers/?id_member=0')
      ]);

      console.log("Members response:", membersRes.data);
      console.log("Supervisors response:", supervisorsRes.data);

      const membersData = membersRes.data.results;
      const supervisorsData = supervisorsRes.data.results;

      const members = membersData.map(m => ({
        value: m.id,
        label: `${m.Nom} ${m.Prenom}`,
      }));

      const memberIds = new Set(membersData.map(m => m.id));

      const supervisors = supervisorsData
        .filter(s => !memberIds.has(s.id))
        .map(s => ({
          value: s.id,
          label: `${s.Nom} ${s.Prenom}`,
        }));

      const combined = [...members, ...supervisors];

      console.log("Combined options:", combined);

      setinitialoptions(combined);
      setmultioptions(combined);
      setsingleoptions(members);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fillSupervisers();
  }, []);

  function handleChangesingle(selectedOption) {
    setsingleselectedoption(selectedOption);
    const filtered = initialoptions.filter(opt => opt.value !== selectedOption.value);
    setmultioptions(filtered);
  }

  function handleChangemulti(selectedOption) {
    setmultiselectedoptions(selectedOption || []);
    if (!selectedOption || selectedOption.length === 0) {
      setsingleoptions(initialoptions.filter(opt => true));
    } else {
      let filtered = initialoptions;
      selectedOption.forEach(sel => {
        filtered = filtered.filter(opt => opt.value !== sel.value);
      });
      setsingleoptions(filtered);
    }
  }

  const handleRedirectToAddSupervisor = () => {
    navigate(`/Add-superviser-fromAddProject?id=${stageid}`);
  };

  async function handlesubmit(e) {
    e.preventDefault();
  
    if (singleselectedoption !== null && stageid !== 0) {
      try {
        // Fetch the supervisor's data using their member ID
        const supervisorRes = await axios.get(`http://localhost:8000/api/Supervisers/?id_member=${singleselectedoption.value}`);
        
        if (supervisorRes.data.results.length > 0) {
          const supervisorData = supervisorRes.data.results[0];  // Assuming there's only one supervisor with that member ID
          const mainSupervisorData = {
            ...formData,
            is_admin: true,
            superviser: supervisorData.id,  // Using the supervisor's ID
            superviser_name: singleselectedoption.label,
            stage: parseInt(stageid),
          };
  
          // Post the main supervisor data
          await axios.post('http://localhost:8000/api/supstage/', mainSupervisorData);
          console.log("Main supervisor added:", mainSupervisorData);
        } else {
          console.log("Supervisor not found.");
        }
      } catch (error) {
        console.error("Error fetching supervisor data:", error);
      }
    }
  
    const otherSupervisors = multiselectedoptions.filter(
      opt => opt.value !== singleselectedoption?.value
    );
  
    for (let i = 0; i < otherSupervisors.length; i++) {
      const otherData = {
        ...formData,
        is_admin: false,
        superviser: parseInt(otherSupervisors[i].value),
        stage: parseInt(stageid),
      };
  
      try {
        await axios.post('http://localhost:8000/api/supstage/', otherData);
        console.log("Other supervisor added:", otherData);
      } catch (error) {
        console.error(error);
      }
    }
  
    navigate("/Stage");
  }
  
  async function ensureMemberIsSupervisor(memberId) {
    try {
      const res = await axios.get(`http://localhost:8000/api/Membres/${memberId}/`);
      const memberData = res.data;
      console.log("Fetched member:", memberData);

      if (memberData.is_sup === false) {
        const supervisorData = {
          Nom: memberData.Nom,
          Prenom: memberData.Prenom,
          Telephone: memberData.Telephone,
          Email: memberData.Email,
          Profession: memberData.Profession,
          Id_Membre: memberData.id,
        };
        Setformdatasup(supervisorData);

        await axios.post("http://localhost:8000/api/Supervisers/", supervisorData);
        console.log("Supervisor created:", supervisorData);

        await axios.patch(`http://localhost:8000/api/Membres/${memberId}/`, {
          is_sup: true
        });

        console.log("Member is_sub updated to true");
      } else {
        console.log("Member already a supervisor.");
      }
    } catch (error) {
      console.error("Error in ensureMemberIsSupervisor:", error);
    }
  }

  return (
    <div className="Add-modify">
      <h1 style={{ color: "transparent" }}>Placeholder</h1>
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h6 style={{ color: "transparent" }}>abc</h6>
          <h2 className="title-add-modify">Add A Project</h2>
          <h6 style={{ color: "transparent" }}>def</h6>
        </div>
        <form method="post" className="form-add-modify" encType="multipart/form-data">
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Main Superviser:</span>
            <Select
              options={singleoptions}
              value={singleselectedoption}
              onChange={(selectedOption) => {
                handleChangesingle(selectedOption); // Handle single supervisor change
                ensureMemberIsSupervisor(selectedOption.value); // Ensure member is a supervisor
              }}
              required
            />
          </div>
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Select Other Supervisers:</span>
            <Select options={multioptions} value={multiselectedoptions} onChange={handleChangemulti} isMulti />
          </div>
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Add other Superviser:</span>
            <input type="button" className="form-control add-btn" value="Add Supervisers" onClick={handleRedirectToAddSupervisor} />
          </div>
          <div className='form-group' style={{ padding: "1rem" }}>
            <input type="button" className="form-control add-btn" value="Finish Add project" onClick={handlesubmit} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSupstage;
