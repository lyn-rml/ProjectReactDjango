import axios from 'axios'
import React,{useRef} from 'react'
import Navbar from '../Header'
import Dashboard from '../Dashboard'
import { Link } from 'react-router-dom'
import { BsInfoSquare } from "react-icons/bs";
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { useState,useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import Homecolor from '../Homecolor'
import pdf from '../photos/pdf.jpeg'
import { Table } from 'react-bootstrap'

function MembreComponent()
 {
  let table_rows=1;
  let currentPage=1;
  const [Count,setCount]=useState(currentPage);
  const [pageCount,setpageCount]=useState(0);
  const [Supstages,setSupstages]=useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters,setfilters]=useState({
    filtermemberfirstname:"",
    filtermemberlastname:"",
    filteradress:"",
    filterapaye:"",
  });//use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const refresh = () =>
  {
    table_rows=1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }
  //
   async function filterStages() //fonction pour donner les donnees
     {
       await axios.get(`http://localhost:8000/api/Membres/?page=${currentPage}&Prenom__icontains=${filters.filtermemberfirstname}&Nom__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}&A_paye=${filters.filterapaye}`)
       .then(res => {     
        console.log("data:",res.data.results)
           setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
           setCount(res.data.count);
           setpageCount(Math.ceil((res.data.count)/(res.data.results.length)))
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
   useEffect(() => {filterStages()}, [filters,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  
   async function fetchComments (currentpage) 
   {
     await axios.get(`http://localhost:8000/api/Membres/?page=${currentPage}&Prenom__icontains=${filters.filtermemberfirstname}&Nom__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}&A_paye=${filters.filterapaye}}`)//url du filtre
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
    console.log("value:",e.target.value);
      const {name,value}=e.target;//pour indiquer quel attribut de l'objet a change sa valeur
     setfilters((prev) => { 
      return{...prev,[name]:value}//ajouter au valeur precedente la nouvelle valeur inscrite
    });
   }
   function del (id,e)
    {
      var x= window.confirm("Do you want to delete this member?");
    if(x)
    {
        var y=prompt("Enter yes to confirm to delete permanently this member from all projects?");
        console.log("y",y);
        if(y==="yes")
        {
      console.log("id:",id);
      axios.delete(`http://localhost:8000/api/Membres/${id}/`)
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

  Homecolor({color: "lightblue"});

  return (
    console.log("Supstages:",Supstages),
    <div className="start">
      <Navbar Add="Add new member" href="/Add-member" home=""/>
      <div className=" main d-flex">
          <div className='filter-stage'>
        <div>    
        <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>     
       <div class="form-group">
        <label for="filtermemberfirstname">Member first name:</label>
        <input type="text" class="form-control" id="filtermemberfirstname" value={filters.filtermemberfirstname} name="filtermemberfirstname" onChange={filter}/>
    </div>
    </form>
    </div>
    <div>    
        <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>     
       <div class="form-group">
        <label for="filtermemberlastname">Member last name:</label>
        <input type="text" class="form-control" id="filtermemberlastname" value={filters.filtermemberlastname} name="filtermemberlastname" onChange={filter}/>
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
        <div class="form-group">
        <label for="filteradress">Adress:</label>
        <input type="text" class="form-control" id="filteradress" value={filters.filteradress} name="filteradress" onChange={filter}/>
        </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="filterapaye">Had payed:</label>
        <input type="text" class="form-control" id="filterapaye" value={filters.filterapaye} name="filterapaye" onChange={filter} />
    </div>
    </form>
    </div>
    <div className="d-xl-none">
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>  
    <div className='form-group'>
      <label></label>
    <Link to="/Add-member"><input type="button" class="form-control add-btn" value="Add new member" readonly/></Link>
    </div>
    </form>
    </div>
    </div>
    <div className='sub-main p-2'>
            {/* <Dashboard Add="Add new member" href="/Add-member" home=""/> */}
            <h3 className='titre'> List of members</h3> 
          <div className="table-responsive table-contayner" style={{border:"1px solid blue",borderRadius:"0.5rem",borderBottom:"none",boxShadow:"rgba(0,0,0,.3)"}}>
          <Table striped="columns" bordered>
          <thead className="thead-dark">
          <tr>
            <th scope="col" width="150px">Id</th>
            <th scope="col" width="150px">Name</th>
            <th scope="col" width="150px">Email</th>
            <th scope="col" width="150px">Phone</th>
            <th scope="col" width="150px">Adress</th>
            <th scope="col" width="150px">Has payed fees</th>
            <th scope="col" width="150px">                  </th>
          </tr>
          </thead>
  <tbody>
   {Supstages.map (supstage => (
      // console.log("splitted:",splitter(supstage.stage_pdf));
      // console.log("length:",(supstage.stage_pdf.split('/')[2].length));
          <tr>
            <td><div className="table-content">
              {supstage.id}
              </div></td>
            <td><div className="table-content">
              {supstage.Prenom} {supstage.Nom}
              </div></td>
            <td><div className="table-content">
              {supstage.Email}
              </div></td>
            <td><div className="table-content">
              {supstage.Telephone}
              </div></td>
              <td><div className="table-content">
              {supstage.Adresse}
              </div></td>
            <td><div className="table-content">
              {(supstage.A_paye.toString().toLowerCase()==="true")
             ?
             "Yes"
             :"No" 
             } 
            </div></td>
            <td>
              <div className='choix table-content'>
              {/* <span className='icon' title="Details"><Link to={`/DetailsMember?member=${supstage.id}`}><BsInfoSquare/></Link></span> */}
              <span className='icon' title="Modify"><Link to={`/Modifier-Membre?member=${supstage.id}`}><FaPenToSquare/></Link></span>
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

export default MembreComponent


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
