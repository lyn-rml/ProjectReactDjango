import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Main1stage from '../Main1stage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fileTypeChecker from 'file-type-checker';
import PageInfo from '../../mycomponent/paginationform';
function UpdateMember() {
  const [searchparams] = useSearchParams();
  const memberid = searchparams.get('member');
  const member = parseInt(memberid);
  const navigate = useNavigate();

  const [a_paye, seta_paye] = useState(false);
  const [Autre_association, setAutre_association] = useState(false);
  const [datedebut, setdatedebut] = useState(new Date());

  const [Application_PDF, setApplication_PDF] = useState(null);
  const [filesliced, setfilesliced] = useState("");
  const [browsefile, setbrowsefile] = useState(null);
  const [fileval, setfileval] = useState(true);

  const [formData, setformData] = useState({
    Nom: "",
    Prenom: "",
    Nom_pere: "",
    Date_naissance: "",
    Lieu_naissance: "",
    Telephone: "",
    Adresse: "",
    Groupe_sanguin: "",
    Travail: "",
    Profession: "",
    Domaine: "",
    Email: "",
    Autre_association: false,
    Nom_autre_association: "",
    A_paye: false,
    Application_PDF: null
  });

  useEffect(() => {
    async function fillProjectData() {
      try {
        const res = await axios.get(`http://localhost:8000/api/Membres/${member}/`);
        const fileParts = res.data.Application_PDF?.split('/');
        const fileName = fileParts?.[fileParts.length - 1] || '';

        setfilesliced(fileName);
        setApplication_PDF(res.data.Application_PDF);
        setformData({
          ...res.data,
          Application_PDF: res.data.Application_PDF
        });

        setdatedebut(new Date(res.data.Date_naissance));
        setAutre_association(res.data.Autre_association);
        seta_paye(res.data.A_paye);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }

    fillProjectData();
  }, [member]);

  function handle(e) {
    const { name, value } = e.target;
    setformData(prev => ({ ...prev, [name]: value }));
  }

  function handle_date1(date) {
    setdatedebut(date);
  }

  function handleChecked_apaye(e) {
    seta_paye(e.target.checked);
  }

  function handleChecked_autreassociation(e) {
    setAutre_association(e.target.checked);
  }

  function handle_files(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const detectedFile = fileTypeChecker.detectFile(reader.result);
      if (detectedFile.mimeType === "application/pdf") {
        setbrowsefile(file);
        setfileval(true);
      } else {
        alert("Only PDF files are allowed");
        setfileval(false);
        setbrowsefile(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function submit(e) {
    e.preventDefault();

    if (!fileval) {
      alert("Invalid file type.");
      return;
    }

    const requiredFields = ["Nom", "Prenom", "Nom_pere", "Lieu_naissance", "Telephone", "Adresse", "Groupe_sanguin", "Travail", "Profession", "Domaine", "Email"];
    const missingFields = requiredFields.some(field => !formData[field]);
    if (missingFields) {
      alert("Please fill in all required fields!");
      return;
    }

    const updatedata = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'Application_PDF') {
        updatedata.append(key, formData[key]);
      }
    });

    if (browsefile) {
      updatedata.append('Application_PDF', browsefile);
    }

    const formattedDate = `${datedebut.getFullYear()}-${(datedebut.getMonth() + 1).toString().padStart(2, '0')}-${datedebut.getDate().toString().padStart(2, '0')}`;
    updatedata.append('Date_naissance', formattedDate);
    updatedata.append('Autre_association', Autre_association);
    updatedata.append('A_paye', a_paye);

    axios.patch(`http://localhost:8000/api/Membres/${member}/`, updatedata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(res => {
        alert("Member updated successfully!");
        navigate("/Member");
      })
      .catch(error => {
        console.error("Error updating member:", error);
      });
  }

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Modify member</h2>
        </div>
        <form method="post" className="form-add-modify" encType="multipart/form-data">
          <Main1stage name="Prenom" id="Prenom" label="First name" type="text" value={formData.Prenom} onChange={handle} required />
          <Main1stage name="Nom" id="Nom" label="Last Name" type="text" value={formData.Nom} onChange={handle} required />
          <Main1stage name="Nom_pere" id="Nom_pere" label="Father name" type="text" value={formData.Nom_pere} onChange={handle} required />
          <div className="form-group add-modif">
            <span>Date of birth:</span>
            <DatePicker selected={datedebut} onChange={handle_date1} dateFormat="yyyy/MM/dd" required />
          </div>
          <Main1stage name="Lieu_naissance" id="Lieu_naissance" label="Place of birth" type="text" value={formData.Lieu_naissance} onChange={handle} required />
          <Main1stage name="Telephone" id="Telephone" label="Phone number" type="text" value={formData.Telephone} onChange={handle} required />
          <Main1stage name="Adresse" id="Adresse" label="Address" type="text" value={formData.Adresse} onChange={handle} required />
          <Main1stage name="Groupe_sanguin" id="Groupe_sanguin" label="Blood Group" type="text" value={formData.Groupe_sanguin} onChange={handle} required />
          <Main1stage name="Travail" id="Travail" label="Job" type="text" value={formData.Travail} onChange={handle} required />
          <Main1stage name="Profession" id="Profession" label="Profession" type="text" value={formData.Profession} onChange={handle} required />
          <Main1stage name="Domaine" id="Domaine" label="Domain" type="text" value={formData.Domaine} onChange={handle} required />
          <Main1stage name="Email" id="Email" label="Email" type="email" value={formData.Email} onChange={handle} required />

          <Main1stage name="Autre_association" id="Autre_association" checkbox="-input" label="Other association" checked={Autre_association} type="checkbox" onChange={handleChecked_autreassociation} />
          <Main1stage name="Nom_autre_association" id="Nom_autre_association" label="Other association name" type="text" value={formData.Nom_autre_association} onChange={handle} />

          <Main1stage
            name="Application_PDF"
            id="Application_PDF"
            label="PDF of "
            type1="text"
            value1={filesliced}
            readOnly
            required
            linkto={Application_PDF}
            browse_edit="1"
            style={{color:"black"}}
            onChange={handle_files}
            accept="application/pdf"
            type2="file"
          />
        

          <Main1stage name="A_paye" id="A_paye" checkbox="-input" label="Member had paid" checked={a_paye} type="checkbox" onChange={handleChecked_apaye} required />

          <div className='form-group' style={{ padding: "1rem" }}>
            <input className="form-control add-btn" value="Modify member" readOnly onClick={submit} />
          </div>
        </form>
        <div className="d-flex justify-content-center gap-3">
                <PageInfo index={1} pageNumber={1} />
                </div>
      </div>
    </div>
  );
}

export default UpdateMember;
