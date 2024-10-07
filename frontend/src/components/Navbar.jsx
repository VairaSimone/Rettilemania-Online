import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { Dropdown, Image, Badge, Modal } from 'react-bootstrap';
import api from '../services/api';
import Notifications from './Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import '../Style/Navbar.css';

const Navbar = () => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector(selectUser); 
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
        <Link className="navbar-brand" to="/">Rettilemania</Link>
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
              <button className="btn btn-light notification-btn" onClick={handleShow}>
                <FaBell size={20} />
                {notificationsCount > 0 && (
                  <Badge bg="danger" pill className="notification-badge">
                    {notificationsCount}
                  </Badge>
                )}
              </button>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/forum">Forum</NavLink>
            </li>

            <li className="nav-item">
              <Dropdown align="end">
                <Dropdown.Toggle as="div" id="dropdown-user" className="d-flex align-items-center user-dropdown">
                  <Image
                    src={user?.avatar || 'https://via.placeholder.com/40'} // Immagine dell'avatar dell'utente
                    roundedCircle
                    className="user-avatar"
                    alt="User Avatar"
                    width={40}
                    height={40}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/profile">
                    Profilo
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
            <button className="btn btn-secondary" onClick={handleClose}>
              Chiudi
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </nav>
  );
};

export default Navbar;
