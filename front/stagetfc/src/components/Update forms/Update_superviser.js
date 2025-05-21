import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Main1stage from '../Main1stage'

function UpdateSuperviser() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('superviser')
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    profession: '',
    email: '',
    phone_number: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    async function fetchSupervisor() {
      try {
        const res = await axios.get(`http://localhost:8000/api/Supervisers/${id}/`)
        const s = res.data
        setFormData({
          first_name: s.first_name || '',
          last_name: s.last_name || '',
          profession: s.profession || '',
          email: s.email || '',
          phone_number: s.phone_number || '',
        })
      } catch (error) {
        console.error("Error fetching supervisor:", error)
      }
    }

    if (id) {
      fetchSupervisor()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}

    // Basic required fields
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required."
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required."
    if (!formData.profession.trim()) newErrors.profession = "Profession is required."
    if (!formData.email.trim()) newErrors.email = "Email is required."
    if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required."

    // Regex for letters, spaces, apostrophes or hyphens
    const lettersOnlyRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/
    if (formData.first_name && !lettersOnlyRegex.test(formData.first_name)) {
      newErrors.first_name = "First name must contain only letters, spaces, apostrophes or hyphens."
    }
    if (formData.last_name && !lettersOnlyRegex.test(formData.last_name)) {
      newErrors.last_name = "Last name must contain only letters, spaces, apostrophes or hyphens."
    }
    if (formData.profession && !lettersOnlyRegex.test(formData.profession)) {
      newErrors.profession = "Profession must contain only letters, spaces, apostrophes or hyphens."
    }

    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email must be a valid email address."
    }

    // Phone number format: 00 000 000
    const phoneRegex = /^\d{2} \d{3} \d{3}$/
    if (formData.phone_number && !phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be in the format '00 000 000'."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await axios.patch(`http://localhost:8000/api/Supervisers/${id}/`, formData)
      alert("Supervisor updated successfully!")
      navigate("/admin-dashboard/Superviser")
    } catch (error) {
      console.error("Error updating supervisor:", error)
      alert("Failed to update supervisor.")
    }
  }

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Modify Supervisor</h2>
        </div>
        <form className="form-add-modify" onSubmit={handleSubmit} noValidate>
          <Main1stage
            name="last_name"
            label="Last Name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          {errors.last_name && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.last_name}</div>}

          <Main1stage
            name="first_name"
            label="First Name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          {errors.first_name && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.first_name}</div>}

          <Main1stage
            name="profession"
            label="Profession"
            type="text"
            value={formData.profession}
            onChange={handleChange}
            required
          />
          {errors.profession && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.profession}</div>}

          <Main1stage
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.email}</div>}

          <Main1stage
            name="phone_number"
            label="Phone"
            type="text"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          {errors.phone_number && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.phone_number}</div>}

          <button type="submit" className="btn btn-warning mt-3">Save Changes</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateSuperviser
