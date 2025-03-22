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
import pdf from '../photos/pdf.jpeg'
import { Alert, Table } from 'react-bootstrap'

function Stage()
 {
  const [abc,setabc]=useState("");
  let table_rows=1;
  let currentPage=1;
  const[dele,setdele]=("");
  const [Count,setCount]=useState(currentPage);
  const [pageCount,setpageCount]=useState(0);
  const [Supstages,setSupstages]=useState([]);//use state pour remplir le tableau supstage quand on appelle l 'api
  const [filters,setfilters]=useState({
    filtermainsupfirstname:"",
    filtermainsuplastname:"",
    filterdomain:"",
    filtertitle:"",
    filterspec:"",
    filter_istaken:"",
  });//use state qui est forme d'un object dont les attributs les fields qu'on va filtrer
  const refresh = () =>
  {
    table_rows=1;//lorsqu'on redemare la page ou on utilise un filtre le nombre des lignes est reinitialise a 0
  }
    async function filterStages() //fonction pour donner les donnees
    {
      
      await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&stage__Sujet_pris=${filters.filter_istaken}`)//url du filtre
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
        await axios.get(`http://localhost:8000/api/supstage/?page=${currentPage}&superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&stage__Sujet_pris__exact=${filters.filter_istaken}&is_admin=`)//url du filtre
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
      var x= window.confirm("Do you want to delete this project?");
      if(x)
      {
        var y=prompt("Enter yes to confirm to delete permanently this project:");
        console.log("y",y);
        if(y==="yes")
        {
          axios.delete(`http://localhost:8000/api/Stages/${id}/`)
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((error) => alert(error));
        }
      }
      console.log("x",x);
      console.log("id:",id);
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
  Homecolor({color: "lightblue"});
  return (
    console.log("Supstages:",Supstages),
    <div className="start">
      <Navbar Add="Add project" href="/Add-project" home=""/>
      <div className=" main d-flex">
        {/* <Dashboard/> */}
        <div className='filter-stage'>
        <div>    
        <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>     
       <div class="form-group">
        <label className="filter-content" for="filtermainsupfirstname">First name:</label>
        <input type="text" class="form-control" id="filtermainsupfirstname" value={filters.filtermainsupfirstname} name="filtermainsupfirstname" onChange={filter}/>
    </div>
    </form>
    </div>
    <div>    
        <form autocomplete="off" method="post" action="">
            <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>     
       <div class="form-group">
        <label for="filtermainsuplastname" className="filter-content">Last name:</label>
        <input type="text" class="form-control" id="filtermainsuplastname" value={filters.filtermainsuplastname} name="filtermainsuplastname" onChange={filter}/>
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
        <div class="form-group">
        <label for="filterdomain"className="filter-content">Domain:</label>
        <input type="text" class="form-control" id="filterdomain" value={filters.filterdomain} name="filterdomain" onChange={filter}/>
        </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="filtertitle" className="filter-content">Title:</label>
        <input type="text" class="form-control" id="filtertitle" value={filters.filtertitle} name="filtertitle" onChange={filter} />
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="spec" className="filter-content">Speciality:</label>
        <input type="text" class="form-control" id="spec" value={filters.filterspec} name="filterspec" onChange={filter} />
    </div>
    </form>
    </div>
    <div>
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
    <div class="form-group">
        <label for="filterprojectistaken" className="filter-content">Project is taken:</label>
        <input type="text" class="form-control" id="filterprojectistaken" value={filters.filter_istaken} name="filter_istaken" onChange={filter} />
    </div>
    </form>
    </div>
    <div className="d-xl-none">
    <form autocomplete="off" method="post" action="">
        <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>  
    <div className='form-group'>
      <label></label>
    <Link to="/Add-project"><input type="button" class="form-control add-btn" value="Add project" readonly/></Link>
    </div>
    </form>
    </div> 
    </div>
          <div className='sub-main p-2'>
            {/* <Dashboard Add="Add project" href="/Add-project" home=""/> */}
    {/* data-mdb-suppress-scroll-y='true' */}
          {/* <div className='tables table-stage'> */}
            <h3 className='titre'> List of projects</h3> 
          <div className="table-responsive table-contayner" style={{border:"1px solid blue",borderRadius:"0.5rem",borderBottom:"none",boxShadow:"rgba(0,0,0,.3)"}}>
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
   {Supstages.map (supstage => (
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
            {/* <td>{supstage.stage_pdf}</td> */}
            <td><div className="table-content">
              <a href={`http://localhost:8000/media/${supstage.stage_pdf}`} target="blank" className="pdf-btn">
              <span>{(supstage.stage_pdf.slice(24,28))}..
                {(supstage.stage_pdf.slice(supstage.stage_pdf.length-4,supstage.stage_pdf.length))}
                {/* {supstage.stage_pdf.split('/')[2].substring((supstage.stage_pdf.split('/')[2].length)-4,(supstage.stage_pdf.split('/')[2].length)-1)} */}
                </span><img src={pdf} alt="pdf" className='pdf_photo'></img></a>
            </div></td> 
            {/* <td><Link to={`http://localhost:8000/media/`}{supstage.stage_pdf.split('/')[2]}</td> */}
            <td>
              <div className='choix table-content'>
              {/* <span className='icon' title="Details"><Link to={`/DetailsStage?stage=${supstage.stage_title}`}><BsInfoSquare/></Link></span> */}
              <span className='icon' title="Modify"><Link to={`/Modifier-stage?stage=${supstage.stage_title}`}><FaPenToSquare/></Link></span>
              <span className='icon' title="Delete" name="dele" onClick={e=>del(supstage.stage,e)}><Link to="#" ><TiUserDeleteOutline/></Link></span>
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
 :""}
{display(table_rows)} 
  </div>       
   
        </div>
        </div>
          {/* </div> */}
  </div>
  );
}

export default Stage


{/* <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-right">
    {
    previousUrl &&
    <li class="page-item"><button  name="previous" class="page-link" onClick={filterStages(previousUrl)}><i className="bi bi-arrow-left"/>Previous</button></li>
  }{/* if previousUrl != null show previous button */}
  {/*{
    nextUrl &&
    <li class="page-item"><button name="next" class="page-link"  onClick={filterStages(nextUrl)}>Next<i className="bi bi-arrow-right"></i></button></li>
  }
  </ul>
</nav> */}

// function paginationHandler (url)
  //   {
  //     axios.get(url)//url de la page demandee
  //     .then(res => {
  //          setSupstages(res.data.results);//utiliser use state pour remplir le tableau supstages par les donnees
  //          setCount(res.data.count);
  //          setpreviousUrl(res.data.previous);
  //          setnextUrl(res.data.next);
  //        })
  //     .catch(function (error) {//en cas d'erreur
  //     console.log(error);
  //     });
  //   }

//Class component
//  class Stage extends  React.Component {

//   constructor(props)
//   {
//     super(props);
//     this.table_rows=0;
//     this.state=
//    {
//     Supstages: [],
//     filters:[],
//    }
//     this.usefilter=this.usefilter.bind(this);
//     this.display=this.display.bind(this);
//     this.refresh=this.refresh.bind(this);
    
//   }
  
//   refresh()
//   {
//     this.table_rows=0;
//   }

//   componentDidMount()
//  {
//   axios.get('http://localhost:8000/api/supstage/')
//     .then(res => {
//       const Supstages = res.data;
//       this.setState({Supstages});
//     });      
//   }

//   usefilter(event) 
//    {
//     this.filtermainsup=useRef();
//     this.filterdomain=useRef();
//     this.filtertitle=useRef();
//     this.filterspec=useRef();
//     this.filter_istaken=useRef();
//     this.filters[0]=this.filtermainsup.current.value;
//     this.filters[1]=this.filterdomain.current.value;
//     this.filters[2]=this.filtertitle.current.value;
//     this.filters[3]=this.filterspec.current.value;
//     this.filters[4]=this.filter_istaken.current.value;
//     axios.get(`http://localhost:8000/api/supstage/?superviser__Nom__icontains=${this.filters[0]}&stage__Domain__icontains=${this.filters[1]}&stage__Title__icontains=${this.filters[2]}&stage__Speciality__icontains=${this.filters[3]}&stage__Sujet_pris__iexact=${this.filters[4]}`)
//       .then(res => {
//          const Supstages = res.data;
//          this.setState({Supstages});
//       })
//     .catch(function (error) {
//       console.log(error);
//     });
//    }
//   delete(id)
//   {
//     axios.delete(`http://localhost:8000/api/supstage/${id}`)
//     axios.get('http://localhost:8000/api/supstage/is_Admin')
//   }
//   display(table_rows)
//   {
//     if(table_rows===0)
//       {
//         return<h1>No data to display</h1>
//       }
//   }
//   render() 
//   {
//   return (
//     this.refresh(),
//     <div className="">
//       <Navbar/>
//       <div className=" main d-flex">
//         <Dashboard/>
//           <div className='sub-main'>
//           <div className='filter-stage'>
//         <div>    
//         <form autocomplete="off" method="post" action="">
//             <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>     
//        <div class="form-group">
//         <label for="filtermainsup">Main Super Name:</label>
//         <input type="text" class="form-control" id="filtermainsup" ref={this.filtermainsup} onChange={this.filter}/>
//     </div>
//     </form>
//     </div>
//     <div>
//     <form autocomplete="off" method="post" action="">
//         <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
//         <div class="form-group">
//         <label for="filterdomain">Domain:</label>
//         <input type="text" class="form-control" id="filterdomain" ref={this.filterdomain} onChange={this.filter}/>
//         </div>
//     </form>
//     </div>
//     <div>
//     <form autocomplete="off" method="post" action="">
//         <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
//     <div class="form-group">
//         <label for="filtertitle">Title:</label>
//         <input type="text" class="form-control" id="filtertitle" ref={this.filtertitle} onChange={this.filter} />
//     </div>
//     </form>
//     </div>
//     <div>
//     <form autocomplete="off" method="post" action="">
//         <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
//     <div class="form-group">
//         <label for="spec">Speciality:</label>
//         <input type="text" class="form-control" id="spec" ref={this.filterspec} onChange={this.filter} />
//     </div>
//     </form>
//     </div>
//     <div>
//     <form autocomplete="off" method="post" action="">
//         <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>
//     <div class="form-group">
//         <label for="filterprojectistaken">Project is taken:</label>
//         <input type="text" class="form-control" id="filterprojectistaken" ref={this.filter_istaken} onChange={this.filter} />
//     </div>
//     </form>
//     </div> 
//     <div>
//     <form autocomplete="off" method="post" action="">
//         <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>  
//     <div className='form-group'>
//       <label></label>
//     <Link to="/Ajouter-stage"><input type="button" class="form-control add-btn" value="Add new project" readonly/></Link>
//     </div>
//     </form>
//     </div>
//     </div>
//           <div className='tables table-stage'>
//             <h3 className='titre'> Liste des projets</h3> 
//           <table className="table ">
//           <thead className="thead-dark">
//           <tr>
//             <th scope="col">Row</th>
//             <th scope="col">Id</th>
//             <th scope="col">Domain</th>
//             <th scope="col">Speciality</th>
//             <th scope="col">Title</th>
//             <th scope="col">Project-taken</th>
//             <th scope="col">Main Supervisor</th>
//             <th scope="col">Subject PDF</th>
//             <th>                  </th>
//           </tr>
//           </thead>
//   <tbody>
//   {this.state.Supstages.map(supstage => (
//           <tr>
//             <td>{this.table_rows++}</td>
//             <td><Link to="/DetailsStage">{supstage.stage_id}</Link></td>
//             <td>{supstage.stage_domain}</td>
//             <td>{supstage.stage_spec}</td>
//             <td>{supstage.stage_title}</td>
//             <td>{supstage.stage_pris ? "Oui" : "Non"}</td>
//             <td>{supstage.superviser_name}</td>
//             <td>{supstage.stage_pdf}</td>
//             <td>
//               <div className='choix'>
//               <span className='icon' title="Details"><Link to={`/DetailsStage?stage=${supstage.stage_id}`}><BsInfoSquare/></Link></span>
//               <span className='icon' title="Modify"><Link to={`/Modifier-stage?stage=${supstage.stage_id}`}><FaPenToSquare/></Link></span>
//               <span className='icon' title="Delete"><Link to="#" onClick={delete(supstage.id)}><TiUserDeleteOutline/></Link></span>
//               </div>
//             </td>
//           </tr>
//          ))}
//   </tbody>
// </table> 
//          <div>
//           {this.display(this.table_rows)}
//           </div> 
//         </div>
//         </div>
//           </div>
//   </div>
//   );
// }
// }
// export default Stage

 
//   addname=(x)=>
//  {
//    const[state,setstate]=useState('');
//    state = {
//      Supervisers: []
//    };
//   this.componentDidMount()
//   {
//     axios.get('http://localhost:8000/api/Supervisers/')
//     .then(res => {
//       const Supervisers = res.data;
//       this.setState({Supervisers});
//     });
//   }
      
   
 
//    this.render()
//    { 
//    return
//    {this.state.Supervisers.map( superviser =>(
//       ` ${superviser.id}==x ? ${superviser.Nom} ${superviser.Prenom}: "" `
//      ))}
//     }
//  }
 

    {/* <tr>
      <th scope="row">1</th>
       <td><a href={Exp} target="blank" className="pdf-btn"><span>abc.pdf</span><img src={pdf} alt="pdf" className='pdf_photo'></img></a></td> 
       <td scope="col"><Link to="/Details"><button type="button" class="btn">Modifier</button></Link></td>
      <td scope="col"><Link to="/Modifier-stage"><button type="button" class="btn">Modifier</button></Link></td>
      <td scope="col"><span className='btn'>Supprimer</span></td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td scope="col"><span className='btn'>Modifier</span></td>
      <td scope="col"><span className='btn'>Supprimer</span></td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td scope="col"><span className='btn'>Modifier</span></td>
      <td scope="col"><span className='btn'>Supprimer</span></td>
    </tr> */}
  
 
  

       

 
//       return (
   
//       );
//     }
//   }
// }


//filters
// import "./styles.css";
// import { useState } from "react";

// export default function App() {
//   const initialvalues = {
//     fname: "",
//     lname: ""
//   };
//   const [data, setData] = useState(initialvalues);
//   const display = () => console.log(data);

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };
//   return (
//     <div className="App">
//       <input
//         placeholder="enter name"
//         value={data.fname}
//         name="fname"
//         id="fname"
//         onChange={handleChange}
//       />
//       <input
//         placeholder="enter surname"
//         value={data.lname}
//         name="lname"
//         id="lname"
//         onChange={handleChange}
//       />
//        <button onClick={display}>click</button>
//     </div>
//   );
// }


// filteristaken(event)
//   {
//     axios.get(`http://localhost:8000/api/supstage/?superviser__Nom__icontains=&stage__Domain__icontains=&stage__Title__icontains=&stage__Speciality__icontains=&stage__Sujet_pris__iexact=${event.target.value}`)
//     .then(res => {
//        const Supstages = res.data;
//        this.setState({Supstages});
//     })
//   .catch(function (error) {
//     console.log(error);
//   });
//   }
//  filtermainsup (event)
//   {
//   axios.get(`http://localhost:8000/api/supstage/?superviser__Nom__icontains=&stage__Domain__icontains=&stage__Title__icontains=&stage__Speciality__icontains=&stage__Sujet_pris__iexact=${event.target.value}`)
//   .then(res => {
//      const Supstages = res.data;
//      this.setState({Supstages});
//   })
// .catch(function (error) {
//   console.log(error);
// });
//   }
//  filtertitle(event)
//   {

//   }
//  filterSpec(event)
//   {

//   }

 //   axios.post('http://localhost:8000/api/Stages/',{domain})
  //    .then(function (response) {
  //     console.log(response)
  //  });