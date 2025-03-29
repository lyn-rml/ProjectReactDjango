import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import fileTypeChecker from 'file-type-checker'

function AddProject()
{
    const [fileval,setfileval]=useState(false);
    let lastid=0;
    const navigate=useNavigate();
    const mindate=new Date();
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

   function handle_date2(date)
   {
    setdatefin(date);
   }

    function submit(e)
    {
        console.log("fileval:",fileval)
        if (fileval!==true)
        {
            alert("Unvalid file type");
            window.location.reload();
        }
        if(datedebut!==null && datefin!==null && (formData.Title)!==null  && formData.Domain!==null && formData.Speciality!==null)
            {
                axios.get('http://localhost:8000/api/Stages/get_all/')
              .then(res=>{
                for(let i=0;i<res.data.length;i++)
                {
                    if (res.data[i].id>lastid)
                    {
                        lastid=res.data[i].id;
                    }
                    console.log("id:",lastid);
                }
                console.log("last id:",lastid);
                console.log("lastidaftaxios:",lastid);
                console.log("pdf:",browsefile);
                if(lastid!==0)
                navigate(`/Add-project/Add_supervisers_project?id=${lastid}`);
              })
              .catch(function (error) {
                console.log(error);
                });
                console.log("success1");
                let day1=datedebut.getDay();
                let day2=datefin.getDay();
                let month1=datedebut.getMonth()+1;
                let month2=datefin.getMonth()+1;
                let year1=datedebut.getFullYear();
                let year2=datefin.getFullYear();
                if (day1 < 10) {
                    day1 = '0' + day1;
                }
                if (month1 < 10) {
                    month1 = `0${month1}`;
                }
                if (day2 < 10) {
                    day2 = '0' + day2;
                }
                if (month2 < 10) {
                    month2 = `0${month2}`;
                }
                e.preventDefault();
                formData.Date_debut=`${year1}-${month1}-${day1}`;
                formData.Date_fin=`${year2}-${month2}-${day2}`;
                formData.PDF_sujet=browsefile;
                console.log("PDF:",browsefile);
                      axios.post('http://localhost:8000/api/Stages/get_all/',formData,{
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                     .then(res => {
                   console.log("success:",formData);
                     console.log(res);
                     setformData({
                        id:0,
                        Domain:"",
                         Title:"",
                         Speciality:"",
                       Sujet_pris:false,
                        PDF_sujet:null,
                        Date_debut:"",
                        Date_fin:"",
                        Supervisers:[],
                    })
                    setdatedebut(null);
                    setdatefin(null);
                    setbrowsefile(null);
   
                 })
              .catch(function (error) {
              console.log(error);
              });
            } 
    }
    return (
    <div className="Add-modify">
        <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
        <div className="Add-modify-container">      
            <div className="top-add-modify">
                <h6 style={{color:"transparent"}}>abc</h6>
            <h2 className="title-add-modify">Add new Project</h2>
            <h6 style={{color:"transparent"}}>def</h6>
            </div>
            <form method="post" className="form-add-modify" enctype="json/multipart/form-data">       
                <Main1stage name="Title" id="title" label="Title" type="text" value={formData.Title} onChange={handle} required="required"/>
                <Main1stage name="Domain" id="Domain" label="Domain" type="text" value={formData.Domain} onChange={handle} required="required"/>
                <Main1stage name="Speciality" id="speciality" label="Speciality" type="text" value={formData.Speciality} onChange={handle} required="required"/>
                <Main1stage name="PDF_subject" id="PDF_subject" label="PDF of Project" type="file" onChange={handle_files}  required="required" accept="application/pdf"/>
                {/* <Main1stage name="Date_debut" id="st_date" label="Start-date" type="date" value={formData.Date_debut} pattern="\d{4}-\d{2}-\d{2}" onChange={filter}/>
                <Main1stage name="Date_fin" id="end_date" label="End date" type="date" value={formData.Date_fin} onChange={filter} pattern="\d{4}-\d{2}-\d{2}" />
                 */}
                  <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}>Start date:</span>
                    <DatePicker value={datedebut} dateFormat="yyyy/MM/dd" dateFormatCalendar="yyyy/MM/dd"  onChange={handle_date1} selected={datedebut} minDate={mindate} maxDate={datefin?datefin-1:""} required/>
                </div>
                <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}>End date:</span>
                    <DatePicker value={datefin} dateFormatCalendar="yyyy/MM/dd" dateFormat="yyyy/MM/dd" onChange={handle_date2} selected={datefin}  minDate={datedebut?datedebut:""} required/>
                </div>
                <div className='form-group' style={{padding:"1rem"}}>
                    <label></label>
                    <input type="submit" class="form-control add-btn" value="Add new project" readonly onClick={submit}/>
                </div>
            </form>  
        </div>
    </div>
  )
}

export default AddProject

  