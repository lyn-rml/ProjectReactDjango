import axios from 'axios'
import React from 'react'
import Main1stage from '../Main1stage'
import { useState, useEffect } from 'react'
import { useNavigate,useSearchParams } from 'react-router-dom'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import fileTypeChecker from 'file-type-checker'
import PageInfo from '../../mycomponent/paginationform'

function AddProject() {
     const [searchparams] = useSearchParams();
     let index=1
      let pageNumber=2
      if(index>2){
        index = searchparams.get('index');
        index++;
        pageNumber++
      }

    const [fileval, setfileval] = useState(false);
    let lastid = 0;
    const navigate = useNavigate();
    const mindate = new Date();
    const [formData, setformData] = useState({
        id: 0,
        Domain: "",
        Title: "",
        Speciality: "",
        Sujet_pris: false,
        PDF_sujet: null,
        Date_debut: "",
        Date_fin: "",
        Supervisers: [],
    })
    const [browsefile, setbrowsefile] = useState(null);
    const [dateregister, setdateregister] = useState(new Date());

    function handle(e) {
        const { name, value } = e.target;
        setformData((prev) => ({ ...prev, [name]: value }));
    }


    function handle_files(e) {
        let file = e.target.files[0];
        if (!file) return;
        console.log("file:", file);
        const reader = new FileReader();
        // const types = [application/pdf];
        reader.onload = () => {
            //   const ispdf= fileTypeChecker.validateFileType(reader.result, types);
            //   console.log("ispdf:",ispdf); // Returns true if the file is a PDF
            const detectedFile = fileTypeChecker.detectFile(reader.result);
            console.log(detectedFile);
            if (detectedFile.mimeType === "application/pdf") {
                setbrowsefile(e.target.files[0]);
                setfileval(true);

            }
            else {
                alert("Only PDF are allowed");
                setfileval(false);
                setbrowsefile(null);

            }
        };
        reader.readAsArrayBuffer(file);
    }

    function handle_date(date) {
        setdateregister(date);
    }


    async function submit(e) {
        e.preventDefault();
        console.log("fileval:", fileval)
        if (fileval !== true) {
            alert("Unvalid file type");
            return;
        }
        if (!dateregister || !formData.Title || !formData.Domain || !formData.Speciality) {
            alert("Please fill all required fields");
            return;
        }

        try {
            const res = await axios.get('http://localhost:8000/api/Stages/');
            console.log("API Response:", res.data);

            let lastid = 0;
            if (Array.isArray(res.data.results)) {
                lastid = res.data.results.reduce((max, stage) => Math.max(max, stage.id), 0);
            } else {
                console.error("Expected an array but got:", res.data);
            }

            // Prepare FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append("Domain", formData.Domain);
            formDataToSend.append("Title", formData.Title);
            formDataToSend.append("Speciality", formData.Speciality);
            formDataToSend.append("Sujet_pris", formData.Sujet_pris);
            formDataToSend.append("Date_register", dateregister.toISOString().split('T')[0]);
            formDataToSend.append("PDF_sujet", browsefile);

            const postRes = await axios.post('http://localhost:8000/api/Stages/', formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("Project added successfully:", postRes.data);

            // Reset form
            setformData({
                Domain: "",
                Title: "",
                Speciality: "",
                Sujet_pris: false,
                Date_register: "",
                Supervisers: [],
            });
            setdateregister(new Date()); // Fixed function name
            setbrowsefile(null);

            // Debugging before redirect
            if (postRes.data.id) {
                console.log("Redirecting to:", `/admin-dashboard/Add-project/Add_supervisers_project?id=${postRes.data.id}`);
                navigate(`/admin-dashboard/Add-project/Add_supervisers_project?id=${postRes.data.id}&index=${index}`)
            } else {
                console.error("No ID returned from API. Redirect failed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    return (
        <div className="Add-modify">
            <div className="Add-modify-container">
            <div className="top-add-modify">
  <h2 className="title-add-modify">Project Details </h2>    
</div>

                <form method="post" className="form-add-modify" encType="multipart/form-data">
                    <Main1stage name="Title" id="title" label="Title" type="text" value={formData.Title} onChange={handle} required="required" />
                    <Main1stage name="Domain" id="Domain" label="Domain" type="text" value={formData.Domain} onChange={handle} required="required" />
                    <Main1stage name="Speciality" id="speciality" label="Speciality" type="text" value={formData.Speciality} onChange={handle} required="required" />
                    <Main1stage name="PDF_subject" id="PDF_subject" label="PDF of Project" type="file" onChange={handle_files} required="required" accept="application/pdf" />

                    <div className="form-group add-modif">
                        <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Register date:</span>
                        <DatePicker selected={dateregister} dateFormat="yyyy/MM/dd" minDate={mindate} onChange={handle_date} required />
                    </div>

                    <div className='form-group' style={{ padding: "1rem" }}>
                        <label></label>
                        <input type="submit" class="form-control add-btn" value="Next Step Add supervisor" readonly onClick={submit} />
                    </div>
                </form>
                <div className="d-flex justify-content-center gap-3">
                <PageInfo index={index} pageNumber={pageNumber} />
                </div>
            </div>
         
        </div>
    )
}

export default AddProject

