import React from 'react';
import { FaChevronDown } from "react-icons/fa";
const StatCard = ({ count, message, href, count2, message2 }) => {
  const hasSecondary = count2>=0 && message2;

  return (
    <div
      className="card shadow-sm border-0"
      style={{
        width: '280px',
        height: hasSecondary ? '220px' : '200px',
        borderEndEndRadius: '50px',
        borderBottomLeftRadius: '70px',
        borderTopRightRadius: '50px',
        backgroundColor: '#f8f9fa',
        padding: '10px',
      }}
    >
      <div className="card-body d-flex flex-column justify-content-center position-relative">
        <div className="d-flex align-items-center mb-3 justify-content-center">
          <h2
            className="fw-bold me-3 mb-0"
            style={{
              color: '#76ABDD',
              fontSize: hasSecondary ? '2.5rem' : '4rem',
              textAlign: 'center',
            }}
          >
            {count}
          </h2>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '20px',
              backgroundColor: '#76ABDD',
            }}
          >
            <a href={href} style={{ color: '#fff' }}>
<FaChevronDown/>
         
            </a>
          </div>
        </div>
        <p
          className="text-muted fw-medium text-center mb-2"
          style={{ fontSize: hasSecondary ? '0.9rem' : '1rem' }}
        >
          {message}
        </p>

        {/* Secondary stat section */}
        {hasSecondary && (
          <>
            <hr className="my-2" />
            <h4
              className="text-center fw-bold"
              style={{ color: '#76ABDD', fontSize: '1.8rem' }}
            >
              {count2}
            </h4>
            <p className="text-muted fw-medium text-center mb-0" style={{ fontSize: '0.9rem' }}>
              {message2}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default StatCard;
