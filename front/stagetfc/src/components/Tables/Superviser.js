import axios from 'axios'
import React, { useRef } from 'react'
import Navbar from '../Header'
import Dashboard from '../Dashboard'
import { Link } from 'react-router-dom'
// import { IoMdInformationCircleOutline } from "react-icons/io"
import { BsInfoSquare } from "react-icons/bs";
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { FaPlus, FaInfoCircle } from "react-icons/fa"
import { useState, useEffect } from 'react'
// import {flushSync} from 'react-dom'
import ConfirmModal from '../../mycomponent/confirmmodal'
import ReactPaginate from 'react-paginate'
//Functional component
//import pdf from '../components/photos/pdf.jpeg'
import { Table } from 'react-bootstrap'
import { FaSearch } from "react-icons/fa";
import { FaArrowRight } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { FaAngleDoubleUp } from 'react-icons/fa';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { Pagination } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
function Superviser() {

 const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const rowsPerPage = 5;

  async function filterStages() //fonction pour donner les donnees
  {
    await axios.get(`http://localhost:8000/api/Supervisers/?page=${currentPage}&first_name=${filters.filtersupfirst}&last_name=${filters.filtersuplast}&email=${filters.filteremail}&profession=${filters.filterprofession}`)//url du filtre
      .then(res => {

        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
      
        setTotalCount(res.data.count);
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  useEffect(() => { filterStages() }, [filters, currentPage]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps

  async function fetchComments(currentpage) {
    await axios.get(`http://localhost:8000/api/Supervisers/?page=${currentpage}&Prenom__icontains=${filters.filtersupfirst}&Nom__icontains=${filters.filtersuplast}&Email__icontains=${filters.filteremail}&Profession__icontains=${filters.filterprofession}`)//url du filtre
      .then(res => {
        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
       
        setTotalCount(res.data.count);
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }





  function filter(e)  //la fonction qui met les valeur inscrits par l'utilisateur dans l'objet filters
  {
    const { name, value } = e.target;//pour indiquer quel attribut de l'objet a change sa valeur
    setfilters((prev) => {
      return { ...prev, [name]: value }//ajouter au valeur precedente la nouvelle valeur inscrite
    });
  }
  function confirmDelete(id) {
    setSelectedId(id);
    setShowModal(true);
  }

  function handleDeleteConfirmed() {
    axios.delete(`http://localhost:8000/api/Supervisers/${selectedId}/delete-superviser-role/`)
      .then((res) => {
        console.log(res);
        setShowModal(false);
        filterStages(); // Refresh without reload
      })
      .catch((error) => alert(error));
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  }
  function applyFilter() {
    setfilters(searchValues); // Only now do we update `filters`
  }
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = indexOfFirstRow + rowsPerPage;
  return (
    <div>



      <form autoComplete="off" method="post" action="" className="p-3">
        <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

        <div className="d-flex flex-wrap gap-3 justify-content-between">
          {/* Filter Inputs Section */}
          <div className="d-flex flex-wrap gap-3" style={{ flex: 1 }}>
            <div className="form-group">
              <label htmlFor="filtersupfirst" className="filter-content text-white">Supervisor Last Name:</label>
              <input
                type="text"
                className="form-control"
                id="filtersupfirst"
                name="filtersupfirst"
                onChange={handleInputChange}
                style={{ width: "250px" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="filtersuplast" className="filter-content text-white">Supervisor First Name:</label>
              <input
                type="text"
                className="form-control"
                id="filtersuplast"
                name="filtersuplast"
                onChange={handleInputChange}
                style={{ width: "250px" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="filteremail" className="filter-content text-white">Email:</label>
              <input
                type="text"
                className="form-control"
                id="filteremail"
                name="filteremail"
                onChange={handleInputChange}
                style={{ width: "250px" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof" className="filter-content text-white">Profession:</label>
              <input
                type="text"
                className="form-control"
                id="prof"
                name="filterprofession"
                onChange={handleInputChange}
                style={{ width: "250px" }}
              />
            </div>
          </div>

          {/* Buttons Section */}
          <div className="d-flex flex-column justify-content-between" style={{ minWidth: "200px" }}>
            <button
              type="button"
              className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100"
              onClick={applyFilter}
            >
              <FaSearch className="me-2" /> Search
            </button>

            <button
              type="button"
              className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100"
              onClick={() => navigate('/admin-dashboard/Add-superviser/')}
            >
              <FaPlus size={20} className="me-2" />
              ADD New
            </button>
          </div>
        </div>
      </form>


      <div>

        <Table  style={{ width: "78vw" }}>
          <thead className="table-primary text-center">
            <tr>
              <th scope='col'>Id</th>
              <th scope='col'>Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Profession</th>
              <th scope='col'>Member Id</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {Supstages.map((supstage, index) => (
              <tr key={index}>
                <td>{supstage.id}</td>
                <td>{supstage.first_name} {supstage.last_name}</td>
                <td>{supstage.email}</td>
                <td>{supstage.profession}</td>
                <td>{supstage.Id_Membre ? supstage.Id_Membre : <span style={{color:"warning"}}>Not a member</span>}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/admin-dashboard/Modifier-superviser?superviser=${supstage.id}&name=${supstage.Prenom} ${supstage.Nom}`}
                      className="btn btn-sm"
                      style={{
                        color: 'black',
                        borderColor: 'black',
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'orange'}
                      onMouseLeave={(e) => e.target.style.color = 'black'}
                    >
                      <FaPenToSquare />
                    </Link>
                    <Link
                      to={`/admin-dashboard/DetailsSupervisor?superviser=${supstage.id}`}
                      className="btn btn-sm"
                      style={{
                        color: 'black',
                        borderColor: 'black',
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'orange'}
                      onMouseLeave={(e) => e.target.style.color = 'black'}
                    >
                      <FaInfoCircle />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        color: 'black',
                        borderColor: 'black',
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'orange'}
                      onMouseLeave={(e) => e.target.style.color = 'black'}
                      onClick={() => confirmDelete(supstage.id)}

                    >
                      <TiUserDeleteOutline />
                    </button>
                  </div>


                </td>
              </tr>
            ))}
          </tbody>
    
          <tfoot>
                <tr>
                  <td colSpan="12">
                    <div className="d-flex justify-content-between align-items-center">
                      {/* Display current page info */}
                      <span>
                        Showing {totalCount === 0 ? 0 : (indexOfFirstRow + 1)} to {Math.min(indexOfLastRow, totalCount)} of {totalCount} entries
                      </span>

                      <Pagination className="justify-content-center mt-4">
                        {/* Previous button */}
                        <Pagination
                          onClick={() => handlePageChange(1)}

                        >
                          <button className="page-link"
                          >
                            <FaAngleDoubleUp /> </button>
                        </Pagination>
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <FaArrowLeft />
                        </Pagination.Prev>


                        {/* Next button */}
                        <Pagination.Next
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || totalPages === 0}
                        >
                          <FaArrowRight />
                        </Pagination.Next>
                        <Pagination
                          onClick={() => handlePageChange(totalPages)}

                        >
                          <button className="page-link"
                          >
                            <FaAngleDoubleDown /> </button>
                        </Pagination>
                      </Pagination>
                    </div>
                  </td>
                </tr>
              </tfoot>
        </Table>
      </div>
      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Supervisor"
        message="Are you sure you want to permanently delete this supervisor from all projects?"
      />

    </div>

  );
}

export default Superviser
