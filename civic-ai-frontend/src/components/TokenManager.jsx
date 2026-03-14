import React, { useState, useEffect } from 'react';
import { getTickets, closeTicket } from '../services/api';
import api from '../services/api';

const TokenManager = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await getTickets();
      setTickets(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleClose = async (id) => {
    if (!window.confirm('Are you sure you want to close this token? This marks the issue as resolved.')) return;
    try {
      await closeTicket(id);
      fetchTickets();
    } catch (err) {
      alert('Failed to close token');
    }
  };

  if (loading) return <div className="token-loading">Syncing Automated Token System...</div>;

  return (
    <div className="token-manager-card card">
      <div className="token-header">
        <div className="header-left">
          <h3>Automated Token System</h3>
          <p>Tokens are automatically generated and assigned to department heads upon acceptance.</p>
        </div>
        <span className="token-count">{tickets.filter(t => t.status !== 'Closed').length} Active Tokens</span>
      </div>

      <div className="token-list">
        {tickets.length === 0 ? (
          <div className="empty-tokens">
            <span className="empty-icon">📁</span>
            <p>No active tokens found. Accept complaints to generate tokens automatically.</p>
          </div>
        ) : (
          <table className="token-table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Department</th>
                <th>Lead Assignment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t._id} className={t.status.toLowerCase().replace(' ', '-')}>
                  <td><strong>{t.ticketId}</strong></td>
                  <td><span className="dept-tag">{t.department}</span></td>
                  <td>
                    <div className="assignment-info">
                      <span className="officer-icon">👤</span>
                      {t.assignedAuthority}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${t.status.toLowerCase().replace(' ', '-')}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.status !== 'Closed' && (
                      <button 
                        onClick={() => handleClose(t._id)} 
                        className="action-btn close-btn"
                      >
                        Close & Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .token-manager-card { padding: 0 !important; overflow: hidden; margin-bottom: 30px; border-left: 6px solid var(--ashoka-blue); }
        .token-header {
          padding: 24px;
          background: #F8FAFC;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left h3 { margin: 0 0 4px 0; font-size: 1.25rem; color: var(--ashoka-blue); }
        .header-left p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; }
        
        .token-count {
          background: var(--ashoka-blue);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          box-shadow: var(--shadow-sm);
        }

        .token-list { padding: 0; overflow-x: auto; }
        .token-table { width: 100%; border-collapse: collapse; text-align: left; }
        .token-table th {
          padding: 14px 24px;
          background: #f1f5f9;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 900;
          letter-spacing: 1px;
        }
        .token-table td { padding: 18px 24px; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
        
        .dept-tag {
          background: var(--bg-main);
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: 700;
          color: var(--ashoka-blue);
          font-size: 0.75rem;
        }

        .assignment-info { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--text-primary); }
        .officer-icon { font-size: 1rem; }

        .status-pill {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-pill.pending { background: #FEF3C7; color: #92400E; }
        .status-pill.in-progress { background: #DBEAFE; color: #1E40AF; border: 1px solid #BFDBFE; }
        .status-pill.resolved { background: #D1FAE5; color: #065F46; }
        .status-pill.closed { background: #F3F4F6; color: #374151; opacity: 0.6; }

        .close-btn {
          background: var(--green);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.75rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .close-btn:hover { background: var(--green-light); transform: translateY(-1px); }

        .empty-tokens { padding: 60px; text-align: center; color: var(--text-muted); }
        .empty-icon { font-size: 3rem; display: block; margin-bottom: 16px; opacity: 0.3; }
        .token-loading { padding: 40px; text-align: center; font-weight: 800; color: var(--ashoka-blue); }
      `}</style>
    </div>
  );
};

export default TokenManager;
