import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useParams } from 'react-router-dom';
import '../Style/ReptileDetails.css'

const ReptileDetails = () => {
  const { reptileId } = useParams();
  const [reptile, setReptile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReptile = async () => {
      try {
        const { data } = await api.get(`/reptile/${reptileId}`);
        setReptile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading reptile details:', err);
        setLoading(false);
      }
    };

    fetchReptile();
  }, [reptileId]);

  if (loading) return <p>Caricamento...</p>;
  if (!reptile) return <p>Rettile non trovato</p>;

  return (
    <div className="container mt-4 reptile-details-container">
      <Link className="btn-back" to="/home">Torna indietro</Link>

      <h2 className="reptile-name">{reptile.name}</h2>
      <div className="reptile-info">
        <p><strong>Specie:</strong> {reptile.species}</p>
        <p><strong>Morph:</strong> {reptile.morph || 'Non specificato'}</p>
        <p><strong>Data di nascita:</strong> {new Date(reptile.birthDate).toLocaleDateString()}</p>
      </div>

      {reptile.image && (
        <div className="reptile-image">
          <img src={reptile.image} alt={reptile.name} className="img-fluid" />
        </div>
      )}

      <div className="section">
        <h3>Record di Crescita</h3>
        {reptile.growthRecords.length > 0 ? (
          <ul className="record-list">
            {reptile.growthRecords.map((record, index) => (
              <li key={index} className="record-item">
                <p><strong>Data:</strong> {new Date(record.date).toLocaleDateString()}</p>
                <p><strong>Peso:</strong> {record.weight} grammi</p>
                <p><strong>Lunghezza:</strong> {record.length} cm</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-record">Nessun record di crescita disponibile.</p>
        )}
      </div>

      <div className="section">
        <h3>Record di Salute</h3>
        {reptile.healthRecords.length > 0 ? (
          <ul className="record-list">
            {reptile.healthRecords.map((record, index) => (
              <li key={index} className="record-item">
                <p><strong>Data visita veterinaria:</strong> {new Date(record.vetVisit).toLocaleDateString()}</p>
                <p><strong>Note:</strong> {record.note || 'Nessuna nota disponibile'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-record">Nessun record di salute disponibile.</p>
        )}
      </div>
    </div>
  );
};

export default ReptileDetails;
