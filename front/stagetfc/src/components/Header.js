import React from 'react'
import logo  from "./photos/logo1.png"
import Dashboard from './Dashboard'

const Navbar = ({home,Add,href,detail,name}) => {
  return (
    <div className="">
       <nav className="navbar navbar-expand-lg d-flex flex-column">
        {/*bg-body-tertiary*/} 
      <div className="container-fluid p-0">
      <img className="logo" src={logo} alt="logo"></img>
      {(detail!=="detail")?<h1 className="navbar-brand text-center p-0">Together for Chehim</h1>: <h1 className="navbar-brand text-center p-0">Details {name}</h1>}
      <span></span>
    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
      </ul>
    </div> */}
  </div>
  <Dashboard home={home} Add={Add} href={href} className="mb-3"/>
</nav>
    </div>
  )
}

export default Navbar
