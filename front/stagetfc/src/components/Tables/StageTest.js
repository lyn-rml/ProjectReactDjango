import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { Table } from 'react-bootstrap'

function StageTest() {
    const [Supstages, setSupstages] = useState([]); // Use state for filling the Supstages table
    const [filters, setfilters] = useState({
        filtermainsupfirstname: "",
        filtermainsuplastname: "",
        filterdomain: "",
        filtertitle: "",
        filterspec: "",
        filter_istaken: "",
    }); // Filter object for the fields

    useEffect(() => {
        filterStages();
    }, [filters]); // Call the filter function when filters change

    async function filterStages() {
        try {
            const res = await axios.get(`http://localhost:8000/api/supstage/?superviser__Prenom__icontains=${filters.filtermainsupfirstname}&superviser__Nom__icontains=${filters.filtermainsuplastname}&stage__Domain__icontains=${filters.filterdomain}&stage__Title__icontains=${filters.filtertitle}&stage__Speciality__icontains=${filters.filterspec}&stage__Sujet_pris=${filters.filter_istaken}`);
            console.log("Response data:", res.data.results); // Log the results
            setSupstages(res.data.results); // Update the Supstages state

        } catch (error) {
            console.log(error);
        }
    }

    function filter(e) {
        const { name, value } = e.target;
        setfilters((prev) => {
            return { ...prev, [name]: value };
        });
    }

    function del(id, e) {
        var x = window.confirm("Do you want to delete this project?");
        if (x) {
            var y = prompt("Enter yes to confirm to delete permanently this project:");
            if (y === "yes") {
                axios.delete(`http://localhost:8000/api/Stages/${id}/`)
                    .then((res) => {
                        console.log(res);
                        window.location.reload();
                    })
                    .catch((error) => alert(error));
            }
        }
    }

    const display = (Supstages) => {
        if (Supstages.length === 0) {
            return <h1 className="no-data-display titre">No data to display</h1>;
        }
    }


    return (
        <div>
            <div>
               
                    <div>
                        <Link to="/Add-project"><input type="button" className="form-control add-btn" value="Add project" readOnly /></Link>
                    </div>

            </div>
            <div className='filter-stage'>
                {/* Filter Form */}
                {['filtermainsupfirstname', 'filtermainsuplastname', 'filterdomain', 'filtertitle', 'filterspec', 'filter_istaken'].map((filterField) => (
                    <div key={filterField}>
                        <form autoComplete="off" method="post" action="">
                            <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
                            <div className="form-group">
                                <label className="filter-content" htmlFor={filterField}>{filterField.replace('filter', '').replace(/([A-Z])/g, ' $1').trim()}:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={filterField}
                                    value={filters[filterField]}
                                    name={filterField}
                                    onChange={filter}
                                />
                            </div>
                        </form>
                    </div>
                ))}

            </div>
            <div className="main d-flex">

                <div className='sub-main p-2'>
                    <h3 className='titre'>List of project with supervisor </h3>
                    <div className="table-responsive table-contayner" style={{ border: "1px solid blue", borderRadius: "0.5rem", borderBottom: "none", boxShadow: "rgba(0,0,0,.3)" }}>
                        <Table striped bordered>
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col" width="150px">Id</th>
                                    <th scope="col" width="150px">Domain</th>
                                    <th scope="col" width="150px">Speciality</th>
                                    <th scope="col" width="150px">Title</th>
                                    <th scope="col" width="150px">Project-taken</th>
                                    <th scope="col" width="150px">Main Supervisor</th>
                                    <th scope="col" width="150px">Subject PDF</th>
                                    <th scope="col" width="150px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Supstages.map(supstage => (
                                    <tr key={supstage.stage}>
                                        <td>{supstage.stage}</td>
                                        <td>{supstage.stage_domain}</td>
                                        <td>{supstage.stage_spec}</td>
                                        <td>{supstage.stage_title}</td>
                                        <td>{supstage.stage_pris}</td>
                                        <td>{supstage.superviser_name}</td>
                                        <td>
                                            <a href={`http://localhost:8000/media/${supstage.stage_pdf}`} target="_blank" className="pdf-btn">
                                                <span>{(supstage.stage_pdf.slice(24, 28))}..{(supstage.stage_pdf.slice(supstage.stage_pdf.length - 4))}</span>
                                                <img src={supstage.stage_pdf} alt="pdf" className='pdf_photo' />
                                            </a>
                                        </td>
                                        <td>
                                            <div className='choix table-content'>
                                                <span className='icon' title="Modify">
                                                    <Link to={`/Modifier-stage?stage=${supstage.stage_title}`}>
                                                        <FaPenToSquare />
                                                    </Link>
                                                </span>
                                                <span className='icon' title="Delete" onClick={e => del(supstage.stage, e)}>
                                                    <Link to="#"><TiUserDeleteOutline /></Link>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    {display(Supstages)}
                </div>
            </div>
        </div>
    );
}

export default StageTest;
