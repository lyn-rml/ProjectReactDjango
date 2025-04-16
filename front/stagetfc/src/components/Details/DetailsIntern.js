import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import PrisIcon from "../../mycomponent/truefalseicon";
const FileItem = ({ label, url }) => (


  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-primary d-flex align-items-center"
  >
    <strong style={{ margin: "10px" }}>{label}</strong>
    <FaDownload className="me-2" />
  </a>

);

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
    if (!data?.stage_id || !data?.stagiaire_id) return;

    const fetchDetails = async () => {
      try {
        const stageRes = await axios.get(
          `http://localhost:8000/api/Stages/${data.stage_id}/`
        );
        setProject(stageRes.data);

        const internRes = await axios.get(
          `http://localhost:8000/api/Stagiaires/${data.stagiaire_id}/`
        );
        setIntern(internRes.data);

        const supers = stageRes.data.Supervisers || [];
        const supDetails = await Promise.all(
          supers.map(async (supId) => {
            try {
              const res = await axios.get(
                `http://localhost:8000/api/Supervisers/${supId}/`
              );
              return {
                id: res.data.id,
                name: `${res.data.Prenom} ${res.data.Nom}`,
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
        `http://localhost:8000/api/stagestagiaire/?stagiaire__id=${data.stagiaire_id}`
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
        <div className="card" style={{ width: "600px",marginLeft:"40px" }}>
          <div className="card-body custom-box">
            <h5 className="card-title mb-3">Intern Information</h5>
            <InfoRow label="Name:" value={`${data.stagiaire_prenom} ${data.stagiaire_nom}`} />
            <InfoRow label="Email:" value={data.stagiaire_email} />
            <InfoRow label="Promotion:" value={data.Promotion} />
            <InfoRow label="Telephone:" value={intern?.Telephone} />
            <InfoRow label="Certified:" value={(<PrisIcon Pris={data.certified}/>) } />
            <InfoRow label="Available:" value={(<PrisIcon Pris={intern?.available}/>) } />
          </div>
        </div>
     

<div className="card" style={{ width: "600px" }}>
  <div className="card-body custom-box">
    {projectslist.length>0 && (
      <>
        <h5 className="card-title mb-4">
          List of projects by {data?.stagiaire_prenom} {data?.stagiaire_nom}
        </h5>

        {projectslist.map((project, index) => (
          <div key={index} className="mb-3 border-bottom pb-2">
            <div className="fw-semibold mb-2">• {project.stage_titre}</div>
            <div className="text-muted d-flex align-items-center mb-1">
              <FaCalendarAlt className="me-2 text-primary" />
              <span className="me-3"><strong>Start:</strong> {project.Date_debut}</span>
              <FaCalendarAlt className="me-2 text-warning" />
              <span><strong>End:</strong> {project.Date_fin}</span>
            </div>
          </div>
        ))}
      </>
    )}
  </div>
</div>



      </div>

      {/* Projects Section */}
      <div  style={{ width: "1100px",marginLeft:"60px" }}>
        {[1].map((_, index) => ( // You can map over a real array of projects here
          <div key={index} className="card mb-5">

            <div className="row p-3 interns-box">
              {/* Column 1 - Project Info */}
              <div className="col-md-4 ">
                <h6>Project Information</h6>
                <InfoRow label="Title:" value={data.stage_titre} />
                <InfoRow label="Domain:" value={project?.Domain} />
                <InfoRow label="Speciality:" value={project?.Speciality} />
                <InfoRow label="Date Registered:" value={project?.Date_register} />
                <h6>Internship Duration</h6>
                <InfoRow label="Start Date:" value={data.Date_debut} />
                <InfoRow label="End Date:" value={data.Date_fin} />
                <InfoRow label="Year:" value={data.Annee_etude} />
              </div>

              {/* Column 2 - Internship Duration */}
              <div className="col-md-4">

                <h5 className="card-title mb-3">Supervisors</h5>
                {supervisers.length > 0 ? (
                  <ul className="list-group">
                    {supervisers.map(sup => (
                      <li className="list-group-item" key={sup.id}>
                        <a
                          href={`/DetailsSupervisor?superviser=${sup.id}`}
                          className="d-flex align-items-center justify-content-between text-decoration-none text-dark hover-underline"
                        >
                          <span>{sup.name}</span>
                          {sup.id === project?.Main_sup && (
                            <span className="text-warning" title="Main Supervisor">⭐</span>
                          )}
                        </a>
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
                <FileItem label="Convention PDF" url={data.convention} />
                <FileItem label="Rapport PDF" url={data.pdf_Rapport} />
                <FileItem label="Presentation PDF" url={data.pdf_Presentation} />
                <FileItem label="Prolongement PDF" url={data.pdf_Prolongement} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default DetailsIntern;
