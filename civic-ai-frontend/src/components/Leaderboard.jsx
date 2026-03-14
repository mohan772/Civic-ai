import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get('/leaderboard');
        setLeaders(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return <div className="leaderboard-loading">Loading Champions...</div>;

  return (
    <div className="leaderboard-card card">
      <div className="leaderboard-header">
        <span className="trophy-icon">🏆</span>
        <h3>Live Civic Leaderboard</h3>
      </div>
      <div className="leaderboard-list">
        {leaders.length > 0 ? (
          leaders.map((citizen, index) => (
            <div key={citizen._id} className={`leader-item ${index < 3 ? 'top-three' : ''}`}>
              <div className="rank">#{index + 1}</div>
              <div className="citizen-info">
                <div className="phone">
                  {citizen.phone.substring(0, 2)}******{citizen.phone.substring(8)}
                </div>
                <div className="level-badge">{citizen.level}</div>
              </div>
              <div className="points-display">
                <strong>{citizen.points}</strong>
                <span>pts</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No data available yet.</p>
        )}
      </div>

      <style>{`
        .leaderboard-card {
          padding: 25px;
          background: white;
          border-radius: 20px;
          box-shadow: var(--shadow-md);
        }

        .leaderboard-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 15px;
        }

        .trophy-icon { font-size: 1.8rem; }
        .leaderboard-header h3 { margin: 0; font-size: 1.4rem; color: var(--ashoka-blue); }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .leader-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 15px;
          border-radius: 12px;
          background: #f8f9fa;
          transition: transform 0.2s;
        }

        .leader-item:hover { transform: translateX(5px); background: #f0f4f8; }

        .top-three { background: #fff8f0; border: 1px solid #ffd8a8; }
        .top-three:nth-child(1) .rank { background: #ffd700; color: #5c4d00; }
        .top-three:nth-child(2) .rank { background: #c0c0c0; color: #333; }
        .top-three:nth-child(3) .rank { background: #cd7f32; color: #fff; }

        .rank {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          color: #495057;
        }

        .citizen-info { flex-grow: 1; }
        .phone { font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
        .level-badge { 
          font-size: 0.7rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          color: var(--ashoka-blue); 
          background: rgba(0, 112, 186, 0.08);
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .points-display { text-align: right; }
        .points-display strong { display: block; font-size: 1.1rem; color: #2ecc71; }
        .points-display span { font-size: 0.75rem; color: #666; font-weight: 600; }

        .no-data { text-align: center; color: #666; padding: 20px; }
        .leaderboard-loading { text-align: center; padding: 40px; color: #666; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Leaderboard;
