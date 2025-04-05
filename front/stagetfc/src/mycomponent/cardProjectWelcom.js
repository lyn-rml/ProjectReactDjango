import React from "react";
import { Card} from "react-bootstrap";

const ProjectCard = ({ projects }) => {
    return (
        <div className="d-flex flex-wrap justify-content-center">
            {projects.map((project, index) => (
                <Card key={index} className="m-3" style={{ width: "18rem" }}>
                    <Card.Body>
                        <Card.Title>{project.Title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{project.Domain}</Card.Subtitle>
                       
                    </Card.Body>
                </Card>
            ))}

            
        </div>
    );
};

export default ProjectCard;
