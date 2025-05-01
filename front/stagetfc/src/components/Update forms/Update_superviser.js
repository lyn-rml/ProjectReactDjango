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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.patch(`http://localhost:8000/api/Supervisers/${id}/`, formData)
      alert("Supervisor updated successfully!")
      navigate("/Superviser")
    } catch (error) {
      console.error("Error updating supervisor:", error)
    }
  }

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Modify Superviser</h2>
        </div>
        <form className="form-add-modify" onSubmit={handleSubmit}>
          <Main1stage name="last_name" label="Last Name" type="text" value={formData.last_name} onChange={handleChange} required />
          <Main1stage name="first_name" label="First Name" type="text" value={formData.first_name} onChange={handleChange} required />
          <Main1stage name="profession" label="Profession" type="text" value={formData.profession} onChange={handleChange} required />
          <Main1stage name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
          <Main1stage name="phone_number" label="Phone" type="text" value={formData.phone_number} onChange={handleChange} required />
          <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateSuperviser
