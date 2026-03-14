import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BangaloreHeatmap from '../components/BangaloreHeatmap';
import DashboardStats from '../components/DashboardStats';
import '../styles/global.css';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("https://civic-ai-backend.onrender.com/api/complaints");
        setComplaints(response.data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div className="loading">Loading City Data...</div>;

  return (
    <div className="user-dashboard-page" style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a1a' }}>Public Civic Dashboard</h1>
        <p style={{ color: '#666' }}>Real-time transparency into civic issues across Bengaluru.</p>
      </header>

      <DashboardStats />

      <section className="heatmap-section" style={{ marginTop: '40px' }}>
        <BangaloreHeatmap complaints={complaints} />
      </section>

      <section className="info-section" style={{ marginTop: '40px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3>How to use this map?</h3>
        <p>This heatmap visualizes the density of civic complaints reported through our platform. 
           Hotspots (Red) indicate areas with high volumes of reports or repeated issues. 
           You can click on the markers to see specific details about each complaint.</p>
      </section>
    </div>
  );
};

export default UserDashboard;
