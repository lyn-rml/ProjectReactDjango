import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Homecolor from '../Homecolor'
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

  {/* <Sel opt={optionssingle.selectOptions}/> */}
                {/* <div className='form-group' style={{padding:"1rem"}}>
                <label for="filterprojectname" style={{color:"white"}}>Title:</label>
                     <Select
                    options={optionssingle.selectOptions}
                    // value={selectedOptions}
                    onChange={handleChangesingle}
                    />     
                     {/* <select multiple name="main" className="data-mdb-select-init" value={label} onChange={handleChange}>
                            <option>Choose an option</option>
                            {Supervisers
                        ?
                    Supervisers.map((superviser)=>{
                        return <option key={superviser.id} value={superviser.id}>{superviser.prenom} {superviser.nom}</option>
                    })
                    :null}                               
                    </select>  */}
                {/*</div>
                <div className='form-group' style={{padding:"1rem"}}>
                <label for="filterprojectname" style={{color:"white"}}>Title:</label>
                    {/* <Select
                    options={optionsmulti.selectOptions} onChange={handleChangemulti} isMulti />
                     {
                       optionsmulti.val ?  optionsmulti.val.map(v => <h4>{v.label}</h4>) :""
                    }  */}
               {/* </div>  */}

                //     //     const sp=document.createElement("span");
                //     //    const inp=React.createElement("Main1stage");
                //     //     console.log(sp);
                //     //     console.log(inp);
                //         //inputs.appendChild(<span style={{color:"white",fontWeight:"400",fontSize:"1.75rem"}}>Other Supervisers:</span>,inputs);
                //         //inputs.appendChild(<Main1stage name={`Superviser${i+1}`} id={`Superviser${i+1}`} label={`Superviser${i+1}`}/>);
                //         //y+=React.createElement('Main1stage', {  name:`Superviser${i+1}`, id:`Superviser${i+1}`, label:`Superviser${i+1}` });
                //        // <Main1stage name={`Superviser${i+1}`} id={`Superviser${i+1}`} label={`Superviser${i+1}`}/>
                //     //    inputs.appendChild({othersup:[othersup.length-1]});
                
                   // function handleDelete(i)
    // {
    //     const deletothersup=[...othersup];
    //     deletothersup.splice(i,1);
    //     setothersup(deletothersup);  
    //     setx(x+1);
    //     if(x==1)
    //         {
    //             document.getElementById("add_sup").style.display="block";
    //         }
    // }

         {/* <div>
                    <label class="form-control add-btn" onClick={add_supers} id="add_sup">Add supervisers {x} remaining</label>
                </div>
                <div>
                <h2  style={{color:"white",textAlign:"justify"}}>Other Supervisers:</h2>   
                </div>
                 {othersup.map((data,i)=>{
            return(
               <div style={{display:"flex",flexDirection:"row"}}>
                    <Main1stage name={`Superviser${i+2}`} id={`Superviser${i+2}`} label={`Superviser${i+2}`} onChange={handleChange} supers="supers"/>   
                    <label className="label-delete" onClick={()=>handleDelete(i)}>x</label>
               </div>
            )
        })}  */}

         // function handleChange(onChangeValue,i)
    // {
    //     const inputdata=[...othersup]
    //     inputdata[i]=onChangeValue.target.value;
    //     setothersup(inputdata)
    //    }

    //     function buildinput(i)
    // {
    //     const updatedComponents = [
    //         ...othersup,
    //         <Main1stage name={`Superviser${i+2}`} id={`Superviser${i+2}`} label={`Superviser${i+2}`}/>        
    //    ];
    //    console.log("udpcom",updatedComponents);
    //    return updatedComponents;
    // }


    // function handleCount()
    // {
    //     let updatedComponents=[];
    //     setothersup([]);//pour supprimer en cas du chamngement du nombre
    //     console.log("value:",value);

    //     let x=value;
    //     console.log("othbef:",othersup);
    //     // const inputs=document.getElementById("supervisers");
    //     // while (inputs.hasChildNodes()) {
    //     //     inputs.removeChild(inputs.firstChild);
    //     //   }
    //     if((isNaN(value))||((value)===" "))
    //         {
    //             setvalue(0);
    //             alert("Write a number");
    //         }
    //     //  if((value)>=count)
    //     //      {
    //     //          alert(`Normal supervisers cannot be greater than ${count-1}`);
    //     //          setvalue(0);
    //     //     }
    //     else if(((value)>0) )//&&((value)<count)
    //         {
    //                 updatedComponents=[null];
    //                 console.log("eraseupdcomp:",updatedComponents);
    //             setothersup([]);
    //             //setvalue(0);//pour reset value a 0
    //             //remplir le tableau supervisers
    //             updatedComponents[0] = <span style={{color:"white",fontWeight:"400",fontSize:"1.75rem"}}>Other Supervisers:</span>;
    //              for(let i=0;i<x;i++)
    //                 {
    //                     updatedComponents[i+1]=null;
    //                     updatedComponents[i+1]=buildinput(i); 
    //                 }    
    //              setothersup(updatedComponents);
    //         }
    // }
    // useEffect(()=> handleCount,[]);//to prevent error in firefox : should not already be working

    //  function handlevalue(e)
    //  {
    //       setothersup([]);
    //       setvalue(parseInt(e.target.value));
    //  }

    // function add_supers()
    // {
    //     rem++;
    //     const updatedComponents=[...othersup,[]];
    //     setothersup(updatedComponents);
    //     setx(x-1);
    //     if(x==1)
    //         {
    //             document.getElementById("add_sup").style.display="none";
    //         }
    // }
 
    // function handleChangesingle(selectedOption)
    // {   
    //     console.log(selectedOption);
    //     console.log(selectedOption.value);
    //     const filtered=initialoptions.filter(abc => (abc.value)!==(selectedOption.value));
    //     console.log("abcaft:",filtered);
    //     setmultioptions(filtered);
    // }
    // function filter(option,arra)
    // {
    //     const filte=arra.filter(abc => abc!==option);
    //     return filte;

    // }
    // function handleChangemulti(selectedOption)
    // {
    //     init=[];
    //     console.log("multiopt:",multioptions);
    //     console.log("multivalues:",multioptions[0].value);
    //     console.log("singleoptionsbefmulti:",singleoptions);
    //     console.log("selectedmulti:",selectedOption);
    //     setsingleoptions([]);
    //      if(selectedOption="")
    //          {
    //              setsingleoptions(initialoptions);
    //          }
    //      else
    //      {
    //         for (let i=0;i<selectedOption.length;i++)
    //             {
    //                 if(i==0)
    //                     {
    //                         init=filter(selectedOption[i],initialoptions);
    //                         console.log(`filteredmulti ${i}`,singleoptions);
    //                         continue;
    //                     }
    //                init=(filter(selectedOption[i],init));//.filter(abc=>(abc.value)===(selectedOption[i].value));
    //                console.log(`filteredmulti ${i}`,init);
    //             }
    //             setsingleoptions(init);
    //     }
    // }
   