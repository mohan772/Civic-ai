import React, { useState } from 'react';
import { loginAdmin } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAdmin({
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminEmail', response.data.admin.email);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="gov-seal">🇮🇳</div>
        <h2>Government of Karnataka</h2>
        <h3>Civic Oversight Portal - Admin Login</h3>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Department Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="e.g. admin@city.gov"
            />
          </div>
          
          <div className="form-group">
            <label>Security Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          
          {error && <div className="login-error">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <p className="login-footer">Authorized Personnel Only. All access is logged.</p>
      </div>

      <style>{`
        .login-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%);
        }
        .login-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          width: 100%;
          max-width: 400px;
          text-align: center;
          border-top: 8px solid var(--ashoka-blue);
        }
        .gov-seal { font-size: 3rem; margin-bottom: 10px; }
        .login-card h2 { color: #333; margin-bottom: 5px; font-weight: 900; }
        .login-card h3 { color: var(--ashoka-blue); margin-bottom: 30px; font-size: 0.9rem; text-transform: uppercase; font-weight: 800; }
        
        .form-group { text-align: left; margin-bottom: 20px; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 800; color: #555; margin-bottom: 5px; text-transform: uppercase; }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #eee;
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s;
        }
        .form-group input:focus { border-color: var(--ashoka-blue); }
        
        .login-error {
          background: #ffebee;
          color: #d32f2f;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        
        .login-btn {
          width: 100%;
          padding: 14px;
          background: var(--ashoka-blue);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.3s;
        }
        .login-btn:hover:not(:disabled) { background: #0000a0; }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .login-footer { margin-top: 30px; font-size: 0.7rem; color: #888; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
