import React from 'react';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PrisIcon = ({ stagePris }) => {
  return (
    <td>
      {stagePris==='True' ? (
        <FaCheckCircle style={{ color: "green" }} />
      ) : (
        <FaTimesCircle style={{ color: "red" }} />
      )}
    </td>
  );
};

export default PrisIcon;
