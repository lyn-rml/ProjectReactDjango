import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card, Table } from 'react-bootstrap';
import PrisIcon from '../../mycomponent/truefalseicon';
import { BsCalendarDate } from 'react-icons/bs';

function MembreDetails() {
  const [searchparams] = useSearchParams();
  const id = searchparams.get('member');
  const [membre, setMembre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:8000/api/Membres/${id}/`)
      .then(res => {
        setMembre(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching member data:', error);
        setError('Error fetching member data. Please try again later.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/payment-history/?Id_Membre=${id}`)
      .then(res => {
        setPaymentHistory(res.data.results || []);
      })
      .catch(error => {
        console.error('Error fetching payment history:', error);
      });
  }, [id]);

  return (
    <div className="start">
      {membre && (<h3 className="mb-4 text-warning">{membre.Nom} Member Details</h3>)}
      <Container className="my-5" style={{ display: "flex", justifyContent: "space-around", gap: "30px" }}>
        {loading && <p>Loading member details...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {membre && !loading && !error && (
          <Card className='interns-box' style={{ width: "700px" }}>
            <Card.Body>
              <Card.Title className="mb-4">Personal Information</Card.Title>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-semibold">Name:</div>
                  <div>{membre.first_name} {membre.last_name}</div>
                </div>
                <div className="col-md-6">
                  <div className="fw-semibold">Date of Birth:</div>
                  <div>{membre.Date_of_birth}</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-semibold">Place of Birth:</div>
                  <div>{membre.Place_of_birth}</div>
                </div>
                <div className="col-md-6">
                  <div className="fw-semibold">Telephone:</div>
                  <div>{membre.phone_number}</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-semibold">Address:</div>
                  <div>{membre.Adresse}</div>
                </div>
                <div className="col-md-6">
                  <div className="fw-semibold">Blood Group:</div>
                  <div>{membre.Blood_type}</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-semibold">Profession:</div>
                  <div>{membre.profession}</div>
                </div>
                <div className="col-md-6">
                  <div className="fw-semibold">Domain:</div>
                  <div>{membre.Domaine}</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-semibold">Email:</div>
                  <div>{membre.email}</div>
                </div>
                <div className="col-md-6">
                  <div className="fw-semibold text-dark">Supervisor or no:</div>
                  <div><PrisIcon Pris={membre.is_superviser} /></div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-semibold">Other Association:</div>
                  <div><PrisIcon Pris={membre.is_another_association} /></div>
                </div>
                {membre.is_another_association && (
                  <div className="col-md-6">
                    <div className="fw-semibold">Other Association Name:</div>
                    <div>{membre.association_name}</div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        )}

        <Card className='interns-box' style={{ width: "700px" }}>
          <Card.Body>
            <Card.Title className="mb-4">Payment History</Card.Title>
            {paymentHistory.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead className="table-warning">
                  <tr>
                    <th>Name</th>
                    <th><BsCalendarDate /> Payment Date</th>
                    <th><BsCalendarDate /> Next Payment</th>
                    <th>Payed</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.first_name} {payment.last_name}</td>
                      <td>{payment.Payment_date}</td>
                      <td>{payment.Next_Payment_date}</td>
                      <td><PrisIcon Pris={payment.payed} /></td>
                      <td>
                        <a href={payment.Payment_received_PDF} target="_blank" rel="noopener noreferrer">
                          View PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No payment history found for this member.</p>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default MembreDetails;
