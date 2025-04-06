import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
function AddSupstage() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const stageid = searchparams.get('id');
  const onlysupid = searchparams.get('id_suponly');
  const idmember = searchparams.get('idmember');

  const [mainchosen, Setmain] = useState(false);
  const [initialoptions, setinitialoptions] = useState([]);
  const [singleoptions, setsingleoptions] = useState([]);
  const [multioptions, setmultioptions] = useState([]);

  const [singleselectedoption, setsingleselectedoption] = useState(null);
  const [multiselectedoptions, setmultiselectedoptions] = useState([]);

  const [formData] = useState({
    stage: 0,
    superviser: 0,
    superviser_name: '',
    is_admin: false,
  });

  async function fillSupervisers() {
    try {
      const [membersRes, supervisorsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/Membres/'),
        axios.get('http://localhost:8000/api/Supervisers/?id_member=0')
      ]);

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

  useEffect(() => {
    if (initialoptions.length === 0) return;
  
    const onlysupid = searchparams.get('id_suponly');
    const idmember = searchparams.get('idmember');
  
    // ✅ Case 1: Newly added supervisor who is NOT a member → go to "Other Supervisors"
    if (onlysupid) {
      const found = initialoptions.find(opt => opt.value === parseInt(onlysupid));
      if (found) {
        setmultiselectedoptions(prev => [...prev, found]);
        setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
        setmultioptions(prev => prev.filter(opt => opt.value !== found.value));
      }
    }
  
    // ✅ Case 2: Newly added member (choose where to place)
    if (idmember) {
      const found = initialoptions.find(opt => opt.value === parseInt(idmember));
      if (found) {
        if (singleselectedoption) {
          // Main supervisor already selected → put in Other
          setmultiselectedoptions(prev => [...prev, found]);
          setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
          setmultioptions(prev => prev.filter(opt => opt.value !== found.value));
        } else {
          // Ask user: main or other?
          Swal.fire({
            title: 'Where do you want to place the new supervisor?',
            text: 'You have not selected a Main Supervisor yet.',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Main Supervisor',
            denyButtonText: 'Other Supervisor'
          }).then(result => {
            if (result.isConfirmed) {
              setsingleselectedoption(found);
              setmultioptions(prev => prev.filter(opt => opt.value !== found.value));
            } else if (result.isDenied) {
              setmultiselectedoptions(prev => [...prev, found]);
              setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
              setmultioptions(prev => prev.filter(opt => opt.value !== found.value));
            }
          });
        }
      }
    }
  }, [initialoptions, searchparams, singleselectedoption]);
  
  function handleChangesingle(selectedOption) {
    setsingleselectedoption(selectedOption);
    const filtered = initialoptions.filter(opt => opt.value !== selectedOption.value);
    setmultioptions(filtered);
    Setmain(true);
  }

 
  function handleChangemulti(selectedOption) {
    const newSelected = selectedOption || [];
    setmultiselectedoptions(newSelected);

    if (newSelected.length === 0) {
      setsingleoptions(initialoptions.filter(() => true));
    } else {
      let filtered = initialoptions;
      newSelected.forEach((sel) => {
        filtered = filtered.filter((opt) => opt.value !== sel.value);
      });
      setsingleoptions(filtered);
    }

    newSelected.forEach(async (sel) => {
      try {
        const res = await axios.get(`http://localhost:8000/api/Membres/${sel.value}/`);
        if (res?.data?.id && res.data.is_sup === false) {
          const member = res.data;
          const supervisorData = {
            Nom: member.Nom,
            Prenom: member.Prenom,
            Telephone: member.Telephone,
            Email: member.Email,
            Profession: member.Profession,
            Id_Membre: member.id,
          };
          await axios.post("http://localhost:8000/api/Supervisers/", supervisorData);
          await axios.patch(`http://localhost:8000/api/Membres/${member.id}/`, {
            is_sup: true,
          });
        }
      } catch (err) {
        // Not a member
      }
    });
  }

  const handleRedirectToAddSupervisor = () => {
    navigate(`/Add-superviser-fromAddProject?id=${stageid}`);
  };

  async function handlesubmit(e) {
    e.preventDefault();

    if (singleselectedoption !== null && stageid !== 0) {
      try {
        const supervisorRes = await axios.get(`http://localhost:8000/api/Supervisers/?id_member=${singleselectedoption.value}`);
        if (supervisorRes.data.results.length > 0) {
          const supervisorData = supervisorRes.data.results[0];
          const mainSupervisorData = {
            ...formData,
            is_admin: true,
            superviser: supervisorData.id,
            superviser_name: singleselectedoption.label,
            stage: parseInt(stageid),
          };
          await axios.post('http://localhost:8000/api/supstage/', mainSupervisorData);
        }
      } catch (error) {
        console.error("Error fetching main supervisor data:", error);
      }
    }

    const otherSupervisors = multiselectedoptions.filter(
      opt => opt.value !== singleselectedoption?.value
    );

    for (let i = 0; i < otherSupervisors.length; i++) {
      const selected = otherSupervisors[i];
      let supervisorId = null;

      try {
        const memberRes = await axios.get(`http://localhost:8000/api/Membres/${selected.value}/`);
        const member = memberRes.data;

        if (!member.is_sup) {
          const newSup = {
            Nom: member.Nom,
            Prenom: member.Prenom,
            Telephone: member.Telephone,
            Email: member.Email,
            Profession: member.Profession,
            Id_Membre: member.id,
          };
          await axios.post("http://localhost:8000/api/Supervisers/", newSup);
          await axios.patch(`http://localhost:8000/api/Membres/${member.id}/`, {
            is_sup: true,
          });
        }

        const supRes = await axios.get(`http://localhost:8000/api/Supervisers/?id_member=${member.id}`);
        if (supRes.data.results.length > 0) {
          supervisorId = supRes.data.results[0].id;
        }

      } catch (err) {
        supervisorId = selected.value;
      }

      if (supervisorId) {
        const otherData = {
          ...formData,
          is_admin: false,
          superviser: supervisorId,
          stage: parseInt(stageid),
        };

        try {
          await axios.post('http://localhost:8000/api/supstage/', otherData);
        } catch (error) {
          console.error("Error adding other supervisor:", error);
        }
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

  async function checkMemberStatusAndEnsureSupervisor(memberId) {
    try {
        const memberRes = await axios.get(`http://localhost:8000/api/Membres/${memberId}/`);
        const memberData = memberRes.data;

        if (!memberData.is_sup) {
            const supervisorData = {
                Nom: memberData.Nom,
                Prenom: memberData.Prenom,
                Telephone: memberData.Telephone,
                Email: memberData.Email,
                Profession: memberData.Profession,
                Id_Membre: memberData.id,
            };

            await axios.post("http://localhost:8000/api/Supervisers/", supervisorData);
            console.log("Supervisor created:", supervisorData);

            await axios.patch(`http://localhost:8000/api/Membres/${memberId}/`, {
                is_sup: true,
            });
            console.log("Member updated to supervisor status.");
        } else {
            console.log("Member is already a supervisor.");
        }
    } catch (error) {
        console.error("Error ensuring member is supervisor:", error);
    }
}

// Function to check selected members outside of handleChangemulti
async function handleCheckMembersAndEnsureSupervisors(selectedOptions) {
    const memberPromises = selectedOptions?.map(async (selected) => {
        const isMember = initialoptions.some(opt => opt.value === selected.value && opt.is_member);
        if (isMember) {
            const memberId = selected.value;
            await checkMemberStatusAndEnsureSupervisor(memberId);
        }
    });

    if (memberPromises) {
        await Promise.all(memberPromises); // Run all checks in parallel
    }
}

useEffect(() => {
    if (multiselectedoptions?.length > 0) {
        handleCheckMembersAndEnsureSupervisors(multiselectedoptions);
    }
}, [multiselectedoptions]);

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
            <Select
              options={multioptions}
              value={multiselectedoptions}
              onChange={handleChangemulti}
              isMulti
            />
          </div>
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Add other Superviser:</span>
            <input
              type="button"
              className="form-control add-btn"
              value="Add Supervisers"
              onClick={handleRedirectToAddSupervisor}
            />
          </div>
          <div className='form-group' style={{ padding: "1rem" }}>
            <input
              type="button"
              className="form-control add-btn"
              value="Finish Add project"
              onClick={handlesubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSupstage;

