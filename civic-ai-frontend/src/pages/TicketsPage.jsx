import React, { useState, useEffect } from 'react';
import { getTickets, closeTicket } from '../services/api';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDept, setActiveTab] = useState('All');

  const departments = ['All', 'BBMP Roads', 'BBMP Waste Management', 'BWSSB', 'BESCOM', 'Traffic Police', 'Municipal Services'];

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
    if (!window.confirm('Mark this departmental token as Resolved and Close?')) return;
    try {
      await closeTicket(id);
      fetchTickets();
    } catch (err) {
      alert('Failed to close token');
    }
  };

  const filteredTickets = activeDept === 'All' 
    ? tickets 
    : tickets.filter(t => t.department === activeDept);

  if (loading) return <div className="loading-screen">Syncing Departmental Tokens...</div>;

  return (
    <div className="tickets-page">
      <header className="tickets-header">
        <div className="header-content">
          <h1>Civic Token Command Center</h1>
          <p>Tracking departmental progress and token lifecycles across Bangalore.</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <strong>{tickets.filter(t => t.status !== 'Closed').length}</strong>
            <span>Active Tokens</span>
          </div>
        </div>
      </header>

      <nav className="dept-tabs">
        {departments.map(dept => (
          <button 
            key={dept} 
            className={`dept-tab ${activeDept === dept ? 'active' : ''}`}
            onClick={() => setActiveTab(dept)}
          >
            {dept}
            {dept !== 'All' && (
              <span className="count-badge">
                {tickets.filter(t => t.department === dept && t.status !== 'Closed').length}
              </span>
            )}
          </button>
        ))}
      </nav>

      <main className="tickets-grid">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎫</span>
            <h3>No tokens found for {activeDept}</h3>
            <p>New tokens appear here automatically when complaints are accepted in the moderation panel.</p>
          </div>
        ) : (
          <div className="token-table-wrapper card">
            <table className="token-table-modern">
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Department</th>
                  <th>Assigned Officer</th>
                  <th>Status</th>
                  <th>Generated On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(t => (
                  <tr key={t._id} className={t.status.toLowerCase()}>
                    <td><span className="id-cell">{t.ticketId}</span></td>
                    <td><span className="dept-pill">{t.department}</span></td>
                    <td>
                      <div className="officer-cell">
                        <span className="avatar">👤</span>
                        {t.assignedAuthority}
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag ${t.status.toLowerCase().replace(' ', '-')}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                    <td>
                      {t.status !== 'Closed' && (
                        <button onClick={() => handleClose(t._id)} className="close-action-btn">
                          Resolve & Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style>{`
        .tickets-page { padding: 40px 20px; max-width: 1400px; margin: 0 auto; }
        
        .tickets-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 4px solid var(--saffron);
          padding-bottom: 30px;
        }
        .tickets-header h1 { margin: 0 0 8px 0; color: var(--ashoka-blue); font-size: 2.5rem; }
        .tickets-header p { margin: 0; color: var(--text-secondary); font-weight: 500; }
        
        .stat-pill {
          background: var(--ashoka-blue);
          color: white;
          padding: 15px 30px;
          border-radius: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .stat-pill strong { font-size: 1.8rem; line-height: 1; }
        .stat-pill span { font-size: 0.75rem; text-transform: uppercase; font-weight: 800; margin-top: 4px; }

        .dept-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          overflow-x: auto;
          padding-bottom: 10px;
        }
        .dept-tab {
          background: white;
          border: 1px solid var(--border);
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 700;
          color: var(--text-secondary);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: var(--transition);
        }
        .dept-tab.active {
          background: var(--ashoka-blue);
          color: white;
          border-color: var(--ashoka-blue);
        }
        .count-badge {
          background: #edf2f7;
          color: var(--text-muted);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.7rem;
        }
        .dept-tab.active .count-badge { background: rgba(255,255,255,0.2); color: white; }

        .token-table-wrapper { padding: 0 !important; overflow: hidden; }
        .token-table-modern { width: 100%; border-collapse: collapse; text-align: left; }
        .token-table-modern th {
          padding: 16px 24px;
          background: #f8fafc;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 900;
          letter-spacing: 1px;
        }
        .token-table-modern td { padding: 20px 24px; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
        
        .id-cell { font-weight: 900; color: var(--ashoka-blue); font-family: monospace; font-size: 1rem; }
        .dept-pill {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.75rem;
          color: #475569;
        }
        
        .officer-cell { display: flex; align-items: center; gap: 10px; font-weight: 600; }
        .avatar { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }

        .status-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-tag.in-progress { background: #dbeafe; color: #1e40af; }
        .status-tag.closed { background: #f1f5f9; color: #64748b; opacity: 0.6; }

        .close-action-btn {
          background: var(--green);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.75rem;
        }
        .close-action-btn:hover { background: var(--green-light); transform: translateY(-1px); }

        .empty-state {
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 16px;
          border: 2px dashed var(--border);
        }
        .empty-icon { font-size: 4rem; display: block; margin-bottom: 20px; opacity: 0.2; }
        .empty-state h3 { color: var(--text-primary); margin-bottom: 8px; }
        .empty-state p { color: var(--text-muted); }

        @media (max-width: 1024px) {
          .tickets-header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .header-stats { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default TicketsPage;
