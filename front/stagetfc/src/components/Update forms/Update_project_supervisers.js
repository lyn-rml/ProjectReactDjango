import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
const UpdateProjectSupervisers = () => {
  const [searchParams] = useSearchParams();
  const stageId = searchParams.get('stage');
  const sujetPris=searchParams.get('sujet_pris')
  const navigate = useNavigate();
  const [supervisors, setSupervisors] = useState([]);
  const [mainSupervisor, setMainSupervisor] = useState(null);
  const [otherSupervisors, setOtherSupervisors] = useState([]);
  const [adminEntryId, setAdminEntryId] = useState(null);
  const [existingOtherIds, setExistingOtherIds] = useState([]);

  useEffect(() => {
    fetchData();
  }, [stageId]);

  const fetchData = async () => {
    try {
      const [allSupRes, stageSupRes] = await Promise.all([
        axios.get('http://localhost:8000/api/Supervisers/'),
        axios.get(`http://localhost:8000/api/supstage/?project_id=${stageId}`)
      ]);

      const allSupervisors = allSupRes.data.results.map(s => ({
        value: s.id,
        label: `${s.first_name} ${s.last_name}`,
        id_member: s.Id_Membre,
      }));

      setSupervisors(allSupervisors);

      const main = stageSupRes.data.results.find(s => s.Role === 'Admin');
      const others = stageSupRes.data.results.filter(s => s.Role === 'Other');

      setMainSupervisor(
        main ? { value: main.supervisor_id, label: main.supervisor_name } : null
      );
      setAdminEntryId(main?.id || null);

      setOtherSupervisors(
        others.map(s => ({
          value: s.supervisor_id,
          label: s.supervisor_name
        }))
      );
      setExistingOtherIds(others.map(s => s.id));

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Update or create main supervisor
      if (mainSupervisor) {
        if (adminEntryId) {
          await axios.put(`http://localhost:8000/api/supstage/${adminEntryId}/`, {
            project_id: stageId,
            supervisor_id: mainSupervisor.value,
            Role: 'Admin',
          });
        } else {
          const res = await axios.post('http://localhost:8000/api/supstage/', {
            project_id: stageId,
            supervisor_id: mainSupervisor.value,
            Role: 'Admin',
          });
          setAdminEntryId(res.data.id);
        }
      }
  
      // Update or create other supervisors
      for (let i = 0; i < otherSupervisors.length; i++) {
        const supervisor = otherSupervisors[i];
  
        if (existingOtherIds[i]) {
          await axios.put(`http://localhost:8000/api/supstage/${existingOtherIds[i]}/`, {
            project_id: stageId,
            supervisor_id: supervisor.value,
            Role: 'Other',
          });
        } else {
          const res = await axios.post('http://localhost:8000/api/supstage/', {
            project_id: stageId,
            supervisor_id: supervisor.value,
            Role: 'Other',
          });
          existingOtherIds[i] = res.data.id;
        }
      }
  
      // Delete supervisors that are removed
      const selectedIds = otherSupervisors.map(s => s.value);
      for (let i = 0; i < existingOtherIds.length; i++) {
        const id = existingOtherIds[i];
        const supValue = otherSupervisors[i]?.value;
        if (!selectedIds.includes(supValue)) {
          await axios.delete(`http://localhost:8000/api/supstage/${id}/`);
        }
      }
  
      alert('Supervisors updated successfully!');
      fetchData(); // Refresh data after submit
  
    } catch (err) {
      console.error('Error updating supervisors:', err.response?.data || err);
      alert('Error while updating supervisors.');
    }
  };
  

  return (
    <div className="container">
      <h2 className="mb-4">Update Project Supervisors</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Main Supervisor:</label>
          <Select
            options={supervisors.filter(s => s.id_member !== null)} // only member supervisors
            value={mainSupervisor}
            onChange={setMainSupervisor}
            isClearable
            placeholder="Select main supervisor"
          />
        </div>

        <div className="mb-4">
          <label>Other Supervisors:</label>
          <Select
            options={supervisors}
            value={otherSupervisors}
            onChange={setOtherSupervisors}
            isMulti
            placeholder="Select additional supervisors"
          />
        </div>

        <button type="submit" className="btn btn-primary">Save</button>
      </form>
      <button className="btn btn-primary" onClick={()=>{
navigate(`/admin-dashboard/Modify-project-stagiers?stage=${stageId}&sujet_pris=${sujetPris}`)
      }}>go next step </button>
    </div>
  );
};

export default UpdateProjectSupervisers;
