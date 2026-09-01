import { useState } from 'react';
import { Bell, Info, CheckCircle, AlertCircle } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Application Received',
      message: 'Your application for PMSSS Merit Scholarship has been received successfully.',
      time: '2 hours ago',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Profile Updated',
      message: 'Your personal information was updated successfully.',
      time: '1 day ago',
      type: 'success',
      read: true
    }
  ]);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-success" size={20} />;
      case 'error': return <AlertCircle className="text-error" size={20} />;
      case 'warning': return <AlertCircle className="text-warning" size={20} />;
      default: return <Info className="text-primary" size={20} />;
    }
  };

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h2>Notifications</h2>
        <button className="btn-text">Mark all as read</button>
      </div>

      <div className="card notifications-list">
        {notifications.length > 0 ? notifications.map(notif => (
          <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
            <div className="notification-icon">
              {getIcon(notif.type)}
            </div>
            <div className="notification-content">
              <div className="notification-title-row">
                <h4>{notif.title}</h4>
                <span className="notification-time">{notif.time}</span>
              </div>
              <p className="notification-message">{notif.message}</p>
            </div>
          </div>
        )) : (
          <div className="empty-notifications">
            <Bell size={48} className="text-light mb-1" />
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
