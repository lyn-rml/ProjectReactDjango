import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

const FileItem = ({ label, url }) => (
  <div className="d-flex justify-content-between align-items-center border p-3 rounded bg-light mb-2">
    <strong>{label}</strong>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-success d-flex align-items-center"
    >
      <FaDownload className="me-2" />
      Download
    </a>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="row mb-2">
    <div className="col-6 fw-semibold">{label}</div>
    <div className="col-6">{value || "N/A"}</div>
  </div>
);

const DetailsIntern = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState(null);
  const [project, setProject] = useState(null);
  const [intern, setIntern] = useState(null);
  const [supervisers, setSupervisers] = useState([]);

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
    };

    fetchDetails();
  }, [data]);

  if (!data) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">
      {/* Intern Info */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Intern Information</h5>
          <InfoRow label="Name:" value={`${data.stagiaire_prenom} ${data.stagiaire_nom}`} />
          <InfoRow label="Email:" value={data.stagiaire_email} />
          <InfoRow label="Promotion:" value={data.promotion} />
          <InfoRow label="Telephone:" value={intern?.Telephone} />
          <InfoRow label="Certified:" value={data.certified === "true" ? "Yes" : "No"} />
          <InfoRow label="Available:" value={intern?.available === "true" ? "Yes" : "No"} />
        </div>
      </div>

      {/* Project Info */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Project Information</h5>
          <InfoRow label="Title:" value={data.stage_titre} />
          <InfoRow label="Domain:" value={project?.Domain} />
          <InfoRow label="Speciality:" value={project?.Speciality} />
          <InfoRow label="Date Registered:" value={project?.Date_register} />
        </div>
      </div>

      {/* Internship Dates */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Internship Duration</h5>
          <InfoRow label="Start Date:" value={data.date_debut} />
          <InfoRow label="End Date:" value={data.date_fin} />
          <InfoRow label="Year:" value={data.annee} />
        </div>
      </div>

      {/* Supervisors */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Supervisors</h5>
          {supervisers.length > 0 ? (
            <ul className="list-group">
              {supervisers.map((sup) => (
                <li key={sup.id} className="list-group-item">
                  {sup.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No supervisors listed.</p>
          )}
        </div>
      </div>

      {/* Files Section */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Files</h5>
          <FileItem label="Convention PDF" url={data.convention} />
          <FileItem label="Rapport PDF" url={data.pdf_Rapport} />
          <FileItem label="Presentation PDF" url={data.pdf_Presentation} />
          <FileItem label="Prolongement PDF" url={data.pdf_Prolongement} />
        </div>
      </div>
    </div>
  );
};

export default DetailsIntern;
