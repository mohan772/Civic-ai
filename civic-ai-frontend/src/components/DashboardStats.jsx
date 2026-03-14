import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data);
      } catch (err) {}
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  const statItems = [
    { label: 'Total Reports', value: stats.total, color: 'var(--ashoka-blue)', icon: '📋' },
    { label: 'Under Review', value: stats.pending, color: 'var(--saffron)', icon: '🔍' },
    { label: 'Successfully Fixed', value: stats.resolved, color: 'var(--green)', icon: '🛠️' },
    { label: 'Critical Priority', value: stats.critical, color: 'var(--danger)', icon: '🔥' }
  ];

  return (
    <div className="modern-stats-grid">
      {statItems.map((item, i) => (
        <div key={i} className="stat-card-modern card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
            {item.icon}
          </div>
          <div className="stat-details">
            <span className="stat-value-big">{item.value}</span>
            <span className="stat-label-small">{item.label}</span>
          </div>
          <div className="stat-progress">
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: '70%', backgroundColor: item.color }}></div>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        .modern-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 30px;
        }

        .stat-card-modern {
          padding: 24px !important;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-value-big {
          font-size: 2rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-label-small {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        .stat-progress {
          margin-top: 8px;
        }

        .progress-bg {
          height: 4px;
          background: var(--bg-main);
          border-radius: 2px;
          width: 100%;
        }

        .progress-fill {
          height: 100%;
          border-radius: 2px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default DashboardStats;
