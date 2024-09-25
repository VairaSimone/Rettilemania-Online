import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import api from '../services/api';
import { Modal, Button, Badge } from 'react-bootstrap';
import Notifications from './Notifications';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice'; 
import { useNavigate } from 'react-router-dom';
import '../Style/Navbar.css'; 

const Navbar = () => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/v1/logout', null, {
        withCredentials: true, 
      });
      dispatch(logoutUser());
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };
  const fetchNotificationsCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread/count');
      setNotificationsCount(data.unreadCount);
    } catch (err) {
      console.error('Error getting notification count:', err);
    }
  };

  useEffect(() => {
    fetchNotificationsCount();

    const intervalId = setInterval(fetchNotificationsCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">MyApp</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Button variant="light" className="notification-btn" onClick={handleShow}>
              <FaBell size={20} />
              {notificationsCount > 0 && (
                <Badge bg="danger" pill className="notification-badge">
                  {notificationsCount}
                </Badge>
              )}
            </Button>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile">Profilo</NavLink>
          </li>
          <li className="nav-item">
            <Button className="nav-link btn btn-link logout-btn" onClick={handleLogout}>Logout</Button>
          </li>
        </ul>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifiche</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Notifications onNotificationRead={fetchNotificationsCount} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Chiudi</Button>
        </Modal.Footer>
      </Modal>
    </div>
  </nav>
);
};


export default Navbar;
