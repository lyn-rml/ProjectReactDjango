import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageInfo from '../../mycomponent/paginationform';
function AddSupstage() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const stageid = searchparams.get('id');
  const newsup = searchparams.get('newsup')
  let index = searchparams.get('index')
  index++
  let pageNumber = 2
  if (index > 2) {
    pageNumber = searchparams.get('pagenub')
    pageNumber++
  }
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [newSupToHandle, setNewSupToHandle] = useState(null);
  
  //singleselected
  const [mainchosen, Setmain] = useState(false);
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
    const searchParams = new URLSearchParams(window.location.search);
    const single = searchParams.get("singleselected");
    const multi = searchParams.get("multiselected");
    console.log(singleoptions,multioptions)
    if (single && singleoptions.length>0) {
      const foundSingle = singleoptions.find(opt => opt.value === Number(single));
      console.log(foundSingle)
      if (foundSingle) {
        setsingleselectedoption(foundSingle); // sélectionne l’objet
      }
    }
  
    if (multi && multioptions.length > 0) {
      const multiIds = multi.split(",").filter(Boolean); // removes empty string
      const selected = multioptions.filter(option =>
        multiIds.includes(String(option.value))
      );
      setmultiselectedoptions(selected);
    }
  }, [multioptions,singleoptions]);
  

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const newsup = searchParams.get("newsup");
    const ismember = searchParams.get("ismember");
    const single = searchParams.get("singleselected");
    
    console.log("Params:", { newsup, ismember, single });
  
    if (!newsup) return;
  
    const foundNewsup = multioptions.find(opt => String(opt.value) === newsup);
  console.log(foundNewsup)
    if (!foundNewsup) return;
  
    // ✅ Cas 1 : singleselected existe -> push newsup dans multi
    if (single && singleselectedoption) {
      setmultiselectedoptions(prev => {
        const alreadyExists = prev.some(opt => opt.value === foundNewsup.value);
        return alreadyExists ? prev : [...prev, foundNewsup];
      });
 
    }
  
    // ✅ Cas 2 : ismember = false -> push dans multi
    if (ismember === "false") {
      setmultiselectedoptions(prev => {
        const alreadyExists = prev.some(opt => opt.value === foundNewsup.value);
        return alreadyExists ? prev : [...prev, foundNewsup];
      });
     
    }
  
    if (single==="" && ismember=== 'true') {
      console.log('open modal')
      setShowPopupModal(true);
      setNewSupToHandle(foundNewsup); // sauvegarde le choix pour le modal
    }
  }, [multioptions, singleselectedoption]);
  

  function handleChangesingle(selectedOption) {
    setsingleselectedoption(selectedOption);
    const filtered = initialoptions.filter(opt => opt.value !== selectedOption.value);
    setmultioptions(filtered);
    Setmain(true);
    ensureMemberIsSupervisor(selectedOption.value);
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
    const multiselectedIds = multiselectedoptions.map(opt => opt.value).join(",");
    navigate(`/Add-superviser-fromAddProject?id=${stageid}&singleselected=${singleselectedoption?.value || ''}&multiselected=${multiselectedIds}&index=${index}&pagenub=${pageNumber}`);
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

    const otherSupervisors = multiselectedoptions.filter(opt => opt.value !== singleselectedoption?.value);

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

        await axios.post('http://localhost:8000/api/Supervisers/', supervisorData);
        await axios.patch(`http://localhost:8000/api/Membres/${memberId}/`, {
          is_sup: true,
        });

        console.log('Member upgraded to supervisor:', supervisorData);
      } else {
        console.log('Member already a supervisor.');
      }
    } catch (error) {
      console.error('Error in ensureMemberIsSupervisor:', error);
    }
  }

  return (
    <div>
    <div className="Add-modify">

      <div className="Add-modify-container">
        <div className="top-add-modify">

          <h2 className="title-add-modify">Add Supervisor</h2>

        </div>
        <form method="post" className="form-add-modify" encType="multipart/form-data">
          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Main Superviser:</span>
            <Select
              options={singleoptions}
              value={singleselectedoption}
              onChange={(selectedOption) => {
                handleChangesingle(selectedOption);
                ensureMemberIsSupervisor(selectedOption.value);
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
              value="Finish"
              onClick={handlesubmit}
            />
          </div>
        </form>
       

        <div className="d-flex justify-content-center gap-3">
          <PageInfo index={index} pageNumber={pageNumber} />
        </div>
      </div>
    

    </div>
      {showPopupModal && newSupToHandle && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choisir la position du superviseur</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopupModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Souhaitez-vous ajouter ce superviseur comme principal ou comme autre ?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setsingleselectedoption(newSupToHandle);
                    setShowPopupModal(false);
                  }}
                >
                  Principal
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setmultiselectedoptions(prev => {
                      const alreadyExists = prev.some(opt => opt.value === newSupToHandle.value);
                      return alreadyExists ? prev : [...prev, newSupToHandle];
                    });
                    setShowPopupModal(false);
                  }}
                >
                  Autre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div> 
  );
}

export default AddSupstage;

