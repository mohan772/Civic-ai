import React from 'react';

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      <div className="stat-item">
        <h4>Total Complaints</h4>
        <p>{stats.total}</p>
      </div>
      <div className="stat-item">
        <h4>Pending</h4>
        <p>{stats.pending}</p>
      </div>
      <div className="stat-item">
        <h4>Resolved</h4>
        <p>{stats.resolved}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
