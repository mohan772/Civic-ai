import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // For demonstration, we'll try to get the phone from localStorage.
  // In a production environment, this would be managed via authentication context.
  const userPhone = localStorage.getItem('userPhone') || '9876543210'; 

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${userPhone}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => n.status === 'unread').length);
    } catch (err) {
      console.warn("Notification sync error");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [userPhone]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, status: 'read' } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn("Read state update error");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">CivicCare AI</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">City Dashboard</Link></li>
        <li><Link to="/submit">Report Issue</Link></li>
        <li><Link to="/status">Status</Link></li>
        
        {/* Requirement 8: Notification Dropdown & Bell */}
        <li className="notification-wrapper">
          <div className="bell-icon" onClick={() => setShowDropdown(!showDropdown)}>
            🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>
          {showDropdown && (
            <div className="notification-dropdown">
              <h3>Civic Alerts</h3>
              {notifications.length === 0 ? (
                <p className="no-notif">No new alerts</p>
              ) : (
                <div className="notif-list">
                  {notifications.map(n => (
                    <div 
                      key={n._id} 
                      className={`notif-item ${n.status}`}
                      onClick={() => markAsRead(n._id)}
                    >
                      <p>{n.message}</p>
                      <small>{new Date(n.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </li>

        <li><Link to="/admin">Admin</Link></li>
        <li><Link to="/authority">Official</Link></li>
      </ul>

      <style>{`
        .notification-wrapper { position: relative; cursor: pointer; display: flex; align-items: center; }
        .bell-icon { font-size: 1.2rem; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 50%; transition: background 0.3s; }
        .bell-icon:hover { background: rgba(0,0,0,0.05); }
        .badge { position: absolute; top: -2px; right: -2px; background: #e74c3c; color: white; font-size: 0.65rem; padding: 1px 5px; border-radius: 10px; font-weight: 800; border: 2px solid white; }
        .notification-dropdown { position: absolute; top: 100%; right: 0; background: white; border: 1px solid #ddd; border-radius: 12px; width: 320px; max-height: 450px; overflow-y: auto; z-index: 1000; box-shadow: 0 8px 30px rgba(0,0,0,0.15); margin-top: 10px; }
        .notification-dropdown h3 { font-size: 0.9rem; padding: 12px 16px; margin: 0; border-bottom: 1px solid #eee; background: #fcfcfc; color: #666; font-weight: 700; }
        .notif-list { padding: 0; }
        .notif-item { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; cursor: pointer; }
        .notif-item:hover { background: #f8f9fa; }
        .notif-item.unread { border-left: 4px solid #646cff; background: #f0f7ff; }
        .notif-item p { margin: 0 0 6px 0; font-size: 0.85rem; color: #333; line-height: 1.5; }
        .notif-item small { color: #999; font-size: 0.7rem; }
        .no-notif { padding: 30px 20px; text-align: center; color: #bbb; font-size: 0.85rem; font-style: italic; }
      `}</style>
    </nav>
  );
};

export default Navbar;
