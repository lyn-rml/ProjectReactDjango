import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import Navbar from '../Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrisIcon from '../../mycomponent/truefalseicon'
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
function DetailsProject() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');
  const [project, setProject] = useState(null);
  const [supervisers, setSupervisers] = useState([]);
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    async function fill_details() {
      try {
        const res = await axios.get(`http://localhost:8000/api/Stages/${id}/`);
        const projectData = res.data;

        if (!projectData) return;

        setProject(projectData);

        // Fetch Supervisors
        const supers = await Promise.all(
          (projectData.supervisors || []).map(async (supId) => {
            try {
              const supRes = await axios.get(`http://localhost:8000/api/supstage/?supervisor_id=${supId}&project_id=${id}`);
              const result = supRes.data.results?.[0]; // safe access first item
              if (!result) return null;
        
              return {
                id: result.id,
                name: `${result.first_name} ${result.last_name}`,
                role: result.Role
              };
            } catch (err) {
              console.error("Error loading supervisor:", err);
              return null;
            }
          })
        );
        
        setSupervisers(supers.filter(Boolean));

        // Fetch Interns
        if (projectData.interns && projectData.interns.length > 0) {
          const internRes = await axios.get(`http://localhost:8000/api/stagestagiaire/?stage__id=${id}`);
          setInterns(internRes.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    }

    if (id) fill_details();
  }, [id]);

  return (
    <div className="container">

      {project && (<h2 className="mb-4 text-center"><span className="text-warning">{project.Title}</span></h2>)}

      <div className="d-flex flex-wrap justify-content-center gap-4">
        {/* Project Info Box */}
        {project && (
          <div className="custom-box">
            <div className="card-body">
              <h5 className="card-title">Project Information</h5>
              <div className="row mb-2"><div className="col-md-4 fw-semibold">Title:</div><div className="col-md-8">{project.Title}</div></div>
              <div className="row mb-2"><div className="col-md-4 fw-semibold">Domain:</div><div className="col-md-8">{project.Domain}</div></div>
              <div className="row mb-2"><div className="col-md-4 fw-semibold">Speciality:</div><div className="col-md-8">{project.Speciality}</div></div>
              <div className="row mb-2"><div className="col-md-4 fw-semibold">Taken:</div><div className="col-md-8">{<PrisIcon Pris={project.Sujet_pris} />}</div></div>
              <div className="row mb-3"><div className="col-md-4 fw-semibold">Date Registered:</div><div className="col-md-8">{project.Date_register}</div></div>
              <div className="align-items-center p-3">
                <strong>PDF:</strong>
                <a
                  href={project.PDF_subject}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <FaDownload className="me-2" />
                  Open PDF
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Supervisors Box */}
        <div className="custom-box">
          <div className="card-body">
            <h5 className="card-title">Supervisors</h5>
            {supervisers.length > 0 ? (
              <ul className="list-group">
                {supervisers.map(sup => (
                  <li className="list-group-item" key={sup.id}>
                    <Link to={`/admin-dashboard/DetailsSupervisor?superviser=${sup.id}`} className="me-2 project-link">
                      <span>{sup.name}</span>
                    </Link>


                    {sup.role ==='Admin' && (
                      <span className="text-warning" title="Main Supervisor">⭐</span>
                    )}

                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No supervisors listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Interns Box centered below */}
      <div className="mx-auto mt-4 interns-box">
        <div className="card-body">
          <h5 className="card-title">Interns</h5>
          {interns.length > 0 ? (
            <ul className="list-group">
              {interns.map(intern => (
                <li className="list-group-item d-flex flex-column flex-md-row align-items-start justify-content-between gap-2" key={intern.id}>
                  <div className="d-flex flex-wrap gap-2">

                  <Link to={`/admin-dashboard/Detailsintern?id=${intern.id}`} className="me-2 project-link">
                  <span>{intern.Intern_details.first_name}</span> -   <span>{intern.Intern_details.last_name}</span>
                    </Link>
                   
                  </div>
                  <div className="text-muted small">
                    <span className="me-3"> <FaCalendarAlt className="me-2 text-primary" /> Start: <strong>{intern.Start_Date}</strong></span>
                    <span><FaCalendarAlt className="me-2 text-warning" /> End: <strong>{intern.End_Date}</strong></span>
                  </div>
                </li>
              ))}
            </ul>

          ) : (
            <p className="text-muted">No interns listed.</p>
          )}
        </div>
      </div>
    </div>

  );
}

export default DetailsProject;
