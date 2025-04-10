import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import fileTypeChecker from 'file-type-checker'
import PageInfo from '../../mycomponent/paginationform'
function UpdateStagier  () 
{
  const navigate=useNavigate();
  const [searchparams] = useSearchParams();
  const internid =searchparams.get('intern');
  const intern=parseInt(internid);
  const [formData,setformData]=useState({
    Nom:"",
    Prenom:"",
    Email:"",
    Telephone:"",
  });

  async function fillProjectData() 
    {
        let x=[];
     await axios.get(`http://localhost:8000/api/Stagiaires/${intern}/`)
     .then(res => {
        console.log(res.data);
            setformData({
                Nom:res.data.Nom,
                Prenom:res.data.Prenom,
                Email:res.data.Email,
                Telephone:res.data.Telephone,
            })
    })
     .catch(function (error) {
        console.log(error);
    });
    }

    useEffect(() => {fillProjectData()},[]);

    function handle (e)  
    {
      const {name,value}=e.target;
      const modname = name[0].toUpperCase() + name.slice(1);
      console.log(name); // name
      console.log(modname); // Name
      // console.log("e.target.name",e.target.name.toString().toCap());
     setformData((prev) => { 
      return{...prev,[modname]:value}
     });
    }

    function submit(e)
    {   
      if(formData.Nom!=="" && formData.Prenom!=="" &&  formData.Email!=="" && formData.Telephone!=="")
      {
        axios.patch(`http://localhost:8000/api/Stagiaires/${intern}/`,formData,{
          headers: {
              "Content-Type": "multipart/form-data",
          },
        })
        .then(res => {
          console.log("success:",formData);
          console.log(res); 
          console.log("status:",res.response.status);
        })
        .catch(function (error) {//en cas d'erreur
            console.log(error);
        });
        alert("Intern modified!!!");
          navigate("/Stagiaire"); 
        }
      else
        {
          alert("Input error!!!");
          window.location.reload();
        } 
    }



  return (
    <div className="Add-modify">
      <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
      <div className="Add-modify-container">      
          <div className="top-add-modify">
              <h6 style={{color:"transparent"}}>abc</h6>
          <h2 className="title-add-modify">Modify intern</h2>
          <h6 style={{color:"transparent"}}>def</h6>
          </div>
          <form method="post" className="form-add-modify" enctype="json/multipart/form-data">
          <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>       
              <Main1stage name="Nom" id="Nom" label="Last Name" type="text" value={formData.Nom} onChange={handle} required="required"/>
              <Main1stage name="Prenom" id="Prenom" label="First Name" type="text" value={formData.Prenom} onChange={handle} required="required"/>
              <Main1stage name="Email" id="Email" label="Email" type="email" value={formData.Email} onChange={handle} required="required"/>
              <Main1stage name="telephone" id="Phone number" label="Telephone" type="text" value={formData.Telephone} onChange={handle} required="required" />
              <div className='form-group' style={{padding:"1rem"}}>
                  <label></label>
                  <input type="submit" class="form-control add-btn" value="Modify Intern" readonly onClick={submit}/>
              </div>
          </form>  
          <div className="d-flex justify-content-center gap-3">
                <PageInfo index={1} pageNumber={1} />
                </div>
      </div>
  </div>
  )
}

export default UpdateStagier
