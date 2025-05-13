import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import PrisIcon from "../../mycomponent/truefalseicon";
import { Link } from 'react-router-dom';
const FileItem = ({ label, url }) => {
  const isAvailable = url !== null && url !== undefined && url !== "";

  return (
    <a
      href={isAvailable ? url : "#"}
      target={isAvailable ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`btn d-flex align-items-center ${isAvailable ? "btn-primary" : "btn-warning"}`}
      style={{ pointerEvents: isAvailable ? "auto" : "none", textDecoration: "none" }}
    >
      <strong style={{ margin: "10px" }}>
        {isAvailable ? label : `${label} - No PDF`}
      </strong>
      {isAvailable && <FaDownload className="me-2" />}
    </a>
  );
};


const InfoRow = ({ label, value }) => (
  <div className="row mb-2">
    <div className="col-6 fw-semibold">{label}</div>
    <div className="col-6">{value}</div>
  </div>
);

const DetailsIntern = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState(null);
  const [project, setProject] = useState(null);
  const [intern, setIntern] = useState(null);
  const [supervisers, setSupervisers] = useState([]);
  const [projectslist, setprojectlist] = useState([])
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/stagestagiaire/${id}/`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.error("Error fetching stagestagiaire:", err));
    }
  }, [id]);

  useEffect(() => {
   
    const fetchDetails = async () => {
      try {
        const supers = data.project_details.supervisors || [];
        const supDetails = await Promise.all(
          supers.map(async (supId) => {
            try {
              const res = await axios.get(
                `http://localhost:8000/api/Supervisers/${supId}/`
              );
              return {
                id: res.data.id,
                name: `${res.data.first_name} ${res.data.last_name}`,
              };
            } catch (err) {
              console.error(`Supervisor ${supId} not found`, err);
              return null;
            }
          })
        );
        setSupervisers(supDetails.filter(Boolean));
      } catch (err) {
        console.error("Error fetching details", err);
      }
      const projectslist = await axios.get(
        `http://localhost:8000/api/stagestagiaire/?intern_id=${data.intern_id}`
      );
      setprojectlist(projectslist.data.results)

    };

    fetchDetails();
  }, [data]);

  if (!data) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">

      {/* Intern + Supervisors side by side */}
      <div className="d-flex mb-5 " style={{ gap: "20px" }}>
        {/* Intern Info */}
       
          <div className="card-body custom-box">
            <h5 className="card-title mb-3">Intern Information</h5>
            <InfoRow label="Name:" value={`${data.Intern_details.first_name} ${data.Intern_details.last_name}`} />
            <InfoRow label="Email:" value={data.Intern_details.email} />
            <InfoRow label="Promotion:" value={data.Promotion} />
            <InfoRow label="Telephone:" value={data.Intern_details.phone_number} />
            <InfoRow label="Certified:" value={(<PrisIcon Pris={data.certified}/>) } />
            <InfoRow label="Available:" value={(<PrisIcon Pris={data.Intern_details.available}/>) } />
          <InfoRow label="Is member:" value={data.Id_Membre===null ? <PrisIcon Pris='false'/> : <PrisIcon Pris='true'/>} />
          </div>
        
     


  <div className="card-body custom-box">
    {projectslist.length>0 && (
      <>
        <h5 className="card-title mb-4">
          List of projects by {data.Intern_details.first_name} {data?.Intern_details.last_name}
        </h5>

        {projectslist.map((project, index) => (
          <div key={index} className="mb-3 border-bottom pb-2">
             <Link to={`/admin-dashboard/DetailsStage?stage=${project.Project_id}`} className="me-2 project-link">
                        {project.project_details.Title}
                      </Link>
          
            <div className="text-muted d-flex align-items-center mb-1">
              <FaCalendarAlt className="me-2 text-primary" />
              <span className="me-3"><strong>Start:</strong> {project.Start_Date}</span>
              <FaCalendarAlt className="me-2 text-warning" />
              <span><strong>End:</strong> {project.End_Date}</span>
            </div>
          </div>
        ))}
      </>
    )}
  </div>




      </div>

      {/* Projects Section */}
      <div>
        {[1].map((_, index) => ( // You can map over a real array of projects here
          <div key={index} className="mb-5" style={{marginLeft:"15px"}}>

            <div className="row p-3 interns-box">
              {/* Column 1 - Project Info */}
              <div className="col-md-4 ">
                  <Link to={`/admin-dashboard/DetailsStage?stage=${data.Project_id}`} className="me-2 project-link">
                         <h6>Project Information</h6>
                      </Link>
              

                <InfoRow label="Title:" value={data.project_details.Title} />
                <InfoRow label="Domain:" value={data.project_details.Domain} />
                <InfoRow label="Speciality:" value={data.project_details.Speciality} />
                <InfoRow label="Date Registered:" value={data.project_details.Date_register} />
                <h6>Internship Duration</h6>
                <InfoRow label="Start Date:" value={data.Start_Date} />
                <InfoRow label="End Date:" value={data.End_Date} />
                <InfoRow label="Year:" value={data.Year_of_study} />
              </div>

              {/* Column 2 - Internship Duration */}
              <div className="col-md-4">

                <h5 className="card-title mb-3">Supervisors</h5>
                {supervisers.length > 0 ? (
                  <ul className="list-group">
                    {supervisers.map(sup => (
                      <li className="list-group-item" key={sup.id}>
                        <Link to={`/admin-dashboard/DetailsSupervisor?superviser=${sup.id}`} className="me-2 project-link">
                                              <span>{sup.name}</span>
                                                {sup.id === project?.Main_sup && (
                            <span className="text-warning" title="Main Supervisor">⭐</span>
                          )}
                                            </Link>
                        
                       
                        
                        
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No supervisors listed.</p>
                )}

              </div>

              {/* Column 3 - Files */}
              <div className="col-md-4">
                <h6>Files</h6>
                <FileItem label="Convention PDF" url={data.PDF_Agreement} />
                <FileItem label="Rapport PDF" url={data.Report_PDF} />
                <FileItem label="Presentation PDF" url={data.Presentation_PDF} />
                <FileItem label="Prolongement PDF" url={data.PDF_Prolongement} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default DetailsIntern;
