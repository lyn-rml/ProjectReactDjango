import React from 'react';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PrisIcon = ({ Pris }) => {
  const isTrue = Pris === 'True' || Pris === true || Pris === 'true';
  
  return (
    <td>
      <div 
        style={{
          backgroundColor: isTrue ? 'orange' : 'blue',
          color: 'white',
          borderRadius: '5px',
          padding: '5px 10px',
          textAlign: 'center',
          display: 'inline-block',
        }}
      >
        {isTrue ? (
          <>
            <FaCheckCircle style={{ color: 'white', marginRight: '5px' }} />
          
          </>
        ) : (
          <>
            <FaTimesCircle style={{ color: 'white', marginRight: '5px' }} />
          
          </>
        )}
      </div>
    </td>
  );
};

export default PrisIcon;
