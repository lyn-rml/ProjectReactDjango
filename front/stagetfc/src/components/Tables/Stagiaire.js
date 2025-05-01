import axios from 'axios'
import React, { useRef } from 'react'
import Navbar from '../Header'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { FaPlus, FaInfoCircle } from "react-icons/fa"
import { FaSearch } from "react-icons/fa";
import PrisIcon from '../../mycomponent/truefalseicon';
import ConfirmModal from '../../mycomponent/confirmmodal'
import { useNavigate } from 'react-router-dom';
function Stagiaire() {
  let str = "";
  const [showConfirm, setShowConfirm] = useState(false);

  let table_rows = 1;

  const navigate = useNavigate();
  const [dele, setdele] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
const rowsPerPage = 5;




const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};
const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = indexOfFirstRow + rowsPerPage;
  const [StageStagiaire, setStageStagiaire] = useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters, setfilters] = useState({
    filterinternfirst: "",
    filterinternlast: "",
    filterpromotion: "",
    filterstagetitle: "",
    filterprojectyear: "",
    filtercertified: "",//interns that have working or not in internships
  });
  const [searchValues, setSearchValues] = useState({
    filterinternfirst: "",
    filterinternlast: "",
    filterpromotion: "",
    filterstagetitle: "",
    filterprojectyear: "",
    filtercertified: "",
  });



  async function filterStages() //fonction pour donner les donnees
  {


    await axios.get(`http://localhost:8000/api/stagestagiaire/?page=${currentPage}&intern_first_name=${filters.filterinternfirst}&intern_last_name=${filters.filterinternlast}&stage__Title__iexact=${filters.filterstagetitle}&Project_year__icontains=${filters.filterprojectyear}&Promotion__icontains=${filters.filterpromotion}&Certified=${filters.filtercertified}`)
      .then(res => {
        setStageStagiaire(res.data.results);

        console.log("data:", res.data.results);

        setTotalPages(res.data.total_pages);
        setTotalCount(res.data.total_count);

      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  useEffect(() => { filterStages() }, [filters,currentPage, ]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps

 


 
  function filter(e)  //la fonction qui met les valeur inscrits par l'utilisateur dans l'objet filters
  {
    const { name, value } = e.target;//pour indiquer quel attribut de l'objet a change sa valeur
    setfilters((prev) => {
      return { ...prev, [name]: value }//ajouter au valeur precedente la nouvelle valeur inscrite
    });
  }
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      axios.delete(`http://localhost:8000/api/stagestagiaire/${deleteId}/`)
        .then(() => {
          setShowConfirm(false);
          setDeleteId(null);
          filterStages(); // refresh list
        })
        .catch((error) => {
          alert("Error deleting intern.");
          console.error(error);
          setShowConfirm(false);
        });
    }
  };

 
  function handleInputChange(e) {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  }
  function applyFilter() {
    setfilters(searchValues); // Only now do we update `filters`
  }
  // useEffect(() => {splitter()}, [Supstages,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  useEffect(() => {
    console.log(StageStagiaire);
    filterStages()
  }, [filters, currentPage]);

  return (

    <div className="container my-4">
      <form autoComplete="off" method="post" action="">
        <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

        {/* First Row: Filters + Buttons */}
        <div className="row g-3 align-items-start">
          {/* Left side: Filter Inputs */}
          <div className="col-md-10">
            <div className="row g-3">
              {/* Intern First Name */}
              <div className="col-md-4" style={{ width: "250px" }}>
                <input
                  type="text"
                  className="form-control"
                  id="filterinternfirst"
                  name="filterinternfirst"
                  onChange={handleInputChange}
                  placeholder="Intern First Name"
                />
              </div>

              {/* Intern Last Name */}
              <div className="col-md-4" style={{ width: "250px" }}>
                <input
                  type="text"
                  className="form-control"
                  id="filterinternlast"
                  name="filterinternlast"
                  onChange={handleInputChange}
                  placeholder="Intern Last Name"
                />
              </div>

              {/* Promotion */}
              <div className="col-md-4" style={{ width: "250px" }}>
                <input
                  type="text"
                  className="form-control"
                  id="filterpromotion"
                  name="filterpromotion"
                  onChange={handleInputChange}
                  placeholder="Promotion"
                />
              </div>

              {/* Project Year */}
              <div className="col-md-4" style={{ width: "250px" }}>
                <input
                  type="text"
                  className="form-control"
                  id="filterprojectyear"
                  name="filterprojectyear"
                  onChange={handleInputChange}
                  placeholder="Project Year"
                />
              </div>

              {/* Certified */}
              <div className="col-md-4" style={{ width: "300px" }}>
                <label className="form-label text-white">Certified :</label>
                <div className="form-check form-check-inline" style={{ margin: "10px" }}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id="certifiedYes"
                    name="filtercertified"
                    value="true"
                    checked={searchValues.filtercertified === "true"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="certifiedYes">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="certifiedNo"
                    name="filtercertified"
                    value="false"
                    checked={searchValues.filtercertified === "false"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="certifiedNo">No</label>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Search Button */}
          <div className="col-md-2 d-flex flex-column justify-content-between" style={{ minHeight: '150px' }}>
            <button type="button" className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100" onClick={applyFilter}>
              <FaSearch className="me-2" /> Search
            </button>
            <div className="w-100">
              <button
                type="button"
                className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100"
                onClick={() => navigate('/admin-dashboard/Add-intern')}
              >
                <FaPlus size={20} className="me-2" />
                ADD New
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="d-flex ">
        <div >


        <div>
  <Table  style={{ width: "78vw" }}>
    <thead className="table-primary text-center">
      <tr>
        <th style={{ maxWidth: "10px" }}>Id</th>
        <th>Name</th>
        <th>Promotion</th>
        <th>Annee</th>
        <th style={{ width: "300px" }}>Current Internship</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Convention PDF</th>
        <th style={{ maxWidth: "30px" }}>Certified</th>
        <th>Certified PDF</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody className="text-center">
      {StageStagiaire.map((Stage, index) => (
        <tr key={Stage.id}>
          <td>{Stage.id}</td>
          <td>{Stage.Intern_details.first_name} {Stage.Intern_details.last_name}</td>
          <td>{Stage.Promotion}</td>
          <td>{Stage.Project_year}</td>
          <td>{Stage.project_details.Title}</td>
          <td>{Stage.Start_Date}</td>
          <td>{Stage.End_Date}</td>
          <td>
            {Stage.PDF_Agreement ? (
              <a href={`http://localhost:8000/media/${Stage.PDF_Agreement}`} target="_blank" className="pdf-btn">
                {Stage.PDF_Agreement.slice(24, 28)}..{Stage.PDF_Agreement.slice(-4)}
              </a>
            ) : <span className="text-danger">Not Agree</span>}
          </td>
          <td><PrisIcon Pris={Stage.Certified} /></td>
          <td>
            {Stage.PDF_Certified ? (
              <a href={`http://localhost:8000/media/${Stage.PDF_Certified}`} target="_blank" className="pdf-btn">
                {Stage.PDF_Certified.slice(24, 28)}..{Stage.PDF_Certified.slice(-4)}
              </a>
            ) : <span className="text-danger">Not certified</span>}
          </td>
          <td className="text-center">
            <div className="d-flex gap-2 justify-content-center">
              <Link to={`/admin-dashboard/Modifier-intern?intern=${Stage.intern_id}`} className="btn btn-sm" style={{ color: 'black', borderColor: 'black' }}
                onMouseEnter={(e) => e.target.style.color = 'orange'}
                onMouseLeave={(e) => e.target.style.color = 'black'}>
                <FaPenToSquare />
              </Link>

              <Link to={`/admin-dashboard/Detailsintern?id=${Stage.id}`} className="btn btn-sm" style={{ color: 'black', borderColor: 'black' }}
                onMouseEnter={(e) => e.target.style.color = 'orange'}
                onMouseLeave={(e) => e.target.style.color = 'black'}>
                <FaInfoCircle />
              </Link>

              <button className="btn btn-sm" style={{ color: 'black', borderColor: 'black' }}
                onMouseEnter={(e) => e.target.style.color = 'orange'}
                onMouseLeave={(e) => e.target.style.color = 'black'}
                onClick={() => handleDeleteClick(Stage.id)}>
                <TiUserDeleteOutline />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>

    {/* Pagination Footer */}
    <tfoot>
      <tr>
        <td colSpan="11">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              Showing {indexOfFirstRow + 1} to {indexOfLastRow} of {StageStagiaire.length} entries
            </p>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </td>
      </tr>
    </tfoot>
  </Table>
</div>


        
        </div>
      </div>
      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete intern"
        message="Are you sure you want to permanently delete this intern from this stage?"
      />

    </div>
  );
}

export default Stagiaire


