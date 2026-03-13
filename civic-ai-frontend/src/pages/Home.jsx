import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="modern-home">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>AI-Powered Civic Complaint Intelligence</h1>
          <p>Transforming urban governance with transparency, AI classification, and real-time resolution tracking.</p>
          <div className="hero-btns">
            <Link to="/submit" className="cta-primary">Report an Issue</Link>
            <Link to="/status" className="cta-secondary">Track Progress</Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-grid">
        <div className="feature-card">
          <span className="icon">🤖</span>
          <h3>AI Classification</h3>
          <p>Gemini AI automatically categorizes and routes complaints to the correct department within seconds.</p>
        </div>
        <div className="feature-card">
          <span className="icon">📊</span>
          <h3>Resource Allocation</h3>
          <p>Smart engine predicts and suggests resource deployment based on complaint density and urgency.</p>
        </div>
        <div className="feature-card">
          <span className="icon">🛡️</span>
          <h3>Fraud Detection</h3>
          <p>Built-in AI filters out fake reports and spam, ensuring focus on genuine community issues.</p>
        </div>
        <div className="feature-card">
          <span className="icon">✅</span>
          <h3>Transparent Tickets</h3>
          <p>Every complaint follows a strict verification and ticketing lifecycle with photo proof of resolution.</p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <h2>Our Digital Workflow</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-num">1</div>
            <h4>Report</h4>
            <p>Citizen submits a report with location and photo.</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h4>Analyze</h4>
            <p>AI classifies category, priority, and responsible department.</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h4>Resolve</h4>
            <p>Department receives a ticket and uploads proof of work.</p>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <h4>Verify</h4>
            <p>Admin closes the ticket after quality verification.</p>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .modern-home { font-family: 'Inter', sans-serif; }
        
        .hero-section {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 100px 20px;
          text-align: center;
          border-radius: 0 0 50px 50px;
        }
        .hero-content h1 { font-size: 3.5rem; margin-bottom: 20px; font-weight: 800; }
        .hero-content p { font-size: 1.2rem; max-width: 800px; margin: 0 auto 40px; opacity: 0.9; }
        
        .hero-btns { display: flex; justify-content: center; gap: 20px; }
        .cta-primary { background: #646cff; color: white; padding: 15px 35px; border-radius: 30px; text-decoration: none; font-weight: 700; box-shadow: 0 4px 15px rgba(100,108,255,0.4); }
        .cta-secondary { background: rgba(255,255,255,0.1); color: white; padding: 15px 35px; border-radius: 30px; text-decoration: none; font-weight: 700; backdrop-filter: blur(10px); }
        
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; padding: 80px 40px; }
        .feature-card { background: #f9f9f9; padding: 40px; border-radius: 20px; text-align: center; transition: transform 0.3s; }
        .feature-card:hover { transform: translateY(-10px); }
        .feature-card .icon { font-size: 40px; display: block; margin-bottom: 20px; }
        .feature-card h3 { margin-bottom: 15px; color: #2c3e50; }
        .feature-card p { color: #666; font-size: 14px; line-height: 1.6; }
        
        .how-it-works { background: #fff; padding: 100px 40px; text-align: center; }
        .how-it-works h2 { margin-bottom: 60px; font-size: 2.5rem; }
        .steps-container { display: flex; justify-content: space-between; gap: 30px; max-width: 1200px; margin: 0 auto; }
        .step { flex: 1; }
        .step-num { width: 50px; height: 50px; background: #646cff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-weight: 800; font-size: 20px; }
        .step h4 { margin-bottom: 10px; color: #2c3e50; }
        .step p { font-size: 14px; color: #777; }
        
        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.2rem; }
          .steps-container { flex-direction: column; }
        }
      `}} />
    </div>
  );
};

export default Home;
