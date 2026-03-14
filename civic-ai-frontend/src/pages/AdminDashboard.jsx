import React, { useState, useEffect } from 'react';
import api from '../services/api';
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
  
  const [viewMode, setViewMode] = useState('status'); 
  const [activeTab, setActiveTab] = useState('Pending'); 

  const statusTabs = ['Pending', 'Accepted', 'Rejected', 'Resolved'];
  const departmentTabs = ['BBMP Roads', 'BBMP Waste Management', 'BWSSB', 'BESCOM', 'Traffic Police', 'Municipal Services'];

  useEffect(() => {
    fetchComplaints();
    fetchAllComplaints(); 
  }, [activeTab, viewMode]);

  useEffect(() => {
    const interval = setInterval(fetchAllComplaints, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (viewMode === 'status') {
        params.status = activeTab;
      } else {
        params.department = activeTab;
        params.status = 'Accepted';
      }
      
      const response = await api.get('/complaints', { params });
      setComplaints(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const fetchAllComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setAllComplaints(response.data);
    } catch (err) {}
  };

  const getDeptCount = (dept) => allComplaints.filter(c => c.department === dept && c.ticketId).length;

  if (loading && complaints.length === 0) return (
    <div className="admin-loading-screen">
      <div className="loader-pulse"></div>
      <p>Initializing Command Center...</p>
    </div>
  );

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div className="header-top">
          <div className="header-title-group">
            <span className="live-indicator">● LIVE SYSTEM</span>
            <h1>Administrative Oversight Panel</h1>
          </div>
          <div className="header-meta">
            <div className="meta-item">
              <span className="meta-label">Total Volume</span>
              <span className="meta-value">{allComplaints.length}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">System Integrity</span>
              <span className="meta-value">99.8%</span>
            </div>
          </div>
        </div>
        <div className="accent-bar-full"></div>
      </header>
      
      <div className="dashboard-grid-layout">
        {/* Left Column: Alerts & Metrics */}
        <aside className="dashboard-sidebar">
          <LiveCityMetrics />
          <EmergencyAlerts />
          <CivicHotspots />
        </aside>

        {/* Right Column: Analytics & Queue */}
        <main className="dashboard-main-content">
          <section className="analytics-hero">
            <div className="analytics-card-pair">
              <CivicHealthGauge />
              <DepartmentPerformance />
            </div>
          </section>

          <DashboardStats />

          <section className="heatmap-container-card card">
            <div className="card-header">
              <h3>Geospatial Incident Density</h3>
              <p>Visualizing real-time civic hotspots across the Bengaluru metropolitan region.</p>
            </div>
            <BangaloreHeatmap complaints={allComplaints} />
          </section>

          <div className="moderation-workspace card">
            <div className="workspace-header">
              <div className="view-selector">
                <button 
                  className={`view-btn ${viewMode === 'status' ? 'active' : ''}`} 
                  onClick={() => {setViewMode('status'); setActiveTab('Pending');}}
                >
                  Moderation View
                </button>
                <button 
                  className={`view-btn ${viewMode === 'dept' ? 'active' : ''}`} 
                  onClick={() => {setViewMode('dept'); setActiveTab('BBMP Roads');}}
                >
                  Departmental View
                </button>
              </div>
              <div className="tab-navigation">
                {(viewMode === 'status' ? statusTabs : departmentTabs).map(tab => (
                  <button 
                    key={tab} 
                    className={`nav-tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    {viewMode === 'dept' && <span className="tab-count">{getDeptCount(tab)}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="queue-container">
              <div className="queue-info">
                <h4>{activeTab} Queue</h4>
                <span>{complaints.length} Records Found</span>
              </div>
              
              <div className="complaints-grid-modern">
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
                  <div className="empty-queue-state">
                    <span className="empty-icon">📂</span>
                    <p>No complaints currently in this queue.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .admin-page-container {
          background-color: var(--bg-main);
          min-height: 100vh;
        }

        .admin-page-header {
          background: white;
          padding: 40px 24px 0;
          margin-bottom: 30px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          max-width: 1400px;
          margin: 0 auto;
          padding-bottom: 30px;
        }

        .header-title-group .live-indicator {
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--danger);
          letter-spacing: 1px;
          margin-bottom: 8px;
          display: block;
        }

        .header-title-group h1 { margin: 0; font-size: 2.5rem; }

        .header-meta { display: flex; gap: 40px; }
        .meta-item { display: flex; flex-direction: column; align-items: flex-end; }
        .meta-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
        .meta-value { font-size: 1.5rem; font-weight: 900; color: var(--ashoka-blue); }

        .accent-bar-full { height: 4px; background: var(--saffron); width: 100%; }

        .dashboard-grid-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px 60px;
        }

        .dashboard-sidebar { display: flex; flex-direction: column; gap: 24px; }
        .dashboard-main-content { display: flex; flex-direction: column; gap: 30px; }

        .analytics-card-pair {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
        }

        .card-header { margin-bottom: 24px; }
        .card-header h3 { margin: 0 0 4px 0; font-size: 1.25rem; }
        .card-header p { margin: 0; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }

        .moderation-workspace { padding: 0 !important; overflow: hidden; }
        .workspace-header {
          background: #F8FAFC;
          border-bottom: 1px solid var(--border);
        }

        .view-selector {
          padding: 16px 24px;
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--border);
        }

        .view-btn {
          background: white;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        .view-btn.active {
          background: var(--ashoka-blue);
          color: white;
          border-color: var(--ashoka-blue);
        }

        .tab-navigation {
          padding: 0 24px;
          display: flex;
          gap: 4px;
          overflow-x: auto;
        }

        .nav-tab-btn {
          background: none;
          border: none;
          padding: 16px 20px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          position: relative;
          white-space: nowrap;
        }

        .nav-tab-btn.active {
          color: var(--saffron);
          font-weight: 800;
        }

        .nav-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--saffron);
        }

        .tab-count {
          background: #EDF2F7;
          color: var(--text-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          margin-left: 8px;
        }

        .queue-container { padding: 24px; }
        .queue-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .queue-info h4 { margin: 0; font-size: 1.1rem; }
        .queue-info span { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }

        .complaints-grid-modern {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .empty-queue-state {
          grid-column: 1 / -1;
          padding: 80px;
          text-align: center;
          color: var(--text-muted);
        }
        .empty-icon { font-size: 3rem; display: block; margin-bottom: 16px; }

        .admin-loading-screen {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
        }
        .loader-pulse {
          width: 60px;
          height: 60px;
          background: var(--ashoka-blue);
          border-radius: 50%;
          animation: pulse-ring 1.5s infinite;
          margin-bottom: 20px;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        @media (max-width: 1200px) {
          .dashboard-grid-layout { grid-template-columns: 1fr; }
          .analytics-card-pair { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
