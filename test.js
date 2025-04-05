import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { Container, Row, Col, Image, Button, Carousel, Card } from "react-bootstrap";
import axios from "axios";
import logo from "../components/photos/logo1.png";

function Welcome() {
    const navigate = useNavigate(); // Navigation hook

    // States for projects
    const [Supstages, setSupstages] = useState([]);
    const [WithInternStages, setWithInternStages] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalProjectsWithInterns, setTotalProjectsWithInterns] = useState(0);

    async function fetchProjects() {
        try {
            const res = await axios.get("http://localhost:8000/api/Stages/?Sujet_pris=false");
            const resWithInterns = await axios.get("http://localhost:8000/api/Stages/?Sujet_pris=true");

            if (res.data) {
                const projects = Array.isArray(res.data) ? res.data : res.data.results || [];
                setSupstages(projects);
                setTotalProjects(projects.length);
            }

            if (resWithInterns.data) {
                const projectsTaken = Array.isArray(resWithInterns.data) ? resWithInterns.data : resWithInterns.data.results || [];
                setWithInternStages(projectsTaken);
                setTotalProjectsWithInterns(projectsTaken.length);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    // States for members
    const [members, setMembers] = useState([]);
    const [membersPaid, setMembersPaid] = useState([]);
    const [totalUnpaidMembers, setTotalUnpaidMembers] = useState(0);
    const [totalPaidMembers, setTotalPaidMembers] = useState(0);

    async function fetchMembers() {
        try {
            const resUnpaid = await axios.get("http://localhost:8000/api/Membres/get_all/?A_paye=false");
            const resPaid = await axios.get("http://localhost:8000/api/Membres/get_all/?A_paye=true");

            if (resUnpaid.data && Array.isArray(resUnpaid.data)) {
                setMembers(resUnpaid.data);
                setTotalUnpaidMembers(resUnpaid.data.length);
            }

            if (resPaid.data && Array.isArray(resPaid.data)) {
                setMembersPaid(resPaid.data);
                setTotalPaidMembers(resPaid.data.length);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    }

    useEffect(() => {
        fetchProjects();
        fetchMembers();
    }, []);

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

            {/* Projects Without Interns */}
            {Supstages.length > 0 && (
                <div className="border-bottom pb-3 mb-3">
                    <h1>List of projects that don't have interns.</h1>
                    <Carousel>
                        {Supstages.map((project, index) => (
                            <Carousel.Item key={index}>
                                <Card className="m-3" style={{ width: "18rem" }}>
                                    <Card.Body>
                                        <Card.Title>{project.Title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{project.Domain}</Card.Subtitle>
                                    </Card.Body>
                                </Card>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <div className="d-flex align-items-center">
                        <h3>Total projects without interns: {totalProjects}</h3>
                        <Button className="btn btn-primary ms-2" onClick={() => navigate("/Stage?Sujet_pris=false")}>
                            View More
                        </Button>
                    </div>
                </div>
            )}

            {/* Projects With Interns */}
            {WithInternStages.length > 0 && (
                <div className="border-bottom pb-3 mb-3">
                    <h1>List of projects that already have interns.</h1>
                    <Carousel>
                        {WithInternStages.map((project, index) => (
                            <Carousel.Item key={index}>
                                <Card className="m-3" style={{ width: "18rem" }}>
                                    <Card.Body>
                                        <Card.Title>{project.Title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{project.Domain}</Card.Subtitle>
                                    </Card.Body>
                                </Card>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <div className="d-flex align-items-center">
                        <h3>Total projects with interns: {totalProjectsWithInterns}</h3>
                        <Button className="btn btn-success ms-2" onClick={() => navigate("/Stage?Sujet_pris=true")}>
                            View More
                        </Button>
                    </div>
                </div>
            )}

            {/* Unpaid Members */}
            {members.length > 0 && (
                <div className="border-bottom pb-3 mb-3">
                    <h1>List of members that haven't paid their fees.</h1>
                    <Carousel>
                        {members.map((member, index) => (
                            <Carousel.Item key={index}>
                                <div key={member.id} style={{
                                    border: "2px solid red",
                                    borderRadius: "10px",
                                    padding: "15px",
                                    width: "250px",
                                    textAlign: "center",
                                    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
                                }}>
                                    <h4 style={{ color: "red", marginBottom: "10px" }}>{member.Nom} {member.Prenom}</h4>
                                    <p><strong>Père:</strong> {member.Nom_pere}</p>
                                    <p>📞 {member.Telephone}</p>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <div className="d-flex align-items-center">
                        <h3>Total unpaid members: {totalUnpaidMembers}</h3>
                        <Button className="btn btn-primary ms-2" onClick={() => navigate("/Member?A_paye=false")}>
                            View More
                        </Button>
                    </div>
                </div>
            )}

            {/* Paid Members */}
            {membersPaid.length > 0 && (
                <div className="border-bottom pb-3 mb-3">
                    <h1>List of members who have paid.</h1>
                    <Carousel>
                        {membersPaid.map((member, index) => (
                            <Carousel.Item key={index}>
                                <div key={member.id} style={{
                                    border: "2px solid green",
                                    borderRadius: "10px",
                                    padding: "15px",
                                    width: "250px",
                                    textAlign: "center",
                                    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
                                }}>
                                    <h4 style={{ color: "green", marginBottom: "10px" }}>{member.Nom} {member.Prenom}</h4>
                                    <p><strong>Père:</strong> {member.Nom_pere}</p>
                                    <p>📞 {member.Telephone}</p>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <div className="d-flex align-items-center">
                        <h3>Total paid members: {totalPaidMembers}</h3>
                        <Button className="btn btn-success ms-2" onClick={() => navigate("/Member?A_paye=true")}>
                            View More
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Welcome;