import React from 'react'
import axios from 'axios'
import Main1stage from '../Main1stage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css"
import { useSearchParams } from 'react-router-dom'
import addDays from "react-datepicker"
import fileTypeChecker from "file-type-checker"
import { useStateManager } from 'react-select'
import { Form, FormGroup } from 'react-bootstrap'

function UpdateProject() {
  const [fileval, setfileval] = useState(true);
  const [filesliced, setfilesliced] = useState(null);
  const [Domain, setDomain] = useState("");
  const [Title, setTitle] = useState("");
  const [Speciality, setSpeciality] = useState("");
  const [Sujet_pris, setSujet_pris] = useState("");
  const [ID, setID] = useState(0);

  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const title = searchparams.get('stage');

  const [PDF_sujet, setPDF_sujet] = useState(null);
  const [formData, setformData] = useState({
    id: 0,
    Domain: "",
    Title: "",
    Speciality: "",
    Sujet_pris: false,
    PDF_sujet: null,
    Date_register: "",
    Supervisers: [],
  });

  const [browsefile, setbrowsefile] = useState(null);
  const [Date_register, setDate_register] = useState(null);

  async function fillProjectData() {
    let x = [];
    await axios.get(`http://localhost:8000/api/Stages/?Title__iexact=${title}`)
      .then(res => {
        console.log(res.data.results);
        setID(res.data.results[0].id);
        setDomain(res.data.results[0].Domain);
        setTitle(res.data.results[0].Title);
        setSpeciality(res.data.results[0].Speciality);
        setSujet_pris(res.data.results[0].Sujet_pris);
        setPDF_sujet(res.data.results[0].PDF_sujet);
        x = res.data.results[0].PDF_sujet.split('/');
        setfilesliced(x[x.length - 1]);
        setDate_register(res.data.results[0].Date_register);

        setformData({
          id: res.data.results[0].id,
          Domain: res.data.results[0].Domain,
          Title: res.data.results[0].Title,
          Speciality: res.data.results[0].Speciality,
          Sujet_pris: res.data.results[0].Sujet_pris,
          PDF_sujet: res.data.results[0].PDF_sujet,
          Date_register: res.data.results[0].Date_register,

        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => { fillProjectData() }, []);


  function handleTitle(e) {
    return setTitle(e.target.value);
  }

  function handleDomain(e) {
    return setDomain(e.target.value);
  }
  function handleSpeciality(e) {
    return setSpeciality(e.target.value);
  }
  function handleChecked(e) {
    if (e.target.checked)
      return setSujet_pris(true);
    return setSujet_pris(false);
  }

  function handle_files(e) {
    try {
      let file = e.target.files[0];
      console.log("file:", file);
      const reader = new FileReader();
      reader.onload = () => {

        const detectedFile = fileTypeChecker.detectFile(reader.result);
        console.log(detectedFile);
        if (detectedFile.mimeType === "application/pdf") {
          setbrowsefile(e.target.files[0]);
          setfileval(true);
        }
        else {
          alert("Only PDF are allowed");
          setfileval(false);
          file = null;
        }

      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error: ", err.message);
    }
  }

  function handle_date(e) {
    setDate_register(e.target.value);
    console.log(" Date_register:", e.target.value);
  }

  function submit(e) {
    if (fileval !== true) {
      alert("Unvalid file type");
      navigate("/Stage");
    }
    console.log(" Date_register submit:", Date_register);
    console.log("formData:", formData);

    console.log("success1");
    e.preventDefault();

    let updatedata = new FormData();
    updatedata.append('id', ID);
    updatedata.append('Title', Title);
    updatedata.append('Domain', Domain);
    updatedata.append('Speciality', Speciality);
    updatedata.append('Sujet_pris', Sujet_pris);
    updatedata.append('Date_debut', Date_register);

    if (browsefile !== null)
      updatedata.append('PDF_sujet', browsefile)

    console.log("PDF:", browsefile);
    console.log("id:", formData.id);
    axios.patch(`http://localhost:8000/api/Stages/${formData.id}/`, updatedata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(res => {
        console.log("Data:", updatedata);
        navigate(`/Modify-project-supervisers?stage=${title}&sujet_pris=${Sujet_pris}`);
        console.log("success:", updatedata);
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    console.log("Domaincscscs:", formData.PDF_sujet),
    console.log("date debut first:", Date_register),

    console.log("formdata", formData),
    <div className="Add-modify">
      <h1 style={{ color: "transparent" }}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
      <div className="Add-modify-container">
        <div className='h-20 bg-#FDB600'>
        </div>
        <h2 className="text-center text-white">Modify project</h2>

        <Form className="d-flex flex-column justify-content-center  align-items-center
                " enctype="multipart/form-data">
          <Main1stage name="Title" id="title" label="Title" type="text" value={Title} onChange={handleTitle} required="required"></Main1stage>

          <Main1stage name="Domain" id="Domain" label="Domain" type="text" value={Domain} onChange={handleDomain} required="required" />
          <Main1stage name="Speciality" id="speciality" label="Speciality" type="text" value={Speciality} onChange={handleSpeciality} required="required" />

          <Main1stage
            name2={PDF_sujet}
            id2="PDF_subject"
            label="PDF of Project"
            type2="text"
             value2={filesliced}
            required="required"
            readonly="readOnly"
            linkto={PDF_sujet}
            browse_edit="1"
            name1="New PDF_subject"
            id1="New_PDF_subject"
            type1="file"
            onChange={handle_files}
            accept="application/pdf" />

          <Main1stage name="project-taken" id="project-taken" checkbox="-input" label="Project is taken" checked={(Sujet_pris === true) ? true : false} type="checkbox" required="required" value={formData.Sujet_pris} onChange={handleChecked} />

          <Main1stage name=" Date_register" id="st_date" label=" Date_register" type="date" value={Date_register} pattern="\d{4}-\d{2}-\d{2}" onChange={handle_date} min="2024-07-25" />

          <Form.Group style={{ padding: "1rem" }}>
            <label></label>
            <Form.Control className=" add-btn" value="Modify Project" readonly onClick={submit} />
          </Form.Group>
        </Form>

      </div>
    </div>
  )
}

export default UpdateProject
