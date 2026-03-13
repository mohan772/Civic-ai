import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardStats from '../components/DashboardStats';
import ComplaintCard from '../components/ComplaintCard';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not load complaints. Make sure the server is running.');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${id}`, { status: newStatus });
      // Refresh complaints list
      fetchComplaints();
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // Calculate Summary Stats
  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    highPriority: complaints.filter(c => c.priority === 'High' || c.priority === 'Critical').length
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="admin-page">
      <h2>Civic Admin Control Panel</h2>
      
      {error && <div className="alert error">{error}</div>}

      <div className="stats-container">
        <div className="stat-card">
          <h4>Total Complaints</h4>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Resolved</h4>
          <p className="stat-value resolved">{stats.resolved}</p>
        </div>
        <div className="stat-card">
          <h4>High Priority</h4>
          <p className="stat-value high-priority">{stats.highPriority}</p>
        </div>
      </div>

      <section className="reports-section">
        <h3>Incoming Community Reports</h3>
        <div className="complaints-grid">
          {complaints.length > 0 ? (
            complaints.map(complaint => (
              <ComplaintCard 
                key={complaint._id} 
                complaint={complaint} 
                isAdmin={true}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          ) : (
            <p className="empty-state">No complaints to display.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
