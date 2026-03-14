import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintStatus from './pages/ComplaintStatus';
import AdminDashboard from './pages/AdminDashboard';
import AuthorityPanel from './pages/AuthorityPanel';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin';
import TicketsPage from './pages/TicketsPage';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/status" element={<ComplaintStatus />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tickets" 
              element={
                <ProtectedRoute>
                  <TicketsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/authority" 
              element={
                <ProtectedRoute>
                  <AuthorityPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
