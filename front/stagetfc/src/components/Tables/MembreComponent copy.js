import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import PrisIcon from '../../mycomponent/truefalseicon';

function MembreComponentTest() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const A_payee = queryParams.get("A_paye");

  const [supstages, setSupstages] = useState([]);
  const [filters, setFilters] = useState({
    filtermemberfirstname: "",
    filtermemberlastname: "",
    filteradress: "",
    filterapaye: "",
  });
  const [searchValues, setSearchValues] = useState({
    filtermemberfirstname: "",
    filtermemberlastname: "",
    filteradress: "",
    filterapaye: "",
  });
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page, applyFilter ) => {
    try {
      let url = `http://localhost:8000/api/Membres/?page=${page}&first_name__icontains=${filters.filtermemberfirstname}&last_name__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}`;
     //first_name__icontains=&last_name__icontains=&email__icontains=&phone_number__icontains=&Adresse__icontains=ff&profession__icontains=&is_sup=unknown&member_payed=unknown
      if (A_payee) {
        url += `&member_payed=false`;
      } else{
        url += `&member_payed=${filters.filterapaye}`;
      }

      const res = await axios.get(url);
      const results = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSupstages(results);
      setPageCount(Math.ceil(res.data.count / res.data.results.length));
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    setFilters(searchValues);
    setCurrentPage(1);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    fetchData(currentPage, filters);
  }, [filters, currentPage]);
  return (
    <div>
      <div className="d-flex align-items-center">
        <h4 style={{ margin: "10px" }}>
          Click the button to add a new Member
          <Link to="/admin-dashboard/Add-member">
            <button type="button" className="btn add-btn">
              <span style={{ margin: "10px" }}>Add New</span>
              <FaPlus size={24} color="blue" />
            </button>
          </Link>
        </h4>
      </div>

      {/* Filter Form */}
      <div>
        <form autoComplete="off" className="p-3">
          <div className="d-flex flex-wrap gap-3">

            <div className="form-group" style={{ width: '300px' }}>
              <label>Member last name:</label>
              <input
                type="text"
                className="form-control"
                name="filtermemberfirstname"
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ width: '300px' }}>
              <label>Member first name:</label>
              <input
                type="text"
                className="form-control"
                name="filtermemberlastname"
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ width: '300px' }}>
              <label>Address:</label>
              <input
                type="text"
                className="form-control"
                name="filteradress"
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ width: '300px' }}>
              <label>Had Payed:</label>
              <div>
                <input
                  type="radio"
                  name="filterapaye"
                  value="true"
                  checked={searchValues.filterapaye === "true"}
                  onChange={handleInputChange}
                />
                <label style={{ margin: "10px" }}>Yes</label>

                <input
                  type="radio"
                  name="filterapaye"
                  value="false"
                  checked={searchValues.filterapaye === "false"}
                  onChange={handleInputChange}
                />
                <label style={{ margin: "10px" }}>No</label>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="text-center mt-4">
            <button type="button" className="btn btn-primary px-4" onClick={applyFilter}>
              <FaSearch className="me-2" /> Search
            </button>
          </div>
        </form>
      </div>

      {/* Members Table */}
      <div className="d-flex align-items-center">
        <div className="sub-main p-2">
          <div className="table-container">
            <Table striped bordered hover style={{ width: "80vw" }}>
              <thead className="thead-dark">
                <tr>
                  <th>Id</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Has Payed</th>
                </tr>
              </thead>
              <tbody>
                {supstages.length > 0 ? (
                  supstages.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.first_name}</td>
                      <td>{member.last_name}</td>
                      <td>{member.email}</td>
                      <td>{member.phone_number}</td>
                      <td>{member.Adresse}</td>
                      <PrisIcon Pris={member.member_payed }/>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No data found</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            {pageCount > 1 && (
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembreComponentTest;
