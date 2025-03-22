import axios from 'axios'
import React,{useRef} from 'react'
import Navbar from '../Header'
import Dashboard from '../Dashboard'
import { Link } from 'react-router-dom'
// import { IoMdInformationCircleOutline } from "react-icons/io"
import { BsInfoSquare } from "react-icons/bs";
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { useState,useEffect } from 'react'
// import {flushSync} from 'react-dom'
import ReactPaginate from 'react-paginate'
import Homecolor from '../Homecolor'
//Functional component
//import pdf from '../components/photos/pdf.jpeg'
import { Table } from 'react-bootstrap'

function Superviser()
 {
  let str="";
  let table_rows=1;
  let currentPage=1;
  const[dele,setdele]=("");
  const [Count,setCount]=useState(currentPage);
  const [pageCount,setpageCount]=useState(0);
  const [Supstages,setSupstages]=useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters,setfilters]=useState({
    filtersupfirst:"",
    filtersuplast:"",
    filteremail:"",
    filteridmember:"",
    filterprofession:"",
  });//use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const refresh = () =>
  {
    table_rows=1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }
    async function filterStages() //fonction pour donner les donnees
    {
      await axios.get(`http://localhost:8000/api/Supervisers/?page=${currentPage}&Prenom__icontains=${filters.filtersupfirst}&Nom__icontains=${filters.filtersuplast}&Email__icontains=${filters.filteremail}&Profession__icontains=${filters.filterprofession}`)//url du filtre
      .then(res => {
          
          setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
          setCount(res.data.count);
          setpageCount(Math.ceil((res.data.count)/(res.data.results.length)))
          if(Count=0)
            {
              table_rows=0
            }
          console.log(table_rows);
          console.log("stages:",Supstages);
        })
     .catch(function (error) {//en cas d'erreur
     console.log(error);
     });
    }
  useEffect(() => {filterStages()}, [filters,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  
    async function fetchComments (currentpage) 
      {
        await axios.get(`http://localhost:8000/api/Supervisers/?page=${currentPage}&Prenom__icontains=${filters.filtersupfirst}&Nom__icontains=${filters.filtersuplast}&Email__icontains=${filters.filteremail}&Profession__icontains=${filters.filterprofession}`)//url du filtre
        .then(res => {
          setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
          setCount(res.data.count);
          setpageCount(Math.ceil((res.data.count)/(res.data.results.length)))
        })
     .catch(function (error) {//en cas d'erreur
     console.log(error);
     });
      }
    async function handlePageClick (data)
      {
        table_rows=pageCount*(data.selected+1);
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
      var x= window.confirm("Do you want to delete this superviser?");
    if(x)
    {
        var y=prompt("Enter yes to confirm to delete permanently this superviser from all projects?");
        console.log("y",y);
        if(y==="yes")
        {
      console.log("id:",id);
      axios.delete(`http://localhost:8000/api/Supervisers/${id}/`)
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
  // function splitter (str)
  //  {
  //    let split2=str.split('/');
  //    let splitted=split2[(split2.length)-1];
  //    console.log("original:",str);
  //    console.log("split2:",split2);
  //    console.log("splitted:",splitted);
  //    return splitted;
  // }
  // useEffect(() => {splitter()}, [Supstages,Count,pageCount]);//pour demander la fonction quand la state des filters change pas tout le temps car cela va presser le serveur due a la demande des donnees tout le temps
  Homecolor({color: "lightblue"})
  return (
    console.log("Supstages:",Supstages),
    console.log("filters:",filters),
    <div className="start">
      <Navbar Add="Add superviser" href="/Add-superviser" home=""/>
      <div className=" main d-flex"> 
          <div className='filter-stage'>
        <div>    
        <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>     
       <div class="form-group">
        <label for="filtermainsup" className="filter-content">Superviser first name:</label>
        <input type="text" class="form-control" id="filtersupfirst" value={filters.filtersupfirst} name="filtersupfirst" onChange={filter}/>
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
        <div class="form-group">
        <label for="filterdomain" className="filter-content">Superviser last name:</label>
        <input type="text" class="form-control" id="filtersuplast" value={filters.filtersuplast} name="filtersuplast" onChange={filter}/>
        </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="filteremail" className="filter-content">Email:</label>
        <input type="text" class="form-control" id="filteremail" value={filters.filteremail} name="filteremail" onChange={filter} />
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="prof" className="filter-content">Profession:</label>
        <input type="text" class="form-control" id="prof" value={filters.filterprofession} name="filterprofession" onChange={filter}/>
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>  
    <div className='form-group'>
      <label></label>
    <Link to="/Add-superviser"><input type="button" class="form-control add-btn" value="Add new superviser" readonly/></Link>
    </div>
    </form>
    </div>
    </div>
    <div className='sub-main p-2'>
            {/* <Dashboard Add="Add superviser" href="/Add-superviser" home=""/> */}
            <h3 className='titre'> List of supervisers</h3> 
          <div className="table-responsive table-contayner" style={{border:"1px solid blue",borderRadius:"0.5rem",borderBottom:"none",boxShadow:"rgba(0,0,0,.3)"}}>
          <Table striped="columns" bordered>
          <thead className="thead-dark">
          <tr>
            <th scope="col" width="150px">Row</th>
            <th scope="col" width="150px">Name</th>
            <th scope="col" width="150px">Email</th>
            <th scope="col" width="150px">Profession</th>
            <th scope="col" width="150px">Member Id</th>
            <th scope="col" width="150px">                  </th>
          </tr>
          </thead>
  <tbody>
   {Supstages.map (supstage => (
      // console.log("splitted:",splitter(supstage.stage_pdf));
      // console.log("length:",(supstage.stage_pdf.split('/')[2].length));
          <tr>
            <td><div className="table-content">
              {table_rows++}
              </div></td>
            <td><div className="table-content">
              {supstage.Prenom} {supstage.Nom}
              </div></td>
            <td><div className="table-content">
              {supstage.Email}
              </div></td>
            <td><div className="table-content">
              {supstage.Profession}
              </div></td>
            <td><div className="table-content">
            {supstage.Id_Membre?supstage.Id_Membre:"Not a member"}
            </div></td> 
            <td>
              <div className='choix table-content'>
              {/* <span className='icon' title="Details"><Link to={`/DetailsSuperviser?superviser=${supstage.Nom} ${supstage.Prenom}`}><BsInfoSquare/></Link></span> */}
              <span className='icon' title="Modify"><Link to={`/Modifier-superviser?superviser=${supstage.id}&name=${supstage.Prenom} ${supstage.Nom}`}><FaPenToSquare/></Link></span>
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

export default Superviser


// class Superviser extends React.Component {
//     state = {
//        Supervisers: []
//      };
//    componentDidMount() {
//      axios.get('http://localhost:8000/api/Supervisers/')
//        .then(res => {
//          const Supervisers = res.data;
//          this.setState({Supervisers});
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
//              <th scope="col">Membre</th>
//              <th scope="col">Modifier</th>
//              <th scope="col">Supprimer</th>
//              </tr>
//              </thead>
//      <tbody>
//       {this.state.Supervisers.map(superviser => (
//              <tr>
//                <td><Link to="/DetailsSuperviser"><span>{superviser.Nom} {superviser.Prenom}</span></Link></td>
//                <td>{superviser.Email}</td>
//                <td>{(superviser.Id_membre==null) ? "Non_Inscrit" : "Inscrit"}</td>
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

// export default Superviser
