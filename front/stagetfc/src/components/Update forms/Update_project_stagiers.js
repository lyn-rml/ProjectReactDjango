import React from 'react'
import axios from 'axios'
import {  useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Homecolor from '../Homecolor'
import { Link } from 'react-router-dom'


function UpdateProjectStagiers ()
{
    const navigate = useNavigate();
    const [searchparams, setsearchparams] = useSearchParams();
    const title = searchparams.get('stage');
    const sujet_pris=searchparams.get('sujet_pris');
    const id=sessionStorage.getItem('id');

    function submit(e)
    {
      axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__Nom__icontains=&stage__Title__iexact=${title}&stagiaire__Annee__icontains=&stagiaire__promotion__icontains=`)
      .then(res =>
      {
        console.log("data",res.data.results);
        if(res.data.results==[])
        {
          let dat= new FormData();
          dat.append('sujet_pris',false);
          axios.patch(`http://localhost:8000/api/Stages/${id}/`,dat,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
          })
          .then(res => {
            console.log("Data:",dat);
            navigate("/Stage");
          })
          .catch(function (error) {
            console.log(error);
            });
        }
        else
        navigate("/Stage");
      })
    }
    
    function verify(e)
    {
      let abc=e.target.value;
      axios.get(`http://localhost:8000/api/stagestagiaire/?stagiaire__Nom__icontains=&stage__Title__iexact=${title}&stagiaire__Annee__icontains=&stagiaire__promotion__icontains=`)
      .then(res =>
      {
        console.log("data",res.data.results);
        if(res.data.results==[])
        {
          alert("No Interns for this project.")
          window.location.reload();
        }
        else
          if(abc==="Modify interns informations about the project")
            navigate(`/Modify-intern-project?stage=${title}&sujet_pris=${sujet_pris}`);
          else if(abc==="Delete interns from the project")
            navigate(`/Delete-intern-project?stage=${title}&sujet_pris=${sujet_pris}`);
          else 
          {
            alert("error");
            window.location.reload();
          }
      })
      .catch(function (error) {
        console.log(error);
        });
    }

    async function backgroundcolor() {
      if(sujet_pris!=="true")
        {
          navigate("/Stage");
        }
        await Homecolor({ color: "#FDB600" });
        console.log("sujet_pris:",sujet_pris);
    }
   useEffect(() => { backgroundcolor() }, []);
  return (
    (sujet_pris) &&
    <div className="Add-modify">
    <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
    <div className="Add-modify-container">      
        <div className="top-add-modify">
            <h6 style={{color:"transparent"}}>abc</h6>
        <h2 className="title-add-modify">Select an action</h2>
        <h6 style={{color:"transparent"}}>def</h6>
        </div>
        <form  className="form-add-modify" >
            <div className='form-group' style={{padding:"1rem"}}>
                <label></label>
                <Link to={`/Add-intern-project?stage=${title}&sujet_pris=${sujet_pris}`}><input class="form-control add-btn" value="Add interns to the project" readonly/></Link>
            </div>
            <div className='form-group' style={{padding:"1rem"}}>
                <label></label>
                <input class="form-control add-btn" value="Modify interns informations about the project"  onClick={verify} readonly/>
            </div>
            <div className='form-group' style={{padding:"1rem"}}>
                <label></label>
                <input class="form-control add-btn" value="Delete interns from the project" onClick={verify}  readonly/>
            </div>
            <div className='form-group' style={{padding:"1rem"}}>
                <label></label>
                <input class="form-control add-btn" value="Finish" onClick={submit} readonly/>
            </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProjectStagiers

