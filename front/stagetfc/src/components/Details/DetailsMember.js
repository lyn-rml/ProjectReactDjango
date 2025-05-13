import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card, Table, Modal, Form, Button } from 'react-bootstrap';
import PrisIcon from '../../mycomponent/truefalseicon';
import { BsCalendarDate } from 'react-icons/bs';

function MembreDetails() {
  const [searchparams] = useSearchParams();
  const id = searchparams.get('member');
  const [membre, setMembre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [receiptModal, setReceiptModal] = useState({ show: false, message: '' });
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

  function fetchPaymentHistory() {
    axios.get(`http://localhost:8000/api/payment-history/?Id_Membre=${id}`)
      .then(res => {
        setPaymentHistory(res.data.results || []);
      })
      .catch(error => {
        console.error('Error fetching payment history:', error);
      });
  }

  useEffect(() => {
    fetchPaymentHistory();
  }, [id]);

  const handleGenerateAndSave = async () => {
    try {
      const receiptResponse = await axios.get(`http://localhost:8000/api/generate-receipt/${id}/`);
      const { pdf_url } = receiptResponse.data;

      if (!pdf_url) {
        alert("Failed to generate receipt.");
        return;
      }

      const paymentResponse = await axios.post('http://localhost:8000/api/add-payment/', {
        member_id: id,
        payment_pdf_path: pdf_url,
        amount: '100',
      });

      if (paymentResponse.data.success) {
        setReceiptModal({ show: true, message: "Payment successfully recorded and receipt generated." });
      } else {
        setReceiptModal({ show: true, message: "Failed to save payment history." });
      }
      fetchPaymentHistory();
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("An error occurred while processing payment.");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleReplacePDF = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setUploadModal(true);
  };

  const handleSubmitFile = async () => {
    if (!selectedFile || !selectedPaymentId) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("Payment_received_PDF_with_signature", selectedFile);
    formData.append("payment_id", selectedPaymentId);

    try {
      const response = await axios.patch(`http://localhost:8000/api/payment-history/${selectedPaymentId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

   
        setUploadModal(false);
        setSelectedFile(null);
        setSelectedPaymentId(null);
        fetchPaymentHistory();
    
    } catch (error) {
      console.error('Error updating payment PDF:', error);
      alert("Error updating PDF.");
    }
  };

  return (
    <div className="start">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {membre && (<h3 className="mb-4 text-warning">{membre.Nom} Member Details</h3>)}
        <button className="btn btn-primary" onClick={handleGenerateAndSave}>
          Generate Receipt & Save Payment
        </button>
      </div>

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
              <Table bordered  responsive>
                <thead className="table-warning">
                  <tr>
                   
                    <th> Payment Date</th>
                    <th> Next Payment Date</th>
                    <th>Payed</th>
                    <th>PDF</th>
                    {paymentHistory.some(p => !p.Payment_received_PDF_with_signature) && <th>Replace PDF</th>}
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      
                      <td>{payment.Payment_date}</td>
                      <td>{payment.Next_Payment_date}</td>
                      <td><PrisIcon Pris={payment.payed} /></td>
                      <td>
                        <a href={payment.Payment_received_PDF_with_signature || payment.Payment_received_PDF} target="_blank" rel="noopener noreferrer">
                          View PDF
                        </a>
                      </td>
                      {!payment.Payment_received_PDF_with_signature && (
                        <td>
                          <Button variant="warning" onClick={() => handleReplacePDF(payment.id)}>
                            Replace PDF
                          </Button>
                        </td>
                      )}
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

      {/* Receipt Status Modal */}
      <Modal show={receiptModal.show} onHide={() => setReceiptModal({ show: false, message: '' })}>
        <Modal.Header closeButton>
          <Modal.Title>Receipt Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{receiptModal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setReceiptModal({ show: false, message: '' })}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Upload/Replace PDF Modal */}
      <Modal show={uploadModal} onHide={() => setUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload New PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select New Signed PDF</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setUploadModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSubmitFile}>Upload & Replace</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MembreDetails;
