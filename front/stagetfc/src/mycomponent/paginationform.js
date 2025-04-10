import React from 'react';

const PageInfo = ({ index, pageNumber }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center p-2"
      style={{
        backgroundColor: '#fb9b34',
        borderRadius: '10px',
        color: 'white',
        width: '50px',
      }}
    >
      <span>{index} /</span>
      <span>{pageNumber}</span>
    </div>
  );
};

export default PageInfo;