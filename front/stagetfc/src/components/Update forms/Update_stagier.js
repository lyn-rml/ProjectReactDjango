import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Main1stage from '../Main1stage'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageInfo from '../../mycomponent/paginationform'

function UpdateStagier() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const internId = parseInt(searchparams.get('intern'));
const [errors, setErrors] = useState({});

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
    const { first_name, last_name, email, phone_number, profession } = formData;
    const newErrors = {};

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    const phoneRegex = /^\d{2} \d{3} \d{3}$/;

    if (!first_name.trim()) newErrors.first_name = "First name is required";
    else if (!nameRegex.test(first_name)) newErrors.first_name = "Only letters are allowed";

    if (!last_name.trim()) newErrors.last_name = "Last name is required";
    else if (!nameRegex.test(last_name)) newErrors.last_name = "Only letters are allowed";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!phone_number.trim()) newErrors.phone_number = "Phone number is required";
    else if (!phoneRegex.test(phone_number)) newErrors.phone_number = "Format must be 00 000 000";

    if (profession && !nameRegex.test(profession)) {
      newErrors.profession = "Only letters are allowed";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    axios.patch(`http://localhost:8000/api/Stagiaires/${internId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(res => {
        alert("Intern modified!");
        navigate("/admin-dashboard/Stagiaire");
      })
      .catch(error => console.error(error));
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

          <Main1stage name="last_name" label="Last Name" type="text" value={formData.last_name} onChange={handle} />
          {errors.last_name && <small className="text-danger">{errors.last_name}</small>}

          <Main1stage name="first_name" label="First Name" type="text" value={formData.first_name} onChange={handle} />
          {errors.first_name && <small className="text-danger">{errors.first_name}</small>}

          <Main1stage name="email" label="Email" type="email" value={formData.email} onChange={handle} />
          {errors.email && <small className="text-danger">{errors.email}</small>}

          <Main1stage name="phone_number" label="Phone Number" type="text" value={formData.phone_number} onChange={handle} />
          {errors.phone_number && <small className="text-danger">{errors.phone_number}</small>}

          <Main1stage name="profession" label="Profession" type="text" value={formData.profession} onChange={handle} />
          {errors.profession && <small className="text-danger">{errors.profession}</small>}

          <div className='form-group' style={{ padding: "1rem" }}>
            <input type="submit" className="form-control btn btn-warning" value="Modify Intern" readOnly onClick={submit} />
          </div>
        </form>

      </div>
    </div>
  );
}

export default UpdateStagier;
