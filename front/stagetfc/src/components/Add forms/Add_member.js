import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Homecolor from '../Homecolor'
import fileTypeChecker from 'file-type-checker'

function AddMember ()
{
  const [a_paye,seta_paye]=useState(false);
  const [Autre_association,setAutre_association]=useState(false);

  const [fileval,setfileval]=useState(false);
    let lastid=0;
    const navigate=useNavigate();
    // const mindate=new Date();
    const [formData,setformData]=useState({
        is_sup: false,
        Nom: "",
        Prenom: "",
        Nom_pere: "",
        Date_naissance: "",
        Lieu_naissance: "",
        Telephone: "",
        Adresse: "",
        Groupe_sanguin: "",
        Travail: "",
        Profession: "",
        Domaine: "",
        Email: "",
        Autre_association: false,
        Nom_autre_association: "",
        Application_PDF:null,
        A_paye: false,
    })
    const [browsefile,setbrowsefile]=useState(null);
    const[datedebut,setdatedebut]=useState(new Date());
    const[datefin,setdatefin]=useState(new Date());

    function handle (e)  
   {
      const {name,value}=e.target;
     setformData((prev) => { 
      return{...prev,[name]:value}
    });
   }

   function handle_files (e)  
   {
        let file = e.target.files[0];
        console.log("file:",file);
        const reader = new FileReader();
        // const types = [application/pdf];
        reader.onload = () => 
        {
        //   const ispdf= fileTypeChecker.validateFileType(reader.result, types);
        //   console.log("ispdf:",ispdf); // Returns true if the file is a PDF
        const detectedFile = fileTypeChecker.detectFile(reader.result);
        console.log(detectedFile);
        if(detectedFile.mimeType==="application/pdf")
             {
               setbrowsefile(e.target.files[0]);
               setfileval(true);
             }
           else
           {
             alert("Only PDF are allowed");
             setfileval(false); 
             file=null;  
           }
        };    
        reader.readAsArrayBuffer(file);
   }

   function handle_date1(date)
   {
    setdatedebut(date);
   }


   function handleChecked_apaye (e)  
   {
    console.log("checked",e.target.checked);
     if(e.target.checked)
         return seta_paye(true);
     return seta_paye(false);
   }
   function handleChecked_autreassociation (e)  
   {
    console.log("checked",e.target.checked);
     if(e.target.checked)
         return setAutre_association(true);
     return setAutre_association(false);
   }
    function submit(e)
    {
        console.log("fileval:",fileval)
        if (fileval!==true)
        {
            alert("Unvalid file type");
            window.location.reload();
        }
        if(datedebut!==null && a_paye!==null && Autre_association!==null && (formData.Nom)!==""  && (formData.Prenom)!=="" && (formData.Nom_pere)!=="" && (formData.Lieu_naissance)!=="" && (formData.Telephone)!=="" && (formData.Adresse)!=="" && (formData.Groupe_sanguin)!=="" && (formData.Travail)!=="" && (formData.Profession)!=="" && (formData.Domaine)!=="" && (formData.Email)!=="" && (formData.Recommandation)!=="")
            {    
              if(Autre_association===true && formData.Nom_autre_association!=="") 
                {
                  let day1=datedebut.getDay();  
                let month1=datedebut.getMonth()+1;
                let year1=datedebut.getFullYear();
                if (day1 < 10) {
                    day1 = '0' + day1;
                }
                if (month1 < 10) {
                    month1 = `0${month1}`;
                }
                e.preventDefault();
                formData.Date_naissance=`${year1}-${month1}-${day1}`;
                formData.Application_PDF=browsefile;
                formData.A_paye=a_paye;
                formData.Autre_association=Autre_association;
                console.log("PDF:",browsefile);
                      axios.post('http://localhost:8000/api/Membres/',formData,{
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                     .then(res => {
                   console.log("success:",formData);
                     console.log(res);
                     console.log("status:",res.response.status);
                    setdatedebut(null);
                    setbrowsefile(null);
                 })
              .catch(function (error) {
              console.log(error);
              });
              alert("New member added!!!");
              navigate("/Member");
                } 
                if(Autre_association===false && formData.Nom_autre_association==="")
                {
                  let day1=datedebut.getDay();  
                let month1=datedebut.getMonth()+1;
                let year1=datedebut.getFullYear();
                if (day1 < 10) {
                    day1 = '0' + day1;
                }
                if (month1 < 10) {
                    month1 = `0${month1}`;
                }
                e.preventDefault();
                formData.Date_naissance=`${year1}-${month1}-${day1}`;
                formData.Application_PDF=browsefile;
                formData.A_paye=a_paye;
                formData.Autre_association=Autre_association;
                console.log("PDF:",browsefile);
                      axios.post('http://localhost:8000/api/Membres/',formData,{
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                     .then(res => {
                   console.log("success:",formData);
                     console.log(res);
                     console.log("status:",res.response.status);
                    setdatedebut(null);
                    setbrowsefile(null);
                 })
              .catch(function (error) {
              console.log(error);
              });
              alert("New member added!!!");
              navigate("/Member");
                }
            } 
            else
            {
              alert("Error!!!");
            }
    }
    async function backgroundcolor()
    {
        await Homecolor({color: "#FDB600"});
        setdatedebut(null);
        setdatefin(null);
    }
    useEffect(() =>{backgroundcolor()},[]); 
    return (
    <div className="Add-modify">
        <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
        <div className="Add-modify-container">      
            <div className="top-add-modify">
                <h6 style={{color:"transparent"}}>abc</h6>
            <h2 className="title-add-modify">Add new Member</h2>
            <h6 style={{color:"transparent"}}>def</h6>
            </div>
            <form method="post" className="form-add-modify" enctype="json/multipart/form-data">       
                <Main1stage name="Nom" id="Nom" label="Last Name" type="text" value={formData.Nom} onChange={handle} required="required"/>

                <Main1stage name="Prenom" id="Prenom" label="First name" type="text" value={formData.Prenom} onChange={handle} required="required"/>

                <Main1stage name="Nom_pere" id="Nom_pere" label="Father name" type="text" value={formData.Nom_pere} onChange={handle} required="required"/>

                <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}> Date of birth:</span>
                    <DatePicker value={datedebut} dateFormat="yyyy/MM/dd" dateFormatCalendar="yyyy/MM/dd"  onChange={handle_date1} selected={datedebut} required/>
                </div>

                <Main1stage name="Lieu_naissance" id="Lieu_naissance" label="Place of birth" type="text" value={formData.Lieu_naissance} onChange={handle} required="required"/>

                <Main1stage name="Telephone" id="Telephone" label="Phone number" type="text" value={formData.Telephone} onChange={handle} required="required"/>

                <Main1stage name="Adresse" id="Adresse" label="Adress" type="text" value={formData.Adresse} onChange={handle} required="required"/>

                <Main1stage name="Groupe_sanguin" id="Groupe_sanguin" label="Blood Group" type="text" value={formData.Groupe_sanguin} onChange={handle} required="required"/>

                <Main1stage name="Travail" id="Travail" label="Job" type="text" value={formData.Travail} onChange={handle} required="required"/>

                <Main1stage name="Profession" id="Profession" label="Profession" type="text" value={formData.Profession} onChange={handle} required="required"/>

                <Main1stage name="Domaine" id="Domaine" label="Domain" type="text" value={formData.Domaine} onChange={handle} required="required"/>

                <Main1stage name="Email" id="Email" label="Email" type="email" value={formData.Email} onChange={handle} required="required"/>

                <Main1stage name="Autre_association" id="Autre_association" checkbox="-input" label="Other association" checked={(Autre_association===true)?true:false} type="checkbox" value={Autre_association} onChange={handleChecked_autreassociation}/>

                <Main1stage name="Nom_autre_association" id="Nom_autre_association" label="Name of other association" type="text" value={formData.Nom_autre_association} onChange={handle}/>

                <Main1stage name="Application_PDF" id="Application_PDF" label=" Application_PDF" type="file" onChange={handle_files}  required="required" accept="application/pdf"/>

                <Main1stage name="A_paye" id="A_paye" checkbox="-input" label="Member had payed" checked={(a_paye===true)?true:false} type="checkbox" required="required" value={a_paye} onChange={handleChecked_apaye}/>

                <div className='form-group' style={{padding:"1rem"}}>
                    <label></label>
                    <input class="form-control add-btn" value="Add new member" readonly onClick={submit}/>
                </div>
            </form>  
        </div>
    </div>
  )
}

export default AddMember
