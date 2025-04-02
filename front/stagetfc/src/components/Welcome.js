import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import axios from "axios";
import logo from "../components/photos/logo1.png";
import ProjectCard from "../mycomponent/cardProjectWelcom";
import UnpaidMembersTable from "../mycomponent/cardMembrePasPayee";

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
                setSupstages(projects.slice(0, 3)); // Display only 3 projects
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
                setMembers(res.data.slice(0, 3)); // Show only 3 unpaid members
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
            <div className="border-bottom pb-3 mb-3">
                <h1>List of projects that don't have interns.</h1>
                <ProjectCard projects={Supstages} />
                <div className="d-flex align-items-center">
                    <h3>Total projects without interns: {totalProjects}</h3>
                    <Button className="btn btn-primary ms-2" onClick={() =>  navigate(`/Stage?Sujet_pris=false`)}>
                        View More
                    </Button>
                </div>
            </div>

            {/* Unpaid Members Section */}
            <div className="border-bottom pb-3 mb-3">
                <h1>List of members that haven't paid their fees.</h1>
                <UnpaidMembersTable members={members} />
                <div className="d-flex align-items-center">
                    <h3>Total unpaid members: {totalUnpaidMembers}</h3>
                    <Button className="btn btn-primary ms-2" onClick={() => navigate("/Member?A_paye=false")}>
                        View More
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
