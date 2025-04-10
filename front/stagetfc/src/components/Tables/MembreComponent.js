import axios from 'axios'
import React, { useRef } from 'react'
import Navbar from '../Header'
import Dashboard from '../Dashboard'
import { Link } from 'react-router-dom'
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import { Table } from 'react-bootstrap'
import { FaPlus } from "react-icons/fa"
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
function MembreComponent() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const A_payee = queryParams.get("A_paye");
  let table_rows = 1;
  let currentPage = 1;
  const [Count, setCount] = useState(currentPage);
  const [pageCount, setpageCount] = useState(0);
  const [Supstages, setSupstages] = useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters, setfilters] = useState({
    filtermemberfirstname: "",
    filtermemberlastname: "",
    filteradress: "",
    filterapaye: "",
  });
  //use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const [searchValues, setSearchValues] = useState({
    filtermemberfirstname: "",
    filtermemberlastname: "",
    filteradress: "",
    filterapaye: "",
  });
  const refresh = () => {
    table_rows = 1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }
  //
  async function filterfromhome() {
    try {
      const res = await axios.get(`http://localhost:8000/api/Membres/?page=${currentPage}&Prenom__icontains=${filters.filtermemberfirstname}&Nom__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}&A_paye=${false}`);

      if (res.data) {
        setSupstages(Array.isArray(res.data) ? res.data : res.data.results || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function filterStages() //fonction pour donner les donnees
  {
    await axios.get(`http://localhost:8000/api/Membres/?page=${currentPage}&Prenom__icontains=${filters.filtermemberfirstname}&Nom__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}&A_paye=${filters.filterapaye}`)
      .then(res => {
        console.log("data:", res.data.results)
        setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
        setCount(res.data.count);
        setpageCount(Math.ceil((res.data.count) / (res.data.results.length)))
        //         if(Count=0)
        //           {
        //             table_rows=0
        //           }
        //         console.log(table_rows);
        //         console.log("stages:",Supstages);
      })
      .catch(function (error) {//en cas d'erreur
        console.log(error);
      });
  }
  useEffect(() => {
    if (A_payee) {
      filterfromhome();
    } else {
      filterStages();
    }
  }, [A_payee, filters, currentPage]);

  async function fetchComments(currentpage) {
    await axios.get(`http://localhost:8000/api/Membres/?page=${currentPage}&Prenom__icontains=${filters.filtermemberfirstname}&Nom__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}&A_paye=${filters.filterapaye}}`)//url du filtre
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
    var x = window.confirm("Do you want to delete this member?");
    if (x) {
      var y = prompt("Enter yes to confirm to delete permanently this member from all projects?");
      console.log("y", y);
      if (y === "yes") {
        console.log("id:", id);
        axios.delete(`http://localhost:8000/api/Membres/${id}/`)
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

  // useEffect(() => {splitter()}, [Supstages,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  function handleInputChange(e) {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  }
  function applyFilter() {
    setfilters(searchValues); // Only now do we update `filters`
  }
  return (
    console.log("Supstages:", Supstages),
    <div>
      <div className="d-flex align-items-center">
      <h2 style={{margin:"30px"}}>
          Click the button to add a new Member to the system
          <Link to="/Add-member">
            <button type="button" className="btn add-btn ">
              <FaPlus size={24} color="blue" />
            </button>
          </Link>
        </h2>
      </div>
      <div>
        <form autoComplete="off" method="post" action="" className="p-3">
          <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

          <div className="row">
            {/* First Name & Last Name */}
            <div className="col-md-6">
              <div className="form-group">
                <label for="filtermemberfirstname">Member first name:</label>
                <input type="text" class="form-control" id="filtermemberfirstname" name="filtermemberfirstname" onChange={handleInputChange} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label for="filtermemberlastname">Member last name:</label>
                <input type="text" class="form-control" id="filtermemberlastname" name="filtermemberlastname" onChange={handleInputChange} />
              </div>
            </div>

            {/* address*/}
            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label for="filteradress">Adress:</label>
                <input type="text" class="form-control" id="filteradress" name="filteradress" onChange={handleInputChange} />
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="form-group">
                <label for="filterapaye">Had payed:</label>
                <div>
                  <input
                    type="radio"
                    id="payedYes"
                    name="filterapaye"
                    value="true"
                    checked={searchValues.filterapaye === "true"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="payedYes" className="ml-1 mr-3">Yes</label>

                  <input
                    type="radio"
                    id="payedNo"
                    name="filterapaye"
                    value="false"
                    checked={searchValues.filterapaye === "false"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="payedNo" className="ml-1">No</label>
                </div>
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
      <div className="d-flex align-items-center">
      <div className='sub-main p-2'>
        {/* <Dashboard Add="Add new member" href="/Add-member" home=""/> */}
        <h3 className='titre'> List of members</h3>
        <div className="table-container" >
          <Table striped="columns" bordered>
            <thead className="thead-dark">
              <tr>
                <th >Id</th>
                <th >First Name</th>
                <th>LastName</th>
                <th >Email</th>
                <th >Phone</th>
                <th >Adress</th>
                <th >Has payed fees</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Supstages.map(supstage => (
                // console.log("splitted:",splitter(supstage.stage_pdf));
                // console.log("length:",(supstage.stage_pdf.split('/')[2].length));
                <tr>
                  <td><div className="table-content">
                    {supstage.id}
                  </div></td>
                  <td><div className="table-content">
                    <p>{supstage.Nom}</p> <p>{supstage.Prenom}</p>
                  </div></td>
                  <td><div className="table-content">
                    <p>{supstage.Prenom}</p>
                  </div></td>
                  <td><div className="table-content">
                    <p>{supstage.Email}</p>
                  </div></td>
                  <td><div className="table-content">
                    {supstage.Telephone}
                  </div></td>
                  <td><div className="table-content">
                    {supstage.Adresse}
                  </div></td>
                  <td><div className="table-content">
                    {(supstage.A_paye.toString().toLowerCase() === "true")
                      ?
                      "True"
                      : "False"
                    }
                  </div></td>
                  <td>
                    <div className='choix table-content'>
                      <span className='icon' title="detail"><Link to={`/DetailsMember?member=${supstage.id}`}><FaInfoCircle /></Link></span>
                      <span className='icon' title="Modify"><Link to={`/Modifier-Membre?member=${supstage.id}`}><FaPenToSquare /></Link></span>
                      <span className='icon' title="Delete" name="dele" onClick={e => del(supstage.id, e)}><Link to="#" ><TiUserDeleteOutline /></Link></span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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

export default MembreComponent
/*
        <div className='filter-stage'>
          <div>
            <form autocomplete="off" method="post" action="">
              <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
              <div class="form-group">
                <label for="filtermemberfirstname">Member first name:</label>
                <input type="text" class="form-control" id="filtermemberfirstname" value={filters.filtermemberfirstname} name="filtermemberfirstname" onChange={filter} />
              </div>
            </form>
          </div>
          <div>
            <form autocomplete="off" method="post" action="">
              <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
              <div class="form-group">
                <label for="filtermemberlastname">Member last name:</label>
                <input type="text" class="form-control" id="filtermemberlastname" value={filters.filtermemberlastname} name="filtermemberlastname" onChange={filter} />
              </div>
            </form>
          </div>
          <div>
            <form autocomplete="off" method="post" action="">
              <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
              <div class="form-group">
                <label for="filteradress">Adress:</label>
                <input type="text" class="form-control" id="filteradress" value={filters.filteradress} name="filteradress" onChange={filter} />
              </div>
            </form>
          </div>
          <div>
            <form autocomplete="off" method="post" action="">
              <input autocomplete="false" name="hidden" type="text" style={{ display: "none" }} />
              <div class="form-group">
                <label for="filterapaye">Had payed:</label>
                <input type="text" class="form-control" id="filterapaye" value={filters.filterapaye} name="filterapaye" onChange={filter} />
              </div>
            </form>
          </div>
        </div> */

// class MembreComponent extends React.Component {
//     state = {
//        Membres: []
//      };
//    componentDidMount() {
//      axios.get('http://localhost:8000/api/Membres/')
//        .then(res => {
//          const Membres = res.data;
//          this.setState({Membres});
//        });
//      }
//      render()
//      {
//      return (
//        <div className="">
//          <Navbar/>
//          <div className=" main d-flex">
//            <Dashboard/>
//              <div className='sub-main'>
//              <Main1stagiaire/>
//              <div>
//                <h3 className='titre'> Liste des stages</h3>
//              <table className="table">
//              <thead className="thead-dark">
//              <tr>
//              <th scope="col">Nom</th>
//              <th scope="col">Email</th>
//              <th scope="col">Telephone</th>
//              <th scope="col">A_paye</th>
//              <th scope="col">Modifier</th>
//              <th scope="col">Supprimer</th>
//              </tr>
//              </thead>
//      <tbody>
//       {this.state.Membres.map(membre => (
//              <tr>
//                <td><Link to="/DetailsMember"><span>{membre.Nom} {membre.Prenom}</span></Link></td>
//                <td>{membre.Email}</td>
//                <td>{membre.Telephone}</td>
//                <td>{(membre.A_paye) ? "Oui" : "Non"}</td>
//                <td scope="col"><Link to="/Modifier-stage"><span className="navbar-brand link-btn">Modifier</span></Link></td>
//                <td scope="col"><Link to="/Supprimer-stage"><span className="navbar-brand link-btn">Supprimer</span></Link></td>
//              </tr>
//            ))}
//      </tbody>
//    </table>
//            </div>
//            </div>
//              </div>
//      </div>
//      );
//    }
//    }

// export default MembreComponent
