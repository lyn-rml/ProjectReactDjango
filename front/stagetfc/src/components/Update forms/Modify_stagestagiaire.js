import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Main1stage from '../Main1stage';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'

import fileTypeChecker from 'file-type-checker';
import { FileTypes } from 'file-type-checker/dist/core';
import { Form } from 'react-bootstrap';
function ModifyStagestagiaire() {
  const navigate = useNavigate();
  const menuPortalTarget = document.getElementById('root');

  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');
  const sujet_pris = searchparams.get('sujetpris');
  const stageid = sessionStorage.getItem('id');

  // const [count,setcount]=useState(0);
  const [singleoptions, setsingleoptions] = useState([]);
  const [singleselectedoption, setsingleselectedoption] = useState(null);

  const [agreementfile, setagreementfile] = useState(null);
  const [agreementval, setagreementval] = useState(true);
  const [agreementsliced, setagreementsliced] = useState(null);
  const [PDF_Agreement, setPDF_Agreement] = useState(null);
  const [agrbrsval, setagrbrsval] = useState(1);

  const [prolongementfile, setprolongementfile] = useState(null);
  const [prolongementval, setprolongementval] = useState(true);
  const [PDF_Prolongement, setPDF_Prolongement] = useState(null);
  const [prolongememtsliced, setprolongementsliced] = useState(null);
  const [prgbrsval, setprgbrsval] = useState(1);

  const [certificatefile, setcertificatefile] = useState(null);
  const [PDF_Certificate, setPDF_Certificate] = useState(null);
  const [certificateval, setcertificateval] = useState(true);
  const [certificatesliced, setcertificatesliced] = useState(null);
  const [crtbrsval, setcrtbrsval] = useState(1);

  const [codefile, setcodefile] = useState(null);
  const [code, setcode] = useState(null);
  const [codesliced, setcodesliced] = useState(null);
  const [codeval, setcodeval] = useState(false);
  const [codebrsval, setcodebrsval] = useState(1);

  const [rapport, setrapport] = useState(null);
  const [rapportsliced, setrapportsliced] = useState(null);
  const [rapportfile, setrapportfile] = useState(null);
  const [rapportval, setrapportval] = useState(false);
  const [rptbrsval, setrptbrsval] = useState(1);

  const [presentation, setpresentation] = useState(null);
  const [presentationsliced, setpresentationsliced] = useState(null);
  const [presentationfile, setpresentationfile] = useState(null);
  const [presentationval, setpresentationval] = useState(false);
  const [prsbrsval, setprsbrsval] = useState(1);

  const [Annee, setAnnee] = useState({});
  const [Annee_etude, setAnnee_etude] = useState({});
  const [Universite, setUniversite] = useState("");
  const [Promotion, setPromotion] = useState("");

  const [formData, setformData] = useState({
    stage: 0,
    stagiaire: 0,
    internship_name: searchparams.get('stage'),
    intern_name: "",
    PDF_Agreement: null,
    PDF_Prolongement: null,
    PDF_Certificate: null,
    Certified: false,
    Code: null,
    Rapport: null,
    Presentation: null,
    Annee: null,
    Annee_etude: null,
    Universite: "",
    Promotion: "",
  });

  const [yearoptions, setyearoptions] = useState([]);
  const [collegeyearoptions, setcollegeyearoptions] = useState([]);

  async function fill_interns() {
    let opts = [];
    let yearopts = [];
    let collegeyearopts = [];
    await axios.get(`http://localhost:8000/api/stagestagiaire/?stage__id=${id}`)
    .then(res => {
      console.log("Interns data:", res.data.results);
      opts = res.data.results.map(s => ({
          "value": {
              "id": s.stagiaire_id,
              "value": s.stagiaire_id,
          },
          "label": `${s.stagiaire_nom}`,
      }));
      setsingleoptions(opts);
  
      })
      .catch(function (error) {
        console.log(error);
      });
    for (let i = 1950; i < 2200; i++) {
      const newyearopt = {
        value: i,
        label: `${i}`,
      }
      const newcollegeyearopt = {
        value: i,
        label: `${i}-${i + 1}`,
      }
      yearopts.push(newyearopt);
      collegeyearopts.push(newcollegeyearopt);
    }
    setyearoptions(yearopts);
    setcollegeyearoptions(collegeyearopts);
  }

  useEffect(() => { fill_interns() }, []);

  function handleChangesingle(selectedOption) {
    let year = {
      value: 0,
      label: "",
    };
    let colyear = {
      value: 0,
      label: "",
    }
    let codepath = [];
    let rapportpath = [];
    let presentationpath = [];
    let agreementpath = [];
    let prolongementpath = [];
    let certificatepath = [];
    let x = [];
    setsingleselectedoption(selectedOption);
    axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__id=${selectedOption.value.id}`)
      .then(res => {
        console.log("id:", res.data.results.id);
        console.log("data", res.data.results);
        console.log("Agreement:", res.data.results.PDF_Agreement);
        year = {
          value: res.data.results.Annee,
          label: `${res.data.results.Annee}`,
        }
        setUniversite(res.data.results.Universite);
        setAnnee(year);
        x = res.data.results.Annee_etude.split('_');
        console.log("x:", x);
        colyear = {
          value: x[0],
          label: res.data.results.Annee_etude,
        }
        setAnnee_etude(colyear);
        console.log("colyear:", colyear);
        console.log("year:", year);
        setPromotion(res.data.results.Promotion);

        if (res.data.results.PDF_Agreement != null) {
          setPDF_Agreement(res.data.results.PDF_Agreement);
          agreementpath = res.data.results.PDF_Agreement.split('/');
          setagreementsliced(agreementpath[(agreementpath.length) - 1]);
          console.log("agreementsliced:", agreementpath[(agreementpath.length) - 1]);
          setagrbrsval(1);
        }
        else {
          setagrbrsval(0);
        }

        if (res.data.Code !== null) {
          setcode(res.data.results.Code);
          codepath = res.data.results.Code.split('/');
          setcodesliced(codepath[(codepath.length) - 1]);
          setcodebrsval(1);
        }
        else {
          setcodebrsval(0);
        }

        if (res.data.results.Rapport !== null) {
          setrapport(res.data.results.Rapport);
          rapportpath = res.data.results.Rapport.split('/');
          setrapportsliced(rapportpath[(rapportpath.length) - 1]);
          setrptbrsval(1);
        }
        else {
          setrptbrsval(0);
        }

        if (res.data.results.Presentation !== null) {
          setpresentation(res.data.results.Presentation);
          presentationpath = res.data.results.Presentation.split('/');
          setpresentationsliced(presentationpath[(presentationpath.length) - 1]);
          setprsbrsval(1);
        }
        else {
          setprsbrsval(0);
        }

        if (res.data.results.PDF_Prolongement !== null) {
          setPDF_Prolongement(res.data.results.PDF_Prolongement);
          prolongementpath = res.data.results.PDF_Prolongement.split('/');
          setprolongementsliced(prolongementpath[(prolongementpath.length) - 1]);
        }
        setprgbrsval(0);
        if (res.data.results.PDF_Certificate !== null) {
          setPDF_Certificate(res.data.results.PDF_Certificate);
          certificatepath = res.data.results.PDF_Certificate.split('/');
          setcertificatesliced(certificatepath[(certificatepath.length) - 1]);
          setcrtbrsval(1);
        }
        else {
          setcrtbrsval(0);
        }

        setformData({
          id: res.data.results.id,
          stage: res.data.results.stage,
          stagiaire: res.data.results.stagiaire,
          stagiaire_nom: res.data.results.stagiaire_nom,
          stage_titre: res.data.results.stage_titre,
          Universite: res.data.results.Universite,
          Promotion: res.data.results.Promotion,
          Annee: res.data.results.Annee,
          Annee_etude: res.data.results.Annee_etude,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handle_file_aggrement(e) {
    let file = e.target.files[0];
    console.log("file:", file);
    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      console.log("Detected file:", detectedFile);
      console.log("description:", detectedFile.description);
      console.log("extension:", detectedFile.extension);
      console.log("signature:", detectedFile.signature);
      console.log("mimetype", detectedFile.mimeType);
      if (detectedFile.mimeType === "application/pdf") {
        setagreementfile(file);
        setagreementval(true);
      }
      else {
        alert("Only PDF are allowed");
        setagreementval(false);
        file = null;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handle_file_prolongment(e) {
    let file = e.target.files[0];
    console.log("file:", file);
    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      console.log(detectedFile);
      if (detectedFile.mimeType === "application/pdf") {
        setprolongementfile(file);
        setprolongementval(true);
      }
      else {
        alert("Only PDF are allowed");
        setprolongementval(false);
        file = null;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handle_Code(e) {
    let file = e.target.files[0];
    console.log("file:", file);
    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      console.log("Detected file:", detectedFile);
      console.log("description:", detectedFile.description);
      console.log("extension:", detectedFile.extension);
      console.log("signature:", detectedFile.signature);
      console.log("mimetype", detectedFile.mimeType);
      if (detectedFile.mimeType === "application/zip") {
        setcodefile(file);
        setcodeval(true);
      }
      else {
        alert("Only PDF are allowed");
        setcodeval(false);
        file = null;
      }
    };
    reader.readAsArrayBuffer(file);
  }
  function handle_Rapport(e) {
    let file = e.target.files[0];
    console.log("file:", file);
    const reader = new FileReader();
    reader.onload = () => {
      // const detectedFile = fileTypeChecker.detectFile(reader.result);
      // if(detectedFile===undefined)
      // {
      //   console.log("error filetypechecker undefined");
      // }
      console.log("Detected file:", fileTypeChecker.detectFile(reader.result));
      console.log("description:", fileTypeChecker.detectFile(reader.result).description);
      console.log("extension:", fileTypeChecker.detectFile(reader.result).extension);
      console.log("signature:", fileTypeChecker.detectFile(reader.result).signature);
      console.log("mimetype", fileTypeChecker.detectFile(reader.result).mimeType);
      if (fileTypeChecker.detectFile(reader.result).mimeType === "application/zip" || file.type === "application/msword") {
        setrapportfile(file);
        setrapportval(true);
      }
      else {
        alert("Only PDF are allowed");
        setrapportval(false);
        file = null;
      }
    };
    reader.readAsArrayBuffer(file);
  }
  function handle_Presentation(e) {
    let file = e.target.files[0];
    console.log("file:", file);
    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      console.log("Detected file:", detectedFile);
      console.log("description:", detectedFile.description);
      console.log("extension:", detectedFile.extension);
      console.log("signature:", detectedFile.signature);
      console.log("mimetype", detectedFile.mimeType);
      if (detectedFile.mimeType === "application/zip") {
        setpresentationfile(file);
        setpresentationval(true);
      }
      else {
        alert("Only PDF are allowed");
        setpresentationval(false);
        file = null;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handle_file_certificate(e) {
    let file = e.target.files[0];
    console.log("file:", file);
    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      console.log(detectedFile);
      if (detectedFile.mimeType === "application/pdf") {
        setcertificatefile(file);
        setcertificateval(true);
      }
      else {
        alert("Only PDF are allowed");
        setcertificateval(false);
        file = null;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleChangeYear(selectedOption) {
    setAnnee(selectedOption);
  }

  function handleChangeCollegeYear(selectedOption) {
    console.log("Annee etude:", selectedOption);
    setAnnee_etude(selectedOption);
  }

  function handleChangeUniversite(e) {
    setUniversite(e.target.value);
  }

  function handleChangePromotion(e) {
    setPromotion(e.target.value);
  }

  function submit(e) {
    console.log("Code:", codefile);
    console.log("Rapport", rapportfile);
    console.log("Presenation", presentationfile);
    let numberstages = 0;
    let abc = e.target.value;
    console.log("value", abc);
    if (abc !== "Modify interns" && abc !== "Finish") {
      alert("error");
      navigate("/Stage");
    }
    if ((agreementfile !== null && agreementval !== true) || (prolongementfile !== null && prolongementval !== true) || (certificatefile !== null && certificateval !== true) || (rapportfile !== null && rapportval !== true) || (codefile !== null && codeval !== true) || (presentationfile !== null && presentationval !== true)) {
      alert("Unvalid file type");
      window.location.reload();
    }
    if (singleselectedoption !== null && stageid !== 0) {
      formData.stagiaire = parseInt(singleselectedoption.value.value);
      formData.intern_name = singleselectedoption.label;
      formData.stage = parseInt(stageid);
      formData.Universite = Universite;
      formData.Promotion = Promotion;
      formData.Annee = parseInt(Annee.label);
      formData.Annee_etude = Annee_etude.label;
      if (codefile !== null) {
        formData.Code = codefile;
      }
      if (rapportfile !== null) {
        formData.Rapport = rapportfile;
      }
      if (presentationfile !== null) {
        formData.Presentation = presentationfile;
      }
      if (agreementfile !== null) {
        formData.PDF_Agreement = agreementfile;
      }
      if (prolongementfile !== null) {
        formData.PDF_Prolongement = prolongementfile;
      }
      if ((certificatefile !== null && codefile !== null && rapportfile !== null && presentationfile !== null) || (formData.PDF_Certificate !== null && formData.Code !== null && formData.Rapport !== null && formData.Presentation !== null)) {
        if (certificatefile !== null) {
          formData.PDF_Certificate = certificatefile;
        }
        formData.Certified = true;
        if (PDF_Certificate === null) {
          axios.get(`http://localhost:8000/api/Stagiaires/${parseInt(singleselectedoption.value.value)}/`)
            .then(res => {
              numberstages = (res.data.N_Stage);
            });


        }
      }
      else {
        formData.Certified = false;
      }
      e.preventDefault();
      axios.patch(`http://localhost:8000/api/stagestagiaire/${singleselectedoption.value.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(res => {
          console.log("success:", formData);
          console.log("post data:", res.config.data);

          if (abc === "Modify other interns") {
            alert("success");
            window.location.reload();
          }
          else {
            navigate("/Stage");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }



  return (
    <div className="Add-modify">

      <div className="Add-modify-container">
        <div className="top-add-modify">

          <h2 className="title-add-modify">Modify interns information about the project:</h2>

        </div>
        <Form method="post" className="form-add-modify" enctype="multipart/form-data">
          <Form.Group className="add-modif ">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }} className="text-nowrap">Select intern:</span>
            <div style={{ minWidth: "200px", alignItems: "center", marginRight: "3rem" }}>
              <Select
                options={singleoptions}
                value={singleselectedoption}
                onChange={handleChangesingle}
                menuPortalTarget={menuPortalTarget}
              />

            </div>
          </Form.Group>
          <Main1stage name="Universite" id="Universite" label="University" type="text" value={Universite} onChange={handleChangeUniversite} required="required" />
          <Main1stage name="Promotion" id="Promotion" label="Promotion" type="text" value={Promotion} onChange={handleChangePromotion} required="required" />

          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Year of the project:</span>
            <div style={{ minWidth: "200px" }}>
              <Select options={yearoptions} value={Annee} onChange={handleChangeYear} requiredmaxMenuHeight={220} menuPlacement="auto" menuPortalTarget={menuPortalTarget} />
            </div>
          </div>

          <div className="form-group add-modif">
            <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select college year:</span>
            <div style={{ minWidth: "200px" }}>
              <Select options={collegeyearoptions} value={Annee_etude} onChange={handleChangeCollegeYear} required />
            </div>
          </div>

          <Main1stage name2={PDF_Agreement} id2="PDF_agr" label="PDF of Agreement" type2="text" value2={agreementsliced} required="required" readonly="readOnly" linkto={PDF_Agreement} browse_edit="1" browseval={agrbrsval} name1="New PDF Agreement" id1="New_PDF_Agr" type1="file" onChange={handle_file_aggrement} accept="application/pdf" />

          <Main1stage name2={PDF_Prolongement} id2="PDF_Prg" label="PDF of Prolongment" type2="text" value2={prolongememtsliced} required="required" readonly="readOnly" linkto={PDF_Prolongement} browse_edit="1" name1="New PDF_Prolongement" id1="New_PDF_Prg" type1="file" browseval={prgbrsval} onChange={handle_file_prolongment} accept="application/pdf" />

          <Main1stage name2={code} id2="Code_file" label="Code file" type2="text" value2={codesliced} required="required" readonly="readOnly" linkto={code} browse_edit="1" browseval={codebrsval} name1="New Code" id1="New_Code" type1="file" onChange={handle_Code} accept="application/zip" />

          <Main1stage name2={rapport} id2="Rapport_file" label="Report file" type2="text" value2={rapportsliced} required="required" browseval={rptbrsval} readonly="readOnly" linkto={rapport} browse_edit="1" name1="New Rapport" id1="New_Rapport" type1="file" onChange={handle_Rapport} accept=".docx,.doc" />

          <Main1stage name2={presentation} id2="Presentation_file" label="Presentation file" type2="text" value2={presentationsliced} required="required" browseval={prsbrsval} readonly="readOnly" linkto={presentation} browse_edit="1" name1="New Presentation" id1="New_Presentation" type1="file" onChange={handle_Presentation} accept=".pptx,.ppt" />

          <Main1stage name2={PDF_Certificate} id2="PDF_Crt" label="PDF of Certification" type2="text" value2={certificatesliced} required="required" readonly="readOnly" linkto={PDF_Certificate} browse_edit="1" browseval={crtbrsval} name1="New PDF_Certificate" id1="New_PDF_Crt" type1="file" onChange={handle_file_certificate} accept="application/pdf" />

          <div className='form-group' style={{ padding: "1rem" }}>
            <label></label>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
              <input type="submit" class="form-control add-btn-2" value="Modify interns" onClick={submit} readonly />
              <input type="submit" class="form-control add-btn-2" value="Finish" onClick={submit} readonly />
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ModifyStagestagiaire


