import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

function ModifyStagestagiaire() {
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

    if (agreementFile) formData.append("agreement_pdf", agreementFile);
    if (certificateFile) formData.append("certificate_pdf", certificateFile);
    if (reportFile) formData.append("report_pdf", reportFile);
    if (presentationFile) formData.append("presentation_pdf", presentationFile);
    if (codeFile) formData.append("code_pdf", codeFile);

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
    navigate(`/admin-dashboard/Modify-project-stagiers?stage=${id}&sujet_pris=true`);
  };

  return (
    <div className="container mt-4">
      <h3>Modify Stage Intern Info</h3>

      <div className="mb-3">
        <label>Intern</label>
        <Select
          options={singleoptions}
          value={singleselectedoption}
          onChange={handleChangesingle}
        />
      </div>

      <div className="mb-3">
        <label>University</label>
        <input
          type="text"
          className="form-control"
          value={Universite}
          onChange={(e) => setUniversite(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Promotion</label>
        <Select
          options={promotionOptions}
          value={promotionOptions.find(opt => opt.value === Promotion)}
          onChange={handleChangePromotion}
        />
      </div>

      <div className="mb-3">
        <label>Year of Study</label>
        <Select
          options={collegeyearoptions}
          value={Annee_etude}
          onChange={(opt) => setAnnee_etude(opt)}
        />
      </div>

      <div className="mb-3">
        <label>Project Year</label>
        <Select
          options={yearoptions}
          value={Annee}
          onChange={(opt) => setAnnee(opt)}
        />
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

      <div className="mb-3">
        <label>Agreement (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setAgreementFile)} />
      </div>

      <div className="mb-3">
        <label>Certificate (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setCertificateFile)} />
      </div>

      <div className="mb-3">
        <label>Report (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setReportFile)} />
      </div>

      <div className="mb-3">
        <label>Presentation (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setPresentationFile)} />
      </div>

      <div className="mb-3">
        <label>Code File (PDF)</label>
        <input type="file" className="form-control" accept="application/pdf" onChange={(e) => handleFileChange(e, setCodeFile)} />
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-primary" onClick={handleModify}>Modify</button>
        <button className="btn btn-success" onClick={handleFinish}>Finish</button>
      </div>
    </div>
  );
}

export default ModifyStagestagiaire;
