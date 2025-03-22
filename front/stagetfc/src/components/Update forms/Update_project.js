import React from 'react'
import axios from 'axios'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css"
import { useSearchParams } from 'react-router-dom'
import Homecolor from '../Homecolor'
import addDays from "react-datepicker"
import fileTypeChecker from "file-type-checker"
import { useStateManager } from 'react-select'
import { Form, FormGroup } from 'react-bootstrap'

function UpdateProject () 
{
    const [fileval,setfileval]=useState(true);
    const [filesliced,setfilesliced]=useState(null);
    const [Domain,setDomain]=useState("");
    const [Title,setTitle]=useState("");
    const [Speciality,setSpeciality]=useState("");
    // const [Date_debut,setDate_debut]=useState("");
    // const [Date_fin,setDate_fin]=useState("");
    const [Sujet_pris,setSujet_pris]=useState("");
    const [ID,setID]=useState(0);
    // let lastid=0;
    const navigate=useNavigate();
    const [searchparams]=useSearchParams();
    const title=searchparams.get('stage');
    // const mindate=new Date();
    const [PDF_sujet,setPDF_sujet]=useState(null);
     const [formData,setformData]=useState({
         id:0,
         Domain:"",
         Title:"",
         Speciality:"",
         Sujet_pris:false,
         PDF_sujet:null,
         Date_debut:"",
         Date_fin:"",
         Supervisers:[],
     });
    // const [Data,setData]=useState({});
    // const [FNam,setFNam]=useState("");
    const [browsefile,setbrowsefile]=useState(null);
    const[datedebut,setdatedebut]=useState(null);
    const[datefin,setdatefin]=useState(null);
    // let init=[];
    // const [DataStage,setDataStage]=useState({
    //     Domain:"",
    //     Title:"",
    //     Speciality:"",
    //     PDF_sujet:"",
    //     Date_debut:"",
    //     Date_fin:"",
    //     Supervisers:[],
    //   });
    async function fillProjectData() 
    {
        let x=[];
     await axios.get(`http://localhost:8000/api/Stages/?Title__iexact=${title}`)
     .then(res => {
        console.log(res.data.results);
            setID(res.data.results[0].id);
            setDomain(res.data.results[0].Domain);
            setTitle(res.data.results[0].Title);
            setSpeciality(res.data.results[0].Speciality);
            setSujet_pris(res.data.results[0].Sujet_pris);
            //setfile(res.data.results[0].PDF_sujet);
            // setDate_debut(res.data.results[0].Date_debut);
            // setDate_fin(res.data.results[0].Date_fin);
            setPDF_sujet(res.data.results[0].PDF_sujet);
            x=res.data.results[0].PDF_sujet.split('/');
            setfilesliced(x[x.length-1]);
            setdatedebut(res.data.results[0].Date_debut);
            setdatefin(res.data.results[0].Date_fin);
            setformData({
                id:res.data.results[0].id,
                Domain:res.data.results[0].Domain,
                Title:res.data.results[0].Title,
                Speciality:res.data.results[0].Speciality,
                Sujet_pris:res.data.results[0].Sujet_pris,
                PDF_sujet:res.data.results[0].PDF_sujet,
                Date_debut:res.data.results[0].Date_debut,
                Date_fin:res.data.results[0].Date_fin,
            })
        // console.log("data domain",res.data.results[0].Domain);
         //formData.Domain=res.data.results[0].Domain;
        //  formData.Title=res.data.results.Title;
        //  formData.Speciality=res.data.results.Speciality;
        //  formData.Date_debut=res.data.results.Date_debut;
        //  formData.Date_fin=res.data.results.Date_fin;
        //  formData.Sujet_pris=res.data.results.Sujet_pris;
    })
     .catch(function (error) {
        console.log(error);
    });
    }

    useEffect(() => {fillProjectData()},[]);//{}:pour fixer l'error destroy is not a function

    function Dat()
    {
        let today = new Date();
        let new_today=addDays(today,21);
        let day = new_today.getDay();
        let month = new_today.getMonth()+1; //January is 0
        let year = new_today.getFullYear();
        if(day<10)
        {
            day='0'+day
        } 
        if(month<10)
        {
            month='0'+month
        }
        new_today = year+'-'+month+'-'+day;
        document.getElementById("st_date").setAttribute("min", new_today);
        console.log("abc");
    }
    function handleTitle (e)  
   {
     return setTitle(e.target.value);
   }

   function handleDomain (e)  
   {
     return setDomain(e.target.value);
   }
   function handleSpeciality (e)  
   {
     return setSpeciality(e.target.value);
   }
   function handleChecked (e)  
   {
     if(e.target.checked)
         return setSujet_pris(true);
     return setSujet_pris(false);
   }

   function handle_files (e)  
   {
    try {
        let file = e.target.files[0];
        console.log("file:",file);
        const reader = new FileReader();
        // const types = [application/pdf];
        reader.onload = () => 
        {
        //   console.log("reader:",reader);
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
        //   console.log("ispdf:",ispdf);
        };    
        reader.readAsArrayBuffer(file);
      } catch (err) {
        console.error("Error: ", err.message);
      }
   }

   function handle_date1(e)
   {
//     let day1=date.getDay();
//     let month1=date.getMonth()+1;
//    let year1=date.getFullYear();
//    if (day1 < 10) {
//     day1 = '0' + day1;
//     }
//    if (month1 < 10) {
//        month1 = `0${month1}`;
//    }
//    let formatteddate=new Date(`${year1}-${month1}-${day1}`)
    setdatedebut(e.target.value);
    console.log("date debut:",e.target.value);
   }

   function handle_date2(e)
   {
//     let day1=date.getDay();
//     let month1=date.getMonth()+1;
//    let year1=date.getFullYear();
//    if (day1 < 10) {
//     day1 = '0' + day1;
//     }
//    if (month1 < 10) {
//        month1 = `0${month1}`;
//    }
//    let formatteddate=new Date(`${year1}-${month1}-${day1}`)
    setdatefin(e.target.value);
    console.log("date fin:",e.target.value);
   }
    function submit(e)
    {
        if (fileval!==true)
            {
                alert("Unvalid file type");
                navigate("/Stage");
            }
        console.log("date debut submit:",datedebut);
        console.log("date fin submit:",datefin);
        console.log("formData:",formData);
        // if(formData.Title !==null && formData.Domain!==null && formData.Speciality!==null && formData.Sujet_pris!==null )
                // navigate(`/Add-project/Add_supervisers_project?id=${formData.id}`);
                console.log("success1");
                // let debut=0;
                // let fin=0;
                //  if(datedebut!==formData.Date_debut)
                //  {
                //     let day1=datedebut.getDay();
                //     let month1=datedebut.getMonth()+1;
                //     let year1=datedebut.getFullYear();
                //     if (day1 < 10) {
                //         day1 = '0' + day1;
                //     }
                //     if (month1 < 10) {
                //         month1 = `0${month1}`;
                //     }
                //     debut=`${year1}-${month1}-${day1}`;
                //     console.log("debut:",debut);
                // }
                // else
                // {
                    // debut=formData.Date_debut;
                    // console.log("debut:",debut);
                // }
                // if(datefin!== formData.Date_fin)
                //     {
                //         let day2=datefin.getDay();                 
                //         let month2=datefin.getMonth()+1;
                //         let year2=datefin.getFullYear();
                //         if (day2 < 10) {
                //             day2 = '0' + day2;
                //         }
                //         if (month2 < 10) {
                //             month2 = `0${month2}`;
                //         }
                //     fin=`${year2}-${month2}-${day2}`
                //     console.log("fin:",fin);
                //     } 
                e.preventDefault();
                // setDate_debut(`${year1}-${month1}-${day1}`);
                // setDate_fin(`${year2}-${month2}-${day2}`);
                // setPDF_sujet=file;
                let updatedata=new FormData();
                    updatedata.append('id',ID);
                    updatedata.append('Title',Title);
                    updatedata.append('Domain',Domain);
                    updatedata.append('Speciality',Speciality);
                    updatedata.append('Sujet_pris',Sujet_pris);
                    // if(datedebut!==formData.Date_debut)
                    // updatedata.append('Date_debut',debut);
                    // else
                    // updatedata.append('Date_debut',formData.Date_debut);
                    // if(datefin!==formData.Date_fin)
                    // updatedata.append('Date_fin',fin);
                    // else
                    // updatedata.append('Date_fin',formData.Date_fin);
                    updatedata.append('Date_debut',datedebut);
                    updatedata.append('Date_fin',datefin);
                    if(browsefile!==null)
                    updatedata.append('PDF_sujet',browsefile)

                console.log("PDF:",browsefile);
                console.log("id:",formData.id);
                      axios.patch(`http://localhost:8000/api/Stages/${formData.id}/`,updatedata,{
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                     .then(res => {
                        console.log("Data:",updatedata);
                        navigate(`/Modify-project-supervisers?stage=${title}&sujet_pris=${Sujet_pris}`);
                   console.log("success:",updatedata);
                     console.log(res);
                 })
              .catch(function (error) {
              console.log(error);
              });             
    }
    async function backgroundcolor()
    {
        await Homecolor({color: "#FDB600"})
    }
    useEffect(() =>{backgroundcolor()},[]); 
    return (
        console.log("Domaincscscs:",formData.PDF_sujet),
        console.log("date debut first:",datedebut),
        console.log("date fin first:",datefin),
        console.log("formdata",formData),
    <div className="Add-modify">
          <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1> 
        <div className="Add-modify-container">
            <div className='h-20 bg-#FDB600'>
            </div>      
            {/* <h2 className="title-add-modify">Modify Project</h2> */}
            <h2 className="text-center text-white">Modify project</h2>
            {/* {formData.map(formData=>( */} 
            {/* className="form-add-modify"            */}
                <Form  className="d-flex flex-column justify-content-center  align-items-center
                " enctype="multipart/form-data">  
                <Main1stage name="Title" id="title" label="Title" type="text" value={Title} onChange={handleTitle} required="required"></Main1stage>

                <Main1stage name="Domain" id="Domain" label="Domain" type="text" value={Domain} onChange={handleDomain} required="required"/>
                <Main1stage name="Speciality" id="speciality" label="Speciality" type="text" value={Speciality} onChange={handleSpeciality} required="required"/>

                <Main1stage name2={PDF_sujet} id2="PDF_subject" label="PDF of Project" type2="text" value2={filesliced}  required="required" readonly="readOnly" linkto={PDF_sujet} browse_edit="1"
                 name1="New PDF_subject" id1="New_PDF_subject" type1="file" onChange={handle_files} accept="application/pdf"/>

                 <Main1stage name="project-taken" id="project-taken" checkbox="-input" label="Project is taken" checked={(Sujet_pris===true)?true:false} type="checkbox" required="required" value={formData.Sujet_pris} onChange={handleChecked}/>
                 
                 <Main1stage name="Date_debut" id="st_date" label="Start-date" type="date" value={datedebut} pattern="\d{4}-\d{2}-\d{2}" onChange={handle_date1} min="2024-07-25" max={datefin?datefin-1:""}  onlod={Dat}/>

                <Main1stage name="Date_fin" id="end_date" label="End date" type="date" value={datefin} onChange={handle_date2} pattern="\d{4}-\d{2}-\d{2}" min={datedebut?datedebut:""} />
                 
                  {/* <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}>Start date:</span>
                    <DatePicker  name="Date_debut" value={datedebut} dateFormatCalendar="yyyy/MM/dd" dateFormat="yyyy/MM/dd" onChange={handle_date1} selected={datedebut} minDate={minDate} maxDate={datefin?datefin-1:""} required/>
                </div>
                <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}>End date:</span>
                    <DatePicker name="Date_fin" value={datefin} dateFormatCalendar="yyyy/MM/dd" dateFormat="yyyy/MM/dd" onChange={handle_date2} selected={datefin}  minDate={datedebut?datedebut:""} required/>
                </div> */}
                <Form.Group  style={{padding:"1rem"}}>
                    <label></label>
                    <Form.Control  className=" add-btn" value="Modify Project" readonly onClick={submit}/>
                </Form.Group>
                </Form>  
            {/* ))}      */}
         </div> 
    </div>
  )
        }

export default UpdateProject
