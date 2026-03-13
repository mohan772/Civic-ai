import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResourceAllocationPanel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resource-allocation');
        setRecommendations(response.data);
      } catch (err) {
        console.error('Error fetching resource recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    // Auto-refresh every minute
    const interval = setInterval(fetchRecommendations, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Computing resource allocations...</div>;

  return (
    <div className="allocation-panel">
      <h3>AI Resource Allocation Engine</h3>
      <p className="panel-subtitle">Optimizing city resources based on complaint density and urgency.</p>
      
      <div className="allocation-grid">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="allocation-card">
              <div className="card-header">
                <span className="area-tag">{rec.area}</span>
                <span className={`category-tag ${rec.category.toLowerCase().replace(' ', '-')}`}>
                  {rec.category}
                </span>
              </div>
              <div className="card-body">
                <div className="stat-row">
                  <span className="stat-label">Active Complaints:</span>
                  <span className="stat-value">{rec.complaints}</span>
                </div>
                <div className="suggestion-box">
                  <strong>Recommended Action:</strong>
                  <p>{rec.suggestion}</p>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn-approve">Approve Allocation</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No urgent resource allocations required at this moment.</p>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .allocation-panel {
          margin-top: 30px;
          background: #fdfdfd;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #eee;
        }
        .allocation-panel h3 {
          margin: 0 0 5px 0;
          color: #2c3e50;
        }
        .panel-subtitle {
          color: #7f8c8d;
          font-size: 14px;
          margin-bottom: 25px;
        }
        .allocation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .allocation-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          overflow: hidden;
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
        }
        .card-header {
          padding: 15px;
          background: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        .area-tag {
          font-weight: 700;
          color: #34495e;
          font-size: 14px;
        }
        .category-tag {
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          background: #e0e0e0;
        }
        .category-tag.sanitation { background: #e8f5e9; color: #2e7d32; }
        .category-tag.infrastructure { background: #fff3e0; color: #ef6c00; }
        .category-tag.utilities { background: #e3f2fd; color: #1565c0; }
        
        .card-body {
          padding: 20px;
          flex-grow: 1;
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .stat-label { color: #7f8c8d; font-size: 14px; }
        .stat-value { font-weight: 700; color: #e74c3c; }
        
        .suggestion-box {
          background: #fff9c4;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #fbc02d;
        }
        .suggestion-box strong {
          display: block;
          font-size: 12px;
          color: #827717;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .suggestion-box p {
          margin: 0;
          font-size: 15px;
          color: #333;
          font-weight: 600;
        }
        
        .card-footer {
          padding: 15px;
          background: #f8f9fa;
          text-align: center;
        }
        .btn-approve {
          background: #3498db;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }
        .btn-approve:hover {
          background: #2980b9;
        }
        .no-data {
          grid-column: 1 / -1;
          text-align: center;
          color: #95a5a6;
          padding: 40px;
          font-style: italic;
        }
      `}} />
    </div>
  );
};

export default ResourceAllocationPanel;
