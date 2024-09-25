import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import '../Style/ReptileCreateModal.css';

const ReptileCreateModal = ({ show, handleClose, setReptiles, onSuccess }) => {
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    morph: '',
    image: null,
    birthDate: '',
    growthRecords: [{ date: '', weight: '', length: '' }],
    healthRecords: [{ date: '', note: '', vetVisit: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleGrowthChange = (index, e) => {
    const { name, value } = e.target;
    const growthRecords = [...formData.growthRecords];
    growthRecords[index][name] = value;
    setFormData({ ...formData, growthRecords });
  };

  const addGrowthRecord = () => {
    setFormData({
      ...formData,
      growthRecords: [
        ...formData.growthRecords,
        { date: '', weight: '', length: '' },
      ],
    });
  };

  const handleHealthChange = (index, e) => {
    const { name, value } = e.target;
    const healthRecords = [...formData.healthRecords];
    healthRecords[index][name] = value;
    setFormData({ ...formData, healthRecords });
  };

  const addHealthRecord = () => {
    setFormData({
      ...formData,
      healthRecords: [
        ...formData.healthRecords,
        { date: '', note: '', vetVisit: '' },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append('name', formData.name);
    formDataToSend.append('species', formData.species);
    formDataToSend.append('morph', formData.morph);
    formDataToSend.append('birthDate', formData.birthDate);
    formDataToSend.append('user', user._id);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    formDataToSend.append('growthRecords', JSON.stringify(formData.growthRecords));
    formDataToSend.append('healthRecords', JSON.stringify(formData.healthRecords));

    try {
      const { data } = await api.post('/reptile/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setReptiles((prevReptiles) => [...prevReptiles, data]);

      handleClose();

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error('Error creating reptile:', err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Crea un nuovo rettile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Inserisci il nome del rettile"
              value={formData.name}
              onChange={handleChange}
              className="input-custom"
              required
            />
          </Form.Group>

          <Form.Group controlId="species">
            <Form.Label>Specie</Form.Label>
            <Form.Control
              type="text"
              name="species"
              placeholder="Inserisci la specie del rettile"
              value={formData.species}
              onChange={handleChange}
              className="input-custom"
              required
            />
          </Form.Group>

          <Form.Group controlId="morph">
            <Form.Label>Morph</Form.Label>
            <Form.Control
              type="text"
              name="morph"
              placeholder="Inserisci il morph (opzionale)"
              value={formData.morph}
              onChange={handleChange}
              className="input-custom"
            />
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Immagine</Form.Label>
            <Form.Control
              type="file"
              name="image"
              placeholder="Inserisci l'immagine (opzionale)"
              onChange={handleFileChange}
              className="input-custom"
            />
          </Form.Group>

          <Form.Group controlId="birthDate">
            <Form.Label>Data di nascita</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="input-custom"
            />
          </Form.Group>

          <hr />

          <h5>Record di Crescita</h5>
          {formData.growthRecords.map((record, index) => (
            <Row key={index}>
              <Col md={4}>
                <Form.Group controlId={`growthDate${index}`}>
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={record.date}
                    onChange={(e) => handleGrowthChange(index, e)}
                    className="input-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`growthWeight${index}`}>
                  <Form.Label>Peso (g)</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={record.weight}
                    onChange={(e) => handleGrowthChange(index, e)}
                    className="input-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`growthLength${index}`}>
                  <Form.Label>Lunghezza (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="length"
                    value={record.length}
                    onChange={(e) => handleGrowthChange(index, e)}
                    className="input-custom"
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addGrowthRecord} className="mt-2 btn-custom">
            Aggiungi Record di Crescita
          </Button>

          <hr />

          <h5>Record di Salute</h5>
          {formData.healthRecords.map((record, index) => (
            <Row key={index}>
              <Col md={4}>
                <Form.Group controlId={`healthDate${index}`}>
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={record.date}
                    onChange={(e) => handleHealthChange(index, e)}
                    className="input-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`healthNote${index}`}>
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    value={record.note}
                    onChange={(e) => handleHealthChange(index, e)}
                    className="input-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`healthVetVisit${index}`}>
                  <Form.Label>Visita Veterinaria</Form.Label>
                  <Form.Control
                    type="date"
                    name="vetVisit"
                    value={record.vetVisit}
                    onChange={(e) => handleHealthChange(index, e)}
                    className="input-custom"
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addHealthRecord} className="mt-2 btn-custom">
            Aggiungi Record di Salute
          </Button>

          <Button variant="primary" type="submit" className="mt-4 btn-save-custom">
            Salva Rettile
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReptileCreateModal;
