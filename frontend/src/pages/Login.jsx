import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/userSlice';
import '../Style/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/login`, { email, password }, {
        withCredentials: true
      });
      const { accessToken } = res.data;

      localStorage.setItem('token', accessToken);

      const userRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch(loginUser(userRes.data));

      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Errore durante il login.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/login-google`;
  };

  return (
    <div className="login-container">
    <div className="card p-4 shadow-lg login-card">
      <h2 className="text-center mb-4">Accedi al tuo account</h2>

      <form onSubmit={handleSubmit}>
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
            placeholder="Inserisci la tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">Accedi</button>
      </form>

      <hr className="my-4" />

      <button className="btn btn-outline-danger w-100 mb-3" onClick={handleGoogleLogin}>
        <i className="bi bi-google me-2"></i>Accedi con Google
      </button>

      <p className="text-center">
        <Link to="/register" className="btn btn-link">Non hai un account? Registrati qui</Link>
      </p>
    </div>
  </div>
);
};
export default Login;
