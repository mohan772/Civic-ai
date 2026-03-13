import React from 'react';

const ComplaintCard = ({ complaint, isAdmin, onUpdateStatus }) => {
  // Use optional chaining and default values to prevent crashes if data is missing
  const { 
    _id, 
    name, 
    address, 
    description, 
    category = "Other", 
    priority = "Medium", 
    status = "Pending", 
    createdAt, 
    image, 
    report_count = 1 
  } = complaint || {};

  return (
    <div className={`complaint-card priority-${priority?.toLowerCase() || 'medium'}`}>
      <div className="card-header">
        <h3>{category || 'Other'} Complaint</h3>
        <span className={`status-badge status-${status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
          {status || 'Pending'}
        </span>
      </div>
      
      <div className="card-body">
        <p><strong>Reported by:</strong> {name || 'Anonymous'}</p>
        <p><strong>Location:</strong> {address || 'Location not provided'}</p>
        <p><strong>Reports:</strong> {report_count}</p>
        <p><strong>Priority:</strong> <span className="priority-label">{priority || 'Medium'}</span></p>
        <p className="description">{description}</p>
        
        {image && (
          <div className="image-preview">
            <img src={`http://localhost:5000${image}`} alt="Civic Issue" />
          </div>
        )}
      </div>

      <div className="card-footer">
        <small>Submitted: {createdAt ? new Date(createdAt).toLocaleString() : 'Date Unknown'}</small>
        
        {isAdmin && status !== 'Resolved' && (
          <div className="admin-actions">
            {status === 'Pending' && (
              <button 
                onClick={() => onUpdateStatus(_id, 'In Progress')}
                className="btn-progress"
              >
                Start Investigation
              </button>
            )}
            <button 
              onClick={() => onUpdateStatus(_id, 'Resolved')}
              className="btn-resolve"
            >
              Resolve Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
