import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import '../Style/Notifications.css'; 

const Notifications = ({ onNotificationRead }) => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const user = useSelector(selectUser);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get(`/notifications/user/${user._id}`);

      setUnreadNotifications(data.unreadNotifications || []);
      setReadNotifications(data.readNotifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}`, { read: true });
      console.log('Response from server:', response);

      const notification = unreadNotifications.find(n => n._id === notificationId);
      setUnreadNotifications(unreadNotifications.filter(n => n._id !== notificationId));
      setReadNotifications([notification, ...readNotifications]);

      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (err) {
      console.error('Error updating notification:', err);
    }
  };

  return (
    <div className="notifications-container mt-4">
      <h2 className="notifications-title">Notifiche</h2>

      <h4 className="section-title">Notifiche non lette</h4>
      {unreadNotifications.length === 0 ? (
        <p className="no-notifications">Non ci sono notifiche non lette</p>
      ) : (
        <ul className="list-group mb-4">
          {unreadNotifications.map(notification => (
            <li
              key={notification._id}
              className="list-group-item d-flex justify-content-between align-items-center unread-notification"
            >
              <div>
                <strong>{notification.type === 'feeding' ? 'Alimentazione' : 'Salute'}:</strong> {notification.message}
                <div><small>{new Date(notification.date).toLocaleDateString()}</small></div>
              </div>
              <button className="btn btn-sm btn-primary mark-as-read-btn" onClick={() => markAsRead(notification._id)}>
                Segna come letto
              </button>
            </li>
          ))}
        </ul>
      )}

      <h4 className="section-title">Ultime 5 notifiche lette</h4>
      {readNotifications.length === 0 ? (
        <p className="no-notifications">Non ci sono notifiche lette</p>
      ) : (
        <ul className="list-group">
          {readNotifications.slice(0, 5).map(notification => (
            <li
              key={notification._id}
              className="list-group-item d-flex justify-content-between align-items-center read-notification"
            >
              <div>
                <strong>{notification.type === 'feeding' ? 'Alimentazione' : 'Salute'}:</strong> {notification.message}
                <div><small>{new Date(notification.date).toLocaleDateString()}</small></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Notifications;
