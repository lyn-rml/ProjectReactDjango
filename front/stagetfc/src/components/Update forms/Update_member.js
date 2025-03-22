import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Homecolor from '../Homecolor'
import fileTypeChecker from 'file-type-checker'

function UpdateMember ()
{
  const [searchparams] = useSearchParams();
  const memberid =searchparams.get('member');
  const member=parseInt(memberid);
  const [a_paye,seta_paye]=useState(false);
  const [Autre_association,setAutre_association]=useState(false);

    const navigate=useNavigate();
    // const mindate=new Date();
    const [formData,setformData]=useState({
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
        A_paye: false,
    })
    const [browsefile,setbrowsefile]=useState(null);
    const[filesliced,setfilesliced]=useState(null);
    const [Application_PDF,setApplication_PDF]=useState(null);
    const [fileval,setfileval]=useState(false);
    const[datedebut,setdatedebut]=useState(new Date());

    async function fillProjectData() 
    {
        let x=[];
     await axios.get(`http://localhost:8000/api/Membres/${member}/`)
     .then(res => {
        console.log(res.data.results);
        x=res.data.Application_PDF.split('/');
        setfilesliced(x[x.length-1]);
        setformData({
          Nom:res.data.Nom,
          Prenom:res.data.Prenom,
          Nom_pere:res.data.Nom_pere,
          Date_naissance:res.data.Date_naissance,
          Lieu_naissance:res.data.Lieu_naissance,
          Telephone:res.data.Telephone,
          Adresse:res.data.Adresse,
          Groupe_sanguin:res.data.Groupe_sanguin,
          Travail:res.data.Travail,
          Profession:res.data.Profession,
          Domaine:res.data.Domaine,
          Email:res.data.Email,
          Autre_association:res.data.Autre_association,
          Nom_autre_association:res.data.Nom_autre_association,
          A_paye:res.data.A_paye,
        })
        setApplication_PDF(res.data.Application_PDF);
        setdatedebut(res.data.Date_naissance);
        console.log(res.data);
    })
     .catch(function (error) {
        console.log(error);
    });
    }

    useEffect(() => {fillProjectData()},[]);//{}:pour fixer l'error destroy is not a function

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
              let updatedata= new FormData();
              updatedata.append('Nom',formData.Nom);
              updatedata.append('Prenom',formData.Prenom);
              updatedata.append('Nom_pere',formData.Nom_pere);
              updatedata.append('A_paye',formData.A_paye);
              updatedata.append('Adresse',formData.Adresse);
              updatedata.append('Autre_association',formData.Autre_association);
              updatedata.append('Date_naissance',formData.Date_naissance);
              updatedata.append('Domaine',formData.Domaine);
              updatedata.append('Email',formData.Email);
              updatedata.append('Groupe_sanguin',formData.Groupe_sanguin);
              updatedata.append('Lieu_naissance',formData.Lieu_naissance);
              updatedata.append('Nom_autre_association',formData.Nom_autre_association);
              updatedata.append('Profession',formData.Profession);
              updatedata.append('Telephone',formData.Telephone);
              updatedata.append('Travail',formData.Travail);
              if(browsefile!==null)
                updatedata.append('Application_PDF',browsefile);
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
                      axios.patch(`http://localhost:8000/api/Membres/${member}/`,formData,{
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
              alert("Member modified!!!");
              navigate("/Member");
            } 
            else
            {
              alert("Error!!!");
              window.location.reload();
            }
    }
    async function backgroundcolor()
    {
        await Homecolor({color: "#FDB600"});
    }
    useEffect(() =>{backgroundcolor()},[]); 
    return (
      console.log("fromdata",formData),
      console.log("fromdata",memberid),
      console.log("fromdata",member),
    <div className="Add-modify">
        <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
        <div className="Add-modify-container">      
            <div className="top-add-modify">
                <h6 style={{color:"transparent"}}>abc</h6>
            <h2 className="title-add-modify">Modify member</h2>
            <h6 style={{color:"transparent"}}>def</h6>
            </div>
            <form method="post" className="form-add-modify" enctype="json/multipart/form-data"> 
                <Main1stage name="Prenom" id="Prenom" label="First name" type="text" value={formData.Prenom} onChange={handle} required="required"/>
      
                <Main1stage name="Nom" id="Nom" label="Last Name" type="text" value={formData.Nom} onChange={handle} required="required"/>

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

                <Main1stage name="Nom_autre_association" id="Nom_autre_association" label="Other association name" type="text" value={formData.Nom_autre_association} onChange={handle}/>

                <Main1stage name2="Application_PDF" id2="Application_PDF" label="PDF of Project" type2="text" value2={filesliced}  required="required" readonly="readOnly" linkto={Application_PDF} browse_edit="1"
                 name1="New Application_PDF" id1="New_Application_PDF" type1="file" onChange={handle_files} accept="application/pdf"/>

                <Main1stage name="A_paye" id="A_paye" checkbox="-input" label="Member had payed" checked={(a_paye===true)?true:false} type="checkbox" required="required" value={a_paye} onChange={handleChecked_apaye}/>

                

                <div className='form-group' style={{padding:"1rem"}}>
                    <label></label>
                    <input class="form-control add-btn" value="Modify member" readonly onClick={submit}/>
                </div>
            </form>  
        </div>
    </div>
  )
}

export default UpdateMember