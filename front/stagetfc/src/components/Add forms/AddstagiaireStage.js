import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageInfo from '../../mycomponent/paginationform';
function AddStageToInternForm() {
  const [searchParams] = useSearchParams();
  let index = searchParams.get('index')
  index++
  let pageNumber = 2
  const internId = searchParams.get("id");
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stageId, setStageId] = useState('');
  const [formData, setFormData] = useState({
    PDF_Agreement: null,
    PDF_Prolongement: null,
    Universite: '',
    Promotion: '',
    Annee_etude: '',
    Annee: '',
    Date_debut: '',
    Date_fin: '',
    Rapport: null,
    Presentation: null,
    Certified: false,
    Code: null,
    PDF_Certificate: null
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/Stages/')
      .then(res => setProjects(res.data?.results || []))
      .catch(err => console.error("Error fetching stages:", err));
  }, []);

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stageId || !formData.Annee || !formData.Annee_etude) {
      alert("Please complete all required fields.");
      return;
    }

    const dataToSend = new FormData();

    for (const key in formData) {
      if (formData[key] !== null) {
        dataToSend.append(key, formData[key]);
      }
    }

    dataToSend.append("stagiaire", parseInt(internId));
    dataToSend.append("stage", parseInt(stageId));
    dataToSend.append("Certified", formData.Certified.toString());

    try {
      await axios.post('http://localhost:8000/api/stagestagiaire/', dataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const internRes = await axios.get(`http://localhost:8000/api/Stagiaires/${internId}/`);
      const currentStages = internRes.data.N_stage || [];

      const updatedStages = currentStages.includes(parseInt(stageId))
        ? currentStages
        : [...currentStages, parseInt(stageId)];

      await axios.patch(`http://localhost:8000/api/Stagiaires/${internId}/`, {
        N_stage: updatedStages
      });

      await axios.patch(`http://localhost:8000/api/Stages/${stageId}/`, {
        Sujet_pris: true
      });

      alert("Stage successfully assigned to intern!");
      navigate(`/Stagiaire`);
    } catch (error) {
      console.error("Error submitting form:", error.response || error.message);
      if (error.response) {
        alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        alert("An error occurred while submitting the form.");
      }
    }
  };

  return (
    <div className="container rounded" style={{ backgroundColor: "black" }}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="text-center text-white mb-4">Assign Stage to Intern</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className=" p-4 rounded">

            <div className="mb-3">
              <label className="form-label text-white">Project</label>
              <select
                className="form-select "
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.Title}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label text-white">PDF Agreement</label>
              <input type="file" name="PDF_Agreement" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">PDF Prolongement</label>
              <input type="file" name="PDF_Prolongement" className="form-control" accept="application/pdf" onChange={handleFileChange} />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">University</label>
              <input type="text" name="Universite" className="form-control" value={formData.Universite} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">Promotion</label>
              <input type="text" name="Promotion" className="form-control" value={formData.Promotion} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">Study Year</label>
              <input type="text" name="Annee_etude" className="form-control" value={formData.Annee_etude} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">Project Year</label>
              <input type="text" name="Annee" className="form-control" value={formData.Annee} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">Start Date</label>
              <input type="date" name="Date_debut" className="form-control" value={formData.Date_debut} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">End Date</label>
              <input type="date" name="Date_fin" className="form-control" value={formData.Date_fin} onChange={handleChange} required />
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="Certified"
                checked={formData.Certified}
                onChange={handleChange}
              />
              <label className="form-check-label text-white">Certified</label>
            </div>

            {formData.Certified && (
              <>
                <div className="mb-3">
                  <label className="form-label text-white">PDF_Certificate</label>
                  <input type="file" name="PDF_Certificate" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">Rapport</label>
                  <input type="file" name="Rapport" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Presentation</label>
                  <input type="file" name="Presentation" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Code</label>
                  <input type="file" name="Code" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary w-100">Finish</button>
          </form>
          <div className="d-flex justify-content-center gap-3">
            <PageInfo index={index} pageNumber={pageNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStageToInternForm;
