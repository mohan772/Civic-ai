import React, { useState } from 'react';
import ComplaintForm from '../components/ComplaintForm';

const SubmitComplaint = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="submit-page-container">
      <header className="submit-header">
        <div className="header-badge">Step {step} of 2</div>
        <h1>Report a Civic Issue</h1>
        <p>Your report will be automatically classified by our AI and routed to the appropriate department.</p>
      </header>

      <div className="stepper-nav">
        <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Details & Photos</div>
        </div>
        <div className="step-line"></div>
        <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Location & Verify</div>
        </div>
      </div>

      <div className="form-card-wrapper card">
        <ComplaintForm onStepChange={(s) => setStep(s)} />
      </div>

      <section className="submission-help">
        <div className="help-item">
          <span className="help-icon">💡</span>
          <p><strong>Clear Photos:</strong> Well-lit photos help our AI classify the issue more accurately.</p>
        </div>
        <div className="help-item">
          <span className="help-icon">📍</span>
          <p><strong>Enable GPS:</strong> Precise location helps city workers find and fix the issue faster.</p>
        </div>
      </section>

      <style>{`
        .submit-page-container {
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 80px;
        }

        .submit-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .header-badge {
          display: inline-block;
          background: var(--saffron);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .submit-header h1 {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .submit-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 500;
        }

        .stepper-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.4;
          transition: var(--transition);
        }

        .step-indicator.active {
          opacity: 1;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: var(--ashoka-blue);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .step-label {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--ashoka-blue);
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: var(--border);
          margin-bottom: 24px;
        }

        .form-card-wrapper {
          padding: 40px;
        }

        .submission-help {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 40px;
        }

        .help-item {
          background: #F8FAFC;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          border: 1px solid var(--border);
        }

        .help-icon { font-size: 1.5rem; }
        .help-item p { margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; }
        .help-item strong { color: var(--ashoka-blue); display: block; margin-bottom: 4px; }

        @media (max-width: 600px) {
          .submission-help { grid-template-columns: 1fr; }
          .form-card-wrapper { padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default SubmitComplaint;
