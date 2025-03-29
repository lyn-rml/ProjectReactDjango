import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import ReactPaginate from 'react-paginate';
import { Table } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
function StageTest() {
  let table_rows = 1;
  let currentPage = 1;

  const [Supstages, setSupstages] = useState([]);
  const [filters, setfilters] = useState({
    filtermainsupfirstname: "",
    filtermainsuplastname: "",
    filterdomain: "",
    filtertitle: "",
    filterspec: "",
    filter_istaken: "",
  });
  const [Count, setCount] = useState(0);
  const [pageCount, setpageCount] = useState(0);

  async function filterStages() {
    await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&Sujet_pris=${filters.filter_istaken}`)
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
    filterStages();
  }, [filters, currentPage, Count]);

  async function fetchComments(currentpage) {
    await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&Prenom__icontains=${filters.filtermemberfirstname}&Nom__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}&A_paye=${filters.filterapaye}}`)//url du filtre
      .then(res => {
        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  async function handlePageClick(data) {
    table_rows = 3 * (data.selected + 1);
    currentPage = (data.selected) + 1;
    const commentformserver = await fetchComments(currentPage);
    // Updates the current page state
  }
  function filter(e)  //la fonction qui met les valeur inscrits par l'utilisateur dans l'objet filters
  {
    console.log("value:", e.target.value);
    const { name, value } = e.target;//pour indiquer quel attribut de l'objet a change sa valeur
    setfilters((prev) => {
      return { ...prev, [name]: value }//ajouter au valeur precedente la nouvelle valeur inscrite
    });
  }
  function del(id, e) {
    var x = window.confirm("Do you want to delete this project?");
    if (x) {
      var y = prompt("Enter yes to confirm to delete permanently this project:");
      console.log("y", y);
      if (y === "yes") {
        axios.delete(`http://localhost:8000/api/Stages/${id}/`)
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((error) => alert(error));
      }
    }
    console.log("x", x);
    console.log("id:", id);
  }
  const display = (table_rows) => {
    if (table_rows === 0) {
      return <h1 className="no-data-display titre">No data to display</h1>
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center">
        <h1>
          Click the button to add a new Project to the system
          <Link to="/Add-project">
            <button type="button" className="btn add-btn ">
              <FaPlus size={24} color="blue" />
            </button>
          </Link>
        </h1>
      </div>
      <div>
        <form autoComplete="off" method="post" action="" className="p-3">
          <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

          <div className="row">
            {/* First Name & Last Name */}
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="filtermainsupfirstname" className="filter-content">First Name:</label>
                <input type="text" className="form-control" id="filtermainsupfirstname" value={filters.filtermainsupfirstname} name="filtermainsupfirstname" onChange={filter} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="filtermainsuplastname" className="filter-content">Last Name:</label>
                <input type="text" className="form-control" id="filtermainsuplastname" value={filters.filtermainsuplastname} name="filtermainsuplastname" onChange={filter} />
              </div>
            </div>

            {/* Domain & Title */}
            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label htmlFor="filterdomain" className="filter-content">Domain:</label>
                <input type="text" className="form-control" id="filterdomain" value={filters.filterdomain} name="filterdomain" onChange={filter} />
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label htmlFor="filtertitle" className="filter-content">Title:</label>
                <input type="text" className="form-control" id="filtertitle" value={filters.filtertitle} name="filtertitle" onChange={filter} />
              </div>
            </div>

            {/* Speciality & Project is Taken */}
            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label htmlFor="spec" className="filter-content">Speciality:</label>
                <input type="text" className="form-control" id="spec" value={filters.filterspec} name="filterspec" onChange={filter} />
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label htmlFor="filterprojectistaken" className="filter-content">Project is Taken:</label>
                <input type="text" className="form-control" id="filterprojectistaken" value={filters.filter_istaken} name="filter_istaken" onChange={filter} />
              </div>
            </div>

            {/* Search Button */}
            <div className="col-12 text-center mt-4">
              <button type="button" className="btn btn-primary px-4" onClick={filter}>
                <FaSearch className="me-2" /> Search
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        <div className="main d-flex">

          <div className="sub-main p-2">
            <h3 className="titre">List of projects</h3>
            <Table striped="columns" bordered>
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Domain</th>
                  <th scope="col">Speciality</th>
                  <th scope="col">Title</th>
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
                    <td>{supstage.stage_pris}</td>
                    <td>{supstage.superviser_name}</td>
                    <td>
                      <a href={`http://localhost:8000/media/${supstage.stage_pdf}`} target="_blank" className="pdf-btn">
                        <span>{supstage.stage_pdf.slice(24, 28)}..{supstage.stage_pdf.slice(supstage.stage_pdf.length - 4)}</span>
                      </a>
                    </td>
                    <td>
                      <span className="icon" title="Modify"><Link to={`/Modifier-stage?stage=${supstage.stage_title}`}><FaPenToSquare /></Link></span>
                      <span className="icon" title="Delete" onClick={e => del(supstage.stage, e)}><TiUserDeleteOutline /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
      </div>
    </div>
  );
}

export default StageTest;
/*
<div className='filter-stage'>
                    <div>
                      <form autocomplete="off" method="post" action="">
                        <div class="form-group">
                          <label className="filter-content" for="filtermainsupfirstname">First name:</label>
                          <input type="text" class="form-control" id="filtermainsupfirstname" value={filters.filtermainsupfirstname} name="filtermainsupfirstname" onChange={filter} />
                        </div>
                      </form>
                    </div>
                    <div>
                      <form autocomplete="off" method="post" action="">
                        <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
                        <div class="form-group">
                          <label for="filtermainsuplastname" className="filter-content">Last name:</label>
                          <input type="text" class="form-control" id="filtermainsuplastname" value={filters.filtermainsuplastname} name="filtermainsuplastname" onChange={filter} />
                        </div>
                      </form>
                    </div>
                    <div>
                      <form autocomplete="off" method="post" action="">
                        <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
                        <div class="form-group">
                          <label for="filterdomain" className="filter-content">Domain:</label>
                          <input type="text" class="form-control" id="filterdomain" value={filters.filterdomain} name="filterdomain" onChange={filter} />
                        </div>
                      </form>
                    </div>
                    <div>
                      <form autocomplete="off" method="post" action="">
                        <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
                        <div class="form-group">
                          <label for="filtertitle" className="filter-content">Title:</label>
                          <input type="text" class="form-control" id="filtertitle" value={filters.filtertitle} name="filtertitle" onChange={filter} />
                        </div>
                      </form>
                    </div>
                    <div>
                      <form autocomplete="off" method="post" action="">
                        <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
                        <div class="form-group">
                          <label for="spec" className="filter-content">Speciality:</label>
                          <input type="text" class="form-control" id="spec" value={filters.filterspec} name="filterspec" onChange={filter} />
                        </div>
                      </form>
                    </div>
                    <div>
                      <form autocomplete="off" method="post" action="">
                        <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
                        <div class="form-group">
                          <label for="filterprojectistaken" className="filter-content">Project is taken:</label>
                          <input type="text" class="form-control" id="filterprojectistaken" value={filters.filter_istaken} name="filter_istaken" onChange={filter} />
                        </div>
                      </form>
                    </div>
                    <div>
                          <Link to="/Add-project"><input type="button" class="form-control add-btn" value="Add project" readonly /></Link>
                  </div>
        </div>
*/