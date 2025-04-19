import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
function DeleteStagestagiaire() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stageId = searchParams.get('stage');
  let sujetPris = searchParams.get('sujet_pris');

  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch interns for the given stage
  useEffect(() => {
    async function fetchInterns() {
      try {
        const res = await axios.get(`http://localhost:8000/api/stagestagiaire/?stage__id=${stageId}`);
        setInterns(res.data.results);
      } catch (error) {
        console.error('Error fetching interns:', error);
        setInterns([]);
      }
    }

    fetchInterns();
  }, [stageId]);

  // Open confirmation modal
  const handleShowModal = (intern) => {
    setSelectedIntern(intern);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIntern(null);
  };

  // Confirm delete and call API
  const handleConfirmDelete = async () => {
    try {
      // Delete selected intern
      await axios.delete(`http://localhost:8000/api/stagestagiaire/${selectedIntern.id}/`);
  
      // Filter out the deleted intern from state
      const updatedInterns = interns.filter(i => i.id !== selectedIntern.id);
      setInterns(updatedInterns);
  
      // If only one intern was present before deletion
      if (interns.length === 1) {
        await axios.patch(`http://localhost:8000/api/Stages/${stageId}/`, {
          sujet_pris: true
        });
        alert("Intern deleted and sujet_pris updated!");
      } else {
        alert("Intern deleted successfully.");
      }
  
      handleCloseModal();
    } catch (error) {
      alert("Failed to delete intern or update sujet_pris.");
      console.error(error);
    }
  };
  
  function  finish(){
 // Navigate after deletion
 navigate(`/Modify-project-stagiers?stage=${stageId}&sujet_pris=${sujetPris}`);
  }
  return (
    <div className="Add-modify">
      <div className="Add-modify-container form-add-modify">
        <div className="top-add-modify ">
          <h2 className="title-add-modify">Delete interns from the project:</h2>
        </div>

        <div className="form-group add-modif p-3 d-flex align-items-center">
          <table className="table table-striped table-bordered bg-white">
            <thead className="table-light">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(interns) && interns.length > 0 ? (
                interns.map((intern) => (
                  <tr key={intern.id}>
                    <td>{intern.stagiaire_prenom}</td>
                    <td>{intern.stagiaire_nom}</td>
                    <td>{intern.email}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleShowModal(intern)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-3">
                    No interns found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <input
                type="button"
                className="form-control add-btn-2"
                value="Finish"
                onClick={finish}
              />
        </div>

        {/* Bootstrap Confirmation Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete{' '}
            <strong>
              {selectedIntern?.stagiaire_prenom} {selectedIntern?.stagiaire_nom}
            </strong>
            ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default DeleteStagestagiaire;
