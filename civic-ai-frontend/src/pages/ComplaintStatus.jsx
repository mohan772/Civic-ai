import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComplaintCard from '../components/ComplaintCard';

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/complaints");
      setComplaints(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();

    // Automatically refresh every 10 seconds to show new complaints
    const intervalId = setInterval(fetchComplaints, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="status-page">
        <h2>Civic Complaints Status</h2>
        <div className="loading">Loading complaints...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-page">
        <h2>Civic Complaints Status</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="status-page">
      <h2>Your Complaints</h2>
      <div className="complaints-list">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))
        ) : (
          <p>No complaints found.</p>
        )}
      </div>
    </div>
  );
};

export default ComplaintStatus;
