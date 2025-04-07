import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import Navbar from '../Header';

function DetailsSuperviser() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('superviser');  // Get supervisor ID from the URL
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
  }

  useEffect(() => { fill_details() }, []);

  return (
    <div className="start">
      <Container className="my-5">
        <h3 className="mb-4">Supervisor Details</h3>
        {superviser && (
          <Card>
            <Card.Body>
              <Card.Title className="mb-4">Personal Information</Card.Title>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Name:</div>
                <div className="col-md-8">{superviser.Prenom} {superviser.Nom}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Email:</div>
                <div className="col-md-8">{superviser.Email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Telephone:</div>
                <div className="col-md-8">{superviser.Telephone}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Profession:</div>
                <div className="col-md-8">{superviser.Profession}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Member ID:</div>
                <div className="col-md-8">{superviser.Id_Membre}</div>
              </div>

            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default DetailsSuperviser;
