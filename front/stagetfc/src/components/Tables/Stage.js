import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import ReactPaginate from 'react-paginate';
import { Table } from 'react-bootstrap';
import { FaPlus, FaInfoCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmModal from '../../mycomponent/confirmmodal'
import PrisIcon from '../../mycomponent/truefalseicon';
function Stage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  let index = 1
  let table_rows = 1;
  let currentPage = 1;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sujetPris = queryParams.get("Sujet_pris");
  const [Supstages, setSupstages] = useState([]);
  const [filters, setfilters] = useState({
    filtermainsupfirstname: "",
    filtermainsuplastname: "",
    filterdomain: "",
    filtertitle: "",
    filterspec: "",
    filter_istaken: "",
    filter_dateregister: ""
  });
  const [searchValues, setSearchValues] = useState({
    filtermainsupfirstname: "",
    filtermainsuplastname: "",
    filterdomain: "",
    filtertitle: "",
    filterspec: "",
    filter_istaken: "",
    filter_dateregister: ""
  });
  const [Count, setCount] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  async function handlePageClick(data) {
    table_rows = 3 * (data.selected + 1);
    currentPage = (data.selected) + 1;
    const commentformserver = await fetchComments(currentPage);
    // Updates the current page state
  }
  async function filterfromhome() {
    try {
      const res = await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&stage__Sujet_pris__icontains=${false}&stage__Date_register__icontains=${filters.filter_dateregister}&is_admin=true`);

      if (res.data) {
        setSupstages(Array.isArray(res.data) ? res.data : res.data.results || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function filterStages() {
    await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&stage__Sujet_pris__icontains=${filters.filter_istaken}&stage__Date_register__icontains=${filters.filter_dateregister}&is_admin=true`)
      .then(res => {
        setSupstages(res.data.results);
        setCount(res.data.count);
        setpageCount(Math.ceil(res.data.count / res.data.results.length));
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  useEffect(() => {
    if (sujetPris) {
      filterfromhome();
    } else {
      filterStages();
    }
  }, [sujetPris, filters, currentPage]);

  async function fetchComments(currentpage) {
    await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&stage__Sujet_pris__icontains=${filters.filter_istaken}&stage__Date_register=${filters.filter_dateregister}`)//url du filtre
      .then(res => {
        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }

  function filter(e)  //la fonction qui met les valeur inscrits par l'utilisateur dans l'objet filters
  {
    console.log("value:", e.target.value);
    const { name, value } = e.target;//pour indiquer quel attribut de l'objet a change sa valeur
    setfilters((prev) => {
      return { ...prev, [name]: value }//ajouter au valeur precedente la nouvelle valeur inscrite
    });
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      axios.delete(`http://localhost:8000/api/supstage/${deleteId}/`)
      setShowConfirm(false);
      setDeleteId(null);
    } catch (error) {
      alert("Error deleting member");
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
  return (
    <div>
      <div className="d-flex align-items-center">
      <h4 style={{margin:"10px"}}>
          Click the button to add a new Project to the system
          <Link to={`/admin-dashboard/Add-project/?index=${index}`}>
            <button type="button" className="btn add-btn ">
            <span style={{ margin: "10px" }}>ADD New</span>
              <FaPlus size={24} color="#fff" />
            </button>
          </Link>
        </h4>
      </div>
      <div>
      <form autoComplete="off" method="post" action="" className="p-3">
  <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
    {/* First Name */}
    <div style={{ width: '250px' }}>
      <label htmlFor="filtermainsupfirstname" className="filter-content">Supervisor Last Name:</label>
      <input type="text" className="form-control" id="filtermainsupfirstname" name="filtermainsupfirstname" onChange={handleInputChange} />
    </div>

    {/* Last Name */}
    <div style={{ width: '250px' }}>
      <label htmlFor="filtermainsuplastname" className="filter-content">Supervisor First Name:</label>
      <input type="text" className="form-control" id="filtermainsuplastname" name="filtermainsuplastname" onChange={handleInputChange} />
    </div>

    {/* Domain */}
    <div style={{ width: '250px' }}>
      <label htmlFor="filterdomain" className="filter-content">Domain:</label>
      <input type="text" className="form-control" id="filterdomain" name="filterdomain" onChange={handleInputChange} />
    </div>

    {/* Title */}
    <div style={{ width: '250px' }}>
      <label htmlFor="filtertitle" className="filter-content">Title:</label>
      <input type="text" className="form-control" id="filtertitle" name="filtertitle" onChange={handleInputChange} />
    </div>

    {/* Speciality */}
    <div style={{ width: '250px' }}>
      <label htmlFor="spec" className="filter-content">Speciality:</label>
      <input type="text" className="form-control" id="spec" name="filterspec" onChange={handleInputChange} />
    </div>

    {/* Project is Taken */}
    <div style={{ width: '250px' }}>
      <label htmlFor="filterprojectistaken" className="filter-content">Project is Taken:</label>
      <div className="d-flex align-items-center">
        <input type="radio" id="takenYes" name="filter_istaken" value="true" checked={searchValues.filter_istaken === "true"} onChange={handleInputChange} />
        <label htmlFor="takenYes" className="ms-1 me-3">Yes</label>
        <input type="radio" id="takenNo" name="filter_istaken" value="false" checked={searchValues.filter_istaken === "false"} onChange={handleInputChange} />
        <label htmlFor="takenNo" className="ms-1">No</label>
      </div>
    </div>

    {/* Date Register */}
    <div style={{ width: '250px' }}>
      <label htmlFor="dateregister" className="filter-content">Date_register:</label>
      <DatePicker
        selected={searchValues.filter_dateregister ? new Date(searchValues.filter_dateregister) : null}
        onChange={(date) => {
          const formatted = date ? date.toISOString().split("T")[0] : "";
          setSearchValues(prev => ({
            ...prev,
            filter_dateregister: formatted,
          }));
        }}
        dateFormat="yyyy-MM-dd"
        className="form-control"
      />
    </div>

    {/* Search Button (full width row) */}
    <div className="w-100 text-center ">
      <button type="button" className="btn btn-primary px-4" onClick={applyFilter}>
        <FaSearch className="me-2" /> Search
      </button>
    </div>
  </div>
</form>

      </div>
      <div>
          <div className="sub-main " >
            <Table striped="columns" bordered style={{ width: "80vw" }}>
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Domain</th>
                  <th scope="col">Speciality</th>
                  <th scope="col" style={{width:"300px"}}>Title</th>
                  <th scope='col'>Date_register</th>
                  <th scope="col">Project-taken</th>
                  <th scope="col">Main Supervisor</th>
                  <th scope="col">Subject PDF</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {Supstages.map(supstage => (
                  <tr key={supstage.id}>
                    <td>{supstage.stage}</td>
                    <td>{supstage.stage_domain}</td>
                    <td>{supstage.stage_spec}</td>
                    <td>{supstage.stage_title}</td>
                    <td>{supstage.stage_date_register}</td>
                    <PrisIcon Pris={supstage.stage_pris} />
                    <td>{supstage.superviser_name}</td>
                    <td>
                      <a href={`http://localhost:8000/media/${supstage.stage_pdf}`} target="_blank" className="pdf-btn">
                        <span>{supstage.stage_pdf.slice(24, 28)}..{supstage.stage_pdf.slice(supstage.stage_pdf.length - 4)}</span>
                      </a>
                    </td>
                    <td>
                      <span className="icon me-2" title="Modify"><Link to={`/admin-dashboard/Modifier-stage?stage=${supstage.stage}`}><FaPenToSquare /></Link></span>
                      <span className="icon me-2" title="details"><Link to={`/admin-dashboard/DetailsStage?stage=${supstage.stage}`}><FaInfoCircle /></Link></span>
                     <span className='icon' title="Delete" onClick={() => handleDeleteClick(supstage.stage.id)}>
                                              <TiUserDeleteOutline style={{ color: "red", cursor: "pointer" }} />
                                            </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div style={{ display: "flex", justifyContent: "center", marginLeft: "210px" }}>
            {(table_rows) ?
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
              : ""}
            {display(table_rows)}
            </div>
          </div>
          <ConfirmModal
          show={showConfirm}
          onHide={() => setShowConfirm(false)}
          onConfirm={ confirmDelete }
          title="Delete Project"
          message="Are you sure you want to permanently delete this Project?"
        />
        </div>

    </div>
  );
}

export default Stage;

