import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { Container, Row, Col, Image, Button, Card } from "react-bootstrap";
import axios from "axios";
import logo from "../components/photos/logo1.png";

function Welcome() {
    const navigate = useNavigate(); // Navigation hook

    // State for projects without interns
    const [Supstages, setSupstages] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);

    async function fetchProjects() {
        try {
            const res = await axios.get("http://localhost:8000/api/Stages/?Sujet_pris=false");

            if (res.data) {
                const projects = Array.isArray(res.data) ? res.data : res.data.results || [];
                setSupstages(projects); // Display all projects
                setTotalProjects(projects.length); // Store total count
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    // State for unpaid members
    const [members, setMembers] = useState([]);
    const [totalUnpaidMembers, setTotalUnpaidMembers] = useState(0);

    async function fetchUnpaidMembers() {
        try {
            const res = await axios.get("http://localhost:8000/api/Membres/get_all/?A_paye=false");

            if (res.data && Array.isArray(res.data)) {
                setMembers(res.data); // Display all unpaid members
                setTotalUnpaidMembers(res.data.length); // Store total count
            }
        } catch (error) {
            console.error("Error fetching unpaid members:", error);
        }
    }

    // Fetch data when component mounts
    useEffect(() => {
        fetchProjects();
        fetchUnpaidMembers();
    }, []);

    // State for carousel navigation: separate for projects and members
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

    const itemsPerPage = 3;

    // Projects Next and Previous page actions
    const nextProjectPage = () => {
        if (currentProjectIndex + itemsPerPage < Supstages.length) {
            setCurrentProjectIndex(currentProjectIndex + itemsPerPage);
        }
    };

    const prevProjectPage = () => {
        if (currentProjectIndex - itemsPerPage >= 0) {
            setCurrentProjectIndex(currentProjectIndex - itemsPerPage);
        }
    };

    // Members Next and Previous page actions
    const nextMemberPage = () => {
        if (currentMemberIndex + itemsPerPage < members.length) {
            setCurrentMemberIndex(currentMemberIndex + itemsPerPage);
        }
    };

    const prevMemberPage = () => {
        if (currentMemberIndex - itemsPerPage >= 0) {
            setCurrentMemberIndex(currentMemberIndex - itemsPerPage);
        }
    };

    return (
        <div className="flex-grow-1 p-4">
            <Container fluid>
                {/* Header Section */}
                <Row className="align-items-center border-bottom pb-3 mb-3">
                    <Col xs={12} md={6} className="text-center text-md-left">
                        <Image src={logo} alt="Logo" rounded style={{ width: "150px", height: "110px" }} />
                        <h1 className="mt-3 fs-4">Together for Chehim</h1>
                    </Col>
                    <Col xs={12} md={6} className="text-center text-md-left">
                        <p className="lead">Committee of research and collaborative projects.</p>
                    </Col>
                </Row>
            </Container>

            {/* Projects Without Interns Section */}
            {Supstages.length > 0 && (
                <div className="border-bottom pb-3 mb-3">
                    <h1>List of projects that don't have interns.</h1>

                    <Row className="d-flex justify-content-start">
                        {Supstages.slice(currentProjectIndex, currentProjectIndex + itemsPerPage).map((project, index) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-3">
                                <Card className="mx-auto" style={{ width: "100%" }}>
                                    <Card.Body>
                                        <Card.Title>{project.Title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{project.Domain}</Card.Subtitle>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div className="d-flex align-items-center justify-content-between">
                        <Button
                            className="btn btn-secondary"
                            onClick={prevProjectPage}
                            disabled={currentProjectIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            className="btn btn-secondary"
                            onClick={nextProjectPage}
                            disabled={currentProjectIndex + itemsPerPage >= Supstages.length}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                        <h3>Total projects without interns: {totalProjects}</h3>
                        <Button className="btn btn-primary ms-2" onClick={() => navigate("/Stage?Sujet_pris=false")}>
                            View More
                        </Button>
                    </div>
                </div>
            )}

            {/* Unpaid Members Section */}
            {members.length > 0 && (
                <div className="border-bottom pb-3 mb-3">
                    <h1>List of members that haven't paid their fees.</h1>

                    <Row className="d-flex justify-content-start">
                        {members.slice(currentMemberIndex, currentMemberIndex + itemsPerPage).map((member, index) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-3">
                                <div
                                    key={member.id}
                                    style={{
                                        border: "2px solid red",
                                        borderRadius: "10px",
                                        padding: "15px",
                                        width: "100%",
                                        textAlign: "center",
                                        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <h4 style={{ color: "red", marginBottom: "10px" }}>
                                        {member.Nom} {member.Prenom}
                                    </h4>
                                    <p><strong>Père:</strong> {member.Nom_pere}</p>
                                    <p>📞 {member.Telephone}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <div className="d-flex align-items-center justify-content-between">
                        <Button
                            className="btn btn-warning"
                            onClick={prevMemberPage}
                            disabled={currentMemberIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            className="btn btn-warning"
                            onClick={nextMemberPage}
                            disabled={currentMemberIndex + itemsPerPage >= members.length}
                        >
                            Next
                        </Button>
                    </div>

                    <div className="d-flex align-items-center mt-3">
                        <h3>Total unpaid members: {totalUnpaidMembers}</h3>
                        <Button className="btn btn-primary ms-2" onClick={() => navigate("/Member?A_paye=false")}>
                            View More
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Welcome;
