import axios from 'axios'
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import Homecolor from '../Homecolor'
import { Table } from 'react-bootstrap'

function Stage() {
  const [abc, setabc] = useState("");
  let table_rows = 1;
  let currentPage = 1;
  const [dele, setdele] = ("");
  const [Count, setCount] = useState(currentPage);
  const [pageCount, setpageCount] = useState(0);
  const [Supstages, setSupstages] = useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters, setfilters] = useState({
    filtermainsupfirstname: "",
    filtermainsuplastname: "",
    filterdomain: "",
    filtertitle: "",
    filterspec: "",
    filter_istaken: "",
  });//use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const refresh = () => {
    table_rows = 1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }
  async function filterStages() //fonction pour donner les donnees
  {
    await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&Sujet_pris=${filters.filter_istaken}`)//url du filtre
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
    await axios.get(`http://localhost:8000/api/supstage/get_all`)
      .then(res => {
        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
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
  Homecolor({ color: "lightblue" });
  return (
    console.log("Supstages:", Supstages),

    <div className=" main d-flex">
      {/* <Dashboard/> */}
      <div className='filter-stage'>
        <div>
          <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
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
        <div className="d-xl-none">
          <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
            <div className='form-group'>
              <label></label>
              <Link to="/Add-project"><input type="button" class="form-control add-btn" value="Add project" readonly /></Link>
            </div>
          </form>
        </div>
      </div>
      <div className='sub-main p-2'>
        {/* <Dashboard Add="Add project" href="/Add-project" home=""/> */}
        {/* data-mdb-suppress-scroll-y='true' */}
        {/* <div className='tables table-stage'> */}
        <h3 className='titre'> List of projects</h3>
        <div className="table-responsive table-contayner" style={{ border: "1px solid blue", borderRadius: "0.5rem", borderBottom: "none", boxShadow: "rgba(0,0,0,.3)" }}>
          {/* <table className="table data-mdb-perfect-scrollbar-init"> */}
          <Table striped="columns" bordered>
            <thead className="thead-dark">
              <tr>
                {/* <th scope="col" width="150px">Row</th> */}
                <th scope="col" width="150px">Id</th>
                <th scope="col" width="150px">Domain</th>
                <th scope="col" width="150px">Speciality</th>
                <th scope="col" width="150px">Title</th>
                <th scope="col" width="150px">Project-taken</th>
                <th scope="col" width="150px">Main Supervisor</th>
                <th scope="col" width="150px">Subject PDF</th>
                <th scope="col" width="150px">                  </th>
              </tr>
            </thead>
            <tbody>
              {Supstages.map(supstage => (
                // console.log("splitted:",splitter(supstage.stage_pdf));
                // console.log("length:",(supstage.stage_pdf.split('/')[2].length));
                <tr>
                  {/* <td><div className="table-content">
              {table_rows++}
              </div></td> */}
                  <td><div className="table-content">
                    {supstage.stage}
                  </div></td>
                  <td><div className="table-content">
                    {supstage.stage_domain}
                  </div></td>
                  <td><div className="table-content">
                    {supstage.stage_spec}
                  </div></td>
                  <td><div className="table-content">
                    {supstage.stage_title}
                  </div></td>
                  <td><div className="table-content">
                    {/* {(supstage.stage_pris.toString().toLowerCase()==="true")
             ?
             "Yes"
             :"No" */}
                    {/* } */}
                    {supstage.stage_pris}
                  </div></td>
                  <td><div className="table-content">
                    {supstage.superviser_name}
                  </div></td>

                 <td>
                                            <a href={`http://localhost:8000/media/${supstage.stage_pdf}`} target="_blank" className="pdf-btn">
                                                <span>{(supstage.stage_pdf.slice(24, 28))}..{(supstage.stage_pdf.slice(supstage.stage_pdf.length - 4))}</span>
                                                <img src={supstage.stage_pdf} alt="pdf" className='pdf_photo' />
                                            </a>
                                        </td>
                  {/* <td><Link to={`http://localhost:8000/media/`}{supstage.stage_pdf.split('/')[2]}</td> */}
                  <td>
                    <div className='choix table-content'>
                      {/* <span className='icon' title="Details"><Link to={`/DetailsStage?stage=${supstage.stage_title}`}><BsInfoSquare/></Link></span> */}
                      <span className='icon' title="Modify"><Link to={`/Modifier-stage?stage=${supstage.stage_title}`}><FaPenToSquare /></Link></span>
                      <span className='icon' title="Delete" name="dele" onClick={e => del(supstage.stage, e)}><Link to="#" ><TiUserDeleteOutline /></Link></span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="p-1">
          {(table_rows) ?
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'next'}
              breakLabel={''}
              pageCount={pageCount}//number of page in the pagination
              marginPagesDisplayed={2} //number of pages displayed at the start and in the end
              pageRangeDisplayed={3} //number of pages displayed in the middle
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

  );
}

export default Stage


