import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fileTypeChecker from 'file-type-checker';

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
  const [errors, setErrors] = useState({});

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

  const nameRegex = /^[A-Za-z\s]+$/;
  const bloodRegex = /^(A|B|AB|O)[+-]$/;

  function handle(e) {
    const { name, value } = e.target;
    let error = "";

    if (
      ["first_name", "last_name", "Father_name", "Place_of_birth", "Adresse", "Work", "Domaine", "association_name"].includes(name)
    ) {
      if (!nameRegex.test(value)) {
        error = "Only letters and spaces are allowed";
      }
    }

    if (name === "Blood_type") {
      if (!bloodRegex.test(value)) {
        error = "Blood type must be A+, A-, B+, B-, AB+, AB-, O+ or O-";
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
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

    const hasErrors = Object.values(errors).some(err => err);
    if (hasErrors) {
      alert("Please fix the errors in the form.");
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
       <form method="post" className="form-add-modify" encType="multipart/form-data" onSubmit={submit}>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>First name</label>
      <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handle} required />
      {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
    </div>
    <div className="col-md-6 mb-3">
      <label>Last name</label>
      <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handle} required />
      {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Father name</label>
      <input type="text" name="Father_name" className="form-control" value={formData.Father_name} onChange={handle} required />
      {errors.Father_name && <div className="text-danger">{errors.Father_name}</div>}
    </div>
    <div className="col-md-6 mb-3">
      <label>Place of birth</label>
      <input type="text" name="Place_of_birth" className="form-control" value={formData.Place_of_birth} onChange={handle} required />
      {errors.Place_of_birth && <div className="text-danger">{errors.Place_of_birth}</div>}
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Address</label>
      <input type="text" name="Adresse" className="form-control" value={formData.Adresse} onChange={handle} required />
      {errors.Adresse && <div className="text-danger">{errors.Adresse}</div>}
    </div>
    <div className="col-md-6 mb-3">
      <label>Blood Type</label>
      <input type="text" name="Blood_type" className="form-control" value={formData.Blood_type} onChange={handle} required />
      {errors.Blood_type && <div className="text-danger">{errors.Blood_type}</div>}
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Job</label>
      <input type="text" name="Work" className="form-control" value={formData.Work} onChange={handle} required />
      {errors.Work && <div className="text-danger">{errors.Work}</div>}
    </div>
    <div className="col-md-6 mb-3">
      <label>Profession</label>
      <input type="text" name="profession" className="form-control" value={formData.profession} onChange={handle} required />
      {errors.profession && <div className="text-danger">{errors.profession}</div>}
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3">
      <label>Domain</label>
      <input type="text" name="Domaine" className="form-control" value={formData.Domaine} onChange={handle} required />
      {errors.Domaine && <div className="text-danger">{errors.Domaine}</div>}
    </div>
    <div className="col-md-6 mb-3">
      <label>Email</label>
      <input type="email" name="email" className="form-control" value={formData.email} onChange={handle} required />
      {errors.email && <div className="text-danger">{errors.email}</div>}
    </div>
  </div>

  <div className="row">
    <div className="col-md-6 mb-3" style={{marginLeft:"100px",width:"250px"}}>
      <label>Phone number</label>
      <input type="text" name="phone_number" className="form-control" value={formData.phone_number} onChange={handle} required />
    </div>
    <div className="col-md-6 mb-3">
      <label>Date of birth</label>
      <DatePicker selected={dateOfBirth} onChange={handle_date1} dateFormat="yyyy/MM/dd" className="form-control" required />
    </div>
  </div>

  <div className="form-check mb-3">
    <input type="checkbox" name="is_another_association" checked={is_another_association} onChange={handleChecked_autreassociation} className="form-check-input" />
    <label className="form-check-label">Other association</label>
  </div>

  {is_another_association && (
    <div className="mb-3">
      <label>Other association name</label>
      <input type="text" name="association_name" className="form-control" value={formData.association_name} onChange={handle} required />
      {errors.association_name && <div className="text-danger">{errors.association_name}</div>}
    </div>
  )}

  <div className="mb-3">
    <label>PDF file</label>
    <input type="file" className="form-control" onChange={handle_files} />
    {filesliced && <div>Current file: {filesliced}</div>}
  </div>

  <button type="submit" className="btn btn-primary">Update Member</button>
</form>

      </div>
    </div>
  );
}

export default UpdateMember;
