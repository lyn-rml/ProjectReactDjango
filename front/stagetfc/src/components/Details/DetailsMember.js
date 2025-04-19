import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import PrisIcon from '../../mycomponent/truefalseicon';

function MembreDetails() {
  const [searchparams] = useSearchParams();
  const id = searchparams.get('member'); // Get the member ID from the URL
  const [membre, setMembre] = useState(null); // Store member details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  // Fetch member details based on the id from the URL
  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    axios.get(`http://localhost:8000/api/Membres/${id}/`) // Adjust the API endpoint accordingly
      .then(res => {
        setMembre(res.data); // Set the member data
        setLoading(false); // Stop loading
      })
      .catch(error => {
        console.error('Error fetching member data:', error);
        setError('Error fetching member data. Please try again later.');
        setLoading(false); // Stop loading
      });
  }, [id]); // Trigger effect when 'id' changes

  return (
    <div className="start">
      <Container className="my-5 ">
       {membre &&(<h3 className="mb-4 text-warning">{membre.Nom} Member Details</h3>)} 
        {loading && <p>Loading member details...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error if any */}

        {membre && !loading && !error && (
          <Card className='interns-box'>
            <Card.Body>
              <Card.Title className="mb-4">Personal Information</Card.Title>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Name:</div>
                <div className="col-md-8">{membre.Prenom} {membre.Nom}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Date of Birth:</div>
                <div className="col-md-8">{membre.Date_naissance}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Place of Birth:</div>
                <div className="col-md-8">{membre.Lieu_naissance}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Telephone:</div>
                <div className="col-md-8">{membre.Telephone}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Address:</div>
                <div className="col-md-8">{membre.Adresse}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Blood Group:</div>
                <div className="col-md-8">{membre.Groupe_sanguin}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Profession:</div>
                <div className="col-md-8">{membre.Profession}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Domain:</div>
                <div className="col-md-8">{membre.Domaine}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Email:</div>
                <div className="col-md-8">{membre.Email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold text-dark">Supervisor or no:</div>
                <div className="col-md-8">
                 
                  <div> <PrisIcon Pris={membre.is_sup}/></div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Other Association:</div>
                <div className="col-md-8"><PrisIcon Pris={membre.Autre_association}/></div>
              </div>
              {membre.Autre_association && (
                <div className="row mb-3">
                  <div className="col-md-4 fw-semibold">Other Association Name:</div>
                  <div className="col-md-8">{membre.Nom_autre_association}</div>
                </div>
              )}

            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default MembreDetails;
