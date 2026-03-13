import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardStats from '../components/DashboardStats';
import ResourceAllocationPanel from '../components/ResourceAllocationPanel';
import ComplaintCard from '../components/ComplaintCard';
import BangaloreHeatmap from '../components/BangaloreHeatmap'; 
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Infrastructure');

  // Requirement 1: Added Rejected/Cancelled statuses to tabs
  const categories = ['Infrastructure', 'Sanitation', 'Utilities', 'Transportation', 'Public Services', 'Rejected'];

  useEffect(() => {
    fetchComplaints();
    fetchAllComplaints(); 
  }, [activeTab]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/complaints`;
      if (activeTab === 'Rejected') {
        url += `?status=Rejected`;
      } else {
        url += `?category=${activeTab}`;
      }
      
      const response = await axios.get(url);
      
      let filtered = response.data;
      if (activeTab !== 'Rejected') {
        filtered = response.data.filter(c => c.status !== 'Rejected');
      }

      setComplaints(filtered);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const fetchAllComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      setAllComplaints(response.data);
    } catch (err) {
      console.error('Fetch all error:', err);
    }
  };

  if (loading) return <div className="loading">Updating Dashboard...</div>;

  return (
    <div className="admin-page">
      <h2>Civic Intelligence Dashboard (Moderator)</h2>
      
      <DashboardStats />
      
      <BangaloreHeatmap complaints={allComplaints} />

      <ResourceAllocationPanel />

      <div className="admin-sections">
        <div className="category-tabs">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`tab-btn ${activeTab === cat ? 'active' : ''} ${cat === 'Rejected' ? 'tab-cancel' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <section className="queue-section">
          <h3>{activeTab} Complaints Queue</h3>
          <div className="complaints-grid">
            {complaints.length > 0 ? (
              complaints.map(complaint => (
                <ComplaintCard 
                  key={complaint._id} 
                  complaint={complaint} 
                  isAdmin={true}
                  onRefresh={fetchComplaints}
                />
              ))
            ) : (
              <p className="empty">No complaints found in this section.</p>
            )}
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .category-tabs { display: flex; gap: 10px; margin-bottom: 25px; overflow-x: auto; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .tab-btn { padding: 10px 24px; border: 1px solid #ddd; border-radius: 25px; background: white; cursor: pointer; white-space: nowrap; font-weight: 600; color: #666; transition: all 0.3s; }
        .tab-btn:hover { background: #f0f0f0; }
        .tab-btn.active { background: #646cff; color: white; border-color: #646cff; }
        .tab-btn.tab-cancel.active { background: #e74c3c; border-color: #e74c3c; }
        
        .complaints-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
        .empty { padding: 40px; text-align: center; color: #999; font-style: italic; background: #fafafa; border-radius: 12px; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
