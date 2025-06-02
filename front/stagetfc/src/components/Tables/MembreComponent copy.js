import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import PrisIcon from '../../mycomponent/truefalseicon';
import { TiUserDeleteOutline } from "react-icons/ti";
import { FaPenToSquare } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../mycomponent/confirmmodal'
import { FaArrowRight } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { FaAngleDoubleUp } from 'react-icons/fa';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { Pagination } from "react-bootstrap";
import { FaTimes, FaCheck } from 'react-icons/fa';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
function MembreComponentTest() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const A_payee = queryParams.get("A_paye");
  const [currentPage, setCurrentPage] = useState(1);

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


  const fetchData = async () => {

    try {
      let url = `http://localhost:8000/api/Membres/?page=${currentPage}&first_name__icontains=${filters.filtermemberfirstname}&last_name__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}`;
      url += `&member_payed=${filters.filterapaye}`;

      const res = await axios.get(url);
      const results = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSupstages(results);

      setTotalCount(res.data.count);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  const fetchDataFromHome = async () => {

    try {
      let url = `http://localhost:8000/api/Membres/?page=${currentPage}&first_name__icontains=${filters.filtermemberfirstname}&last_name__icontains=${filters.filtermemberlastname}&Adresse__icontains=${filters.filteradress}`;
      //first_name__icontains=&last_name__icontains=&email__icontains=&phone_number__icontains=&Adresse__icontains=ff&profession__icontains=&is_sup=unknown&member_payed=unknown

      url += `&member_payed=false`;




      const res = await axios.get(url);
      const results = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSupstages(results);

      setTotalCount(res.data.count);
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
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
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
        if (A_payee === 'false') {
          fetchDataFromHome()
        } else {
          fetchData();
        }

      })
      .catch((error) => alert(error));
  }
  useEffect(() => {
    if (A_payee === 'false') {
      fetchDataFromHome()
    } else {
      fetchData();
    }

  }, [A_payee, filters, currentPage]);


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
                    <label className="form-check-label text-white" htmlFor="payedYes"><FaCheck style={{ color: 'white' }} /></label>
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
                    <label className="form-check-label text-white" htmlFor="payedNo"><FaTimes style={{ color: 'white' }} /></label>
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
              <td colSpan="12">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Display current page info */}
                  <span>
                    Showing {totalCount === 0 ? 0 : (indexOfFirstRow + 1)} to {Math.min(indexOfLastRow, totalCount)} of {totalCount} entries
                  </span>

                  <Pagination className="justify-content-center mt-4">
                    {/* Previous button */}
                    <Pagination
                      onClick={() => handlePageChange(1)}

                    >
                      <button className="page-link"
                      >
                        <FaAngleDoubleLeft /> </button>
                    </Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaArrowLeft />
                    </Pagination.Prev>


                    {/* Next button */}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <FaArrowRight />
                    </Pagination.Next>
                    <Pagination
                      onClick={() => handlePageChange(totalPages)}

                    >
                      <button className="page-link"
                      >
                        <FaAngleDoubleRight /> </button>
                    </Pagination>
                  </Pagination>
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
