import React from 'react'
import axios from 'axios'
import Navbar from './Header'
import Dashboard from './Dashboard'
import Homecolor from './Homecolor'
import imagess from './photos/Picture1.jpg'
import { Button, Image, ListGroup, Container, Row, Col } from 'react-bootstrap'
import { Carousel } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


function Welcome() {
  const [Supstages, setSupstages] = useState([]);
  const [members, setmembers] = useState([]);

  async function fill_projects() {
    let opts = [];
    await axios.get(`http://localhost:8000/api/supstage/get_all/?superviser__Prenom__icontains=&superviser__Nom__icontains=&stage__Domain__icontains=&stage__Title__icontains=&stage__Speciality__icontains=&stage__Sujet_pris=false&is_admin=unknown/`)
      .then(res => {
        for (let i = 0; i < 10; i++) {
          opts.push(res.data[i].stage_title);
        }
        console.log(res.data);
        setSupstages(opts);//utiliser use state pour remplir le tableau supstages par les donnees
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  useEffect(() => { fill_projects() }, []);

  async function fill_members() {
    let opts = [];
    await axios.get(`http://localhost:8000/api/Membres/get_all/?Prenom__icontains=&Nom__icontains=&A_paye=false&Adresse__icontains=`)
      .then(res => {
        console.log("member data:", res.data);
        for (let i = 0; i < 10 && i < (res.data.length); i++) {
          let option = {
            firstname: `${res.data[i].Prenom}`,
            lastname: `${res.data[i].Nom}`,
          }
          opts.push(option);
        }

        setmembers(opts);//utiliser use state pour remplir le tableau supstages par les donnees
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  useEffect(() => { fill_members() }, []);

  Homecolor({ color: "lightblue" })
  return (
    console.log("supstage", Supstages),
    <div className="start justify-content-center">
      <Navbar home="home" />
      {/* <div className=" main d-flex flex-column">
         <Dashboard home="home"/> 
        */}
      {/* <div className="d-flex flex-column justify-content-center align-items-center flex-md-row">
           <Image  src={imagess} alt="comite picture" className="col-8 col-lg-4 p-2 h-30"></Image> 
          <p>The comitte of researches and collaboratives projects 
          The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects The comitte of researches and collaboratives projects 
          </p>
        </div> */}
      <Carousel>
        <Carousel.Item interval={3000}>
          <div className="justify-content-center align-items-center d-flex flex-column">
            <Image src={imagess} alt="comity picture" className="col-8 col-lg-3 p-5 h-30 m-0"></Image>
            {/* <ExampleCarouselImage text="First slide" /> */}
            {/* <Carousel.Caption className="text-black" > */}
            <h3>Comity of research and collaborative projects.</h3>
            {/* </Carousel.Caption> */}
            <h1 className="carousel-capt">ABC</h1>
          </div>
        </Carousel.Item>
        <Carousel.Item interval={3000} >

          <div className="d-flex flex-column align-items-center justify-content-center">
            <ul className="home-list">
              <li className="p-2">List of projects that don't have interns.</li>
              {Supstages.map(supstage => (
                <li>{supstage}</li>
              ))}
            </ul>
            <Link to="/Stage"><Button className="mt-10">More info</Button></Link>
            <h1 className="carousel-capt">ABC</h1>
          </div>
          {/* <div className="d-flex flex-column justify-content-center align-items-center"> */}
          {/* <Container className="d-flex flex-column justify-content-center align-items-center">
          <Row>
            <Col>
            <span className="p-5">List of projects that don't have interns.</span>
            </Col>
          </Row>
          <ListGroup>
        {Supstages.map (supstage => (
          <Row>
            <Col>
              <ListGroup.Item>{supstage}</ListGroup.Item>
            </Col>
          </Row>
      ))}
      </ListGroup>
      <Row>
        <Col>
        <Link  to="/Stage"><Button className="mt-10">More info</Button></Link>
        </Col>
      </Row>
        </Container> */}
          {/* <ListGroup className="d-flex flex-column justify-content-center align-items-center bg-white border-radius-1">
        <ListGroup.Item className="p-5">List of projects that don't have interns.</ListGroup.Item>
        {Supstages.map (supstage => (
          <ListGroup.Item>{supstage}</ListGroup.Item>
      ))}
      </ListGroup>
      <Link  to="/Stage"><Button className="mt-10">More info</Button></Link>
      </ListGroup>
      </div> */}
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <ul className="home-list">
              <li className="p-2">List of members that don't have payed fees.</li>
              {(members.length > 0) ? members.map(member => (
                <li>{member.firstname} {member.lastname}</li>
              )) : <li className="p-3">All members had payed fees</li>}
            </ul>

            <Link to="/Member"><Button className="mt-10">More info</Button></Link>
            <h1 style={{ color: "transparent" }}>ABC</h1>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
    // </div>
  )
}


export default Welcome
