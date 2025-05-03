import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import PrisIcon from '../../mycomponent/truefalseicon';
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../mycomponent/confirmmodal'
function MembreComponentTest() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const A_payee = queryParams.get("A_paye");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const rowsPerPage = 5;
  const [supstages, setSupstages] = useState([]);
  const [showModal, setShowModal] = useState(false);
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


  const fetchData = async ( ) => {
  
    try {
      let url = `http://localhost:8000/api/Membres/?page=${currentPage}&first_name__icontains=${filters.filtermemberfirstname}&last_name__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}`;
      //first_name__icontains=&last_name__icontains=&email__icontains=&phone_number__icontains=&Adresse__icontains=ff&profession__icontains=&is_sup=unknown&member_payed=unknown
      if (A_payee) {
        url += `&member_payed=false`;
      } else {
        url += `&member_payed=${filters.filterapaye}`;
      }

      const res = await axios.get(url);
      const results = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSupstages(results);
      setTotalPages(res.data.total_pages);
      setTotalCount(res.data.total_count);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  const [selectedId, setSelectedId] = useState(null);
  function confirmDelete(id) {
    setSelectedId(id);
    setShowModal(true);
  }
  function handleDeleteConfirmed() {
    axios.delete(`http://localhost:8000/api/Membres/${selectedId}/delete-member-role/`)
      .then((res) => {
        console.log(res);
        setShowModal(false);
      
      })
      .catch((error) => alert(error));
  }
  useEffect(() => {
    fetchData(currentPage, filters);
  }, [filters, currentPage]);
  const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = indexOfFirstRow + rowsPerPage;
  return (
    <div>
      <div>
        <form autoComplete="off" method="post" action="">



          <div className="row g-3 align-items-start">
            {/* Inputs côté gauche */}
            <div className="col-md-10">
              <div className="row g-3">
                {/* Nom de famille */}
                <div className="col-md-4" style={{ width: "350px" }}>
                  <input
                    type="text"
                    className="form-control"
                    name="filtermemberlastname"
                    onChange={handleInputChange}
                    placeholder="Member Last Name"
                  />
                </div>

                {/* Prénom */}
                <div className="col-md-4" style={{ width: "350px" }}>
                  <input
                    type="text"
                    className="form-control"
                    name="filtermemberfirstname"
                    onChange={handleInputChange}
                    placeholder="Member First Name"
                  />
                </div>

                {/* Adresse */}
                <div className="col-md-4" style={{ width: "350px" }}>
                  <input
                    type="text"
                    className="form-control"
                    name="filteradress"
                    onChange={handleInputChange}
                    placeholder="Address"
                  />
                </div>

                {/* A payé ? */}
                <div className="col-md-4" style={{ width: "300px" }}>
                  <label className="form-label text-white">Had Payed:</label>
                  <div className="form-check form-check-inline ms-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="filterapaye"
                      value="true"
                      checked={searchValues.filterapaye === "true"}
                      onChange={handleInputChange}
                      id="payedYes"
                    />
                    <label className="form-check-label text-white" htmlFor="payedYes">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="filterapaye"
                      value="false"
                      checked={searchValues.filterapaye === "false"}
                      onChange={handleInputChange}
                      id="payedNo"
                    />
                    <label className="form-check-label text-white" htmlFor="payedNo">No</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Côté droit : boutons */}
            <div className="col-md-2 d-flex flex-column justify-content-between" style={{ minHeight: '170px' }}>
              {/* Bouton Rechercher */}
              <div className="w-100">
                <button
                  type="button"
                  className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100"
                  onClick={applyFilter}
                >
                  <FaSearch className="me-2" />
                  Search
                </button>
              </div>

              {/* Bouton Ajouter */}
              <div className="w-100">
                <button
                  type="button"
                  className="btn btn-warning d-flex align-items-center shadow rounded-pill px-4 py-2 w-100"
                  onClick={() => navigate('/admin-dashboard/Add-member/')}
                >
                  <FaPlus size={20} className="me-2" />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </form>

      </div>

      {/* Members Table */}
      <div>
        <Table>
          <thead className="table-primary text-center">
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Has Payed</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-center">
            {supstages.length > 0 ? (
              supstages.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.first_name}</td>
                  <td>{member.last_name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone_number}</td>
                  <td>{member.Adresse}</td>
                  <PrisIcon Pris={member.member_payed} />
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/admin-dashboard/Modifier-Membre/?member=${member.id}`}
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
                        to={`/admin-dashboard/DetailsMember/?member=${member.id}`}
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
                        onClick={() => confirmDelete(member.id)}
                      >
                        <TiUserDeleteOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No data found</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="8">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Optional info display, e.g., totalCount if available */}
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

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, index) => (
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
      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDeleteConfirmed}
       
        title="Delete Member"
        message="Are you sure you want to permanently delete this Member ?"
      />
    </div>
  );
}

export default MembreComponentTest;
