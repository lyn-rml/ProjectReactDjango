import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const ConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Delete Project"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message || "Are you sure you want to permanently delete this Project?"}</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button className="custom-delete-btn" onClick={onConfirm}>
          Delete
        </Button>
        <Button className="custom-cancel-btn" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
