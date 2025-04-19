import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import Navbar from '../Header';
import { Link } from "react-router-dom"; // if you're using react-router
import { FaStar } from "react-icons/fa"; // star icon
function DetailsSuperviser() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('superviser');  // Get supervisor ID from the URL
  const [superviser, setsupervisers] = useState(null);  // Store supervisor details here
const [ProjectList,setprojectlist]=useState([])
  // Function to fetch supervisor details and other information
  async function fill_details() {
    await axios.get(`http://localhost:8000/api/Supervisers/${id}/`)
      .then(res => {
        setsupervisers(res.data);  // Store the supervisor data in state
      })
      .catch(function (error) {
        console.log(error);
      });
await axios.get(`http://localhost:8000/api/supstage/?sup_id=${id}`)
.then(res=>{
  setprojectlist(res.data.results)
}

)
  }

  useEffect(() => { fill_details() }, []);

  return (
    <div className="d-flex gap-4 flex-wrap justify-content-center align-content-center" style={{marginTop:"100px"}}>
  {superviser && (
    <Card className="custom-box " style={{marginLeft:"40px"}}>
      <Card.Body>
        <Card.Title className="mb-4">Personal Information</Card.Title>
        <div className="row mb-3">
          <div className="col-md-4 fw-semibold">Name:</div>
          <div className="col-md-8">{superviser.Prenom} {superviser.Nom}</div>
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
                <div className="col-md-8">{superviser.Id_Membre !==0 ? superviser.Id_Membre: "Not a Membre"}</div>
              </div>


        </div>
        {/* More personal info... */}
      </Card.Body>
    </Card>
  )}

  <Card className="custom-box " >
    <Card.Body>
      <Card.Title className="mb-4">
        {superviser && <>
        Projects where {superviser.Nom} is Supervisor
        </>}
      </Card.Title>

      {ProjectList.map((project, index) => (
        <div key={index} className="mb-2">
          <Link to={`/project/details/${project.stage}`} className="me-2 project-link">
            {project.stage_title}
          </Link>
          {project.is_admin && <FaStar color="gold" />}
        </div>
      ))}
    </Card.Body>
  </Card>
</div>

  );
}

export default DetailsSuperviser;
