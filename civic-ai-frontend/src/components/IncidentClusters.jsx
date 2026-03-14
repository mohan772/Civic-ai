import React, { useState, useEffect } from 'react';
import { getIncidentClusters } from '../services/api';

const IncidentClusters = () => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await getIncidentClusters();
        setClusters(res.data);
      } catch (err) {
        console.error("Error fetching clusters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, []);

  if (loading) return <div className="clusters-loading">Analyzing Urban Patterns...</div>;

  return (
    <div className="clusters-card">
      <div className="clusters-header">
        <div className="header-icon">🧠</div>
        <div className="header-text">
          <h3>Urban Problem Clusters</h3>
          <span>AI Pattern Recognition</span>
        </div>
      </div>

      <div className="clusters-list">
        {clusters.length > 0 ? (
          clusters.map((cluster, index) => (
            <div key={index} className={`cluster-item severity-${cluster.severity.toLowerCase()}`}>
              <div className="cluster-main">
                <div className="area-title">
                  <strong>{cluster.area}</strong>
                  <span className={`severity-badge ${cluster.severity.toLowerCase()}`}>
                    {cluster.severity}
                  </span>
                </div>
                <div className="cluster-meta">
                  <span className="meta-tag">Category: {cluster.category}</span>
                  <span className="meta-tag">Reports: {cluster.complaints}</span>
                </div>
                <p className="cluster-insight">{cluster.insight}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-clusters">
            <span className="check-icon">✅</span>
            <p>No significant issue clusters detected currently.</p>
          </div>
        )}
      </div>

      <style>{`
        .clusters-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-top: 5px solid var(--ashoka-blue);
        }

        .clusters-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .header-icon { font-size: 1.8rem; }
        .header-text h3 { margin: 0; font-size: 1.1rem; color: #1a202c; text-transform: uppercase; letter-spacing: 0.5px; }
        .header-text span { font-size: 0.7rem; color: #718096; font-weight: 800; text-transform: uppercase; }

        .clusters-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cluster-item {
          padding: 16px;
          border-radius: 12px;
          border-left: 5px solid #e2e8f0;
          background: #f8fafc;
          transition: transform 0.2s;
        }

        .cluster-item:hover { transform: translateX(5px); }

        .severity-low { border-left-color: #138808; background: #f0fff4; }
        .severity-medium { border-left-color: #FF9933; background: #fffaf0; }
        .severity-high { border-left-color: #D32F2F; background: #fff5f5; }

        .area-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .area-title strong { font-size: 1rem; color: #2d3748; }

        .severity-badge {
          font-size: 0.65rem;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .severity-badge.low { background: #c6f6d5; color: #22543d; }
        .severity-badge.medium { background: #feebc8; color: #744210; }
        .severity-badge.high { background: #fed7d7; color: #822727; }

        .cluster-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 12px;
        }

        .meta-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #4a5568;
          background: rgba(0,0,0,0.05);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .cluster-insight {
          margin: 0;
          font-size: 0.85rem;
          color: #4a5568;
          line-height: 1.5;
          font-style: italic;
          border-top: 1px dashed rgba(0,0,0,0.1);
          padding-top: 10px;
        }

        .empty-clusters { text-align: center; padding: 30px; color: #718096; }
        .check-icon { display: block; font-size: 2rem; margin-bottom: 10px; }
        .clusters-loading { padding: 40px; text-align: center; color: #718096; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default IncidentClusters;
