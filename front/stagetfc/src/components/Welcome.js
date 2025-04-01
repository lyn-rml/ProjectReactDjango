import React from "react";
import logo from "../components/photos/logo1.png"
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import axios from 'axios'
import ProjectCard from "../mycomponent/cardProjectWelcom";
import UnpaidMembersTable from "../mycomponent/cardMembrePasPayee";
function Welcome() {
    //fetch for project without intern
    const [Supstages, setSupstages] = useState([]);
    async function fill_projects() {
        try {
            // Faire une requête à l'API
            const res = await axios.get(`http://localhost:8000/api/Stages/get_all/?Sujet_pris=${false}`);

            // Vérifier si la réponse contient des données
            if (res.data && Array.isArray(res.data)) {
                setSupstages(res.data); // Stocker tous les champs
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données : ", error);
        }
    }

    useEffect(() => {
        fill_projects();
    }, []);
//fetch unpaid members 
const [members, setmembers] = useState([]);
async function fill_members() {
    try {
        // Faire une requête à l'API
        const res = await axios.get(`http://localhost:8000/api/Membres/get_all/?A_paye=${false}`);

        // Vérifier si la réponse contient des données
        if (res.data && Array.isArray(res.data)) {
        
            // Mettre à jour l'état avec les données
            setmembers(res.data);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des membres impayés :", error);
    }
}

// Appeler la fonction dans useEffect au chargement du composant
useEffect(() => {
    fill_members();
}, []);

    return (
            <div className="flex-grow-1 p-4 "  >
                <Container fluid>
                    <Row className="align-items-center border-bottom pb-3 mb-3">
                        <Col xs={12} md={6} className="text-center text-md-left">
                            <Image
                                src={logo}
                                alt="Logo"
                                rounded
                                style={{ width: '150px', height: '110px' }}
                            />
                            <h1 className="mt-3 fs-4">Together for Chehim</h1>
                        </Col>
                        {/* Text Section */}
                        <Col xs={12} md={6} className="text-center text-md-left">
                            <p className="lead">
                                Comity of research and collaborative projects.
                            </p>
                        </Col>
                    </Row>
                </Container>
                {console.log(Supstages)}
                <div className="border-bottom pb-3 mb-3">  <h1>List of projects that don't have interns.</h1>
                    <ProjectCard projects={Supstages} />
                    <div  className="d-flex align-items-center"><h3>The total number of projects that don't have interns is ....</h3><button className="btn btn-primary ms-2" >View More</button></div>
                </div>
                <div className="border-bottom pb-3 mb-3">
                    <h1>List of members that don't have payed fees..</h1>
                  <UnpaidMembersTable members={members}/>
                    <div className="d-flex align-items-center"><h3>The total number of members that don't have payed is ....</h3><button className="btn btn-primary ms-2">View More</button></div>
                </div>
            </div>
    );
}

export default Welcome;
