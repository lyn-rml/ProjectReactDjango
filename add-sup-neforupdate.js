import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'
import Select from 'react-select'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function AddSupstage ()
{
    const navigate=useNavigate();
    const [searchparams]=useSearchParams();
    const stageid=searchparams.get('id')
    let init=[];
    const [initialoptions,setinitialoptions]=useState([]);
    const [singleoptions,setsingleoptions]=useState([]);
    const [multioptions,setmultioptions]=useState([]);
    // const [count,setcount]=useState(0);
    // const [x,setx]=useState(0);
    const [singleselectedoption,setsingleselectedoption]=useState(null);
    const [multiselectedoptions,setmultiselectedoptions]=useState([]);
    const [formData,setformData]=useState({
        stage:0,
        superviser:0,
        //stage_domain:"",
        //stage_title:"",
        //stage_spec:"",
        //stage_pris:false,
        superviser_name:"",
        is_admin:false,
        //stage_pdf:"",
    });
    async function fillSupervisers() 
    {
     await axios.get('http://localhost:8000/api/Supervisers/?id_member=${0}')
     .then(res => {
          const opts =res.data.map(s => ({
            "value" : s.id,
            "label" : `${s.Nom} ${s.Prenom}`
           }
        ));
        
    })
    await axios.get('http://localhost:8000/api/Membres/')
    .them(res=>{
        const opte =res.data.map(s => ({
            "value" : s.id,
            "label" : `${s.Nom} ${s.Prenom}`
    }))
    opts.push(opte)
    setinitialoptions(opts);
    setmultioptions(opts);
    })
    
     .catch(function (error) {
        console.log(error);
    });
    }
async function fillMembres(){
    await axios.get('http://localhost:8000/api/Membres/')
    .them(res=>{
        const opts =res.data.map(s => ({
            "value" : s.id,
            "label" : `${s.Nom} ${s.Prenom}`
    }))
    setinitialoptions(opts);
    setsingleoptions(opts);
    })
    .catch(function (error) {
        console.log(error);
    });
}


    useEffect(() => {fillSupervisers(),fillMembres()}, []);//{}:pour fixer l'error destroy is not a function

    function handleChangesingle(selectedOption)
    {   
        setsingleselectedoption(selectedOption);
        console.log("selectedoption:",selectedOption);
        console.log(selectedOption.value);
        const filtered=initialoptions.filter(abc => (abc.value)!==(selectedOption.value));
        console.log("abcaft:",filtered);
        setmultioptions(filtered);
    }
    function filter(option,arra)
    {
        const filte=arra.filter(abc => abc!==option);
        return filte;

    }
    function handleChangemulti(selectedOption)
    {
        setmultiselectedoptions(selectedOption);
        init=[];
        console.log("multiselectedoptions:",selectedOption);
        // console.log("multiopt:",multioptions);
        // console.log("multivalues:",multioptions[0].value);
        // console.log("singleoptionsbefmulti:",singleoptions);
        // console.log("selectedmulti:",selectedOption);
        setsingleoptions([]);
         if(selectedOption===null)
        {
                 setsingleoptions(initialoptions);
        }
         else
        {
            for (let i=0;i<selectedOption.length;i++)
                {
                    if(i===0)
                        {
                            init=filter(selectedOption[i],initialoptions);
                            console.log(`filteredmulti ${i}`,singleoptions);
                            continue;
                        }
                   init=(filter(selectedOption[i],init));//.filter(abc=>(abc.value)===(selectedOption[i].value));
                   console.log(`filteredmulti ${i}`,init);
                }
                setsingleoptions(init);
        }
    }
    const handleRedirectToAddSupervisor = () => {
        navigate(`/Add-superviser-fromAddProject?id=${stageid}`);  // Pass the current id as a query param
      };
    
    function handlesubmit(e)
    {
        if(singleselectedoption!==null && stageid!==0)
            {
                formData.is_admin=true;
                formData.superviser=parseInt(singleselectedoption.value);
                formData.superviser_name=singleselectedoption.label;
                formData.stage=parseInt(stageid);
                e.preventDefault();
                axios.post('http://localhost:8000/api/supstage/',formData)
                     .then(res => {
                   console.log("success:",formData);
                     console.log(res.config.data);
                     setformData({
                        superviser:0,
                        superviser_name:"",
                    })
                    if(multiselectedoptions.length===0)
                        {
                            navigate("/Stage");
                        }
                 })
              .catch(function (error) {//en cas d'erreur
              console.log(error);
              });
            }
        if(multiselectedoptions!==null && stageid!==0)
        {
            for(let i=0;i<=multiselectedoptions.length-1;i++)
                {
                    console.log("multiselectedoptionsbefaxios:",multiselectedoptions);
                    formData.is_admin=false;
                    formData.superviser=parseInt(multiselectedoptions[i].value);
                    //formData.superviser_name=multiselectedoptions[i].label;
                    formData.stage=parseInt(stageid);
                    e.preventDefault();
                    axios.post('http://localhost:8000/api/supstage/',formData)
                         .then(res => {
                    console.log("success:",formData);
                    console.log(res.config.data);
                    setformData({
                        superviser:0,
                        superviser_name:"",
                        is_admin:false,
                    })
                 })
              .catch(function (error) {//en cas d'erreur
              console.log(error);
              });
              navigate("/Stage");
                }            
        }
    }

    return (
        console.log("singleoptions:",singleoptions),
    <div className="Add-modify">
        <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
        <div className="Add-modify-container">
        
            <div className="top-add-modify">
                <h6 style={{color:"transparent"}}>abc</h6>
            <h2 className="title-add-modify">Add A project</h2>
            <h6 style={{color:"transparent"}}>def</h6>
            </div>
            <form method="post" className="form-add-modify" enctype="multipart/form-data">       
                <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.75rem"}}>Select Main Superviser:</span>
                    <Select options={singleoptions} value={singleselectedoption} onChange={handleChangesingle} required/>
                </div>
                <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}>Select Other Supervisers:</span>
                    <Select options={multioptions}  value={multiselectedoptions} onChange={handleChangemulti} isMulti/>
                </div>
                <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}>Add other Superviser:</span>
                    <input type="button" class="form-control add-btn" value="Add Supervisers" onClick={handleRedirectToAddSupervisor} readonly/>
                </div>
                <div className='form-group' style={{padding:"1rem"}}>
                    <label></label>
                    <input type="button" class="form-control add-btn" value="Finish Add project" onClick={handlesubmit} readonly/>
                </div>
            </form>  
        </div>
    </div>
  )
}

export default AddSupstage
