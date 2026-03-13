import React from 'react';
import axios from 'axios';

const ComplaintCard = ({ complaint, isAdmin, onRefresh }) => {
  const { 
    _id, 
    name, 
    phone,
    address, 
    description, 
    category = "Other", 
    priority = "Medium", 
    status = "Pending", 
    createdAt, 
    image, 
    department,
    report_count = 1,
    rejectionReason,
    ticketId
  } = complaint || {};

  const handleAccept = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${_id}/status`, { status: 'Accepted' });
      alert("Complaint accepted and ticket raised.");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept.");
    }
  };

  const handleCancel = async () => {
    const reason = prompt("Please enter the reason for rejection:");
    if (!reason) return;

    try {
      await axios.patch(`http://localhost:5000/api/complaints/${_id}/status`, { status: 'Rejected', reason });
      alert("Complaint rejected.");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject.");
    }
  };

  return (
    <div className={`gov-complaint-card priority-${priority?.toLowerCase()} status-${status.toLowerCase()}`}>
      <div className="card-accent"></div>
      
      <div className="card-header">
        <div className="tag-group">
          <span className="gov-tag category">{category}</span>
          <span className="gov-tag department">{department}</span>
        </div>
        <span className={`gov-status status-${status.toLowerCase()}`}>{status}</span>
      </div>
      
      <div className="card-content">
        <p className="main-desc">{description}</p>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">{address}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Priority</span>
            <span className={`info-value prio-text prio-${priority?.toLowerCase()}`}>{priority}</span>
          </div>
          {ticketId && (
            <div className="info-item">
              <span className="info-label">Ticket ID</span>
              <span className="info-value id-text">{ticketId}</span>
            </div>
          )}
        </div>

        {status === 'Rejected' && rejectionReason && (
          <div className="rejection-box">
            <strong>Rejection Reason:</strong> {rejectionReason}
          </div>
        )}

        {image && (
          <div className="image-attachment">
            <img src={`http://localhost:5000${image}`} alt="Evidence" />
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="meta-user">
          <span className="reporter">👤 {name || 'Anonymous'}</span>
          <span className="date">📅 {new Date(createdAt).toLocaleDateString()}</span>
        </div>
        
        {isAdmin && status === 'Pending' && (
          <div className="admin-btn-group">
            <button onClick={handleAccept} className="btn-gov btn-accept">Accept Complaint</button>
            <button onClick={handleCancel} className="btn-gov btn-cancel">Cancel Complaint</button>
          </div>
        )}
      </div>

      <style>{`
        .gov-complaint-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
          border: 1px solid #eee;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .card-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6px;
          background-color: var(--saffron);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .tag-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .gov-tag {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .gov-tag.category { background: #eef2ff; color: var(--ashoka-blue); }
        .gov-tag.department { background: #f0fdf4; color: var(--green); }
        
        .gov-status {
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          color: #999;
        }
        .gov-status.status-accepted { color: var(--green); }
        .gov-status.status-rejected { color: var(--red); }
        .gov-status.status-pending { color: var(--saffron); }

        .main-desc {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.5;
          margin: 0 0 15px 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-item { display: flex; flex-direction: column; }
        .info-label { font-size: 0.7rem; color: #888; text-transform: uppercase; font-weight: 700; }
        .info-value { font-size: 0.9rem; font-weight: 600; color: #444; }
        
        .prio-text { font-weight: 800; }
        .prio-high { color: var(--red); }
        .prio-medium { color: var(--saffron); }
        .prio-low { color: var(--green); }
        .id-text { color: var(--ashoka-blue); font-family: monospace; }

        .rejection-box {
          background: #fff5f5;
          border: 1px solid #fed7d7;
          padding: 12px;
          border-radius: 8px;
          color: var(--red);
          font-size: 0.85rem;
        }

        .image-attachment {
          border-radius: 10px;
          overflow: hidden;
          height: 200px;
          border: 1px solid #eee;
        }
        .image-attachment img { width: 100%; height: 100%; object-fit: cover; }

        .card-footer {
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .meta-user { display: flex; justify-content: space-between; font-size: 0.8rem; color: #777; font-weight: 600; }

        .admin-btn-group { display: flex; gap: 10px; }
        .btn-gov {
          flex: 1;
          padding: 12px;
          border: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-accept { background-color: var(--green); }
        .btn-cancel { background-color: var(--red); }
        
        .btn-gov:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
};

export default ComplaintCard;
