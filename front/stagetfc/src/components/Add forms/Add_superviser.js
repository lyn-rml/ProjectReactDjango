import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import Homecolor from '../Homecolor'

function AddSuperviser()
{
  const menuPortalTarget = document.getElementById('root');
  const [readonly,setreadonly]=useState(false);
  const navigate=useNavigate();
  const [singleoptions,setsingleoptions]=useState([]);
  const [singleselectedoption,setsingleselectedoption]=useState({
    "value":0,
    label:"Not a member",
  });
//   const minDate=new Date();
  const [formData,setformData]=useState({
      Nom:"",
      Prenom:"",
      Profession:"",
      Email:"",
      Telephone:"",
      Id_Membre:null,
  });
 
  async function fill_supervisers()
    {
        let opts=[{
            "value":0,
            label:"Not a member",
        }];
        await axios.get(`http://localhost:8000/api/Membres/get_superviser/`)
        .then(res => {
            for (let i=0;i<res.data.length;i++)
            {
                let option ={
                    "value":res.data[i].id,
                    "label": `${res.data[i].Prenom} ${res.data[i].Nom}`,
                }
                opts.push(option);
            }
            setsingleoptions(opts);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
  
    useEffect(() => {fill_supervisers()}, []);

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
 
 function handleChangesingle(selectedOption)
    {
        setsingleselectedoption(selectedOption);
        if(selectedOption.label==="Not a member")
        {
            // let input=document.getElementsByTagName("input");
            // input.setAttribute('readonly',true);
            setreadonly(false);
            setformData({
              Nom:"",
              Prenom:"",
              Profession:"",
              Email:"",
              Telephone:"",
              Id_Membre:0,
          });
        }
        else
        {
            axios.get(`http://localhost:8000/api/Membres/${selectedOption.value}/`)
        .then(res => {
          console.log("id:",res.data.id);
          console.log("data",res.data);
          formData.Id_Membre=res.data.id;    
          formData.Nom=res.data.Nom;
          formData.Prenom=res.data.Prenom;
          formData.Profession=res.data.Profession;
          formData.Email=res.data.Email;
          formData.Telephone=res.data.Telephone;
          // let input=document.getElementsByTagName("input");
          // input.setAttribute('readonly',true);
          setreadonly(true);
        })
        .catch(function (error) {
            console.log(error);
        });            
        }
       setsingleselectedoption(selectedOption);
    }

  function submit(e)
  {   
    if(formData.Nom!=="" && formData.Prenom!=="" && formData.Profession!=="" && formData.Email!=="" && formData.Telephone!=="")
    {
      axios.post('http://localhost:8000/api/Supervisers/',formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        alert("Created new superviser successfully successfully!");
        console.log("success:",formData);
        console.log(res); 
      })
      .catch(function (error) {//en cas d'erreur
          console.log(error);
      });
      if(singleselectedoption.value===0)
          {
            alert("New superviser created succesfully!");
            navigate("/Superviser");
          }         
      else
          {
            let form= new FormData();
            form.append('is_sup',true);
            axios.patch(`http://localhost:8000/api/Membres/${singleselectedoption.value}/`,form,{
              headers: {
                  "Content-Type": "multipart/form-data",
              },
            })
           .then(res => {
              alert("Created new superviser successfully successfully!");
              console.log("success:",form);
              console.log(res);
              console.log("status:",res.data.response.status) 
            })
            .catch(function (error) {//en cas d'erreur
                console.log(error);
              });
          }
        alert("New superviser created succesfully!");
        navigate("/Superviser");
      }
    else
      {
        alert("Input error!!!");
        window.location.reload();
      } 
  }

  async function backgroundcolor()
  {
      await Homecolor({color: "#FDB600"})
  }
  useEffect(() =>{backgroundcolor()},[]); 
  return (
    console.log("New formData:",formData),
  <div className="Add-modify">
      <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
      <div className="Add-modify-container">      
          <div className="top-add-modify">
              <h6 style={{color:"transparent"}}>abc</h6>
          <h2 className="title-add-modify">Add new Superviser</h2>
          <h6 style={{color:"transparent"}}>def</h6>
          </div>
          <form method="post" className="form-add-modify" enctype="json/multipart/form-data">
          <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>       
            <div className="form-group add-modif">
                <span style={{color:"white",fontWeight:"400",fontSize:"1.75rem"}}>Select Member:</span>
                <Select options={singleoptions} value={singleselectedoption} onChange={handleChangesingle} defaultInputValue='Not a member' maxMenuHeight={220} menuPlacement="auto" menuPortalTarget={menuPortalTarget} required
                />
            </div>
              <Main1stage name="Nom" id="Nom" label="Nom" type="text" value={formData.Nom} onChange={handle} required="required" readonly={readonly} />
              <Main1stage name="Prenom" id="Prenom" label="Prenom" type="text" value={formData.Prenom} onChange={handle} required="required" readonly={readonly} />
              <Main1stage name="Profession" id="Profession" label="Profession" type="text" value={formData.Profession} onChange={handle} required="required" readonly={readonly}/>
              <Main1stage name="Email" id="Email" label="Email" type="email" value={formData.Email} onChange={handle} required="required" readonly={readonly}/>
              <Main1stage name="telephone" id="Telephone" label="Telephone" type="text" value={formData.Telephone} onChange={handle} required="required" readonly={readonly}/>
              <div className='form-group' style={{padding:"1rem"}}>
                  <label></label>
                  <input type="submit" class="form-control add-btn" value="Add new superviser" readonly onClick={submit}/>
              </div>
          </form>  
      </div>
  </div>
)
}

export default AddSuperviser
