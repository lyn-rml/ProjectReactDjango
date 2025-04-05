import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from '../Header';
import pdf from '../photos/pdf.jpeg';

function DetailsSuperviser() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('superviser');  // Get supervisor ID from the URL
  const [projects, setprojects] = useState([]);
  const [superviser, setsupervisers] = useState(null);  // Store supervisor details here

  // Function to fetch supervisor details and other information
  async function fill_details() {
    await axios.get(`http://localhost:8000/api/Supervisers/${id}/`)
      .then(res => {
        setsupervisers(res.data);  // Store the supervisor data in state
      })
      .catch(function (error) {
        console.log(error);
      });

    // Fetch projects or other data as needed
  }

  useEffect(() => { fill_details() }, []);

  return (
    <div className="start">
      
      <Container>
        <h3>Supervisor Details</h3>
        {superviser && (
          <div>
            <p><strong>Name:</strong> {superviser.Prenom} {superviser.Nom}</p>
            <p><strong>Email:</strong> {superviser.Email}</p>
            <p><strong>Telephone:</strong> {superviser.Telephone}</p>
            <p><strong>Profession:</strong> {superviser.Profession}</p>
            <p><strong>Member ID:</strong> {superviser.Id_Membre}</p>
          </div>
        )}
      </Container>
    </div>
  );
}

export default DetailsSuperviser;
