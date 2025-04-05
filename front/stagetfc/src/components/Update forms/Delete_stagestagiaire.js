import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'


function DeleteStagestagiaire ()
{
    const menuPortalTarget = document.getElementById('root');
    const navigate=useNavigate();
    const [searchparams] = useSearchParams();
    const title = searchparams.get('stage');
    const sujet_pris=searchparams.get('sujetpris');
    const [multioptions,setmultioptions]=useState([]);
    const [multiselectedoptions,setmultiselectedoptions]=useState(null);

    async function fill_interns()
    {
        let opts=[];
        await axios.get(`http://localhost:8000/api/stagestagiaire/get_notcertified/?stagiaire__Nom__icontains=&stage__Title__iexact=${title}&stagiaire__Annee__icontains=&stagiaire__promotion__icontains=`)
        .then(res => {
            opts = res.data.map(s => ({
                "value": {
                    "id":s.id,
                    "value":s.stagiaire,
                },
                "label": `${s.intern_name}`,
            }
            ));
            setmultioptions(opts);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {fill_interns()}, []);



    function handleChangemulti(selectedoptions)
    {
        console.log("selected options",selectedoptions);
        setmultiselectedoptions(selectedoptions);
    }

    function handlesubmit()
    {
         for(let i=0;i<multiselectedoptions.length;i++)
         {
            axios.delete(`http://localhost:8000/api/stagestagiaire/${multiselectedoptions[i].value.id}/`)
            .then((res) => {
                console.log(res);
                alert("interns selected deleted succesfully!!!")
              })
              .catch((error) => alert(error));
         }
         navigate("/Stage");
    }

  return (
    <div className="Add-modify">
      <h1 style={{color:"transparent"}}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
      <div className="Add-modify-container">      
          <div className="top-add-modify">
              <h6 style={{color:"transparent"}}>abc</h6>
          <h2 className="title-add-modify">Delete interns from the project:</h2>
          <h6 style={{color:"transparent"}}>def</h6>
          </div>
          <form method="post" className="form-add-modify" enctype="multipart/form-data"> 
            <div className="form-group add-modif">
                    <span style={{color:"white",fontWeight:"400",fontSize:"1.5rem"}}>Select interns to delete:</span>
                    <Select options={multioptions}  value={multiselectedoptions} onChange={handleChangemulti} maxMenuHeight={220} menuPlacement="auto" menuPortalTarget={menuPortalTarget} isMulti/>
            </div>
            <div className='form-group' style={{ padding: "1rem" }}>
                    <label></label>
                    <input type="button" class="form-control add-btn" value="Delete" onClick={handlesubmit} readonly />
            </div>
          </form>
      </div>
    </div>
  )
}

export default DeleteStagestagiaire
