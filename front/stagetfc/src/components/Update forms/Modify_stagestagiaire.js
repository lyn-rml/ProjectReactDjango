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
  const [errors, setErrors] = useState({
    universite: '',
    annee_etude: '',
    certificat: '',
    rapport: '',
    code: '',
  });

  const isPDF = (file) => file && file.name.toLowerCase().endsWith('.pdf');
  const isZIP = (file) => file && file.name.toLowerCase().endsWith('.zip');

  const validateForm = () => {
    let validationErrors = {
      universite: '',
      annee_etude: '',
      certificat: '',
      rapport: '',
      code: '',
      presentation: '',
    };

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(Universite.trim())) {
      validationErrors.universite = "Le nom de l'université ne doit contenir que des lettres.";
    }

    if (!/^\d{4}-\d{4}$/.test(Annee_etude.label?.trim?.())) {
      validationErrors.annee_etude = "L'année d'étude doit être au format AAAA-AAAA.";
    }

    if (codeFile && !isZIP(codeFile)) {
      validationErrors.code = "Le fichier code doit être un fichier .zip.";
    }

    if (certificateFile && !isPDF(certificateFile)) {
      validationErrors.certificat = "Le certificat doit être un fichier PDF.";
    }

    if (reportFile && !isPDF(reportFile)) {
      validationErrors.rapport = "Le rapport doit être un fichier PDF.";
    }

    if (presentationFile && !isPDF(presentationFile)) {
      validationErrors.presentation = "La présentation doit être un fichier PDF.";
    }

    // ✅ Removed "required if certified" logic

    setErrors(validationErrors);
    return validationErrors;
  };




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



      for (let i = 2015; i < 2020; i++) {
        yearopts.push({ value: `${i}`, label: `${i}` });  // value as string
        collegeyearopts.push({ value: `${i}`, label: `${i}-${i + 1}` });  // value as string
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
    const validationErrors = validateForm();
    if (Object.values(validationErrors).some((error) => error !== '')) {
      setErrors(validationErrors);  // Set errors to state
      return;
    }
    const formData = new FormData();
    formData.append("University", Universite);
    formData.append("Promotion", Promotion);
    formData.append("Project_year", Annee.value);
    formData.append("Year_of_study", Annee_etude.label);
    formData.append("Certified", isCertified);

    // Ajouter uniquement les fichiers modifiés (de type File)
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
    if (codeFile) {
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
        color: "white"

      }}>
      <div className="container" style={{ maxWidth: "800px", padding: "30px" }}>
        <h2 className="text-center mb-4">Modify Stage Intern Info</h2>

        <div className="mb-3">
          <label>Intern</label>
          <Select
            options={singleoptions}
            value={singleselectedoption}
            onChange={handleChangesingle}
            styles={{
              control: (base) => ({
                ...base,
                color: 'black',
              }),
              singleValue: (base) => ({
                ...base,
                color: 'black',
              }),
              option: (base, state) => ({
                ...base,
                color: 'black',
                backgroundColor: state.isFocused ? '#eaeaea' : 'white',
              }),
              input: (base) => ({
                ...base,
                color: 'black',
              }),
            }}
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
            {errors.universite && <span style={{ color: 'red' }}>{errors.universite}</span>}
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
              styles={{
                control: (base) => ({
                  ...base,
                  color: 'black',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'black',
                }),
                option: (base, state) => ({
                  ...base,
                  color: 'black',
                  backgroundColor: state.isFocused ? '#eaeaea' : 'white',
                }),
                input: (base) => ({
                  ...base,
                  color: 'black',
                }),
              }}
            />
            {errors.annee_etude && <span style={{ color: 'red' }}>{errors.annee_etude}</span>}
          </div>
          <div className="col-md-6 mb-3">
            <label>Project Year</label>
            <Select
              options={yearoptions}
              value={Annee}
              onChange={(opt) => setAnnee(opt)}
              styles={{
                control: (base) => ({
                  ...base,
                  color: 'black',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'black',
                }),
                option: (base, state) => ({
                  ...base,
                  color: 'black',
                  backgroundColor: state.isFocused ? '#eaeaea' : 'white',
                }),
                input: (base) => ({
                  ...base,
                  color: 'black',
                }),
              }}
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
                {agreementFile.preview.split('/').pop()}

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
                {certificateFile.preview.split('/').pop()}
                {errors.certificat && <span style={{ color: 'red' }}>{errors.certificat}</span>}
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
                {reportFile.preview.split('/').pop()}
                {errors.rapport && <span style={{ color: 'red' }}>{errors.rapport}</span>}
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
                {presentationFile.preview.split('/').pop()}
                {errors.presentation && <span style={{ color: 'red' }}>{errors.presentation}</span>}
              </div>
            )}
          </div>
        </div>

       <div className="mb-3">
  <label>Code File (.zip or .rar)</label>
  <input
    type="file"
    className="form-control"
    accept=".zip, .rar, application/x-rar-compressed, application/zip"
  />
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
      {codeFile.preview.split('/').pop()}
      {errors.code && <span style={{ color: 'red' }}>{errors.code}</span>}
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
