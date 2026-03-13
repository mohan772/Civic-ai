import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentPerformance = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics/department-performance');
        setDepartments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPerf();
  }, []);

  if (loading) return <div>Analyzing Performance...</div>;
  if (departments.length === 0) return null;

  const topDept = departments[0]; // Already sorted by resolutionRate descending

  return (
    <div className="dept-perf-container">
      <div className="perf-header">
        <h3>Agency Efficiency Metrics</h3>
        {topDept && (
          <div className="top-performer-badge">
             🏆 Top: {topDept.department} ({Math.round(topDept.resolutionRate)}%)
          </div>
        )}
      </div>

      <div className="dept-perf-grid">
        {departments.map(dept => (
          <div key={dept.department} className="dept-perf-card">
            <div className="dept-meta">
              <span className="dept-name">{dept.department}</span>
              <span className="dept-total">{dept.total} Reports</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${dept.resolutionRate}%` }}
              ></div>
            </div>
            <div className="dept-stats">
              <span>{Math.round(dept.resolutionRate)}% Resolved</span>
              <span>{dept.avgResTimeHours ? `${Math.round(dept.avgResTimeHours)}h avg` : 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .dept-perf-container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border-top: 5px solid var(--ashoka-blue);
        }
        .perf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        .perf-header h3 {
          margin: 0;
          color: var(--ashoka-blue);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .top-performer-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 800;
          border: 1px solid #c8e6c9;
        }
        .dept-perf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .dept-perf-card {
          background: #fcfcfc;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid var(--saffron);
        }
        .dept-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .dept-name { font-weight: 800; color: var(--ashoka-blue); font-size: 0.9rem; }
        .dept-total { font-size: 0.75rem; color: #777; font-weight: 700; }
        
        .progress-bar-container {
          height: 8px;
          background: #eee;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--saffron), #138808);
          border-radius: 4px;
          transition: width 1s ease-in-out;
        }
        .dept-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default DepartmentPerformance;
