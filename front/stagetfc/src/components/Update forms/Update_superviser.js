import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Select from 'react-select'
import PageInfo from '../../mycomponent/paginationform'

function UpdateSuperviser () 
{
  const [initid,setinitid]=useState(null);
  const menuPortalTarget = document.getElementById('root');
  const [Id_Membre,setId_Membre]=useState(null);
  const [readonly,setreadonly]=useState(false);
  const navigate=useNavigate();
  const [singleoptions,setsingleoptions]=useState([]);
  const [searchparams]=useSearchParams();
  const id=searchparams.get('superviser');
  const [singleselectedoption,setsingleselectedoption]=useState();
//   const minDate=new Date();
  const [formData,setformData]=useState({
      Nom:"",
      Prenom:"",
      Profession:"",
      Email:"",
      Telephone:"",
      Id_Membre:0,
  });
 const [Nom,setNom]=useState("");
 const [Prenom,setPrenom]=useState("");
 const [Profession,setProfession]=useState("");
 const [Email,setEmail]=useState("");
 const [Telephone,setTelephone]=useState("");

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
            // setsingleoptions(opts);
        })
        .catch(function (error) {
            console.log(error);
        });
        axios.get(`http://localhost:8000/api/Supervisers/${id}/`)
        .then(res => {
          if(res.data.Id_Membre!==0)
          {
            axios.get(`http://localhost:8000/api/Membres/${res.data.Id_Membre}/`)
            .then(res => {
              let option ={
                "value":res.data.id,
                "label": `${res.data.Prenom} ${res.data.Nom}`,
            }
              opts.push(option);
              setsingleoptions(opts);
              console.log("init data:",res.data)
              setNom(res.data.Nom);
              setPrenom(res.data.Prenom);
              setEmail(res.data.Email);
              setProfession(res.data.Profession);
              setTelephone(res.data.Telephone);
              setId_Membre(res.data.id);
              setinitid(res.data.id);
              console.log("initid first:",res.data.id);
          })
          .catch(function (error) {
              console.log(error);
          });
          }

          })
        .catch(function (error) {
            console.log(error);
        });
    }
  
    useEffect(() => {fill_supervisers()}, []);

//   function handle (e)  
//  {
//     const {name,value}=e.target;
//     const modname = name[0].toUpperCase() + name.slice(1);
//     console.log(name); // name
//     console.log(modname); // Name
//     // console.log("e.target.name",e.target.name.toString().toCap());
//    setformData((prev) => { 
//     return{...prev,[modname]:value}
//   });
//  }
function handleNom(e)
{
  setNom(e.target.value);
}

function handlePrenom(e)
{
  setPrenom(e.target.value);
}
function handleProfession(e)
{
  setProfession(e.target.value);
}
function handleEmail(e)
{
  setEmail(e.target.value);
}
function handleTelephone(e)
{
  setTelephone(e.target.value);
}

 
 async function handleChangesingle(selectedOption)
    {
      console.log("function selected option:",selectedOption.value);
      let x= selectedOption.value;
      let y=selectedOption.label;
      let abc={
        value:x,
        label:y,
      }
        setsingleselectedoption(abc);
        console.log("selected option:",selectedOption);
        if(selectedOption.label==="Not a member")
        {
            // let input=document.getElementsByTagName("input");
            // input.setAttribute('readonly',true);
            setreadonly(false);
            setNom("");
            setPrenom("");
            setEmail("");
            setProfession("");
            setTelephone("");
            setId_Membre(0);
        }
        else
        {
            axios.get(`http://localhost:8000/api/Membres/${selectedOption.value}/`)
        .then(res => {
          console.log("id:",res.data.id);
          console.log("data",res.data);
          setId_Membre(res.data.id);    
          setNom(res.data.Nom);
          setPrenom(res.data.Prenom);
          setProfession(res.data.Profession);
          setEmail(res.data.Email);
          setTelephone(res.data.Telephone);
          console.log("res data id:",res.data.id);
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

    useEffect(() => {handleChangesingle()}, [singleselectedoption]);

  function submit(e)
  {   
    console.log("id membre:",Id_Membre);
    console.log("initid",initid);
    console.log("form membre:",formData.Id_Membre);
    if(Nom!=="" && Prenom!=="" && Profession!=="" && Email!=="" && Telephone!=="")
    {
      formData.Nom=Nom;
      formData.Prenom=Prenom;
      formData.Profession=Profession;
      formData.Email=Email;
      formData.Telephone=Telephone;
      formData.Id_Membre=Id_Membre;
      axios.patch(`http://localhost:8000/api/Supervisers/${id}/`,formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        alert("Created new superviser successfully!");
        console.log("success:",formData);
        console.log("response form data:",res.config.data); 
      })
      .catch(function (error) {//en cas d'erreur
          console.log(error);
      });
      if(Id_Membre===0)
          {
            let form2= new FormData();
                  form2.append('is_sup',false);
                  axios.patch(`http://localhost:8000/api/Membres/${initid}/`,form2,{
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                  })
                 .then(res => {
                    console.log("success:",form2);
                    console.log(res);
                    console.log("status:",res.data.response.status) 
                  })
                  .catch(function (error) {//en cas d'erreur
                      console.log(error);
                    });
            alert("Superviser modified succesfully!");
            navigate("/Superviser");
          }         
      else
          {
            if(initid!==null)
            {
              if(formData.Id_Membre!==initid)
                {
                  let form2= new FormData();
                  form2.append('is_sup',false);
                  axios.patch(`http://localhost:8000/api/Membres/${initid}/`,form2,{
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                  })
                 .then(res => {
                    console.log("success:",form2);
                    console.log(res);
                    console.log("status:",res.data.response.status) 
                  })
                  .catch(function (error) {//en cas d'erreur
                      console.log(error);
                    });

                  let form= new FormData();
                  form.append('is_sup',true);
                  axios.patch(`http://localhost:8000/api/Membres/${formData.Id_Membre}/`,form,{
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                  })
                  .then(res => {
                    console.log("success:",form);
                    console.log(res);
                    console.log("status:",res.data.response.status) 
                  })
                  .catch(function (error) {//en cas d'erreur
                    console.log(error);
                  });
                }
                // else
                // {
                //   let form2= new FormData();
                //   form2.append('is_sup',false);
                //   axios.patch(`http://localhost:8000/api/Membres/${initid}/`,form2,{
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //     },
                //   })
                //  .then(res => {
                //     alert("Created new superviser successfully successfully!");
                //     console.log("success:",form2);
                //     console.log(res);
                //     console.log("status:",res.data.response.status) 
                //   })
                //   .catch(function (error) {//en cas d'erreur
                //       console.log(error);
                //     });
                // }
              }
            alert("Superviser modified succesfully!");
            // navigate("/Superviser");
          }
            }
            
    else
      {
        alert("Input error!!!");
        window.location.reload();
      } 
  }


  return (    
    console.log("initid",initid),
    console.log("New formData:",formData),
    console.log("id membre form:",formData.Id_Membre),
    console.log("single selected option:",singleselectedoption),
    console.log("options:",singleoptions),
  <div className="Add-modify">
  
      <div className="Add-modify-container">      
          <div className="top-add-modify">
          
          <h2 className="title-add-modify">Modify Superviser</h2>
    
          </div>
          <form method="post" className="form-add-modify" enctype="json/multipart/form-data">
          <input autocomplete="false" name="hidden" type="text" style={{display:"none"}}/>       

             
            <Main1stage name="Nom" id="Nom" label="Last Name" type="text" value={Nom} onChange={handleNom} required="required" readonly={readonly} />
              <Main1stage name="Prenom" id="Prenom" label="First Name" type="text" value={Prenom} onChange={handlePrenom} required="required" readonly={readonly} />
              <Main1stage name="Profession" id="Profession" label="Profession" type="text" value={Profession} onChange={handleProfession} required="required" readonly={readonly}/>
              <Main1stage name="Email" id="Email" label="Email" type="email" value={Email} onChange={handleEmail} required="required" readonly={readonly}/>
              <Main1stage name="telephone" id="Telephone" label="Phone number" type="text" value={Telephone} onChange={handleTelephone} required="required" readonly={readonly}/>
              <div className='form-group' style={{padding:"1rem"}}>
                  <label></label>
                  <input class="form-control add-btn" value="Modify superviser" readonly onClick={submit}/>
              </div>
          </form>  
          <div className="d-flex justify-content-center gap-3">
                <PageInfo index={1} pageNumber={1} />
                </div>
      </div>
  </div>
)
}

export default UpdateSuperviser
