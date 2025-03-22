import React from 'react';
import { Container, Row, Col, Table, Form , Nav, Navbar,Button,Stack} from 'react-bootstrap';

const Dashboard = ({Add,href,home}) =>
{
  return (
    console.log("home",home),
    // <div className='Dashboard'>
    //         <Homebutton/>
    //         <div className='dash-cat'>
    //         <Stagebuttons/>
    //         </div>
    //         <div className='dash-cat'>
    //         <Member/>
    //         </div>       
    // </div>
    <Navbar bg="lightblue" expand="lg" className="navbar p-2">
          <Container cols="6" gap="2">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Row>
              <Col className="flex-row justify-content-md-center align-items-center" fluid>
                    <Button href="/">Home</Button>
                 </Col>
                 <Col className="flex-row justify-content-md-center align-items-center" fluid>
                    <Button href="/Stage">Projects</Button>
                 </Col>
                 <Col className="flex-row justify-content-md-center align-items-center" fluid>
                    <Button href="/Stagiaire">Interns</Button>
                 </Col>
                 <Col className="flex-row justify-content-md-center align-items-center" fluid>
                    <Button href="/Superviser">Supervisers</Button>
                 </Col>
                 <Col className="flex-row justify-content-md-center align-items-center" fluid>
                    <Button href="/Member">Members</Button>
                 </Col>
                 {(home!=="home")?<Col className="flex-row justify-content-md-center align-items-center" fluid>
                    <Button href={href} className="d-md-none d-xl-block text-nowrap">{Add}</Button>                 
                 </Col>:""}
              </Row>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  )
}

export default Dashboard

    {/* <Dashboard Add="Add new project" href="/Add-project"/> */}
       {/* <table>
          <tr>
            <td><Homebutton/></td>
          </tr>
          <tr>
            <td><div className='dash-cat'>
            <Stagebuttons/>
            </div>
            </td>
          </tr>
          <tr>
            <td><div className='dash-cat'>
            <Member/>
            </div>
            </td>
            </tr>
          </table>       */}