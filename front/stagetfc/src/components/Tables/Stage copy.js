import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import ReactPaginate from 'react-paginate';
import { Table } from 'react-bootstrap';
import { FaPlus, FaInfoCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmModal from '../../mycomponent/confirmmodal'
import PrisIcon from '../../mycomponent/truefalseicon';
import { useSearchParams } from "react-router-dom";
function StageTest() {
  const [Supstages, setSupstages] = useState([]);
  const [filters, setFilters] = useState({
    filtermainsupfirstname: "",
    filtermainsuplastname: "",
    filterdomain: "",
    filtertitle: "",
    filterspec: "",
    filter_istaken: "",
    filter_dateregister: "",
  });
  const [searchValues, setSearchValues] = useState({ ...filters });
  const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const is_taken = searchParams.get("is_taken");
  console.log(is_taken)

  async function fetchSupStages() {
    try {
      let url = `http://localhost:8000/api/supstage/?page=${currentPage}&Role=Admin`;

      // Add filters
      if (filters.filtermainsupfirstname) url += `&supervisor_first_name=${filters.filtermainsupfirstname}`;
      if (filters.filtermainsuplastname) url += `&supervisor_last_name=${filters.filtermainsuplastname}`;
      if (filters.filterdomain) url += `&project_domain=${filters.filterdomain}`;
      if (filters.filtertitle) url += `&project_title=${filters.filtertitle}`;
      if (filters.filterspec) url += `&project_speciality=${filters.filterspec}`;
      if (filters.filter_istaken) url += `&project_taken=${filters.filter_istaken}`;
      if (filters.filter_dateregister) url += `&project_date_register=${filters.filter_dateregister}`;

      const res = await axios.get(url);

      if (res.data && Array.isArray(res.data.results)) {
        setSupstages(res.data.results);
      } else {
        console.error("No data found.");
      }
    } catch (error) {
      console.error("Error fetching supstages:", error);
    }
  }

  async function fetchSupStagesFromHome() {
    try {
      let url = `http://localhost:8000/api/supstage/?page=${currentPage}&Role=Admin&project_taken=${false}`;

      // Add filters
      if (filters.filtermainsupfirstname) url += `&supervisor_first_name=${filters.filtermainsupfirstname}`;
      if (filters.filtermainsuplastname) url += `&supervisor_last_name=${filters.filtermainsuplastname}`;
      if (filters.filterdomain) url += `&project_domain=${filters.filterdomain}`;
      if (filters.filtertitle) url += `&project_title=${filters.filtertitle}`;
      if (filters.filterspec) url += `&project_speciality=${filters.filterspec}`;
      if (filters.filter_dateregister) url += `&project_date_register=${filters.filter_dateregister}`;

      const res = await axios.get(url);

      if (res.data && Array.isArray(res.data.results)) {
        setSupstages(res.data.results);
      } else {
        console.error("No data found.");
      }
    } catch (error) {
      console.error("Error fetching supstages:", error);
    }
  }


  useEffect(() => {
    if (is_taken === "false") {
      fetchSupStagesFromHome();
    } else {
      fetchSupStages();
    }
  }, [is_taken, filters, currentPage]);



  function handleInputChange(e) {
    const { name, value } = e.target;
    setSearchValues(prev => ({ ...prev, [name]: value }));
  }

  function applyFilter() {
    setFilters(searchValues);
  }

  function handlePageClick(data) {
    setCurrentPage(data.selected + 1);
  }

  return (
    <div>
      <div className="d-flex align-items-center">
        <h4 style={{ margin: "10px" }}>
          Click the button to add a new Project to the system
          <Link to={`/admin-dashboard/Add-project/`}>
            <button type="button" className="btn add-btn ">
              <span style={{ margin: "10px" }}>ADD New</span>
              <FaPlus size={24} color="#fff" />
            </button>
          </Link>
        </h4>
      </div>
      <div>
        <form autoComplete="off" method="post" action="" className="p-3">
          <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
            {/* First Name */}
            <div style={{ width: '250px' }}>
              <label htmlFor="filtermainsupfirstname" className="filter-content">Supervisor Last Name:</label>
              <input type="text" className="form-control" id="filtermainsupfirstname" name="filtermainsupfirstname" onChange={handleInputChange} />
            </div>

            {/* Last Name */}
            <div style={{ width: '250px' }}>
              <label htmlFor="filtermainsuplastname" className="filter-content">Supervisor First Name:</label>
              <input type="text" className="form-control" id="filtermainsuplastname" name="filtermainsuplastname" onChange={handleInputChange} />
            </div>

            {/* Domain */}
            <div style={{ width: '250px' }}>
              <label htmlFor="filterdomain" className="filter-content">Domain:</label>
              <input type="text" className="form-control" id="filterdomain" name="filterdomain" onChange={handleInputChange} />
            </div>

            {/* Title */}
            <div style={{ width: '250px' }}>
              <label htmlFor="filtertitle" className="filter-content">Title:</label>
              <input type="text" className="form-control" id="filtertitle" name="filtertitle" onChange={handleInputChange} />
            </div>

            {/* Speciality */}
            <div style={{ width: '250px' }}>
              <label htmlFor="spec" className="filter-content">Speciality:</label>
              <input type="text" className="form-control" id="spec" name="filterspec" onChange={handleInputChange} />
            </div>

            {/* Project is Taken */}
            <div style={{ width: '250px' }}>
              <label htmlFor="filterprojectistaken" className="filter-content">Project is Taken:</label>
              <div className="d-flex align-items-center">
                <input type="radio" id="takenYes" name="filter_istaken" value="true" checked={searchValues.filter_istaken === "true"} onChange={handleInputChange} />
                <label htmlFor="takenYes" className="ms-1 me-3">Yes</label>
                <input type="radio" id="takenNo" name="filter_istaken" value="false" checked={searchValues.filter_istaken === "false"} onChange={handleInputChange} />
                <label htmlFor="takenNo" className="ms-1">No</label>
              </div>
            </div>

            {/* Date Register */}
            <div style={{ width: '250px' }}>
              <label htmlFor="dateregister" className="filter-content">Date_register:</label>
              <DatePicker
                selected={searchValues.filter_dateregister ? new Date(searchValues.filter_dateregister) : null}
                onChange={(date) => {
                  const formatted = date ? date.toISOString().split("T")[0] : "";
                  setSearchValues(prev => ({
                    ...prev,
                    filter_dateregister: formatted,
                  }));
                }}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
            </div>

            {/* Search Button (full width row) */}
            <div className="w-100 text-center ">
              <button type="button" className="btn btn-primary px-4" onClick={applyFilter}>
                <FaSearch className="me-2" /> Search
              </button>
            </div>
          </div>
        </form>

      </div>
      <div>
        <div className="sub-main " >
          <Table striped="columns" bordered style={{ width: "80vw" }}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">Domain</th>
                <th scope="col">Speciality</th>
                <th scope="col" style={{ width: "300px" }}>Title</th>
                <th scope='col'>Date_register</th>
                <th scope="col">Project-taken</th>
                <th scope="col">Main Supervisor</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {Supstages.map(supstage => (
                <tr key={supstage.id}>
                  <td>{supstage.project_Domain}</td>
                  <td>{supstage.project_Speciality}</td>
                  <td>{supstage.project_title}</td>
                  <td>{supstage.project_date_register}</td>
                  <PrisIcon Pris={supstage.project_is_taken} />
                  <td>{supstage.supervisor_name}</td>

                  <td>
                    <span className="icon me-2" title="Modify"><Link to={`/admin-dashboard/Modifier-stage?stage=${supstage.stage}`}><FaPenToSquare /></Link></span>
                    <span className="icon me-2" title="details"><Link to={`/admin-dashboard/DetailsStage?stage=${supstage.stage}`}><FaInfoCircle /></Link></span>
                    <span className='icon' title="Delete" >
                      <TiUserDeleteOutline style={{ color: "red", cursor: "pointer" }} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={{ display: "flex", justifyContent: "center", marginLeft: "210px" }}>

            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={1}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-center'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              activeClassName={'active'}
            />


          </div>
        </div>

      </div>

    </div>
  );
}

export default StageTest;

