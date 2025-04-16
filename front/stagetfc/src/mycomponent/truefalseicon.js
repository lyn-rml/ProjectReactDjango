import React from 'react';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PrisIcon = ({ Pris }) => {
  return (
    <td>
      {Pris==='True'|| Pris===true || Pris==='true' ? (
        <FaCheckCircle style={{ color: "green" }} />
      ) : (
        <FaTimesCircle style={{ color: "red" }} />
      )}
    </td>
  );
};

export default PrisIcon;
