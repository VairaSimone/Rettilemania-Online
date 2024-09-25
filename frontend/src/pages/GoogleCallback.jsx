import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginUser } from '../features/userSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);

      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
        .then((res) => {
          dispatch(loginUser(res.data));
          navigate('/home');
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          alert('Error retrieving user data.');
        });
    } else {
      console.error('Token not found');
    }
  }, [navigate, dispatch]);

  return (
    <div className="container">
      <h2>Login in corso...</h2>
    </div>
  );
};

export default GoogleCallback;
