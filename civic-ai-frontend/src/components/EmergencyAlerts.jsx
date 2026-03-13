import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/emergency-alerts');
      setAlerts(res.data.alerts);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // 15s refresh for emergencies
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="emergency-loading">Monitoring City Emergencies...</div>;

  return (
    <div className="emergency-panel">
      <div className="emergency-header">
        <span className="emergency-icon">🚨</span>
        <h3>Active Emergency Alerts</h3>
      </div>
      
      <div className="alerts-container">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert._id} className="emergency-card">
              <div className="emergency-card-main">
                <span className="alert-priority">CRITICAL</span>
                <p className="alert-desc">{alert.description}</p>
                <div className="alert-loc">
                  <span className="loc-icon">📍</span> {alert.address}
                </div>
              </div>
              <div className="emergency-card-footer">
                <span className="alert-dept">{alert.department}</span>
                <span className="alert-time">{new Date(alert.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-alerts">✅ All systems normal. No active emergencies.</div>
        )}
      </div>

      <style>{`
        .emergency-panel {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(211, 47, 47, 0.15);
          border: 2px solid #ffcdd2;
          overflow: hidden;
          margin-bottom: 25px;
        }
        .emergency-header {
          background: #d32f2f;
          color: white;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .emergency-header h3 {
          margin: 0;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 900;
        }
        .emergency-icon { font-size: 1.4rem; }
        
        .alerts-container {
          max-height: 400px;
          overflow-y: auto;
          padding: 15px;
          background: #fffafa;
        }
        .emergency-card {
          background: white;
          border: 1px solid #ffcdd2;
          border-left: 6px solid #d32f2f;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 12px;
          transition: transform 0.2s;
        }
        .emergency-card:hover { transform: scale(1.01); }
        
        .alert-priority {
          background: #d32f2f;
          color: white;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 8px;
        }
        .alert-desc {
          font-weight: 800;
          color: #333;
          margin: 0 0 8px 0;
          font-size: 0.95rem;
        }
        .alert-loc {
          font-size: 0.8rem;
          color: #666;
          font-weight: 600;
        }
        .emergency-card-footer {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 800;
        }
        .alert-dept { color: var(--ashoka-blue); }
        .alert-time { color: #999; }
        
        .no-alerts {
          text-align: center;
          padding: 30px;
          color: #138808;
          font-weight: 800;
          font-style: italic;
        }
        .emergency-loading { padding: 20px; text-align: center; font-weight: 800; color: #d32f2f; }
      `}</style>
    </div>
  );
};

export default EmergencyAlerts;
