import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CivicHotspots = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics/hotspots');
        setHotspots(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHotspots();
  }, []);

  if (loading) return <div>Detecting Hotspots...</div>;
  if (hotspots.length === 0) return (
    <div className="hotspots-card empty">
       ✅ No critical hotspots detected this week.
    </div>
  );

  return (
    <div className="hotspots-card">
      <div className="hotspots-header">
        <h3>⚠ Civic Hotspot Alerts</h3>
        <span className="live-pulse">LIVE ANALYTICS</span>
      </div>

      <div className="hotspots-list">
        {hotspots.map((h, i) => (
          <div key={i} className={`hotspot-item ${h.trend === 'increasing' ? 'critical-trend' : ''}`}>
            <div className="hotspot-main">
              <span className="area-name">{h.area}</span>
              <span className="area-meta">{h.category} Complaints</span>
            </div>
            <div className="hotspot-badge">
              {h.trend === 'increasing' ? (
                <span className="trend-increasing">▲ Rising ({h.complaints})</span>
              ) : (
                <span className="trend-stable">● High Volume ({h.complaints})</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hotspots-card {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border-left: 6px solid #d32f2f;
        }
        .hotspots-card.empty {
          color: #138808;
          font-weight: 800;
          text-align: center;
          border-left: 6px solid #138808;
        }
        .hotspots-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .hotspots-header h3 {
          margin: 0;
          color: #d32f2f;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .live-pulse {
          font-size: 0.65rem;
          font-weight: 900;
          color: #d32f2f;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .hotspots-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .hotspot-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #fff5f5;
          border-radius: 8px;
          border: 1px solid #ffebee;
        }
        .critical-trend {
          background: #fff0f0;
          border: 1px solid #ffcdd2;
        }
        .area-name {
          display: block;
          font-weight: 900;
          color: #333;
          font-size: 0.95rem;
        }
        .area-meta {
          font-size: 0.75rem;
          color: #666;
          font-weight: 700;
        }
        .hotspot-badge {
          font-size: 0.75rem;
          font-weight: 800;
        }
        .trend-increasing { color: #d32f2f; }
        .trend-stable { color: #555; }
      `}</style>
    </div>
  );
};

export default CivicHotspots;
