import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import api from '../services/api';
import '../Style/ReptileEditModal.css'; 

const ReptileEditModal = ({ show, handleClose, reptile, setReptiles }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    morph: '',
    image: '',
    birthDate: '',
    growthRecords: [],
    healthRecords: [],
  });

  const [image, setImage] = useState(null); 
  const [errorMessage, setErrorMessage] = useState('');  
    useEffect(() => {
    if (reptile) {
      setFormData({
        name: reptile.name || '',
        species: reptile.species || '',
        morph: reptile.morph || '',
        birthDate: reptile.birthDate || '',
        growthRecords: reptile.growthRecords || [],
        healthRecords: reptile.healthRecords || [],
      });

    }
  }, [reptile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Il file deve essere un\'immagine nei formati .jpeg, .jpg o .png');
        setImage(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('L\'immagine non può superare i 5MB');
        setImage(null);
        return;
      }

      setErrorMessage(''); 
      setImage(file); 
    }
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

    try {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('species', formData.species);
      formDataToSubmit.append('morph', formData.morph);
      formDataToSubmit.append('birthDate', formData.birthDate);

      if (image) {
        formDataToSubmit.append('image', image);
      }

      formData.growthRecords.forEach((record, index) => {
        formDataToSubmit.append(`growthRecords[${index}][date]`, record.date);
        formDataToSubmit.append(`growthRecords[${index}][weight]`, record.weight);
        formDataToSubmit.append(`growthRecords[${index}][length]`, record.length);
      });

      formData.healthRecords.forEach((record, index) => {
        formDataToSubmit.append(`healthRecords[${index}][date]`, record.date);
        formDataToSubmit.append(`healthRecords[${index}][note]`, record.note);
        formDataToSubmit.append(`healthRecords[${index}][vetVisit]`, record.vetVisit);
      });

      const { data } = await api.put(`/reptile/${reptile._id}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      setReptiles((prevReptiles) =>
        prevReptiles.map((r) => (r._id === data._id ? data : r))
      );
      handleClose();
    } catch (err) {
      console.error('Error editing reptile:', err);
      setErrorMessage('Errore durante la modifica del rettile');
    }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Modifica Rettile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Inserisci il nome del rettile"
              value={formData.name || ''}
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
              value={formData.species || ''}
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
              placeholder="Inserisci il morph"
              value={formData.morph || ''}
              onChange={handleChange}
              className="input-custom"
            />
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Immagine</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
              className="input-custom"
            />
            {image && <div style={{ marginTop: '10px' }}>File selezionato: {image.name}</div>}
          </Form.Group>

          <Form.Group controlId="birthDate">
            <Form.Label>Data di nascita</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate ? formData.birthDate.split('T')[0] : ''}
              onChange={handleChange}
              className="input-custom"
            />
          </Form.Group>

          <hr />

          <h5 className="section-title">Record di Crescita</h5>
          {formData.growthRecords.map((record, index) => (
            <Row key={index}>
              <Col md={4}>
                <Form.Group controlId={`growthDate${index}`}>
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={record.date ? record.date.split('T')[0] : ''}
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
                    value={record.weight || ''}
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

          <h5 className="section-title">Record di Salute</h5>
          {formData.healthRecords.map((record, index) => (
            <Row key={index}>
              <Col md={4}>
                <Form.Group controlId={`healthDate${index}`}>
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={record.date ? record.date.split('T')[0] : ''}
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
                    value={record.vetVisit ? record.vetVisit.split('T')[0] : ''}
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

          <div className="d-grid gap-2 mt-4">
            <Button variant="primary" type="submit" className="btn-save-custom">
              Salva Modifiche
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReptileEditModal;