import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import ComplaintCard from '../components/ComplaintCard';

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [citizen, setCitizen] = useState(null);
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGlobalComplaints = async () => {
    try {
      const response = await axios.get('/complaints');
      setComplaints(response.data);
      setCitizen(null);
      setIsSearching(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load global complaints registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPhone) {
      fetchGlobalComplaints();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    setError(null);

    try {
      // 1. Fetch Citizen Stats
      const statsRes = await axios.get(`/leaderboard/${searchPhone}`);
      setCitizen(statsRes.data);

      // 2. Fetch Personal Complaints
      const complaintsRes = await axios.get(`/complaints?phone=${searchPhone}`);
      setComplaints(complaintsRes.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Citizen not found. Please ensure the phone number is correct.");
        setCitizen(null);
        setComplaints([]);
      } else {
        setError("An error occurred during search. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalComplaints();
  }, []);

  if (loading && !isSearching) return <div className="loading-screen">Accessing Civic Registry...</div>;

  return (
    <div className="status-page-container">
      <div className="status-header">
        <h1>{isSearching ? 'Personal Civic Profile' : 'Global Civic Registry'}</h1>
        <p>{isSearching ? `Viewing reports and engagement stats for ${searchPhone}` : 'Transparency in action. Viewing all reported civic issues across the city.'}</p>
      </div>

      <div className="search-bar-container">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Search by Phone (e.g., 9876543210)" 
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            {loading ? '...' : '🔍 Check Status'}
          </button>
          {isSearching && (
            <button type="button" onClick={fetchGlobalComplaints} className="clear-btn">
              Clear
            </button>
          )}
        </form>
      </div>

      {citizen && (
        <section className="citizen-stats-section card">
          <div className="stats-main">
            <div className="stat-box">
              <span className="stat-label">Civic Level</span>
              <span className="stat-value highlight">{citizen.level}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Total Points</span>
              <span className="stat-value points">{citizen.points} pts</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Trust Score</span>
              <div className="trust-meter">
                <div className="trust-fill" style={{ width: `${citizen.trustScore}%` }}></div>
                <span>{citizen.trustScore}%</span>
              </div>
            </div>
          </div>
          <div className="stats-breakdown">
            <div className="breakdown-item">
              <strong>{citizen.totalComplaints}</strong>
              <span>Total Reports</span>
            </div>
            <div className="breakdown-item positive">
              <strong>{citizen.validComplaints}</strong>
              <span>Valid</span>
            </div>
            <div className="breakdown-item negative">
              <strong>{citizen.fakeComplaints}</strong>
              <span>Invalid/Fake</span>
            </div>
          </div>
        </section>
      )}

      {error && <div className="status-error">{error}</div>}

      <div className="results-section">
        <div className="registry-meta">
          <h2>{isSearching ? 'My Reported Issues' : 'Live Complaint Feed'}</h2>
          <span className="count-badge">{complaints.length} Reports Found</span>
        </div>
        
        {complaints.length > 0 ? (
          <div className="complaints-grid-modern">
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} isAdmin={false} />
            ))}
          </div>
        ) : (
          <div className="no-results card">
            <span className="info-icon">📋</span>
            <p>{isSearching ? "No reports found for this phone number." : "The civic registry is currently empty. All clear!"}</p>
          </div>
        )}
      </div>

      <style>{`
        .status-page-container { max-width: 1200px; margin: 0 auto; padding-bottom: 60px; padding-top: 40px; }
        .status-header { text-align: center; margin-bottom: 30px; border-bottom: 4px solid var(--saffron); padding-bottom: 30px; }
        .status-header h1 { font-size: 3rem; color: var(--ashoka-blue); margin-bottom: 10px; }
        .status-header p { color: var(--text-secondary); font-size: 1.2rem; font-weight: 500; }

        .search-bar-container { margin-bottom: 40px; display: flex; justify-content: center; }
        .search-form { display: flex; gap: 10px; width: 100%; max-width: 600px; }
        .search-input { 
          flex-grow: 1; 
          padding: 14px 20px; 
          border-radius: 12px; 
          border: 2px solid #e0e0e0; 
          font-size: 1rem; 
          font-weight: 600;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--ashoka-blue); outline: none; }
        .search-btn { 
          background: var(--ashoka-blue); 
          color: white; 
          border: none; 
          padding: 0 25px; 
          border-radius: 12px; 
          font-weight: 700; 
          cursor: pointer;
        }
        .clear-btn {
          background: #f0f0f0;
          color: #666;
          border: none;
          padding: 0 20px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .citizen-stats-section {
          background: white;
          padding: 30px;
          border-radius: 20px;
          margin-bottom: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-left: 6px solid var(--ashoka-blue);
        }

        .stats-main {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #f0f0f0;
        }

        .stat-box { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.85rem; color: #718096; text-transform: uppercase; font-weight: 800; margin-bottom: 8px; }
        .stat-value { font-size: 1.8rem; font-weight: 800; color: #1a202c; }
        .stat-value.highlight { color: var(--ashoka-blue); }
        .stat-value.points { color: #2ecc71; }

        .trust-meter {
          height: 12px;
          background: #edf2f7;
          border-radius: 6px;
          position: relative;
          margin-top: 10px;
        }
        .trust-fill { height: 100%; background: #3182ce; border-radius: 6px; }
        .trust-meter span { position: absolute; right: 0; top: -20px; font-size: 0.8rem; font-weight: 800; color: #3182ce; }

        .stats-breakdown { display: flex; gap: 40px; }
        .breakdown-item { display: flex; flex-direction: column; }
        .breakdown-item strong { font-size: 1.2rem; color: #2d3748; }
        .breakdown-item span { font-size: 0.75rem; color: #718096; font-weight: 700; text-transform: uppercase; }
        .breakdown-item.positive strong { color: #38a169; }
        .breakdown-item.negative strong { color: #e53e3e; }

        .registry-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .registry-meta h2 { margin: 0; font-size: 1.8rem; }
        .count-badge { background: var(--ashoka-blue); color: white; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 0.85rem; }

        .status-error { 
          background: #ffebee; 
          color: #d32f2f; 
          padding: 15px; 
          border-radius: 10px; 
          margin-bottom: 30px; 
          font-weight: 700; 
          text-align: center;
        }

        .no-results { text-align: center; padding: 80px; }
        .info-icon { font-size: 3rem; display: block; margin-bottom: 15px; opacity: 0.3; }

        .complaints-grid-modern {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 25px;
        }

        @media (max-width: 768px) {
          .complaints-grid-modern { grid-template-columns: 1fr; }
          .registry-meta { flex-direction: column; align-items: flex-start; gap: 10px; }
          .stats-main { grid-template-columns: 1fr; gap: 20px; }
          .stats-breakdown { flex-wrap: wrap; gap: 20px; }
        }
      `}</style>
    </div>
  );
};

export default ComplaintStatus;
