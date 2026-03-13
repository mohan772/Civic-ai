import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveCityMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/live-metrics');
      setMetrics(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 20000); // 20s refresh as requested
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="metrics-loading">Syncing Live City Data...</div>;
  if (!metrics) return null;

  const metricCards = [
    { label: 'Complaints Today', value: metrics.complaintsToday, color: 'var(--saffron)', icon: '📅' },
    { label: 'Resolved Today', value: metrics.resolvedToday, color: 'var(--green)', icon: '✅' },
    { label: 'Pending Complaints', value: metrics.pendingComplaints, color: 'var(--ashoka-blue)', icon: '⏳' },
    { label: 'Critical Issues', value: metrics.criticalIssues, color: '#d32f2f', icon: '⚠' }
  ];

  return (
    <div className="live-metrics-container">
      <div className="metrics-grid">
        {metricCards.map((metric, index) => (
          <div key={index} className="metric-card" style={{ borderTop: `5px solid ${metric.color}` }}>
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-info">
              <span className="metric-val">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
            </div>
            <div className="live-badge">LIVE</div>
          </div>
        ))}
      </div>

      <style>{`
        .live-metrics-container { margin-bottom: 25px; }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .metric-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.3s;
        }
        .metric-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        
        .metric-icon { font-size: 2rem; }
        .metric-info { display: flex; flex-direction: column; }
        .metric-val { font-size: 1.8rem; font-weight: 900; color: #333; line-height: 1; }
        .metric-label { font-size: 0.75rem; font-weight: 800; color: #777; text-transform: uppercase; margin-top: 5px; }
        
        .live-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ffebee;
          color: #d32f2f;
          font-size: 0.55rem;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 10px;
          border: 1px solid #ffcdd2;
        }
        .metrics-loading { padding: 20px; text-align: center; color: var(--ashoka-blue); font-weight: 800; }
      `}</style>
    </div>
  );
};

export default LiveCityMetrics;
