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
      // Récupérer tous les superviseurs
      const supervisorsRes = await axios.get('http://localhost:8000/api/Supervisers/get_all/');
      const supervisorsData = supervisorsRes.data;
  
      // Ajouter les superviseurs à la liste des options
      const allSupervisors = supervisorsData.map(s => ({
        value: s.id,
        label: `${s.Nom} ${s.Prenom}`,
        ismember: s.Id_Membre !== 0, // Flag selon Id_Membre
        id_member: s.Id_Membre,
        onlymembre: false,
      }));
  
      // Récupérer les membres où is_sup=false
      const membersRes = await axios.get('http://localhost:8000/api/Membres/?is_sup=false');
      const membersData = membersRes.data.results;
  
      // Vérifier si membersData est un tableau
      if (Array.isArray(membersData)) {
        // Ajouter les membres avec le flag onlymembre=true
        const onlyMembers = membersData.map(m => ({
          value: m.id,
          label: `${m.Nom} ${m.Prenom}`,
          ismember: true,
          onlymembre: true, 
        }));
  console.log("only",onlyMembers)
        const singleOnly = allSupervisors.filter(sup => sup.id_member !== 0); // ✅ ceux qui ne sont pas membres
        const combine = [...singleOnly, ...onlyMembers];
  console.log('combine',combine)
        setinitialoptions(allSupervisors);
        setmultioptions(allSupervisors);
        setsingleoptions(combine); // ✅ seule la liste des non membres pour le main
      } else {
        console.error("Membres data is not an array:", membersData);
      }
  
    } catch (error) {
      console.error("Error fetching supervisors or members:", error);
    }
  }
  

  useEffect(() => {
    fillSupervisers();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const single = searchParams.get("singleselected");
    const multi = searchParams.get("multiselected");
    console.log(singleoptions, multioptions)
    if (single && singleoptions.length > 0) {
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
  }, []);


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

    if (single === "" && ismember === 'true') {
      console.log('open modal')
      setShowPopupModal(true);
      setNewSupToHandle(foundNewsup); // sauvegarde le choix pour le modal
    }
  }, [multioptions, singleselectedoption]);


 async function handleChangesingle(selectedOption) {
    const info= (await axios.get(`http://localhost:8000/api/Supervisers/${selectedOption.value}/`)).data.results
    setsingleselectedoption(selectedOption);
    Setmain(true);
    ensureMemberIsSupervisor(info.Id_Membre);
  
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
  

  function handleChangemulti(selectedOption) {
    const newSelected = selectedOption || [];
    setmultiselectedoptions(newSelected);
  
    // Filter multioptions
    let filtered = initialoptions;
    newSelected.forEach((sel) => {
      filtered = filtered.filter((opt) => opt.value !== sel.value);
    });
    setmultioptions(filtered);
  
    // Filter singleoptions: only members and not in multi
    const updatedSingleOptions = initialoptions
      .filter(opt => opt.id_member !== 0)
      .filter(opt => !newSelected.some(sel => sel.value === opt.value));
  
    setsingleoptions(updatedSingleOptions);
  
    // Upgrade members if needed
    newSelected.forEach(async (sel) => {
      if (sel.ismember) {
        try {
          const info= (await axios.get(`http://localhost:8000/api/Supervisers/${sel.value}/`)).data.results
          const membreid=info.Id_Membre
          console.log(membreid)
          const res = await axios.get(`http://localhost:8000/api/Membres/${membreid}/`);
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
            })
          }
        } catch (err) {
          console.error("Error upgrading member:", err);
        }
      }
    });
  }
  



  const handleRedirectToAddSupervisor = () => {
    const multiselectedIds = multiselectedoptions.map(opt => opt.value).join(",");
    navigate(`/Add-superviser-fromAddProject?id=${stageid}&singleselected=${singleselectedoption?.value || ''}&multiselected=${multiselectedIds}&index=${index}&pagenub=${pageNumber}`);
  };

  async function handlesubmit(e) {
    e.preventDefault();
  
    const stageIdInt = parseInt(stageid);
    const mainSupervisor = singleselectedoption;
  
    // --- 1. UPGRADE if needed ---
    const allSupervisors = [mainSupervisor, ...multiselectedoptions];
    for (let sup of allSupervisors) {
      if (sup.ismember) {
        try {
          const memberRes = await axios.get(`http://localhost:8000/api/Membres/${sup.id_member}/`);
          const member = memberRes.data;
  
          if (!member.is_sup) {
            // Create Supervisor
            const newSup = {
              Nom: member.Nom,
              Prenom: member.Prenom,
              Telephone: member.Telephone,
              Email: member.Email,
              Profession: member.Profession,
              Id_Membre: member.id,
            };
  
            await axios.post("http://localhost:8000/api/Supervisers/", newSup);
  
            // Upgrade Member
            await axios.patch(`http://localhost:8000/api/Membres/${member.id}/`, {
              is_sup: true,
            });
          }
        } catch (err) {
          console.error("Error upgrading member:", err);
        }
      }
    }
  
    // --- 2. MAIN SUPERVISOR ---
    try {
      const mainRes = await axios.get(
        `http://localhost:8000/api/Supervisers/${mainSupervisor.value}/`
      );
  
      if (mainRes.data && mainRes.data.id) {
        const mainSupervisorId = mainRes.data.id;
  console.log('main',mainRes.data.results)
        // Post main supervisor
        await axios.post("http://localhost:8000/api/supstage/", {
          ...formData,
          is_admin: true,
          superviser: mainSupervisorId,
          superviser_name: mainSupervisor.label,
          stage: stageIdInt,
        });
  
        // Patch stage main supervisor
        await axios.patch(`http://localhost:8000/api/Stages/${stageIdInt}/`, {
          Main_sup: mainSupervisor.value,
        });
      }
    } catch (err) {
      console.error("Error adding main supervisor:", err);
    }
  
    // --- 3. ADDITIONAL SUPERVISORS ---
    const additionalSupervisors = multiselectedoptions.filter(
      (opt) => opt.value !== mainSupervisor?.value
    );
  
    for (let sup of additionalSupervisors) {
      let supervisorId = null;
  
      try {
        if (sup.ismember) {
          const supRes = await axios.get(
            `http://localhost:8000/api/Supervisers/?id_member=${sup.id_member}`
          );
          if (supRes.data.results.length > 0) {
            supervisorId = supRes.data.results[0].id;
          }
        } else {
          supervisorId = sup.value;
        }
  
        if (supervisorId) {
          // Post to supstage
          await axios.post("http://localhost:8000/api/supstage/", {
            ...formData,
            is_admin: false,
            superviser: supervisorId,
            stage: stageIdInt,
          });
  
          // Add to Stage.superviseurs (many-to-many)
          await axios.patch(`http://localhost:8000/api/Stages/${stageIdInt}/`, {
            superviseurs: [supervisorId],
          });
        }
      } catch (err) {
        console.error("Error handling additional supervisor:", err);
      }
    }
  
    // ✅ Done
    navigate("/Stage");
  }
  
    async function ensureMemberIsSupervisor(memberId) {
      try {
        console.log('function ensureMembre',memberId)
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
    function filterOptions(singleSelected, multiSelected, allOptions) {
      // Exclure le superviseur principal et tous ceux déjà en multi
      const filteredSingle = allOptions
        .filter(opt => opt.id_member !== 0) // Doit être membre
        .filter(opt => opt.value !== singleSelected?.value)
        .filter(opt => !multiSelected.some(sel => sel.value === opt.value));
    
      const filteredMulti = allOptions
        .filter(opt => opt.value !== singleSelected?.value)
        .filter(opt => !multiSelected.some(sel => sel.value === opt.value));
    
      setsingleoptions(filteredSingle);
      setmultioptions(filteredMulti);
    }
    useEffect(() => {
      filterOptions(singleselectedoption, multiselectedoptions, initialoptions);
    }, [initialoptions, singleselectedoption, multiselectedoptions]);
    async function upgradeMemberIfNeeded(memberId) {
      try {
        const res = await axios.get(`http://localhost:8000/api/Membres/${memberId}/`);
        if (!res.data.is_sup) {
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
      } catch (error) {
        console.error("Error upgrading member:", error);
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

