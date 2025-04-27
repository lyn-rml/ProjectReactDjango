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
import { Pagination } from "react-bootstrap";

import { useSearchParams } from "react-router-dom";
function StageTest() {
  const [Supstages, setSupstages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const rowsPerPage = 5;
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
        setTotalPages(res.data.total_pages);
        setTotalCount(res.data.total_count);
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


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = indexOfFirstRow + rowsPerPage;
  return (
    <div className="container my-4">
    {/* Add New Button */}
   
  
    {/* Filter Form */}
 
    <form autoComplete="off" method="post" action="">
  <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

  {/* First Row: Filters + Buttons */}
  <div className="row g-3 align-items-start">
    {/* Left side: Filter Inputs */}
    <div className="col-md-10">
      <div className="row g-3">
        {/* Supervisor Last Name */}
        <div className="col-md-4" style={{width:"250px"}}>
          <input type="text" className="form-control" id="filtermainsupfirstname" name="filtermainsupfirstname" onChange={handleInputChange} placeholder='Supervisor Last Name'  />
        </div>

        {/* Supervisor First Name */}
        <div className="col-md-4"style={{width:"250px"}}>

          <input type="text" className="form-control" id="filtermainsuplastname" name="filtermainsuplastname" onChange={handleInputChange} placeholder='Supervisor First Name' />
        </div>

        {/* Domain */}
        <div className="col-md-4"style={{width:"250px"}}>
          <input type="text" className="form-control" id="filterdomain" name="filterdomain" onChange={handleInputChange} placeholder='Domain' />
        </div>

        {/* Title */}
        <div className="col-md-4"style={{width:"250px"}}>
          <input type="text" className="form-control" id="filtertitle" name="filtertitle" onChange={handleInputChange} placeholder='Title'/>
        </div>

        {/* Speciality */}
        <div className="col-md-4"style={{width:"250px"}}>
          <input type="text" className="form-control" id="spec" name="filterspec" onChange={handleInputChange} placeholder='Speciality' />
        </div>

        {/* Project is Taken */}
        <div className="col-md-4" style={{width:"300px"}}>
          <label className="form-label text-white">Project is Taken : </label>
          <div className="form-check form-check-inline" style={{margin:"10px"}}>
            <input className="form-check-input" type="radio" id="takenYes" name="filter_istaken" value="true" checked={searchValues.filter_istaken === "true"} onChange={handleInputChange} />
            <label className="form-check-label" htmlFor="takenYes">Yes</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" id="takenNo" name="filter_istaken" value="false" checked={searchValues.filter_istaken === "false"} onChange={handleInputChange} />
            <label className="form-check-label" htmlFor="takenNo">No</label>
          </div>
        </div>

        {/* Date Register */}
        <div className="col-md-4">
          <DatePicker
            selected={searchValues.filter_dateregister ? new Date(searchValues.filter_dateregister) : null}
            onChange={(date) => {
              const formatted = date ? date.toISOString().split("T")[0] : "";
              setSearchValues(prev => ({ ...prev, filter_dateregister: formatted }));
            }}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText='Date Register'
          />
        </div>
      </div>
    </div>

    {/* Right side: Buttons */}
    <div className="col-md-2 d-flex flex-column justify-content-between" style={{ minHeight: '150px' }}>
      {/* Search Button (at top) */}
      <div className=" w-100">
        <button type="button" className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100" onClick={applyFilter}>
          <FaSearch className="me-2" />
          Search
        </button>
      </div>

      {/* Add New Button (at bottom) */}
      <div className="w-100">
      <button
        type="button"
        className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100"
        onClick={() => navigate('/admin-dashboard/Add-project/')}
      >
        <FaPlus size={20} className="me-2" />
        ADD New
      </button>
    </div>
    </div>
  </div>
</form>


 
  
<div>
  <Table>
    <thead className="table-primary text-center">
      <tr>
        <th>Domain</th>
        <th>Speciality</th>
        <th style={{ width: "300px" }}>Title</th>
        <th>Date Register</th>
        <th>Project Taken</th>
        <th>Main Supervisor</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody className='text-center'>
      {Supstages.map(supstage => (
        <tr key={supstage.id}>
          <td>{supstage.project_Domain}</td>
          <td>{supstage.project_Speciality}</td>
          <td>{supstage.project_title}</td>
          <td>{supstage.project_date_register}</td>
          <PrisIcon Pris={supstage.project_is_taken} />
          <td>{supstage.supervisor_name}</td>
          <td>
            <div className="d-flex gap-2">
              <Link
                to={`/admin-dashboard/Modifier-stage?stage=${supstage.id}`}
                className="btn btn-sm"
                style={{
                  color: 'black',
                  borderColor: 'black',
                }}
                onMouseEnter={(e) => e.target.style.color = 'orange'}
                onMouseLeave={(e) => e.target.style.color = 'black'}
              >
                <FaPenToSquare />
              </Link>
              <Link
                to={`/admin-dashboard/DetailsStage?stage=${supstage.id}`}
                className="btn btn-sm"
                style={{
                  color: 'black',
                  borderColor: 'black',
                }}
                onMouseEnter={(e) => e.target.style.color = 'orange'}
                onMouseLeave={(e) => e.target.style.color = 'black'}
              >
                <FaInfoCircle />
              </Link>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  color: 'black',
                  borderColor: 'black',
                }}
                onMouseEnter={(e) => e.target.style.color = 'orange'}
                onMouseLeave={(e) => e.target.style.color = 'black'}
              >
                <TiUserDeleteOutline />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan="7">
          <div className="d-flex justify-content-between align-items-center">
            {/* Display current page info */}
            <p className="mb-0">
              Showing {indexOfFirstRow + 1} to {indexOfLastRow} of {totalCount} entries
            </p>

            {/* Pagination Controls */}
            <nav>
              <ul className="pagination mb-0">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Number Buttons */}
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </td>
      </tr>
    </tfoot>
  </Table>
</div>

  
      
    </div>

  

  

  );
}

export default StageTest;

