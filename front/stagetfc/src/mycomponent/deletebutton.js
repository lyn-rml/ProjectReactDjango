import React, { useState } from 'react';
import axios from 'axios';
import ConfirmModal from './confirmmodal';
import { TiUserDeleteOutline } from 'react-icons/ti';

const YourComponent = ({ projectId }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/Stages/${projectId}/`);
      console.log('Deleted successfully!');
      setShowConfirm(false);
     
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <>
      <button 
        type="button"
        className="btn btn-sm"
        style={{
          color: 'black',
          borderColor: 'black',
        }}
        onMouseEnter={(e) => e.target.style.color = 'orange'}
        onMouseLeave={(e) => e.target.style.color = 'black'}
        onClick={() => setShowConfirm(true)}
      >
        <TiUserDeleteOutline />
      </button>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to permanently delete this Project?"
      />
    </>
  );
};

export default YourComponent;
