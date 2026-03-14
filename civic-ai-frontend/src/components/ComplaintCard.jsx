import React from 'react';
import api from '../services/api';

const ComplaintCard = ({ complaint, isAdmin, onRefresh }) => {
  const getPriorityColor = (p) => {
    switch (p) {
      case 'Critical': return '#EF4444';
      case 'High': return '#F59E0B';
      case 'Medium': return '#3B82F6';
      default: return '#10B981';
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      if (newStatus === 'Accepted') {
        await api.patch(`/complaints/${complaint._id}/accept`);
      } else {
        await api.patch(`/complaints/${complaint._id}/status`, { status: newStatus });
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="modern-complaint-card card">
      <div className="card-top">
        <span className="priority-tag" style={{ backgroundColor: getPriorityColor(complaint.priority) }}>
          {complaint.priority}
        </span>
        <div className="card-badges">
          {complaint.ticketId && <span className="token-id-badge">ID: {complaint.ticketId}</span>}
          <span className="status-tag">{complaint.status}</span>
        </div>
      </div>

      <div className="card-body">
        <h4 className="complaint-desc">{complaint.description}</h4>
        <div className="meta-row">
          <span className="meta-icon">📍</span>
          <p className="address-text">{complaint.address}</p>
        </div>
        
        {complaint.image && (
          <div className="image-preview-container">
            <img src={`http://localhost:5000${complaint.image}`} alt="Evidence" className="complaint-img" />
          </div>
        )}

        <div className="info-grid">
          <div className="info-item">
            <span className="label">Category</span>
            <span className="value">{complaint.category}</span>
          </div>
          <div className="info-item">
            <span className="label">Department</span>
            <span className="value">{complaint.department}</span>
          </div>
          <div className="info-item">
            <span className="label">Reported By</span>
            <span className="value">{complaint.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Reports</span>
            <span className="value">{complaint.report_count}</span>
          </div>
        </div>
      </div>

      {isAdmin && complaint.status === 'Pending' && (
        <div className="card-actions-modern">
          <button onClick={() => updateStatus('Accepted')} className="accept-btn-modern">
            Verify & Accept
          </button>
          <button onClick={() => updateStatus('Rejected')} className="reject-btn-modern">
            Reject
          </button>
        </div>
      )}

      {isAdmin && (complaint.status === 'Accepted' || complaint.status === 'Assigned') && (
        <div className="card-actions-modern">
          <button onClick={() => updateStatus('Resolved')} className="resolve-btn-modern">
            Mark Resolved
          </button>
        </div>
      )}

      <style>{`
        .modern-complaint-card {
          padding: 20px !important;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-badges { display: flex; gap: 8px; align-items: center; }

        .token-id-badge {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--ashoka-blue);
          background: #eef2ff;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #c7d2fe;
        }

        .priority-tag {
          font-size: 0.65rem;
          font-weight: 900;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          background: var(--bg-main);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .complaint-desc {
          font-size: 1rem;
          line-height: 1.4;
          margin-bottom: 12px;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .meta-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .meta-icon { font-size: 0.9rem; }
        .address-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 500;
        }

        .image-preview-container {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          border: 1px solid var(--border);
        }
        .complaint-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .info-item { display: flex; flex-direction: column; gap: 2px; }
        .info-item .label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
        .info-item .value { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); }

        .card-actions-modern {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .card-actions-modern button {
          flex: 1;
          font-size: 0.8rem;
          padding: 10px;
        }

        .accept-btn-modern { background: var(--ashoka-blue); color: white; }
        .reject-btn-modern { background: white; border: 1px solid var(--border); color: var(--text-secondary); }
        .resolve-btn-modern { background: var(--green); color: white; }
      `}</style>
    </div>
  );
};

export default ComplaintCard;
