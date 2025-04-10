import axios from 'axios'
import React, { useRef } from 'react'
import Navbar from '../Header'
import Dashboard from '../Dashboard'
import { Link } from 'react-router-dom'
// import { IoMdInformationCircleOutline } from "react-icons/io"
import { BsInfoSquare } from "react-icons/bs";
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { FaPlus,FaInfoCircle } from "react-icons/fa"
import { useState, useEffect } from 'react'
// import {flushSync} from 'react-dom'
import ReactPaginate from 'react-paginate'
//Functional component
//import pdf from '../components/photos/pdf.jpeg'
import { Table } from 'react-bootstrap'
import { FaSearch } from "react-icons/fa";
function Superviser() {
  let str = "";
  let table_rows = 1;
  let currentPage = 1;
  const [dele, setdele] = ("");
  const [Count, setCount] = useState(currentPage);
  const [pageCount, setpageCount] = useState(0);
  const [Supstages, setSupstages] = useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters, setfilters] = useState({
    filtersupfirst: "",
    filtersuplast: "",
    filteremail: "",
    filteridmember: "",
    filterprofession: "",
  });
   const [searchValues, setSearchValues] = useState({
    filtersupfirst: "",
    filtersuplast: "",
    filteremail: "",
    filteridmember: "",
    filterprofession: "",
      });
  //use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const refresh = () => {
    table_rows = 1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }
  async function filterStages() //fonction pour donner les donnees
  {
    await axios.get(`http://localhost:8000/api/Supervisers/?page=${currentPage}&Prenom__icontains=${filters.filtersupfirst}&Nom__icontains=${filters.filtersuplast}&Email__icontains=${filters.filteremail}&Profession__icontains=${filters.filterprofession}`)//url du filtre
      .then(res => {

        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
        setCount(res.data.count);
        setpageCount(Math.ceil((res.data.count) / (res.data.results.length)))
        if (Count = 0) {
          table_rows = 0
        }
        console.log(table_rows);
        console.log("stages:", Supstages);
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  useEffect(() => { filterStages() }, [filters, Count, pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps

  async function fetchComments(currentpage) {
    await axios.get(`http://localhost:8000/api/Supervisers/?page=${currentPage}&Prenom__icontains=${filters.filtersupfirst}&Nom__icontains=${filters.filtersuplast}&Email__icontains=${filters.filteremail}&Profession__icontains=${filters.filterprofession}`)//url du filtre
      .then(res => {
        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
        setCount(res.data.count);
        setpageCount(Math.ceil((res.data.count) / (res.data.results.length)))
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  async function handlePageClick(data) {
    table_rows = pageCount * (data.selected + 1);
    console.log("page=", data.selected + 1);
    currentPage = (data.selected) + 1;
    const commentformserver = await fetchComments(currentPage);
  }
  // useEffect(() =>{fetchComments()},[filters]);  

  function filter(e)  //la fonction qui met les valeur inscrits par l'utilisateur dans l'objet filters
  {
    const { name, value } = e.target;//pour indiquer quel attribut de l'objet a change sa valeur
    setfilters((prev) => {
      return { ...prev, [name]: value }//ajouter au valeur precedente la nouvelle valeur inscrite
    });
  }
  function del(id, e) {
    var x = window.confirm("Do you want to delete this superviser?");
    if (x) {
      var y = prompt("Enter yes to confirm to delete permanently this superviser from all projects?");
      console.log("y", y);
      if (y === "yes") {
        console.log("id:", id);
        axios.delete(`http://localhost:8000/api/Supervisers/${id}/`)
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((error) => alert(error));
      }
    }
  }
  const display = (table_rows) => {
    if (table_rows === 0) {
      return <h1 className="no-data-display titre">No data to display</h1>
    }
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  }
  function applyFilter() {
    setfilters(searchValues); // Only now do we update `filters`
  }
  return (
    <div>
      <div className="d-flex align-items-center">
      <h2 style={{margin:"30px"}}>
          Click the button to add a new supervisor to the system
          <Link to="/Add-superviser">
            <button type="button" className="btn add-btn ">
              <FaPlus size={24} color="blue" />
            </button>
          </Link>
        </h2>
      </div>
      <div>
        <div>
          <form autoComplete="off" method="post" action="" className="p-3">
            <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

            <div className="row">
              {/* First Name & Last Name */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="filtersupfirst" className="filter-content">Supervisor First Name:</label>
                  <input type="text" className="form-control" id="filtersupfirst" name="filtersupfirst" onChange={handleInputChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="filtersuplast" className="filter-content">Supervisor Last Name:</label>
                  <input type="text" className="form-control" id="filtersuplast"  name="filtersuplast" onChange={handleInputChange} />
                </div>
              </div>

              {/* Email & Profession */}
              <div className="col-md-6 mt-3">
                <div className="form-group">
                  <label htmlFor="filteremail" className="filter-content">Email:</label>
                  <input type="text" className="form-control" id="filteremail"  name="filteremail" onChange={handleInputChange} />
                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="form-group">
                  <label htmlFor="prof" className="filter-content">Profession:</label>
                  <input type="text" className="form-control" id="prof"  name="filterprofession" onChange={handleInputChange} />
                </div>
              </div>

              {/* Search Button */}
              <div className="col-12 text-center mt-4">
                <button type="button" className="btn btn-primary px-4" onClick={applyFilter}>
                  <FaSearch className="me-2" /> Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='sub-main p-2'>
        <h3 className='titre'> List of supervisors</h3>
        <Table striped='columns' bordered>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Row</th>
              <th scope='col'>Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Profession</th>
              <th scope='col'>Member Id</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {Supstages.map((supstage, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{supstage.Prenom} {supstage.Nom}</td>
                <td>{supstage.Email}</td>
                <td>{supstage.Profession}</td>
                <td>{supstage.Id_Membre ? supstage.Id_Membre : 'Not a member'}</td>
                <td>
                  <span className='icon' title='Modify'>
                    <Link to={`/Modifier-superviser?superviser=${supstage.id}&name=${supstage.Prenom} ${supstage.Nom}`}>
                      <FaPenToSquare />
                    </Link>
                  </span>
                                        <span className="icon" title="details"><Link to={`/DetailsSupervisor?superviser=${supstage.id}`}><FaInfoCircle /></Link></span>
                  <span className='icon' title='Delete' onClick={e => del(supstage.id, e)}>
                    <TiUserDeleteOutline />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-center'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          activeClassName={'active'}
        />
      </div>

    </div>

  );
}

export default Superviser
/*
<div className='filter-stage'>
         
          <Link to="/Add-superviser">
          <button type="button" className="form-control add-btn">
            Add new superviser
          </button>
        </Link>

*/
