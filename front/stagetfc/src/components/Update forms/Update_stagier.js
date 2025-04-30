import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Main1stage from '../Main1stage'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageInfo from '../../mycomponent/paginationform'

function UpdateStagier() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const internId = parseInt(searchparams.get('intern'));

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profession: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/Stagiaires/${internId}/`)
      .then(res => {
        setFormData(res.data);
      })
      .catch(error => console.error(error));
  }, [internId]);

  const handle = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const { first_name, last_name, email, phone_number } = formData;

    if (first_name && last_name && email && phone_number) {
      axios.patch(`http://localhost:8000/api/Stagiaires/${internId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(res => {
          alert("Intern modified!");
          navigate("/admin-dashboard/Stagiaire");
        })
        .catch(error => console.error(error));
    } else {
      alert("Input error!");
      window.location.reload();
    }
  };

  return (
    <div className="Add-modify">
      <h1 style={{ color: "transparent" }}>placeholder</h1>
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h6 style={{ color: "transparent" }}>abc</h6>
          <h2 className="title-add-modify">Modify intern</h2>
          <h6 style={{ color: "transparent" }}>def</h6>
        </div>
        <form method="post" className="form-add-modify" encType="multipart/form-data">
          <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

          <Main1stage name="last_name" label="Last Name" type="text" value={formData.last_name} onChange={handle} required />
          <Main1stage name="first_name" label="First Name" type="text" value={formData.first_name} onChange={handle} required />
          <Main1stage name="email" label="Email" type="email" value={formData.email} onChange={handle} required />
          <Main1stage name="phone_number" label="Phone Number" type="text" value={formData.phone_number} onChange={handle} required />
          <Main1stage name="profession" label="Profession" type="text" value={formData.profession} onChange={handle} />

          <div className='form-group' style={{ padding: "1rem" }}>
            <input type="submit" className="form-control add-btn" value="Modify Intern" readOnly onClick={submit} />
          </div>
        </form>
       
      </div>
    </div>
  );
}

export default UpdateStagier;
