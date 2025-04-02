import axios from 'axios';
import React, { useState } from 'react';
import Main1stage from '../Main1stage';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fileTypeChecker from 'file-type-checker';

function AddProject() {
    const [fileval, setFileval] = useState(false);
    const navigate = useNavigate();
    const mindate = new Date();
    const [formData, setFormData] = useState({
        id: 0,
        Domain: "",
        Title: "",
        Speciality: "",
        Sujet_pris: false,
        PDF_sujet: null,
        Date_register: "",
        Supervisers: [],
    });
    const [browsefile, setBrowsefile] = useState(null);
    const [dateregister, setDateregister] = useState(new Date());

    function handle(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleFiles(e) {
        let file = e.target.files[0];
        if (!file) return;
        console.log("File selected:", file);

        const reader = new FileReader();
        reader.onload = () => {
            const detectedFile = fileTypeChecker.detectFile(reader.result);
            if (detectedFile.mimeType === "application/pdf") {
                setBrowsefile(file);
                setFileval(true);
            } else {
                alert("Only PDFs are allowed");
                setFileval(false);
                setBrowsefile(null);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function handleDate(date) {
        setDateregister(date);
    }

    async function submit(e) {
        e.preventDefault();

        if (!fileval) {
            alert("Invalid file type");
            return;
        }
        if (!dateregister || !formData.Title || !formData.Domain || !formData.Speciality) {
            alert("Please fill all required fields");
            return;
        }

        try {
            // Fetch the latest project ID
            const res = await axios.get('http://localhost:8000/api/Stages/');
            let lastid = res.data.reduce((max, stage) => Math.max(max, stage.id), 0);
            console.log("Last ID:", lastid);

            // Format date
            formData.Date_register = dateregister.toISOString().split('T')[0];
            formData.PDF_sujet = browsefile;

            // Send project data
            const postRes = await axios.post('http://localhost:8000/api/Stages/', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("Project added successfully:", postRes.data);

            // Reset form
            setFormData({
                id: 0,
                Domain: "",
                Title: "",
                Speciality: "",
                Sujet_pris: false,
                PDF_sujet: null,
                Date_register: "",
                Supervisers: [],
            });
            setDateregister(new Date());
            setBrowsefile(null);

            // Redirect after success
            navigate(`/add-supervisor?id=${postRes.data.id}`);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="Add-modify">
            <h1 style={{ color: "transparent" }}>Add New Project</h1>
            <div className="Add-modify-container">
                <div className="top-add-modify">
                    <h6 style={{ color: "transparent" }}>abc</h6>
                    <h2 className="title-add-modify">Add New Project</h2>
                    <h6 style={{ color: "transparent" }}>def</h6>
                </div>
                <form className="form-add-modify" encType="multipart/form-data" onSubmit={submit}>
                    <Main1stage name="Title" id="title" label="Title" type="text" value={formData.Title} onChange={handle} required />
                    <Main1stage name="Domain" id="Domain" label="Domain" type="text" value={formData.Domain} onChange={handle} required />
                    <Main1stage name="Speciality" id="speciality" label="Speciality" type="text" value={formData.Speciality} onChange={handle} required />
                    <Main1stage name="PDF_subject" id="PDF_subject" label="PDF of Project" type="file" onChange={handleFiles} required accept="application/pdf" />
                    <div className="form-group add-modif">
                        <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Register date:</span>
                        <DatePicker
                            selected={dateregister}
                            onChange={handleDate}
                            dateFormat="yyyy/MM/dd"
                            minDate={mindate}
                            required
                        />
                    </div>
                    <div className='form-group' style={{ padding: "1rem" }}>
                        <input type="submit" className="form-control add-btn" value="Add new project" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProject;