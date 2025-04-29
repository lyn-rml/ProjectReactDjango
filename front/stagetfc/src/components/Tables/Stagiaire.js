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
function Stagiaire() {
  let str = "";
    const [showConfirm, setShowConfirm] = useState(false);

  let table_rows = 1;
  let currentPage = 1;
  const [dele, setdele] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [Count, setCount] = useState(currentPage);
  const [pageCount, setpageCount] = useState(0);
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

  //use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const refresh = () => {
    table_rows = 1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }

  async function filterStages() //fonction pour donner les donnees
  {
    let init = [];
    let internsinit = [];

    await axios.get(`http://localhost:8000/api/stagestagiaire/?intern_first_name=${filters.filterinternfirst}&intern_last_name=${filters.filterinternlast}&stage__Title__iexact=${filters.filterstagetitle}&Project_year__icontains=${filters.filterprojectyear}&Promotion__icontains=${filters.filterpromotion}&Certified=${filters.filtercertified}`)
      .then(res => {
        setStageStagiaire(res.data.results);

        console.log("data:", res.data.results);
       
        setCount(res.data.count);
        setpageCount(Math.ceil((res.data.count) / (res.data.results.length)))
        

      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  useEffect(() => { filterStages() }, [filters, Count, pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps

  async function fetchComments(currentpage) {
    let initstagiaires = [];
    await axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__Nom__icontains=${filters.filterinternlast}&stagiaire__Prenom__icontains=${filters.filterinternfirst}&stage__Title__iexact=${filters.filterstagetitle}&Annee__icontains=${filters.filterprojectyear}&Promotion__icontains=${filters.filterpromotion}&Certified=${filters.filtercertified}`)//url du filtre
      .then(res => {
        setStageStagiaire(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }


  async function handlePageClick(data) {
    table_rows = 3 * (data.selected + 1);
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
  // useEffect(() => {splitter()}, [Supstages,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  useEffect(() => {
    console.log(StageStagiaire);
    filterStages()
  }, [filters, Count, pageCount]);

  return (

    <div>
      <div className="d-flex align-items-center">
        <h4 style={{ margin: "10px" }}>
          Click the button to add a new Intern to the system
          <Link to="/Add-intern">
            <button type="button" className="btn add-btn ">
              <span style={{ margin: "10px" }}>ADD New</span>
              <FaPlus size={24} color="#fff" />
            </button>
          </Link>
        </h4>
      </div>
      <div>
        <div className=" p-2">
          <form autoComplete="off" method="post" action="">
            <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {/* Intern First Name */}
              <div className="form-group" style={{ width: "250px" }}>
                <label htmlFor="filterinternfirst">Intern First Name:</label>
                <input type="text" className="form-control" id="filterinternfirst" name="filterinternfirst" onChange={handleInputChange} />
              </div>

              {/* Intern Last Name */}
              <div className="form-group" style={{ width: "250px" }}>
                <label htmlFor="filterinternlast">Intern Last Name:</label>
                <input type="text" className="form-control" id="filterinternlast" name="filterinternlast" onChange={handleInputChange} />
              </div>

              {/* Promotion */}
              <div className="form-group" style={{ width: "250px" }}>
                <label htmlFor="filterpromotion">Promotion:</label>
                <input type="text" className="form-control" id="filterpromotion" name="filterpromotion" onChange={handleInputChange} />
              </div>

              {/* Project Year */}
              <div className="form-group" style={{ width: "250px" }}>
                <label htmlFor="filterprojectyear">Project Year:</label>
                <input type="text" className="form-control" id="filterprojectyear" name="filterprojectyear" onChange={handleInputChange} />
              </div>

              {/* Certified */}
              <div className="form-group" style={{ width: "250px" }}>
                <label htmlFor="filtercertified">Certified:</label>
                <div>
                  <input
                    type="radio"
                    id="certifiedYes"
                    name="filtercertified"
                    value="true"
                    checked={searchValues.filtercertified === "true"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="certifiedYes" className="ml-1 mr-3" style={{ margin: "10px" }}>Yes</label>

                  <input
                    type="radio"
                    id="certifiedNo"
                    name="filtercertified"
                    value="false"
                    checked={searchValues.filtercertified === "false"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="certifiedNo" className="ml-1"style={{ margin: "10px" }}>No</label>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center mt-4">
              <button type="button" className="btn btn-primary px-4" onClick={applyFilter}>
                <FaSearch className="me-2" /> Search
              </button>
            </div>
          </form>

        </div>
      </div>
      <div className="d-flex ">
        <div className="sub-main p-2">
       

          <div className="table-container" >
            <Table striped='columns' bordered style={{ width: "85vw" }}>
              <thead className="thead-dark">
                <tr>
                  <th style={{maxWidth:"10px"}}>Id</th>
                  <th>Name</th>

                  <th>Promotion</th>
                  <th>Annee</th>
                  <th style={{width:"300px"}}>Current Internship</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Convention PDF</th>
                  <th style={{maxWidth:"30px"}}>Certified</th>
                  <th>Certified PDF</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
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
                      {Stage.PDF_Agreement
                        ? (
                          <a
                            href={`http://localhost:8000/media/${Stage.PDF_Agreement}`}
                            target="_blank"
                            className="pdf-btn"
                          >
                            <span>
                              {Stage.PDF_Agreement.slice(24, 28)}..
                              {Stage.PDF_Agreement.slice(Stage.PDF_Agreement.length - 4)}
                            </span>
                          </a>
                        ) : (
                          <span className="text-danger">Not Agree yet</span>
                        )}
                    </td>

                    <td>

                      <PrisIcon Pris={Stage.Certified} />
                    </td>
                    <td>
                      {Stage.PDF_Certified
                        ? (
                          <a
                            href={`http://localhost:8000/media/${Stage.PDF_Certified}`}
                            target="_blank"
                            className="pdf-btn"
                          >
                            <span>
                              {Stage.PDF_Certified.slice(24, 28)}..
                              {Stage.PDF_Certified.slice(Stage.PDF_Certified.length - 4)}
                            </span>
                          </a>
                        ) : (
                          <span className="text-danger">Not certified yet</span>
                        )}
                    </td>
                    <td className="text-center">
                      <span className="icon me-2" title="Modify">
                        <Link to={`/Modifier-intern?intern=${Stage.intern_id}`} className="icon text-primary" title="Modify">
                          <FaPenToSquare size={20} />
                        </Link>
                      </span>

                      <span className="icon me-2" title="Details">
                        <Link to={`/Detailsintern?id=${Stage.Project_id}`}>
                          <FaInfoCircle />
                        </Link>
                      </span>

                      <span className='icon' title="Delete" onClick={() => handleDeleteClick(Stage.intern_id)}>
                                                <TiUserDeleteOutline style={{ color: "red", cursor: "pointer" }} />
                                              </span>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", marginLeft: "210px" }}>
            {table_rows ? (
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center mt-3"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            ) : null}

            {display(table_rows)}
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


