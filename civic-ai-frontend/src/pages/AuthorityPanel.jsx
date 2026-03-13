import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorityPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolutionFiles, setResolutionFiles] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data.filter(t => t.status !== 'Closed'));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setLoading(false);
    }
  };

  const handleFileChange = (ticketId, file) => {
    setResolutionFiles(prev => ({ ...prev, [ticketId]: file }));
  };

  const handleResolve = async (ticketId) => {
    const file = resolutionFiles[ticketId];
    if (!file) {
      alert('Please upload a resolution photo first.');
      return;
    }

    const formData = new FormData();
    formData.append('resolutionPhoto', file);

    try {
      await axios.patch(`http://localhost:5000/api/tickets/${ticketId}/resolve`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Ticket marked as Resolved!');
      fetchTickets();
    } catch (err) {
      console.error('Error resolving ticket:', err);
      alert('Failed to resolve ticket.');
    }
  };

  if (loading) return <div className="loading">Loading Tickets...</div>;

  return (
    <div className="authority-page">
      <h2>Department Resolution Portal</h2>
      <p className="subtitle">Manage and resolve assigned civic tickets.</p>

      <div className="tickets-list">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket._id} className={`ticket-card status-${ticket.status.toLowerCase()}`}>
              <div className="ticket-header">
                <span className="ticket-id">{ticket.ticketId}</span>
                <span className="ticket-status">{ticket.status}</span>
              </div>
              
              <div className="ticket-body">
                <h4>{ticket.complaintId?.category} Complaint</h4>
                <p className="desc">{ticket.complaintId?.description}</p>
                <p><strong>Location:</strong> {ticket.complaintId?.address}</p>
                <p><strong>Assigned To:</strong> {ticket.assignedAuthority}</p>
                
                {ticket.status === 'Resolved' ? (
                  <div className="resolved-info">
                    <p className="success-text">✓ Resolution pending admin closure.</p>
                    {ticket.resolutionPhoto && (
                      <img src={`http://localhost:5000${ticket.resolutionPhoto}`} alt="Resolution" className="res-img" />
                    )}
                  </div>
                ) : (
                  <div className="resolution-actions">
                    <label>Upload Resolution Proof:</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(ticket._id, e.target.files[0])} 
                    />
                    <button onClick={() => handleResolve(ticket._id)} className="btn-resolve">
                      Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No active tickets assigned to your department.</p>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .authority-page { padding: 30px; max-width: 1000px; margin: 0 auto; }
        .subtitle { color: #666; margin-bottom: 30px; }
        .ticket-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          margin-bottom: 20px;
          padding: 20px;
          border-left: 6px solid #ccc;
        }
        .ticket-card.status-pending { border-left-color: #f39c12; }
        .ticket-card.status-resolved { border-left-color: #27ae60; }
        
        .ticket-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .ticket-id { font-weight: 800; color: #2c3e50; }
        .ticket-status {
          font-size: 12px;
          text-transform: uppercase;
          background: #eee;
          padding: 4px 10px;
          border-radius: 4px;
        }
        
        .ticket-body h4 { margin: 0 0 10px 0; color: #34495e; }
        .desc { font-style: italic; color: #555; margin-bottom: 15px; }
        
        .resolution-actions {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .resolution-actions label { display: block; margin-bottom: 8px; font-weight: 600; }
        .btn-resolve {
          margin-top: 15px;
          background: #27ae60;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        .res-img { width: 100%; max-width: 300px; border-radius: 8px; margin-top: 15px; }
        .success-text { color: #27ae60; font-weight: 600; }
      `}} />
    </div>
  );
};

export default AuthorityPanel;
