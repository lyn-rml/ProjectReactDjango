import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

function ModifyStagestagiaire({ onCancel }) {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');

  const [singleoptions, setsingleoptions] = useState([]);
  const [singleselectedoption, setsingleselectedoption] = useState(null);
  const [Annee, setAnnee] = useState({});
  const [Annee_etude, setAnnee_etude] = useState({});
  const [Universite, setUniversite] = useState("");
  const [Promotion, setPromotion] = useState("");
  const [idupdate, setidupdate] = useState(null);
  const [isCertified, setIsCertified] = useState(false);

  const [agreementFile, setAgreementFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [presentationFile, setPresentationFile] = useState(null);
  const [codeFile, setCodeFile] = useState(null);

  const [yearoptions, setyearoptions] = useState([]);
  const [collegeyearoptions, setcollegeyearoptions] = useState([]);

  useEffect(() => {
    async function fill_interns() {
      let opts = [];
      let yearopts = [];
      let collegeyearopts = [];

      try {
        const res = await axios.get(`http://localhost:8000/api/stagestagiaire/?Project_id=${id}`);
        opts = res.data.results.map(s => ({
          value: {
            id: s.intern_id,
            value: s.intern_id,
          },
          label: `${s.Intern_details.first_name} ${s.Intern_details.last_name}`,
        }));
        setsingleoptions(opts);
        if (opts.length > 0) {
          setsingleselectedoption(opts[0]);
          handleChangesingle(opts[0]);
        }
      } catch (error) {
        console.log(error);
      }

      for (let i = 1950; i < 2200; i++) {
        yearopts.push({ value: i, label: `${i}` });
        collegeyearopts.push({ value: i, label: `${i}-${i + 1}` });
      }
      setyearoptions(yearopts);
      setcollegeyearoptions(collegeyearopts);
    }

    fill_interns();
  }, [id]);

  const handleChangesingle = async (selectedOption) => {
    setsingleselectedoption(selectedOption);
    try {
      const res = await axios.get(`http://localhost:8000/api/stagestagiaire/?intern_id=${selectedOption.value.id}`);
      const result = res.data.results[0];
      setidupdate(result.id);
      setUniversite(result.University);
      setAnnee({ value: result.Project_year, label: `${result.Project_year}` });
      setAnnee_etude({ value: result.Year_of_study.split('_')[0], label: result.Year_of_study });
      setPromotion(result.Promotion);
      setIsCertified(result.Certified);
  
      // Gérer les fichiers s'ils existent (vous devez avoir les bons noms de champs du backend)
      if (result.PDF_Agreement) {
        setAgreementFile({ name: result.PDF_Agreement, preview: result.PDF_Agreement });
      } else {
        setAgreementFile(null);
      }
  
      if (result.PDF_Certified) {
        setCertificateFile({ name: result.PDF_Certified, preview: result.PDF_Certified });
      } else {
        setCertificateFile(null);
      }
  
      if (result.Report_PDF) {
        setReportFile({ name: result.Report_PDF, preview: result.Report_PDF });
      } else {
        setReportFile(null);
      }
  
      if (result.Presentation_PDF) {
        setPresentationFile({ name: result.Presentation_PDF, preview: result.Presentation_PDF });
      } else {
        setPresentationFile(null);
      }
  
      if (result.Code_file) {
        setCodeFile({ name: result.Code_file, preview: result.Code_file });
      } else {
        setCodeFile(null);
      }
  
    } catch (error) {
      console.log(error);
    }
  };
  
  const promotionOptions = [
    { value: 'L1', label: 'L1' },
    { value: 'L2', label: 'L2' },
    { value: 'L3', label: 'L3' },
    { value: 'M1', label: 'M1' },
    { value: 'M2', label: 'M2' },
    { value: 'PhD', label: 'PhD' },
  ];

  const handleChangePromotion = (selectedOption) => {
    setPromotion(selectedOption.value);
  };

  const handleFileChange = (e, setFileState) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFileState(file);
    } else {
      alert("Only PDF files are allowed.");
      e.target.value = "";
    }
  };

  const handleModify = async () => {
    if (!idupdate) {
      alert("No intern selected.");
      return;
    }

    const formData = new FormData();
    formData.append("University", Universite);
    formData.append("Promotion", Promotion);
    formData.append("Project_year", Annee.value);
    formData.append("Year_of_study", Annee_etude.label);
    formData.append("Certified", isCertified);

    if (agreementFile) formData.append("PDF_Agreement", agreementFile);
    if (certificateFile) formData.append("PDF_Certified", certificateFile);
    if (reportFile) formData.append("Report_PDF", reportFile);
    if (presentationFile) formData.append("Presentation_PDF", presentationFile);
    if (codeFile) formData.append("Code_file", codeFile);

    if (agreementFile instanceof File) {
      formData.append("PDF_Agreement", agreementFile);
    }
    if (certificateFile instanceof File) {
      formData.append("PDF_Certified", certificateFile);
    }
    if (reportFile instanceof File) {
      formData.append("Report_PDF", reportFile);
    }
    if (presentationFile instanceof File) {
      formData.append("Presentation_PDF", presentationFile);
    }
    if (codeFile instanceof File) {
      formData.append("Code_file", codeFile);
    }
    try {
      await axios.patch(`http://localhost:8000/api/stagestagiaire/${idupdate}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Intern data updated successfully.");
      
    } catch (error) {
      console.error(error);
      alert("Failed to update intern data.");
    }
  };

  const handleFinish = () => {
    onCancel();
  }
useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth is 0-based
  
    let academicYear = '';
    if (month >= 7) {
      academicYear = `${year}-${year + 1}`;
    } else {
      academicYear = `${year - 1}-${year}`;
    }
  
    setAnnee_etude(academicYear);
  }, []);
  return (
<div className="d-flex justify-content-center" 
 style={{

backgroundColor: "#76ABDD",
borderRadius: "8px",
padding: "1.5rem",
boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
color:"white"

}}>
  <div className="container" style={{ maxWidth: "800px", padding: "30px" }}>
    <h2 className="text-center mb-4">Modify Stage Intern Info</h2>

    <div className="mb-3">
      <label>Intern</label>
      <Select
        options={singleoptions}
        value={singleselectedoption}
        onChange={handleChangesingle}
      />
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label>University</label>
        <input
          type="text"
          className="form-control"
          value={Universite}
          onChange={(e) => setUniversite(e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label>Promotion</label>
        <Select
          options={promotionOptions}
          value={promotionOptions.find(opt => opt.value === Promotion)}
          onChange={handleChangePromotion}
        />
      </div>
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label>Year of Study</label>
        <Select
          options={collegeyearoptions}
          value={Annee_etude}
          onChange={(opt) => setAnnee_etude(opt)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label>Project Year</label>
        <Select
          options={yearoptions}
          value={Annee}
          onChange={(opt) => setAnnee(opt)}
        />
      </div>
    </div>

    <div className="form-check mb-3">
      <input
        type="checkbox"
        className="form-check-input"
        id="certifiedCheckbox"
        checked={isCertified}
        onChange={() => setIsCertified(!isCertified)}
      />
      <label className="form-check-label" htmlFor="certifiedCheckbox">
        Certified
      </label>
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label>Agreement (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setAgreementFile)} />
        
        {agreementFile?.preview && (
  <div
    className="mt-1"
    style={{
      width: '200px',
      backgroundColor: 'white',
      color: 'black',
      padding: '4px 8px',
      borderRadius: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    title={agreementFile.name || agreementFile.preview.split('/').pop()}
  >
    { agreementFile.preview.split('/').pop()}
  </div>
)}



      </div>
      <div className="col-md-6 mb-3">
        <label>Certificate (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setCertificateFile)} />
        {certificateFile?.preview && (
  <div
    className="mt-1"
    style={{
      width: '200px',
      backgroundColor: 'white',
      color: 'black',
      padding: '4px 8px',
      borderRadius: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    title={certificateFile.name || certificateFile.preview.split('/').pop()}
  >
    { certificateFile.preview.split('/').pop()}
  </div>
)}
      </div>
    
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label>Report (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setReportFile)} />
        {reportFile?.preview && (
  <div
    className="mt-1"
    style={{
      width: '200px',
      backgroundColor: 'white',
      color: 'black',
      padding: '4px 8px',
      borderRadius: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    title={reportFile.name || reportFile.preview.split('/').pop()}
  >
    { reportFile.preview.split('/').pop()}
  </div>
)}
      </div>
      
      <div className="col-md-6 mb-3">
        <label>Presentation (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setPresentationFile)} />
        {presentationFile?.preview && (
  <div
    className="mt-1"
    style={{
      width: '200px',
      backgroundColor: 'white',
      color: 'black',
      padding: '4px 8px',
      borderRadius: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    title={presentationFile.name || presentationFile.preview.split('/').pop()}
  >
    { presentationFile.preview.split('/').pop()}
  </div>
)}
      </div>
    </div>

    <div className="mb-3">
      <label>Code File (PDF)</label>

      <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setCodeFile)} />
      {codeFile?.preview && (
  <div
    className="mt-1"
    style={{
      width: '200px',
      backgroundColor: 'white',
      color: 'black',
      padding: '4px 8px',
      borderRadius: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    title={codeFile.name || codeFile.preview.split('/').pop()}
  >
    { codeFile.preview.split('/').pop()}
  </div>
)}
    </div>

    <div className="d-flex justify-content-center mt-4">
      <button className="btn btn-warning" onClick={handleModify}>Modify</button>
      <button className="btn btn-secondary" onClick={handleFinish}>Finish</button>
    </div>
  </div>
</div>

  );
}

export default ModifyStagestagiaire;
