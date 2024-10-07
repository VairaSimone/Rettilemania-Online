import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Pagination } from 'react-bootstrap';
import api from '../services/api';
import '../Style/FeedingModal.css';

const FeedingModal = ({ show, handleClose, reptileId, onFeedingAdded }) => {
  const [feedings, setFeedings] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    foodType: '',
    quantity: '',
    nextFeedingDate: '',
    notes: '',
    daysUntilNextFeeding: '',
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (show && reptileId) {
      fetchFeedings(page);
    }
  }, [show, reptileId, page]);

  const fetchFeedings = async (page) => {
    try {
      const { data } = await api.get(`/feedings/${reptileId}?page=${page}`);
      setFeedings(data.dati);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error loading meals:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (feedingId) => {
    try {
      await api.delete(`/feedings/${feedingId}`);
      setFeedings(feedings.filter((feeding) => feeding._id !== feedingId));
    } catch (err) {
      console.error('Error deleting meal:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/feedings/${reptileId}`, formData);
      setFeedings([...feedings, data]);
      setFormData({
        date: '',
        foodType: '',
        quantity: '',
        nextFeedingDate: '',
        notes: '',
        daysUntilNextFeeding: '',
      });
      if (onFeedingAdded) onFeedingAdded();
    } catch (err) {
      console.error('Error adding meal:', err);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Pasti dei Rettili</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="date">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-custom"
              required
            />
          </Form.Group>

          <Form.Group controlId="foodType">
            <Form.Label>Tipo di cibo</Form.Label>
            <Form.Control
              type="text"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className="input-custom"
              required
            />
          </Form.Group>

          <Form.Group controlId="quantity">
            <Form.Label>Quantità</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input-custom"
            />
          </Form.Group>

          <Form.Group controlId="daysUntilNextFeeding">
            <Form.Label>Giorni fino al prossimo pasto</Form.Label>
            <Form.Control
              type="number"
              name="daysUntilNextFeeding"
              value={formData.daysUntilNextFeeding}
              onChange={handleChange}
              className="input-custom"
              required
            />
          </Form.Group>

          <Form.Group controlId="notes">
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-custom"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3 btn-custom">
            Aggiungi Pasto
          </Button>
        </Form>

        <h5 className="mt-5 title-custom">Cronologia dei Pasti</h5>
        <div className="table-wrapper">
          <Table striped bordered hover className="table-custom">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo di Cibo</th>
                <th>Quantità</th>
                <th>Prossimo Pasto</th>
                <th>Note</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {feedings.map((feeding) => (
                <tr key={feeding._id}>
                  <td>{new Date(feeding.date).toLocaleDateString()}</td>
                  <td>{feeding.foodType}</td>
                  <td>{feeding.quantity || 'N/A'}</td>
                  <td>{new Date(feeding.nextFeedingDate).toLocaleDateString()}</td>
                  <td>{feeding.notes || 'Nessuna nota'}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(feeding._id)}
                      className="btn-delete-custom"
                    >
                      Elimina
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPages).keys()].map((x) => (
            <Pagination.Item
              key={x + 1}
              active={x + 1 === page}
              onClick={() => handlePageChange(x + 1)}
            >
              {x + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Modal.Body>
    </Modal>
  );
};

export default FeedingModal;
