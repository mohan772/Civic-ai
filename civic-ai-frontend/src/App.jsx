import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintStatus from './pages/ComplaintStatus';
import AdminDashboard from './pages/AdminDashboard';
import AuthorityPanel from './pages/AuthorityPanel';
import UserDashboard from './pages/UserDashboard'; // Added UserDashboard
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<UserDashboard />} /> {/* Added Dashboard Route */}
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/status" element={<ComplaintStatus />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/authority" element={<AuthorityPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
