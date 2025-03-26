import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";

const ProjectCard = ({ projects }) => {
    const [show, setShow] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Fonction pour ouvrir la popup avec les détails du projet sélectionné
    const handleShow = (project) => {
        setSelectedProject(project);
        setShow(true);
    };

    // Fonction pour fermer la popup
    const handleClose = () => setShow(false);

    return (
        <div className="d-flex flex-wrap justify-content-center">
            {projects.map((project, index) => (
                <Card key={index} className="m-3" style={{ width: "18rem" }}>
                    <Card.Body>
                        <Card.Title>{project.Title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{project.Domain}</Card.Subtitle>
                        <Button variant="primary" onClick={() => handleShow(project)}>
                            Read More
                        </Button>
                    </Card.Body>
                </Card>
            ))}

            {/* Modal pour afficher les détails du projet */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProject?.Title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Domain:</strong> {selectedProject?.Domain}</p>
                    <p><strong>Speciality:</strong> {selectedProject?.Speciality}</p>
                    <p><strong>Date de Début:</strong> {selectedProject?.Date_debut}</p>
                    <p><strong>Date de Fin:</strong> {selectedProject?.Date_fin}</p>
                    <p>
                        <strong>Superviseurs:</strong> {selectedProject?.Supervisers.length > 0
                            ? selectedProject.Supervisers.join(", ")
                            : "Aucun"}
                    </p>
                    <p>
                        <strong>Stagiaires:</strong> {selectedProject?.Stagiers.length > 0
                            ? selectedProject.Stagiers.join(", ")
                            : "Pas de stagiaires"}
                    </p>
                    <Button variant="success" href={selectedProject?.PDF_sujet} target="_blank">
                        Open PDF
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProjectCard;
