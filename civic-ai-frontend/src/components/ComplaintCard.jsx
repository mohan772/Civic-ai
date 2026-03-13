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
    rejectionReason
  } = complaint || {};

  // Requirement 3: Accept Complaint Action
  const handleAccept = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${_id}/status`, { status: 'Accepted' });
      alert("Complaint accepted and assigned to department.");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept.");
    }
  };

  // Requirement 4: Cancel (Reject) Complaint Action
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
    <div className={`complaint-card priority-${priority?.toLowerCase()} status-${status.toLowerCase()}`}>
      <div className="card-header">
        <div className="cat-group">
          <span className="cat-tag">{category}</span>
          <span className="dept-tag">{department}</span>
        </div>
        <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
      </div>
      
      <div className="card-body">
        <p className="description">{description}</p>
        <div className="meta-info">
          <p>📍 <strong>Location:</strong> {address}</p>
          <p>👤 <strong>Reported by:</strong> {name || 'Anonymous'}</p>
          <p>📞 <strong>Phone:</strong> {phone || 'Not provided'}</p>
          <p>📊 <strong>Reports:</strong> {report_count}</p>
          <p>⚡ <strong>Priority:</strong> <span className={`prio-tag prio-${priority?.toLowerCase()}`}>{priority}</span></p>
        </div>
        
        {status === 'Rejected' && rejectionReason && (
          <div className="rejection-info">
            <strong>Rejection Reason:</strong> {rejectionReason}
          </div>
        )}

        {image && (
          <div className="image-preview">
            <img src={`http://localhost:5000${image}`} alt="Issue" />
          </div>
        )}
      </div>

      <div className="card-footer">
        <small>{new Date(createdAt).toLocaleString()}</small>
        
        {/* Requirement 2: Show buttons only when status is Pending */}
        {isAdmin && status === 'Pending' && (
          <div className="admin-actions">
            <button onClick={handleAccept} className="btn-accept">Accept Complaint</button>
            <button onClick={handleCancel} className="btn-cancel">Cancel Complaint</button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .complaint-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px; border: 1px solid #eee; transition: transform 0.2s; position: relative; }
        .complaint-card:hover { transform: translateY(-2px); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .cat-group { display: flex; gap: 8px; }
        .cat-tag { background: #e3f2fd; color: #1565c0; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .dept-tag { background: #f1f8e9; color: #33691e; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .status-badge { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; }
        .status-badge.status-rejected { color: #e74c3c; }
        .status-badge.status-resolved { color: #27ae60; }
        .status-badge.status-accepted { color: #646cff; }
        
        .description { font-size: 16px; font-weight: 600; color: #2c3e50; margin-bottom: 15px; line-height: 1.4; }
        .meta-info p { margin: 6px 0; font-size: 13px; color: #555; }
        .prio-tag { font-weight: bold; padding: 2px 6px; border-radius: 3px; font-size: 11px; }
        .prio-low { background: #e8f5e9; color: #2e7d32; }
        .prio-medium { background: #fff3e0; color: #ef6c00; }
        .prio-high { background: #ffebee; color: #c62828; }
        .prio-critical { background: #b71c1c; color: white; }
        
        .rejection-info { margin: 10px 0; padding: 10px; background: #fff5f5; border-left: 4px solid #e74c3c; color: #c53030; font-size: 14px; }
        
        .image-preview { margin-top: 15px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; }
        .image-preview img { width: 100%; height: 180px; object-fit: cover; display: block; }
        
        .admin-actions { display: flex; gap: 10px; margin-top: 15px; }
        .btn-cancel { flex: 1; padding: 10px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
        .btn-accept { flex: 1; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
        
        .complaint-card.status-rejected { opacity: 0.8; border-left: 5px solid #e74c3c; }
        .complaint-card.status-pending { border-left: 5px solid #f39c12; }
        .complaint-card.status-accepted { border-left: 5px solid #646cff; }
      `}} />
    </div>
  );
};

export default ComplaintCard;
