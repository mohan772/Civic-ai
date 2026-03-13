import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to CivicCare</h1>
        <p>A transparent platform for resolving civic issues in your community.</p>
        <div className="hero-actions">
          <Link to="/submit" className="btn-primary">Submit a Complaint</Link>
          <Link to="/status" className="btn-secondary">Check Status</Link>
        </div>
      </section>
      <section className="info">
        <h3>How it Works</h3>
        <p>Report issues like broken streetlights, potholes, or sanitation problems, and track their progress in real-time.</p>
      </section>
    </div>
  );
};

export default Home;
