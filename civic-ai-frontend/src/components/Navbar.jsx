import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const userPhone = localStorage.getItem('userPhone') || '9876543210'; 
  const isAdmin = !!localStorage.getItem('adminToken');

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  return (
    <nav className="gov-navbar">
      <div className="nav-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon">🏛️</div>
            <div className="brand-text">
              <span className="portal-title">Civic AI</span>
              <span className="portal-subtitle">Smart City Platform</span>
            </div>
          </Link>
        </div>
        
        <div className="nav-main">
          <ul className="navbar-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/submit" className="nav-link">Report Issue</Link></li>
            <li><Link to="/status" className="nav-link">Track Status</Link></li>
          </ul>

          <div className="nav-actions">
            <div className="notification-wrapper">
              <button className={`icon-btn ${unreadCount > 0 ? 'has-unread' : ''}`} onClick={() => setShowDropdown(!showDropdown)}>
                <span className="bell-icon">🔔</span>
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
              </button>
              
              {showDropdown && (
                <div className="notification-dropdown shadow-lg">
                  <div className="dropdown-header">
                    <h3>Recent Alerts</h3>
                    <span className="notif-count">{unreadCount} New</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="empty-notif">
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    <div className="notif-list">
                      {notifications.slice(0, 5).map(n => (
                        <div 
                          key={n._id} 
                          className={`notif-item ${n.status}`}
                          onClick={() => markAsRead(n._id)}
                        >
                          <p>{n.message}</p>
                          <span className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="auth-actions">
              {isAdmin ? (
                <>
                  <Link to="/tickets" className="tickets-nav-link">Tickets</Link>
                  <Link to="/admin" className="admin-btn">Admin Portal</Link>
                  <button onClick={handleLogout} className="logout-btn">Sign Out</button>
                </>
              ) : (
                <Link to="/admin-login" className="login-btn-link">Admin Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gov-navbar {
          background-color: var(--white);
          height: 80px;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border-bottom: 3px solid var(--saffron);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
        }
        .brand-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-icon { font-size: 2rem; }
        .brand-text { display: flex; flex-direction: column; }
        .portal-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--ashoka-blue);
          line-height: 1;
          letter-spacing: -0.5px;
        }
        .portal-subtitle {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--saffron);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .nav-main { display: flex; align-items: center; gap: 40px; }
        .navbar-links {
          display: flex;
          list-style: none;
          gap: 30px;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition);
          position: relative;
          padding: 8px 0;
        }
        .nav-link:hover { color: var(--ashoka-blue); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--saffron);
          transition: var(--transition);
        }
        .nav-link:hover::after { width: 100%; }

        .nav-actions { display: flex; align-items: center; gap: 24px; }
        .icon-btn {
          background: var(--bg-main);
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        }
        .icon-btn:hover { background: #EDF2F7; }
        .bell-icon { font-size: 1.2rem; }
        
        .unread-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--danger);
          color: white;
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 800;
          border: 2px solid var(--white);
        }

        .notification-dropdown {
          position: absolute;
          top: 60px;
          right: 0;
          background: var(--white);
          border-radius: 16px;
          width: 320px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .dropdown-header {
          padding: 16px;
          background: var(--bg-main);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }
        .dropdown-header h3 { font-size: 0.9rem; margin: 0; }
        .notif-count { font-size: 0.75rem; font-weight: 800; color: var(--danger); }
        
        .notif-list { max-height: 350px; overflow-y: auto; }
        .notif-item {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: var(--transition);
        }
        .notif-item:hover { background: #F8FAFC; }
        .notif-item.unread { background: #FFF9F0; border-left: 4px solid var(--saffron); }
        .notif-item p { font-size: 0.85rem; margin-bottom: 4px; color: var(--text-primary); font-weight: 600; }
        .notif-time { font-size: 0.7rem; color: var(--text-muted); }

        .auth-actions { display: flex; gap: 12px; align-items: center; }
        .tickets-nav-link {
          color: var(--ashoka-blue);
          text-decoration: none;
          font-weight: 800;
          font-size: 0.85rem;
          padding: 10px 18px;
          border: 2px solid var(--ashoka-blue);
          border-radius: 8px;
          transition: var(--transition);
        }
        .tickets-nav-link:hover {
          background: var(--ashoka-blue);
          color: white;
        }
        .admin-btn {
          background: var(--ashoka-blue);
          color: white;
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
        }
        .logout-btn {
          background: var(--danger);
          color: white;
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .login-btn-link {
          color: var(--ashoka-blue);
          text-decoration: none;
          font-weight: 800;
          font-size: 0.85rem;
          padding: 10px 18px;
          border: 2px solid var(--ashoka-blue);
          border-radius: 8px;
        }

        @media (max-width: 992px) {
          .nav-main { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
