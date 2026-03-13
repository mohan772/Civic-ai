import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    const interval = setInterval(fetchNotifications, 15000); 
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
    <nav className="gov-navbar">
      <div className="nav-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="portal-title">Civic Intelligence Portal</span>
          </Link>
        </div>
        
        <ul className="navbar-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/submit">Complaints</Link></li>
          
          <li className="notification-wrapper">
            <div className="bell-icon" onClick={() => setShowDropdown(!showDropdown)}>
              🔔 {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </div>
            {showDropdown && (
              <div className="notification-dropdown">
                <h3>Recent Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="no-notif">No new alerts</p>
                ) : (
                  <div className="notif-list">
                    {notifications.slice(0, 5).map(n => (
                      <div 
                        key={n._id} 
                        className={`notif-item ${n.status}`}
                        onClick={() => markAsRead(n._id)}
                      >
                        <p>{n.message}</p>
                        <small>{new Date(n.createdAt).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>

          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </div>

      <style>{`
        .gov-navbar {
          background-color: var(--saffron);
          padding: 15px 0;
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          border-bottom: 4px solid var(--ashoka-blue);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .brand-link {
          text-decoration: none;
          color: white;
        }
        .portal-title {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .navbar-links {
          display: flex;
          list-style: none;
          gap: 25px;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        .navbar-links a {
          color: white;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          transition: opacity 0.2s;
        }
        .navbar-links a:hover {
          opacity: 0.8;
        }
        
        .notification-wrapper { position: relative; cursor: pointer; display: flex; align-items: center; }
        .bell-icon { font-size: 1.2rem; display: flex; align-items: center; position: relative; }
        .unread-badge { 
          position: absolute; 
          top: -8px; 
          right: -8px; 
          background: var(--ashoka-blue); 
          color: white; 
          font-size: 0.65rem; 
          padding: 2px 6px; 
          border-radius: 10px; 
          font-weight: 800; 
          border: 2px solid var(--saffron); 
        }
        .notification-dropdown { 
          position: absolute; 
          top: 45px; 
          right: 0; 
          background: white; 
          border: 1px solid #ddd; 
          border-radius: 12px; 
          width: 300px; 
          max-height: 400px; 
          overflow-y: auto; 
          z-index: 1000; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.15); 
        }
        .notification-dropdown h3 { 
          font-size: 0.9rem; 
          padding: 12px 16px; 
          margin: 0; 
          border-bottom: 1px solid #eee; 
          background: #fcfcfc; 
          color: var(--ashoka-blue); 
        }
        .notif-item { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; color: var(--dark-text); }
        .notif-item:hover { background: #f8f9fa; }
        .notif-item.unread { border-left: 4px solid var(--saffron); background: #fff9f0; }
        .notif-item p { margin: 0 0 5px 0; font-size: 0.85rem; line-height: 1.4; }
        .notif-item small { color: #999; }
        .no-notif { padding: 20px; text-align: center; color: #bbb; font-size: 0.85rem; }

        @media (max-width: 768px) {
          .nav-container { flex-direction: column; gap: 15px; }
          .portal-title { font-size: 1.2rem; }
          .navbar-links { gap: 15px; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
