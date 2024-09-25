import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/Register.css'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/register`, { name, email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Errore durante la registrazione.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/login-google`;
  };


  return (
    <div className="register-container">
      <div className="card p-4 shadow-lg register-card">
        <h2 className="text-center mb-4">Crea il tuo account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Inserisci il tuo nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Inserisci una password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Registrati</button>
        </form>

        <hr className="my-4" />

        <button className="btn btn-outline-danger w-100 mb-3" onClick={handleGoogleLogin}>
          <i className="bi bi-google me-2"></i>Registrati con Google
        </button>

        <p className="text-center">
        <Link to="/login" className="btn btn-link">Hai un account? Accedi qui</Link>
      </p>

      </div>
    </div>
  );
};
export default Register;
