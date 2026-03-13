import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching civic intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading-stats">Analyzing City Intelligence...</div>;
  if (!data) return null;

  return (
    <div className="civic-intelligence-panel">
      <div className="intel-header">
        <div className="health-gauge" style={{ borderLeftColor: data.color }}>
          <span className="gauge-value" style={{ color: data.color }}>{data.civicHealthScore}</span>
          <span className="gauge-label">Civic Health Index</span>
        </div>
        <div className="trend-indicator">
          <span className={`trend-icon ${data.trend}`}>
            {data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '↔'}
          </span>
          <span className="trend-text">
            {data.trend === 'up' ? 'Health Improving' : data.trend === 'down' ? 'Health Worsening' : 'Stable'}
            <small>{data.change}% (24h)</small>
          </span>
        </div>
      </div>

      <div className="intel-grid">
        <div className="intel-card">
          <span className="card-val">{data.total}</span>
          <span className="card-lbl">Total Reports</span>
        </div>
        <div className="intel-card success">
          <span className="card-val">{data.resolved}</span>
          <span className="card-lbl">Resolved</span>
        </div>
        <div className="intel-card alert">
          <span className="card-val">{data.critical}</span>
          <span className="card-lbl">Critical Alerts</span>
        </div>
      </div>

      <div className="hotspot-section">
        <div className="hotspot-item">
          <h4>Top Issue Category</h4>
          <p className="highlight-text">{data.topCategory}</p>
          <small>{data.topCategoryCount} active reports</small>
        </div>
        <div className="hotspot-item">
          <h4>Problem Hotspot Area</h4>
          <p className="highlight-text">{data.hotspotArea}</p>
          <small>{data.hotspotReports} reports from this area</small>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .civic-intelligence-panel {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          margin-bottom: 30px;
          border: 1px solid #eee;
        }
        .intel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .health-gauge {
          border-left: 6px solid;
          padding-left: 15px;
        }
        .gauge-value {
          font-size: 42px;
          font-weight: 800;
          display: block;
          line-height: 1;
        }
        .gauge-label {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8f9fa;
          padding: 10px 15px;
          border-radius: 12px;
        }
        .trend-icon {
          font-size: 24px;
          font-weight: bold;
        }
        .trend-icon.up { color: #27ae60; }
        .trend-icon.down { color: #e74c3c; }
        .trend-text {
          font-weight: 600;
          font-size: 14px;
          display: flex;
          flex-direction: column;
        }
        .trend-text small {
          font-weight: normal;
          color: #666;
        }
        .intel-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .intel-card {
          text-align: center;
          padding: 15px;
          background: #fdfdfd;
          border-radius: 12px;
          border: 1px solid #f5f5f5;
        }
        .intel-card.success { border-bottom: 4px solid #27ae60; }
        .intel-card.alert { border-bottom: 4px solid #e74c3c; }
        .card-val {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
        }
        .card-lbl {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
        }
        .hotspot-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          background: #fcfcfc;
          padding: 15px;
          border-radius: 12px;
        }
        .hotspot-item h4 {
          margin: 0 0 5px 0;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }
        .highlight-text {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #34495e;
        }
        .hotspot-item small {
          color: #999;
        }
        .loading-stats {
          padding: 40px;
          text-align: center;
          color: #666;
          font-style: italic;
        }
      `}} />
    </div>
  );
};

export default DashboardStats;
