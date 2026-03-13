import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardStats from '../components/DashboardStats';
import ResourceAllocationPanel from '../components/ResourceAllocationPanel';
import ComplaintCard from '../components/ComplaintCard';
import BangaloreHeatmap from '../components/BangaloreHeatmap'; 
import CivicHealthGauge from '../components/CivicHealthGauge';
import DepartmentPerformance from '../components/DepartmentPerformance';
import CivicHotspots from '../components/CivicHotspots';
import LiveCityMetrics from '../components/LiveCityMetrics';
import EmergencyAlerts from '../components/EmergencyAlerts';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Requirement: Grouping by Status or Department
  const [viewMode, setViewMode] = useState('status'); 
  const [activeTab, setActiveTab] = useState('Pending'); 

  const statusTabs = ['Pending', 'Accepted', 'Rejected', 'Resolved'];
  const departmentTabs = ['BBMP Roads', 'BBMP Waste Management', 'BWSSB', 'BESCOM', 'Traffic Police', 'Municipal Services'];

  useEffect(() => {
    fetchComplaints();
    fetchAllComplaints(); 
  }, [activeTab, viewMode]);

  // Background sync for Live Ticket Distribution summary
  useEffect(() => {
    const interval = setInterval(fetchAllComplaints, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/complaints`;
      const params = new URLSearchParams();
      
      if (viewMode === 'status') {
        params.append('status', activeTab);
      } else {
        params.append('department', activeTab);
        params.append('status', 'Accepted'); // Only show accepted complaints for departments
      }
      
      const response = await axios.get(`${url}?${params.toString()}`);
      setComplaints(response.data);
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
    } catch (err) {}
  };

  // Calculate ticket counts per department for the summary
  const getDeptCount = (dept) => allComplaints.filter(c => c.department === dept && c.ticketId).length;

  if (loading) return <div className="loading">Refreshing Portal Data...</div>;

  return (
    <div className="admin-page-container">
      <header className="page-header">
        <h1>Administrative Oversight Panel</h1>
        <div className="accent-bar"></div>
      </header>
      
      <div className="dashboard-top-section">
        <LiveCityMetrics />
        <EmergencyAlerts />
      </div>

      <DashboardStats />

      {/* NEW: Analytics Section */}
      <section className="analytics-dashboard-grid">
        <CivicHealthGauge />
        <DepartmentPerformance />
      </section>

      {/* Ticket Breakdown by Category/Department */}
      <section className="ticket-summary-section">
        <h3 className="section-subtitle">Live Ticket Distribution</h3>
        <div className="dept-summary-grid">
          {departmentTabs.map(dept => (
            <div key={dept} className="dept-summary-card">
              <span className="dept-name">{dept}</span>
              <span className="dept-count">{getDeptCount(dept)} Tickets</span>
            </div>
          ))}
        </div>
      </section>
      
      <div className="heatmap-section-gov">
        <div className="section-title-box">
          <h2 className="heatmap-title">Bengaluru Civic Complaint Heatmap</h2>
        </div>
        <BangaloreHeatmap complaints={allComplaints} />
      </div>

      {/* NEW: Hotspots Section */}
      <section className="hotspots-section-gov">
        <CivicHotspots />
      </section>

      <div className="admin-content">
        <div className="view-toggle">
          <button 
            className={viewMode === 'status' ? 'active' : ''} 
            onClick={() => {setViewMode('status'); setActiveTab('Pending');}}
          >
            Moderation View
          </button>
          <button 
            className={viewMode === 'dept' ? 'active' : ''} 
            onClick={() => {setViewMode('dept'); setActiveTab('BBMP Roads');}}
          >
            Departmental Oversight
          </button>
        </div>

        <div className="gov-tabs">
          {(viewMode === 'status' ? statusTabs : departmentTabs).map(tab => (
            <button 
              key={tab} 
              className={`gov-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="mod-queue">
          <h3 className="queue-title">{activeTab} Queue</h3>
          <div className="complaints-grid-gov">
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
              <div className="gov-empty">No records found for {activeTab}.</div>
            )}
          </div>
        </section>
      </div>

      <footer className="footer">
        Smart Civic Governance Platform &copy; {new Date().getFullYear()}
      </footer>

      <style>{`
        .admin-page-container { background-color: #fcfcfc; min-height: 100vh; padding-bottom: 50px; }
        .page-header { margin-bottom: 40px; text-align: center; }
        .page-header h1 { font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; }
        .accent-bar { width: 80px; height: 4px; background: var(--saffron); margin: 0 auto; }

        .dashboard-top-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 25px;
          padding: 0 20px;
          margin-bottom: 30px;
        }

        .section-subtitle { font-size: 1rem; color: var(--ashoka-blue); text-transform: uppercase; font-weight: 800; margin-bottom: 15px; border-bottom: 2px solid var(--saffron); display: inline-block; }
        .ticket-summary-section { margin-bottom: 40px; padding: 0 20px; }
        .dept-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; }
        .dept-summary-card { background: white; padding: 15px; border-radius: 10px; border-top: 4px solid var(--ashoka-blue); box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; transition: all 0.3s; }
        .dept-summary-card:hover { border-top-color: var(--saffron); transform: translateY(-3px); }
        .dept-name { display: block; font-size: 0.7rem; font-weight: 800; color: #666; text-transform: uppercase; margin-bottom: 5px; }
        .dept-count { font-size: 1.3rem; font-weight: 900; color: var(--ashoka-blue); }
        
        .analytics-dashboard-grid { 
          display: grid; 
          grid-template-columns: 1fr 2fr; 
          gap: 25px; 
          padding: 0 20px; 
          margin-bottom: 40px; 
        }
        .hotspots-section-gov {
          padding: 0 20px;
          margin-bottom: 40px;
        }

        .view-toggle { display: flex; gap: 10px; margin-bottom: 25px; padding: 0 20px; }

        @media (max-width: 992px) {
          .analytics-dashboard-grid { grid-template-columns: 1fr; }
        }
        .view-toggle button { padding: 10px 25px; border: 2px solid var(--ashoka-blue); background: white; color: var(--ashoka-blue); font-size: 0.85rem; font-weight: 800; border-radius: 30px; cursor: pointer; transition: all 0.3s; }
        .view-toggle button.active { background: var(--ashoka-blue); color: white; }

        .gov-tabs { display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 2px solid #eee; overflow-x: auto; padding-bottom: 10px; padding-left: 20px; }
        .gov-tab-btn { background: none; border: none; padding: 10px 20px; font-size: 0.9rem; font-weight: 700; color: #777; white-space: nowrap; position: relative; cursor: pointer; }
        .gov-tab-btn.active { color: var(--saffron); }
        .gov-tab-btn.active::after { content: ''; position: absolute; bottom: -12px; left: 0; right: 0; height: 4px; background: var(--saffron); }

        .admin-content { padding: 0 20px; }
        .complaints-grid-gov { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 25px; }
        .gov-empty { background: white; padding: 60px; text-align: center; border-radius: 12px; color: #aaa; font-style: italic; border: 1px dashed #ddd; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
