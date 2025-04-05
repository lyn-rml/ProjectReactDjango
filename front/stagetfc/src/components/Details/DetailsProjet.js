import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from 'react-bootstrap';
import Navbar from '../Header';
import pdf from '../photos/pdf.jpeg'

function DetailsProject ()
{
  const navigate=useNavigate();
  const [searchparams]=useSearchParams();
  const title=searchparams.get('stage');
  const [projects,setprojects]=useState([]);
  const [supervisers,setsupervisers]=useState([]);
  const [interns,setinterns]=useState([]);
  let name=`for project ${title}`;

  async function fill_details() 
  {
    let supersx=[];
    let stagiers=[];
    let sup="";
    let inte="";
    await axios.get(`http://localhost:8000/api/Stages/?Title__icontains=${title}`)
    .then(res => {
      let obj={
        Date_debut:res.data.results[0].Date_debut,
        Date_fin:res.data.results[0].Date_fin,
        Domain:res.data.results[0].Domain,
        PDF_sujet:res.data.results[0].PDF_sujet,
        Speciality:res.data.results[0].Speciality,
        Sujet_pris:res.data.results[0].Sujet_pris,
        Title:title,
      }
      setprojects(res.data.results);
      supersx=res.data.results[0].Supervisers;
      stagiers=res.data.results[0].Stagiers;
  })
  .catch(function (error) {
    console.log(error);
});
console.log(" superx length:",supersx.length);

  if(supersx.length>0)
  {
    for(let i=0;i<supersx.length;i++)
      {
        axios.get(`http://localhost:8000/api/Supervisers/${supersx[i]}/`)
        .then(res => {
        console.log("supervisers:",res.data);
         sup={
          id:res.data.id,
          name:`${res.data.Prenom} ${res.data.Nom}`,
         }
         console.log("sup",sup);
         setsupervisers(prevArray=>[...prevArray,sup]);//(prevArray => [...prevArray, newValue])
        })
    .catch(function (error) {
      console.log(error);
    });
      }
  }
  console.log("stagiers length:",stagiers.length);
  if(stagiers.length>0)
    {
      console.log("stagiers length:",stagiers.length);
          axios.get(`http://localhost:8000/api/stagestagiaire/get_all/?stagiaire__Nom__icontains=&stagiaire__Prenom__icontains=&stage__Title__iexact=${title}&Annee__icontains=&Promotion__icontains=&Certified=unknown&stage__id=&stagiaire__id=`)
          .then(res => {
            setinterns(res.data);
            // setinterns(inte);
          // setinterns(res.data);
          })
      .catch(function (error) {
       console.log(error);
      });
        }
  }
useEffect(() => {fill_details()},[]);//{}:pour fixer l'error destroy is not a 


  return (
    console.log("supervisers return:",supervisers),
    console.log("interns return:",interns),
    <div className="start">
      <Container>
        <p>Initial details:</p>
        {projects.map (project => (
           <ol>
            <li>Title : {project.Title}</li>
            <li>Domain : {project.Domain} </li>
            <li>Speciality : {project.Speciality}</li>
            <li>Project is taken : {(project.Sujet_pris.toString().toLowerCase()==="true")
             ?
             "Yes"
             :"No"}</li>
             <li>Date_Register : {project.Date_register}</li>
             <li> PDF of project: <a href={`${project.PDF_sujet}`} target="blank" className="pdf-btn">
              <span>{(project.PDF_sujet.slice(24,28))}..
                {(project.PDF_sujet.slice(project.PDF_sujet.length-4,project.PDF_sujet.length))}
                </span><img src={pdf} alt="pdf" className='pdf_photo'></img></a></li>
           </ol>
          ))}
      </Container>
      <Container>
      <p>Supervisers list: </p>
      <ol>
      {supervisers.map(sup => (
            <li id={sup.id}>{sup.name}</li>
          ))} 
      </ol>
      <p>Interns list </p>
          <ol>
          {interns.map(intern => (
            <li id={intern.stagiaire}>{intern.intern_name}</li>
          ))}
          </ol>
      </Container>
    </div>
  )
}

export default DetailsProject
