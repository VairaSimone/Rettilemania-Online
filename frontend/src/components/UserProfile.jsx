import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../Style/UserProfile.css'; 

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/api/v1/me');
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setAvatar(data.avatar);
      } catch (err) {
        setError('Errore nel caricamento del profilo utente');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/user/${user._id}`, {
        name,
        email,
        password,
        avatar,
      });
      setUser(data);
      setError('');
    } catch (err) {
      setError('Errore nell\'aggiornamento del profilo');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/user/${user._id}`);
      dispatch(logoutUser());
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      setError('Errore durante l\'eliminazione dell\'account');
    }
  };

  if (!user) {
    return <div>Caricamento profilo...</div>;
  }

  return (

    <div className="container profile-container mt-5">
    <div className="card p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="profile-title">Profilo Utente</h2>
        <Link className="btn btn-outline-secondary" to="/home">Torna indietro</Link>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="text-center mb-4">
        <img src={avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="rounded-circle profile-avatar mb-3" />
        <h5>{name}</h5>
        <p className="text-muted">{email}</p>
      </div>

      <form onSubmit={handleUpdateProfile} className="mb-5">
        <div className="mb-3">
          <label>Nome</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Cambia la tua password"
          />
        </div>
        <div className="mb-3">
          <label>Avatar (URL)</label>
          <input
            type="text"
            className="form-control"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Inserisci l'URL del tuo avatar"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Aggiorna Profilo</button>
      </form>

      <hr />

      <h3 className="text-danger">Elimina Account</h3>
      <p className="text-danger">Attenzione! Questa azione è irreversibile.</p>
      <button className="btn btn-danger w-100" onClick={handleDeleteAccount}>
        Elimina Account
      </button>
    </div>
  </div>
);
};
export default UserProfile;
