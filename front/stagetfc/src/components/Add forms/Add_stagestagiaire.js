import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Main1stage from '../Main1stage';
import Select from 'react-select'
import fileTypeChecker from 'file-type-checker';
import { useNavigate } from "react-router-dom";
function AddStagestagiaire ()
{
  const menuPortalTarget = document.getElementById('root');
  const navigate=useNavigate();
  const [searchparams] = useSearchParams();
  const title = searchparams.get('stage');
  const sujet_pris=searchparams.get('sujetpris');
  const [count,setcount]=useState(0);
  const [singleoptions,setsingleoptions]=useState([]);
  const [agreementfile,setagreementfile]=useState(null);
  const [agreementval,setagreementval]=useState(false);
  const [codefile,setcodefile]=useState(null);
  const [codeval,setcodeval]=useState(false);
  const [rapportfile,setrapportfile]=useState(null);
  const [rapportval,setrapportval]=useState(false);
  const [presentationfile,setpresentationfile]=useState(null);
  const [presentationval,setpresentationval]=useState(false);
  const [Annee,setAnnee]=useState([]);
  const [Annee_etude,setAnnee_etude]=useState([]);
  const [Universite,setUniversite]=useState("");
  const [Promotion,setPromotion]=useState("");
  // const [initialoptions,setinitialoptions]=useState([]);
  const [singleselectedoption,setsingleselectedoption]=useState(null);
  const [yearoptions,setyearoptions]=useState([]);
  const [collegeyearoptions,setcollegeyearoptions]=useState([]);
  const stageid=sessionStorage.getItem('id');
  const [formData]=useState({
    stage:0,
    stagiaire:0,
    internship_name:searchparams.get('stage'),
    intern_name:"",
    Universite:"",
    Annee_etude:"",
    Annee:0,
    PDF_Agreement:null,
    PDF_Prolongement:null,
    PDF_Certificate:null,
    Certified:false,
    Code:null,
    Rapport:null,
    Presentation:null,
    Promotion:"",
  });

   async function fill_interns()
  {
      let opts=[];
      let initopts=[];
      let singopt={};
      let yearopts=[];
      let collegeyearopts=[];
      let internnumber=0;
      await axios.get('http://localhost:8000/api/Stagiaires/get_all/')
      .then(res => {
          opts = res.data.map(s => ({
              "value": s.id,
              "label": `${s.Prenom} ${s.Nom}`
          }
          ));
           console.log("interns",res.data);
          setcount(res.data.length);
          internnumber=res.data.length;
          // setinitialoptions(opts);
      })
      .catch(function (error) {
          console.log(error);
      });
      //fill options
      await axios.get(`http://localhost:8000/api/stagestagiaire/get_all/?stagiaire__Nom__icontains=&stage__Title__iexact=${title}&stagiaire__Annee__icontains=&stagiaire__promotion__icontains=`)
      .then(res => {
        if(res.data.length===internnumber)
        {
          alert("No more interns to add");
          navigate("/Stage");
        }
        initopts=opts;
        console.log("initopts:",initopts);
        for (let i = 0; i < res.data.length; i++) 
        {
          // if(res.data[i].internship_name===`${title}`)
          // {
            singopt = 
            {
              value: res.data[i].stagiaire,
              label: `${res.data[i].intern_name}`,
            };
            console.log("xyz:",singopt);
            initopts=initopts.filter(abc=> (abc.value) !== (singopt.value));
            console.log("initopts:",initopts);
          // }
        }
       console.log(res.data);
        setsingleoptions(initopts);
      })
    .catch(function (error) {
      console.log(error);
    });
    for(let i=1950;i<2200;i++)
    {
      const newyearopt={
        value:i,
        label:`${i}`,
      }
      const newcollegeyearopt={
        value:i,
        label:`${i}-${i+1}`,
      }
      yearopts.push(newyearopt);
      collegeyearopts.push(newcollegeyearopt);
    }
    setyearoptions(yearopts);
    setcollegeyearoptions(collegeyearopts);
  }

  useEffect(() => { fill_interns() },[]);

   function handle_file_aggrement(e)
   {
    let file = e.target.files[0];
    console.log("file:",file);
    const reader = new FileReader();
    reader.onload = () => 
    {
    const detectedFile = fileTypeChecker.detectFile(reader.result);
    console.log("Detected file:",detectedFile);
    console.log("description:",detectedFile.description);
    console.log("extension:",detectedFile.extension);
    console.log("signature:",detectedFile.signature);
    console.log("mimetype",detectedFile.mimeType);
    if(detectedFile.mimeType==="application/pdf")
         {
           setagreementfile(file);
           setagreementval(true);
         }
       else
       {
         alert("Only PDF are allowed");
         setagreementval(false); 
         file=null;  
       }
    };    
    reader.readAsArrayBuffer(file);
   }

   function handleChangesingle(selectedOption)
   {
     setsingleselectedoption(selectedOption);
   }

   function handleChangeYear(selectedOption)
   {
    setAnnee(selectedOption);
   }

   function handleChangeCollegeYear(selectedOption)
   {
    console.log("Annee etude:",selectedOption);
    setAnnee_etude(selectedOption);
   }

   
   function handleChangeUniversite(e)
   {
    setUniversite(e.target.value);
   }

   function handleChangePromotion(e)
   {
    setPromotion(e.target.value);
   }

   function submit(e)
    {
      let abc=e.target.value;
      console.log("value",abc);
      if (abc!=="Add more interns" && abc!=="Finish")
      {
        alert("error");
        navigate("/Stage");
      }
      if(agreementval!==true  || agreementfile===null)
      {
        alert("Unvalid file type");
        window.location.reload();
      }
      if(Annee==[])
      {
        alert("Unvalid year choice");
        window.location.reload();
      }
      if(Annee_etude==[])
        {
          alert("Unvalid college year choice");
          window.location.reload();
        }
        if(singleselectedoption!==null && stageid!==0 && (Annee!==null && Annee!=[]) && (Annee_etude!==null && Annee_etude!=[]))
            {
                formData.stage=stageid;
                formData.Annee=Annee.value;
                formData.Annee_etude=Annee_etude.label;
                formData.Universite=Universite;
                formData.Promotion=Promotion;
                formData.stagiaire=parseInt(singleselectedoption.value);
                formData.intern_name=singleselectedoption.label;
                formData.stage=parseInt(stageid);
                formData.Certified=false;
                formData.PDF_Certificate=null;
                formData.PDF_Prolongement=null;
                formData.PDF_Agreement=agreementfile;
                console.log("agreement:",formData.PDF_Agreement);
                console.log("formaData:",formData);
                e.preventDefault();
                axios.post('http://localhost:8000/api/stagestagiaire/get_all/',formData,{
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              })
                     .then(res => {
                   console.log("success:",formData);
                     console.log("post data:",res.config.data);
                    //  setformData({
                    //     stagiaire:0,
                    //     intern_name:"",
                    //     Certified:false,
                    //     PDF_Agreement:null,
                    //     PDF_Convention:null,
                    //     PDF_Certificate:null,
                    //     PDF_Prolongement:null,
                    // })
                    if(abc==="Add more interns")
                    {
                        alert("success");
                        window.location.reload();
                    }
                    else
                    {
                        navigate("/Stage");
                    }
                    
                 })
              .catch(function (error) {
              console.log(error);
              });
            }
            else 
            {
              alert("Error in data!!!!!!!");
            }
    }



  return (
    console.log("Annee",Annee),
    console.log("Annee etude",Annee_etude),
    <div className="Add-modify">
    <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
    <div className="Add-modify-container">      
        <div className="top-add-modify">
            <h6 style={{color:"transparent"}}>abc</h6>
        <h2 className="title-add-modify">Add new intern to the project:</h2>
        <h6 style={{color:"transparent"}}>def</h6>
        </div>
        <form method="post" className="form-add-modify" enctype="multipart/form-data"> 
          <div className="form-group add-modif">
            <span style={{color:"white",fontWeight:"400",fontSize:"1.75rem"}}>Select new intern:</span>
            <Select options={singleoptions} value={singleselectedoption} onChange={handleChangesingle} required maxMenuHeight={220} menuPlacement="auto" menuPortalTarget={menuPortalTarget}/>
          </div>
          <Main1stage name="Universite" id="Universite" label="Universite" type="text" value={Universite} onChange={handleChangeUniversite} required="required"/>
          <Main1stage name="Promotion" id="Promotion" label="Promotion" type="text" value={Promotion} onChange={handleChangePromotion} required="required"/>
          <div className="form-group add-modif">
            <span style={{color:"white",fontWeight:"400",fontSize:"1.75rem"}}>Select Year of the project:</span>
            <Select options={yearoptions} value={Annee} onChange={handleChangeYear} required/>
          </div><div className="form-group add-modif">
            <span style={{color:"white",fontWeight:"400",fontSize:"1.75rem"}}>Select college year:</span>
            <Select options={collegeyearoptions} value={Annee_etude} onChange={handleChangeCollegeYear} required/>
          </div>
          <Main1stage name="PDF_agr" id="PDF_agr" label="PDF of Agreement" type="file" onChange={handle_file_aggrement}  required="required" accept="application/pdf"/>
          <div className='form-group' style={{padding:"1rem"}}>
                <label></label>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}} >
                <input type="submit" class="form-control add-btn-2" value="Add more interns" onClick={submit} readonly/>
                <input type="submit" class="form-control add-btn-2" value="Finish" onClick={submit} readonly/>
                </div>
            </div>
        </form>  
        </div>
    </div>
  )
}

export default AddStagestagiaire
