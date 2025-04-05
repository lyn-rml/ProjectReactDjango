import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import Navbar from '../Header';

function MembreDetails() {
  const [searchparams] = useSearchParams();
  const id = searchparams.get('member');  // Get the member ID from the URL
  const [membre, setMembre] = useState(null);  // Store member details
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track error state

  // Fetch member details based on the id from the URL
  useEffect(() => {
    setLoading(true);  // Start loading
    setError(null);    // Reset error state
    axios.get(`http://localhost:8000/api/Membres/${id}/`)  // Adjust the API endpoint accordingly
      .then(res => {
        setMembre(res.data);  // Set the member data
        setLoading(false);     // Stop loading
      })
      .catch(error => {
        console.error('Error fetching member data:', error);
        setError('Error fetching member data. Please try again later.');
        setLoading(false);     // Stop loading
      });
  }, [id]);  // Trigger effect when 'id' changes

  return (
    <div className="start">
      
      <Container>
        <h3>Member Details</h3>
        {loading && <p>Loading member details...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Show error if any */}
        
        {membre && !loading && !error && (
          <div>
            <p><strong>Name:</strong> {membre.Prenom} {membre.Nom}</p>
            <p><strong>Date of Birth:</strong> {membre.Date_naissance}</p>
            <p><strong>Place of Birth:</strong> {membre.Lieu_naissance}</p>
            <p><strong>Telephone:</strong> {membre.Telephone}</p>
            <p><strong>Address:</strong> {membre.Adresse}</p>
            <p><strong>Blood Group:</strong> {membre.Groupe_sanguin}</p>
            <p><strong>Profession:</strong> {membre.Profession}</p>
            <p><strong>Domain:</strong> {membre.Domaine}</p>
            <p><strong>Email:</strong> {membre.Email}</p>
            <p><strong>Other Association:</strong> {membre.Autre_association ? "Yes" : "No"}</p>
            {membre.Autre_association && (
              <p><strong>Other Association Name:</strong> {membre.Nom_autre_association}</p>
            )}
           
          </div>
        )}
      </Container>
    </div>
  );
}

export default MembreDetails;
