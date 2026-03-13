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
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading-stats">Syncing Analytics...</div>;
  if (!data) return null;

  return (
    <div className="gov-stats-container">
      <div className="stats-grid">
        <div className="stat-card-gov">
          <div className="stat-icon total">📊</div>
          <div className="stat-info">
            <span className="stat-val">{data.total}</span>
            <span className="stat-lbl">Total Registered Cases</span>
          </div>
        </div>
        
        <div className="stat-card-gov">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <span className="stat-val">{data.pending || (data.total - data.resolved - data.rejected) || 0}</span>
            <span className="stat-lbl">Pending Moderation</span>
          </div>
        </div>

        <div className="stat-card-gov">
          <div className="stat-icon resolved">✅</div>
          <div className="stat-info">
            <span className="stat-val">{data.resolved}</span>
            <span className="stat-lbl">Resolved & Closed</span>
          </div>
        </div>

        <div className="stat-card-gov">
          <div className="stat-icon rejected">❌</div>
          <div className="stat-info">
            <span className="stat-val">{data.rejected || 0}</span>
            <span className="stat-lbl">Rejected / Invalid</span>
          </div>
        </div>
      </div>

      <div className="health-section-gov">
        <div className="health-card">
          <h4>City Civic Health Index</h4>
          <div className="health-bar-container">
            <div className="health-bar" style={{ width: `${data.civicHealthScore}%`, backgroundColor: data.color }}></div>
          </div>
          <div className="health-meta">
            <span className="health-score" style={{ color: data.color }}>{data.civicHealthScore}/100</span>
            <span className="health-trend">
              {data.trend === 'up' ? '📈 Improving' : '📉 Worsening'}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .gov-stats-container { margin-bottom: 40px; }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card-gov {
          background-color: var(--light-grey);
          padding: 25px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid #e0e0e0;
          transition: transform 0.2s;
        }
        .stat-card-gov:hover { transform: translateY(-5px); border-color: var(--saffron); }

        .stat-icon {
          font-size: 2rem;
          background: white;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .stat-info { display: flex; flex-direction: column; }
        .stat-val { font-size: 1.8rem; font-weight: 900; color: var(--ashoka-blue); line-height: 1.2; }
        .stat-lbl { font-size: 0.75rem; color: #666; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }

        .health-section-gov {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #eee;
        }
        .health-card h4 { margin: 0 0 15px 0; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; }
        .health-bar-container { height: 12px; background: #eee; border-radius: 6px; overflow: hidden; margin-bottom: 10px; }
        .health-bar { height: 100%; transition: width 1s ease-in-out; }
        .health-meta { display: flex; justify-content: space-between; align-items: center; }
        .health-score { font-size: 1.4rem; font-weight: 800; }
        .health-trend { font-size: 0.9rem; font-weight: 600; color: #666; }

        .loading-stats { padding: 30px; text-align: center; color: var(--ashoka-blue); font-weight: 700; }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
};

export default DashboardStats;
