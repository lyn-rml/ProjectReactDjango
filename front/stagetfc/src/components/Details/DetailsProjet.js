import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import Navbar from '../Header';
import pdf from '../photos/pdf.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';

function DetailsProject() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const title = searchparams.get('stage');
  const [projects, setProjects] = useState([]);
  const [supervisers, setSupervisers] = useState([]);
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    async function fill_details() {
      let supersx = [];
      let stagiers = [];

      try {
        const res = await axios.get(`http://localhost:8000/api/Stages/?Title__icontains=${title}`);
        setProjects(res.data.results);

        const project = res.data.results[0];
        supersx = project.Supervisers;
        stagiers = project.Stagiers;

        if (supersx.length > 0) {
          for (let id of supersx) {
            try {
              const supRes = await axios.get(`http://localhost:8000/api/Supervisers/${id}/`);
              const sup = {
                id: supRes.data.id,
                name: `${supRes.data.Prenom} ${supRes.data.Nom}`,
              };
              setSupervisers(prev => [...prev, sup]);
            } catch (err) {
              console.error("Error loading supervisor:", err);
            }
          }
        }

        if (stagiers.length > 0) {
          try {
            const internRes = await axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__Nom__icontains=&stagiaire__Prenom__icontains=&stage__Title__iexact=${title}&Annee__icontains=&Promotion__icontains=&Certified=unknown&stage__id=&stagiaire__id=`);
            setInterns(internRes.data);
          } catch (err) {
            console.error("Error loading interns:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    }

    fill_details();
  }, [title]);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Details for project: <span className="text-primary">{title}</span></h2>

      {/* Project Info */}
      {projects.map(project => (
        <div className="card mb-4" key={project.Title}>
          <div className="card-body">
            <h5 className="card-title">Project Information</h5>
            <div className="row mb-2">
              <div className="col-md-4 fw-semibold">Title:</div>
              <div className="col-md-8">{project.Title}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4 fw-semibold">Domain:</div>
              <div className="col-md-8">{project.Domain}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4 fw-semibold">Speciality:</div>
              <div className="col-md-8">{project.Speciality}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4 fw-semibold">Taken:</div>
              <div className="col-md-8">{project.Sujet_pris.toString().toLowerCase() === "true" ? "Yes" : "No"}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 fw-semibold">Date Registered:</div>
              <div className="col-md-8">{project.Date_register}</div>
            </div>
            <div className="d-flex justify-content-between align-items-center border p-3 rounded bg-light">
              <strong>PDF:</strong>
              <a
                href={project.PDF_sujet}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success d-flex align-items-center"
              >
                <FaDownload className="me-2" />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Supervisors */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Supervisors</h5>
          {supervisers.length > 0 ? (
            <ul className="list-group">
              {supervisers.map(sup => (
                <li className="list-group-item" key={sup.id}>
                  {sup.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No supervisors listed.</p>
          )}
        </div>
      </div>

      {/* Interns */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Interns</h5>
          {interns.length > 0 ? (
            <ul className="list-group">
              {interns.map(intern => (
                <li className="list-group-item" key={intern.stagiaire}>
                  {intern.intern_name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No interns found for this project.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailsProject;
