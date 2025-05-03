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
          <Main1stage name="first_name" label="First name" type="text" value={formData.first_name} onChange={handle} required />
          <Main1stage name="last_name" label="Last name" type="text" value={formData.last_name} onChange={handle} required />
          <Main1stage name="Father_name" label="Father name" type="text" value={formData.Father_name} onChange={handle} required />
          <div className="form-group add-modif">
            <span>Date of birth:</span>
            <DatePicker selected={dateOfBirth} onChange={handle_date1} dateFormat="yyyy/MM/dd" required />
          </div>
          <Main1stage name="Place_of_birth" label="Place of birth" type="text" value={formData.Place_of_birth} onChange={handle} required />
          <Main1stage name="phone_number" label="Phone number" type="text" value={formData.phone_number} onChange={handle} required />
          <Main1stage name="Adresse" label="Address" type="text" value={formData.Adresse} onChange={handle} required />
          <Main1stage name="Blood_type" label="Blood Type" type="text" value={formData.Blood_type} onChange={handle} required />
          <Main1stage name="Work" label="Job" type="text" value={formData.Work} onChange={handle} required />
          <Main1stage name="profession" label="Profession" type="text" value={formData.profession} onChange={handle} required />
          <Main1stage name="Domaine" label="Domain" type="text" value={formData.Domaine} onChange={handle} required />
          <Main1stage name="email" label="Email" type="email" value={formData.email} onChange={handle} required />

          <Main1stage name="is_another_association" checkbox="-input" label="Other association" checked={is_another_association} type="checkbox" onChange={handleChecked_autreassociation} />
          <Main1stage name="association_name" label="Other association name" type="text" value={formData.association_name} onChange={handle} />

          <Main1stage
            name="Application_PDF"
            label="PDF file"
            type1="text"
            value1={filesliced}
            readOnly
            required
            linkto={Application_PDF}
            browse_edit="1"
            style={{ color: "black" }}
            onChange={handle_files}
            accept="application/pdf"
            type2="file"
          />
         <div className='form-group' style={{ padding: "1rem" }}>
            <input className="form-control add-btn btn-warning" value="Modify member" readOnly onClick={submit} />
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default UpdateMember;
