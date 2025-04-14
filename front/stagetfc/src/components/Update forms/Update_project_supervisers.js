import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useSearchParams, useNavigate } from 'react-router-dom';

function UpdateProjectSupervisers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stageId = searchParams.get('stage');
  const sujetPris = searchParams.get('sujet_pris') === 'true';

  const [supervisors, setSupervisors] = useState([]);
  const [mainSupervisor, setMainSupervisor] = useState(null);
  const [otherSupervisors, setOtherSupervisors] = useState([]);
  const [adminEntryId, setAdminEntryId] = useState(null);
  const [existingOtherIds, setExistingOtherIds] = useState([]);

  useEffect(() => {
    if (stageId) {
      fetchData();
    }
  }, [stageId]);

  const fetchData = async () => {
    try {
      const [allSupRes, stageSupRes] = await Promise.all([
        axios.get('http://localhost:8000/api/Supervisers/get_all/'),
        axios.get(`http://localhost:8000/api/supstage/?stage_id=${stageId}`)
      ]);

      const allSupervisors = allSupRes.data.map(s => ({
        value: s.id,
        label: `${s.Nom} ${s.Prenom}`
      }));

      setSupervisors(allSupervisors);

      const main = stageSupRes.data.results.find(s => s.is_admin === true);
      const others = stageSupRes.data.results.filter(s => !s.is_admin);

      setMainSupervisor(
        main ? { value: main.superviser, label: main.superviser_name } : null
      );
      setAdminEntryId(main?.id || null);

      setOtherSupervisors(
        others.map(s => ({
          value: s.superviser,
          label: s.superviser_name
        }))
      );
      setExistingOtherIds(others.map(s => s.id));

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleMainChange = selected => {
    setMainSupervisor(selected);
  };

  const handleOtherChange = selected => {
    setOtherSupervisors(selected || []);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const requests = [];

      // Update main supervisor
      if (mainSupervisor && adminEntryId) {
        requests.push(
          axios.patch(`http://localhost:8000/api/supstage/${adminEntryId}/`, {
            stage: parseInt(stageId),
            superviser: mainSupervisor.value,
            superviser_name: mainSupervisor.label,
            is_admin: true,
          })
        );
      }

      // Delete old other supervisors
      for (let id of existingOtherIds) {
        requests.push(axios.delete(`http://localhost:8000/api/supstage/${id}/`));
      }

      // Add new other supervisors
      for (let supervisor of otherSupervisors) {
        requests.push(
          axios.post(`http://localhost:8000/api/supstage/`, {
            stage: parseInt(stageId),
            superviser: supervisor.value,
            superviser_name: supervisor.label,
            is_admin: false,
          })
        );
      }

      await Promise.all(requests);

      sessionStorage.setItem('id', stageId);
      const target = sujetPris
        ? `/Modify-project-stagiers?stage=${stageId}&sujet_pris=${sujetPris}`
        : `/Modify-project-stagiers?stage=${stageId}&sujet_pris=${sujetPris}`;
      navigate(target);
    } catch (err) {
      console.error('Error updating supervisors:', err);
    }
  };

  // Disable already selected supervisors in dropdowns
  const getAvailableOptions = () => {
    const selectedIds = [
      mainSupervisor?.value,
      ...otherSupervisors.map(s => s.value),
    ];
    return supervisors.filter(opt => !selectedIds.includes(opt.value));
  };

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Modify Supervisors of the Project</h2>
        </div>
        <form onSubmit={handleSubmit} className="form-add-modify">
          <div className="form-group add-modif">
            <span style={{ color: "white", fontSize: "1.75rem" }}>
              Select Main Supervisor:
            </span>
            <Select
              options={supervisors}
              value={mainSupervisor}
              onChange={handleMainChange}
              isClearable
              menuPlacement="auto"
              maxMenuHeight={220}
              required
            />
          </div>

          <div className="form-group add-modif">
            <span style={{ color: "white", fontSize: "1.5rem" }}>
              Select Other Supervisors:
            </span>
            <Select
              isMulti
              options={getAvailableOptions()}
              value={otherSupervisors}
              onChange={handleOtherChange}
              menuPlacement="auto"
              maxMenuHeight={220}
            />
          </div>

          <div className="form-group" style={{ padding: "1rem" }}>
            <input
              type="submit"
              className="form-control add-btn"
              value="Modify supervisor of the project"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProjectSupervisers;
