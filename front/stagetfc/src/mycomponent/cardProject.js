import React from 'react';

const ProjectList = ({ projects }) => {
  const openPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div>
      <h2>Liste des Projets</h2>
      <div>
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3>{project.Title}</h3>
            <p><strong>Domain:</strong> {project.Domain}</p>
            <p><strong>Speciality:</strong> {project.Speciality}</p>
            <p><strong>Date Début:</strong> {new Date(project.Date_debut).toLocaleDateString()}</p>
            <p><strong>Date Fin:</strong> {new Date(project.Date_fin).toLocaleDateString()}</p>

            {/* Supervisors */}
            <p><strong>Supervisors:</strong> {project.Supervisers.join(', ')}</p>

            {/* Stagiers */}
            <p>
              <strong>Stagiers:</strong> 
              {project.Stagiers.length > 0 ? project.Stagiers.join(', ') : 'Pas de stagiaires'}
            </p>

            {/* PDF Sujet Button */}
            <button onClick={() => openPDF(project.PDF_sujet)}>Ouvrir PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
