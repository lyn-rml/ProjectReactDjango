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
  const [is_another_association, setIsAnotherAssociation] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  const [Application_PDF, setApplication_PDF] = useState(null);
  const [filesliced, setfilesliced] = useState("");
  const [browsefile, setbrowsefile] = useState(null);
  const [fileval, setfileval] = useState(true);

  const [formData, setformData] = useState({
    first_name: "",
    last_name: "",
    Father_name: "",
    Date_of_birth: "",
    Place_of_birth: "",
    phone_number: "",
    Adresse: "",
    Blood_type: "",
    Work: "",
    profession: "",
    Domaine: "",
    email: "",
    is_another_association: false,
    association_name: "",
    Application_PDF: null
  });

  useEffect(() => {
    async function fillMemberData() {
      try {
        const res = await axios.get(`http://localhost:8000/api/Membres/${member}/`);
        const fileParts = res.data.Application_PDF?.split('/');
        const fileName = fileParts?.[fileParts.length - 1] || '';

        setfilesliced(fileName);
        setApplication_PDF(res.data.Application_PDF);
        setformData({ ...res.data, Application_PDF: res.data.Application_PDF });

        setDateOfBirth(new Date(res.data.Date_of_birth));
        setIsAnotherAssociation(res.data.is_another_association);
   
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }
    fillMemberData();
  }, [member]);

  function handle(e) {
    const { name, value } = e.target;
    setformData(prev => ({ ...prev, [name]: value }));
  }

  function handle_date1(date) {
    setDateOfBirth(date);
  }


  function handleChecked_autreassociation(e) {
    setIsAnotherAssociation(e.target.checked);
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

    const requiredFields = [
      "first_name", "last_name", "Father_name", "Place_of_birth",
      "phone_number", "Adresse", "Blood_type", "Work", "profession",
      "Domaine", "email"
    ];

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

    const formattedDate = `${dateOfBirth.getFullYear()}-${(dateOfBirth.getMonth() + 1).toString().padStart(2, '0')}-${dateOfBirth.getDate().toString().padStart(2, '0')}`;
    updatedata.append('Date_of_birth', formattedDate);
    updatedata.append('is_another_association', is_another_association);
 

    axios.patch(`http://localhost:8000/api/Membres/${member}/`, updatedata, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      alert("Member updated successfully!");
      navigate("/admin-dashboard/Member");
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

      <div className="row">
        <div className="col-md-6">
          <label>First name</label>
          <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handle} required />
        </div>
        <div className="col-md-6">
          <label>Last name</label>
          <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handle} required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6" style={{marginLeft:"90px",width:"250px"}}>
          <label>Father name</label>
          <input type="text" name="Father_name" className="form-control" value={formData.Father_name} onChange={handle} required style={{ margin:"0"} }/>
        </div>
        <div className="col-md-6">
          <label>Date of birth</label>
          <DatePicker selected={dateOfBirth} onChange={handle_date1} dateFormat="yyyy/MM/dd" className="form-control" required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label>Place of birth</label>
          <input type="text" name="Place_of_birth" className="form-control" value={formData.Place_of_birth} onChange={handle} required />
        </div>
        <div className="col-md-6">
          <label>Phone number</label>
          <input type="text" name="phone_number" className="form-control" value={formData.phone_number} onChange={handle} required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label>Address</label>
          <input type="text" name="Adresse" className="form-control" value={formData.Adresse} onChange={handle} required />
        </div>
        <div className="col-md-6">
          <label>Blood Type</label>
          <input type="text" name="Blood_type" className="form-control" value={formData.Blood_type} onChange={handle} required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label>Job</label>
          <input type="text" name="Work" className="form-control" value={formData.Work} onChange={handle} required />
        </div>
        <div className="col-md-6">
          <label>Profession</label>
          <input type="text" name="profession" className="form-control" value={formData.profession} onChange={handle} required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label>Domain</label>
          <input type="text" name="Domaine" className="form-control" value={formData.Domaine} onChange={handle} required />
        </div>
        <div className="col-md-6">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handle} required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <input
            type="checkbox"
            name="is_another_association"
            checked={is_another_association}
            onChange={handleChecked_autreassociation}
            className="me-2"
          />
          <label>Other association</label>
        </div>
 

      {is_another_association && (
 
          <div className="col-md-6">
            <label>Other association name</label>
            <input
              type="text"
              name="association_name"
              className="form-control"
              value={formData.association_name}
              onChange={handle}
              required
            />
          </div>
       
      )}
</div>
      <div className="row mt-3">
        <div className="col-md-12">
          <label>PDF file</label>
          <input
            type="file"
            name="Application_PDF"
            onChange={handle_files}
            className="form-control"
            accept="application/pdf"
            required
          />
          <div style={{display:"flex"}}>
          {Application_PDF && (
            <a href={Application_PDF} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary mt-2" >
              View existing PDF
            </a>
          )}
          {filesliced && <p className="mt-1 text-muted">Selected: {filesliced}</p>}
          </div>
        </div>
      </div>

      <div className="form-group" style={{ padding: "1rem" }}>
        <input
          className="form-control btn btn-warning"
          value="Modify member"
          readOnly
          onClick={submit}
        />
      </div>
    </form>
  </div>
</div>

  );
}

export default UpdateMember;
