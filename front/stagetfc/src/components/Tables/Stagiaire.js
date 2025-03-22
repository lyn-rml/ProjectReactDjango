import axios from 'axios'
import React,{useRef} from 'react'
import Navbar from '../Header'
import Dashboard from '../Dashboard'
import { Link } from 'react-router-dom'
import { BsInfoSquare } from "react-icons/bs";
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { useState,useEffect } from 'react'
import { Table } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Homecolor from '../Homecolor'

function Stagiaire()
 {
  let str="";
  let table_rows=1;
  let currentPage=1;
  const[dele,setdele]=("");
  const [Count,setCount]=useState(currentPage);
  const [pageCount,setpageCount]=useState(0);
  const [Supstages,setSupstages]=useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters,setfilters]=useState({
    filterinternfirst:"",
    filterinternlast:"",
    filterpromotion:"",
    filterstagetitle:"",
    filterprojectyear:"",
    filtercertified:"",//interns that have working or not in internships
  });//use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const refresh = () =>
  {
    table_rows=1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }

    async function filterStages() //fonction pour donner les donnees
    {
      let init=[];
      let internsinit=[];
      //fill all interns
    // await axios.get(`http://localhost:8000/api/Stagiaires/get_all/`)
    // .then(res => {
    //       for(let i=0;i<res.data.length;i++)
    //       {
    //           let singintern=
    //           {
    //             value:res.data[i].id,
    //           }
    //           init.push(singintern);
    //       }
    //   })
    //   .catch(function (error) {//en cas d'erreur
    //   console.log(error);
    //   });
        //filter interns that don't have internships:
     await axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__Nom__icontains=${filters.filterinternlast}&stagiaire__Prenom__icontains=${filters.filterinternfirst}&stage__Title__iexact=${filters.filterstagetitle}&Annee__icontains=${filters.filterprojectyear}&Promotion__icontains=${filters.filterpromotion}&Certified=${filters.filtercertified}`)
      .then(res => {
           setSupstages(res.data.results);
                // for(let i=0;i<res.data.count;i++)
                // {
                //   let singintern=
                //   {
                //     value:res.data[i],
                //     intern_name:`${res.data[i].intern_name}`,
                //   }
                // }
                console.log("data:",res.data.results);
          // setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
           setCount(res.data.count);
           setpageCount(Math.ceil((res.data.count)/(res.data.results.length)))
          // if(Count=0)
          //   {
          //     table_rows=0
          //   }
          // console.log(table_rows);
          // console.log("stages:",Supstages);

        })
     .catch(function (error) {//en cas d'erreur
     console.log(error);
     });
    }
  useEffect(() => {filterStages()}, [filters,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  
    async function fetchComments (currentpage) 
      {
        let initstagiaires=[];
        await axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__Nom__icontains=${filters.filterinternlast}&stagiaire__Prenom__icontains=${filters.filterinternfirst}&stage__Title__iexact=${filters.filterstagetitle}&Annee__icontains=${filters.filterprojectyear}&Promotion__icontains=${filters.filterpromotion}&Certified=${filters.filtercertified}`)//url du filtre
        .then(res => {
          setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
        })
     .catch(function (error) {//en cas d'erreur
     console.log(error);
     });
      }

    async function handlePageClick (data)
      {
        table_rows=3*(data.selected+1);
        console.log("page=",data.selected+1);
        currentPage=(data.selected) +1;
        const commentformserver= await fetchComments(currentPage);
      }  
     // useEffect(() =>{fetchComments()},[filters]);  
  
  function filter (e)  //la fonction qui met les valeur inscrits par l'utilisateur dans l'objet filters
   {
      const {name,value}=e.target;//pour indiquer quel attribut de l'objet a change sa valeur
     setfilters((prev) => { 
      return{...prev,[name]:value}//ajouter au valeur precedente la nouvelle valeur inscrite
    });
   }
  function del (id,e)
  {
    var x=window.confirm("Do you want to delete this intern?");
    if(x)
    {
        var y=prompt("Enter yes to confirm to delete permanently this intern from all projects?");
        console.log("y",y);
        if(y==="yes")
        {
      console.log("id:",id);
      axios.delete(`http://localhost:8000/api/Stagiaires/${id}/`)
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((error) => alert(error));
      }
    }
  }
  const display = (table_rows) =>
  {
    if(table_rows===0)
      {
        return <h1 className="no-data-display titre">No data to display</h1>
      }
  }

  // useEffect(() => {splitter()}, [Supstages,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  Homecolor({color: "lightblue"})
  return (
    
    <div className="start">
      <Navbar Add="Add new intern" href="/Add-intern" home=""/>
      <div className=" main d-flex">
          <div className='filter-stage'>
        <div>    
        <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>     
       <div class="form-group">
        <label for="filtermainsup">Intern first name:</label>
        <input type="text" class="form-control" id="filterinternfirst" value={filters.filterinternfirst} name="filterinternfirst" onChange={filter}/>
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
        <div class="form-group">
        <label for="filterdomain">Intern last name:</label>
        <input type="text" class="form-control" id="filterinternlast" value={filters.filterinternlast} name="filterinternlast" onChange={filter}/>
        </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
        <div class="form-group">
        <label for="filterdomain">Promotion:</label>
        <input type="text" class="form-control" id="filterpromotion" value={filters.filterpromotion} name="filterpromotion" onChange={filter}/>
        </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="filtertitle">Project year:</label>
        <input type="text" class="form-control" id="filtertitle" value={filters.filterprojectyear} name="filterprojectyear" onChange={filter} />
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="filtertitle">Certified:</label>
        <input type="text" class="form-control" id="filtercertified" value={filters.filtercertified} name="filtercertified" onChange={filter} />
    </div>
    </form>
    </div>
    <div className="d-xl-none">
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>  
    <div className='form-group'>
      <label></label>
    <Link to="/Add-intern"><input type="button" class="form-control add-btn" value="Add new interns" readonly/></Link>
    </div>
    </form>
    </div>
    </div>
    <div className='sub-main p-2'>
            {/* <Dashboard Add="Add new intern" href="/Add-intern" home=""/> */}
            <h3 className='titre'> List of interns</h3> 
          <div className="table-responsive table-contayner" style={{border:"1px solid blue",borderRadius:"0.5rem",borderBottom:"none",boxShadow:"rgba(0,0,0,.3)"}}>
          <Table striped bordered>
          <thead className="thead-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Promotion</th>
            <th scope="col">Current internship</th>
            <th scope="col">Date-debut</th>
            <th scope="col">Date-fin</th>
            <th scope="col">Convention PDF</th>
            <th style={{color:"transparent"}}>Other actions</th>
          </tr>
          </thead>
  <tbody>
    {Supstages.map(supstage => (
          <tr>
            <td><div className="table-content">
            {supstage.stagiaire}
              </div></td>
            <td><div className="table-content">
            {supstage.intern_name}
            </div></td>
            <td><div className="table-content">
            {supstage.intern_email}
            </div></td>
            <td><div className="table-content">
            {supstage.Promotion}
            </div></td>
            <td><div className="table-content">
            {supstage.internship_name}
            </div></td>
            <td><div className="table-content">
            {supstage.date_debut}
            </div></td>
            <td><div className="table-content">
            {supstage.date_fin}
            </div></td>
            <td><div className="table-content">
              <a href={`http://localhost:8000/media/${supstage.PDF_Agreement}`} target="blank" className="pdf-btn">
              <span>{(supstage.PDF_Agreement.slice(24,28))}..
                {(supstage.PDF_Agreement.slice(supstage.PDF_Agreement.length-4,supstage.PDF_Agreement.length))}
                </span></a>
            </div></td> 
            <td>
              <div className='choix'>
              {/* <span className='icon' title="Details"><Link to={`/DetailsStage?intern=${supstage.stagiaire}`}><BsInfoSquare/></Link></span> */}
              <span className='icon' title="Modify"><Link to={`/Modifier-intern?intern=${supstage.stagiaire}`}><FaPenToSquare/></Link></span>
              <span className='icon' title="Delete" name="dele" onClick={e=>del(supstage.id,e)}><Link to="#" ><TiUserDeleteOutline/></Link></span>
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
 :""}
{display(table_rows)}
        </div>
        </div>
          </div>
  );
}

export default Stagiaire


// class Stagiaire extends React.Component {
//     state = {
//        Stagiaires: []
//      };
//    componentDidMount() {
//      axios.get('http://localhost:8000/api/Stagiaires/')
//        .then(res => {
//          const Stagiaires = res.data;
//          this.setState({Stagiaires});
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
//              <th scope="col">Nombre de stages</th>
//              <th scope="col">Has stage on in hand</th>
//              <th scope="col">Modifier</th>
//              <th scope="col">Supprimer</th>
//              </tr>
//              </thead>
//      <tbody>
//       {this.state.Stagiaires.map(stagiaire => (
//              <tr>
//                <td><Link to="/DetailsStagiaire"><span>{stagiaire.Nom} {stagiaire.Prenom}</span></Link></td>
//                <td>{stagiaire.Email}</td>
//                <td>{stagiaire.Nbstage}</td>
//                <td>{stagiaire.Has_stage ? "Oui" : "Non"}</td>
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

// export default Stagiaire
