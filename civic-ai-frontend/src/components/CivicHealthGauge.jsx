import React, { useState, useEffect } from 'react';
import { getAnalyticsHealth } from '../services/api';

const CivicHealthGauge = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await getAnalyticsHealth();
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  if (loading) return <div>Loading Health Metrics...</div>;
  if (!data) return null;

  const getStatusColor = (score) => {
    if (score >= 80) return '#138808'; // Green
    if (score >= 50) return '#FF9933'; // Saffron/Orange
    return '#d32f2f'; // Red
  };

  const color = getStatusColor(data.score);

  return (
    <div className="health-gauge-card">
      <h3>City Civic Health Score</h3>
      <div className="gauge-container">
        <svg viewBox="0 0 100 100" className="gauge-svg">
          <circle className="gauge-bg" cx="50" cy="50" r="45" />
          <circle 
            className="gauge-fill" 
            cx="50" cy="50" r="45" 
            style={{ 
              strokeDasharray: `${data.score * 2.83} 283`,
              stroke: color
            }}
          />
          <text x="50" y="55" className="gauge-text" fill={color}>{data.score}</text>
        </svg>
      </div>
      <div className="health-stats">
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-val">{data.pending}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resolved</span>
          <span className="stat-val">{data.resolved}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Critical</span>
          <span className="stat-val text-red">{data.critical}</span>
        </div>
      </div>

      <style>{`
        .health-gauge-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
          border-top: 5px solid var(--ashoka-blue);
        }
        .health-gauge-card h3 {
          margin-top: 0;
          color: var(--ashoka-blue);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .gauge-container {
          width: 150px;
          height: 150px;
          margin: 20px auto;
        }
        .gauge-svg { transform: rotate(-90deg); }
        .gauge-bg { fill: none; stroke: #eee; stroke-width: 8; }
        .gauge-fill { 
          fill: none; 
          stroke-width: 8; 
          stroke-linecap: round; 
          transition: stroke-dasharray 1s ease-in-out;
        }
        .gauge-text {
          font-size: 20px;
          font-weight: 900;
          text-anchor: middle;
          transform: rotate(90deg);
          transform-origin: center;
        }
        .health-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
        .stat-item { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.7rem; color: #777; font-weight: 800; text-transform: uppercase; }
        .stat-val { font-size: 1.1rem; font-weight: 900; color: var(--ashoka-blue); }
        .text-red { color: #d32f2f; }
      `}</style>
    </div>
  );
};

export default CivicHealthGauge;
