import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Next-Gen Urban Governance</div>
          <h1>Transforming Our City with <span className="text-gradient">AI Intelligence</span></h1>
          <p className="hero-lead">Empowering citizens to build a smarter, safer, and cleaner Bengaluru through automated AI classification and real-time civic analytics.</p>
          <div className="hero-cta">
            <Link to="/submit" className="primary-btn">Report a Civic Issue</Link>
            <Link to="/status" className="secondary-btn">Track Existing Reports</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card main-stats">
            <span className="visual-icon">📊</span>
            <div className="visual-text">
              <strong>94%</strong>
              <span>Resolution Rate</span>
            </div>
          </div>
          <div className="visual-card ai-tag">
            <span className="visual-icon">🤖</span>
            <div className="visual-text">
              <strong>AI Classification</strong>
              <span>Automated Routing</span>
            </div>
          </div>
          <div className="visual-card city-pulse">
            <span className="visual-icon">📈</span>
            <div className="visual-text">
              <strong>City Pulse</strong>
              <span>Live Health Score: 88</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card card">
          <div className="feature-icon saffron-bg">⚡</div>
          <h3>Rapid Response</h3>
          <p>AI-driven routing ensures your complaints reach the right department in milliseconds, not days.</p>
        </div>
        <div className="feature-card card">
          <div className="feature-icon blue-bg">📍</div>
          <h3>Geospatial Intelligence</h3>
          <p>Hyper-local tracking and duplicate detection prevent redundant tickets and optimize resources.</p>
        </div>
        <div className="feature-card card">
          <div className="feature-icon green-bg">🛡️</div>
          <h3>Trust System</h3>
          <p>A transparent trust-score mechanism prioritizes genuine reports and rewards active citizenship.</p>
        </div>
      </section>

      <section className="stats-strip">
        <div className="stat-item">
          <strong>12k+</strong>
          <span>Complaints Resolved</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <strong>45m</strong>
          <span>Avg. Response Time</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <strong>100%</strong>
          <span>Transparency</span>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 80px;
          padding-bottom: 60px;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 40px;
          padding: 60px 0;
        }

        .hero-badge {
          display: inline-block;
          background: #EBF8FF;
          color: #2B6CB0;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-content h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--ashoka-blue), var(--saffron));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-lead {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 40px;
          max-width: 600px;
        }

        .hero-cta {
          display: flex;
          gap: 20px;
        }

        .primary-btn {
          background: var(--ashoka-blue);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 800;
          transition: var(--transition);
        }

        .secondary-btn {
          background: white;
          color: var(--ashoka-blue);
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 800;
          border: 2px solid var(--ashoka-blue);
          transition: var(--transition);
        }

        .hero-visual {
          position: relative;
          height: 400px;
        }

        .visual-card {
          position: absolute;
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 15px;
          width: 240px;
          animation: float 6s ease-in-out infinite;
        }

        .main-stats { top: 0; right: 0; }
        .ai-tag { top: 150px; left: 0; animation-delay: -2s; }
        .city-pulse { bottom: 0; right: 50px; animation-delay: -4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .visual-icon {
          width: 48px;
          height: 48px;
          background: var(--bg-main);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .visual-text strong { display: block; font-size: 1.25rem; }
        .visual-text span { font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .feature-card {
          text-align: center;
          padding: 40px;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 24px;
        }

        .saffron-bg { background: #FFF5F0; color: #FF4D00; }
        .blue-bg { background: #EBF8FF; color: #2B6CB0; }
        .green-bg { background: #F0FFF4; color: #2F855A; }

        .stats-strip {
          background: var(--ashoka-blue);
          border-radius: 24px;
          padding: 40px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: white;
        }

        .stat-item { text-align: center; }
        .stat-item strong { display: block; font-size: 2.5rem; margin-bottom: 4px; }
        .stat-item span { color: rgba(255,255,255,0.7); text-transform: uppercase; font-weight: 800; font-size: 0.8rem; }
        .stat-divider { width: 1px; height: 50px; background: rgba(255,255,255,0.1); }

        @media (max-width: 992px) {
          .hero-section { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Home;
