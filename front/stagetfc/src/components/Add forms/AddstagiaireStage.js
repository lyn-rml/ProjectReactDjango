import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageInfo from '../../mycomponent/paginationform';

function AddStageToInternForm() {
  const [searchParams] = useSearchParams();
  let index = parseInt(searchParams.get('index') || 0) + 1;
  let pageNumber = 2;
  const internId = searchParams.get("id");
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stageId, setStageId] = useState('');
  const [formData, setFormData] = useState({
    PDF_Agreement: null,
    PDF_Prolongement: null,
    University: '',
    Promotion: '',
    Year_of_study: '',
    Project_year: null,
    Start_Date: '',
    End_Date: '',
    Report_PDF: null,
    Presentation_PDF: null,
    Certified: false,
    Code_file: null,
    PDF_Certified: null
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
      [name]:
        type === 'checkbox'
          ? checked
          : name === "Project_year"
            ? parseInt(value)
            : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stageId || !formData.Project_year || !formData.Year_of_study) {
      alert("Please complete all required fields.");
      return;
    }

    const dataToSend = new FormData();

    for (const key in formData) {
      if (formData[key] !== null) {
        dataToSend.append(key, formData[key]);
      }
    }

    dataToSend.append("intern_id", parseInt(internId));
    dataToSend.append("Project_id", parseInt(stageId));
    dataToSend.append("Certified", formData.Certified.toString());

    try {
      await axios.post('http://localhost:8000/api/stagestagiaire/', dataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      await axios.patch(`http://localhost:8000/api/Stages/${stageId}/`, {
        Sujet_pris: true
      });

      alert("Stage successfully assigned to intern!");
      navigate(`/admin-dashboard/Stagiaire`);
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
    <div className="container rounded" style={{ backgroundColor: "#76ABDD" ,}}>
  <div className="row justify-content-center">
    <div className="col-md-8 col-lg-6">
      <h2 className="text-center text-white mb-4">Assign Stage to Intern</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-4 rounded">

        {/* First row with Project and PDF Agreement */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label text-white">Project</label>
            <select
              className="form-select"
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
          <div className=" col-md-6">
            <label className="form-label text-white">PDF Agreement</label>
            <input type="file" name="PDF_Agreement" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
          </div>
        </div>

        {/* Second row with PDF Prolongement and University */}
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label text-white">PDF Prolongement</label>
            <input type="file" name="PDF_Prolongement" className="form-control" accept="application/pdf" onChange={handleFileChange} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-white">University</label>
            <input type="text" name="University" className="form-control" value={formData.University} onChange={handleChange} required />
          </div>
        </div>

        {/* Third row with Promotion and Study Year */}
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label text-white">Promotion</label>
            <input type="text" name="Promotion" className="form-control" value={formData.Promotion} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-white">Study Year</label>
            <input type="text" name="Year_of_study" className="form-control" value={formData.Year_of_study} onChange={handleChange} required />
          </div>
        </div>

        {/* Fourth row with Project Year and Start Date */}
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label text-white">Project Year</label>
            <select name="Project_year" onChange={handleChange} value={formData.Project_year} className='form-control'>
              <option >-- Select Year --</option>
              {[2021, 2022, 2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-white">Start Date</label>
            <input type="date" name="Start_Date" className="form-control" value={formData.Start_Date} onChange={handleChange} required />
          </div>
        </div>

        {/* Fifth row with End Date and Certification Checkbox */}
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label text-white">End Date</label>
            <input type="date" name="End_Date" className="form-control" value={formData.End_Date} onChange={handleChange} required />
          </div>
          <div className="col-12 col-md-6">
            <div className="form-check" style={{padding:"30px"}}>
              <input
                className="form-check-input"
                type="checkbox"
                name="Certified"
                checked={formData.Certified}
                onChange={handleChange}
              />
              <label className="form-check-label text-white" >Certified</label>
            </div>
          </div>
        </div>

        {/* Conditional rendering for Certified fields */}
        {formData.Certified && (
          <>
            {/* Additional fields when Certified is checked */}
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label text-white">PDF Certified</label>
                <input type="file" name="PDF_Certified" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label text-white">Report PDF</label>
                <input type="file" name="Report_PDF" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label text-white">Presentation PDF</label>
                <input type="file" name="Presentation_PDF" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label text-white">Code File</label>
                <input type="file" name="Code_file" className="form-control" accept="application/pdf" onChange={handleFileChange} required />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-warning w-100">Finish</button>
      </form>
    </div>
  </div>
</div>

  );
}

export default AddStageToInternForm;
