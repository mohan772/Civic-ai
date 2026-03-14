import React, { useState } from 'react';
import axios from 'axios';
import LocationPicker from './LocationPicker';
import '../styles/ComplaintForm.css';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    image: null
  });

  const [pickedLocation, setPickedLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleLocationChange = (lat, lng) => {
    setPickedLocation({ latitude: lat, longitude: lng });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      setStatus({ type: 'error', message: 'Enter a valid Indian phone number' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Submitting complaint...' });

    try {
      const data = new FormData();
      data.append('name', formData.name); 
      data.append('phone', formData.phone);
      data.append('description', formData.description);
      data.append('latitude', pickedLocation.latitude);
      data.append('longitude', pickedLocation.longitude);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await axios.post('http://localhost:5000/api/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatus({ type: 'success', message: 'Complaint submitted successfully! AI is analyzing your report.' });
      setFormData({ name: '', phone: '', description: '', image: null });
      
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to submit complaint.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="complaint-form-v2" onSubmit={handleSubmit}>
        <div className="form-badge">AI-Powered Rapid Reporting</div>
        <h2>Submit a Civic Complaint</h2>
        <p className="form-subtitle">Automatic priority detection & geo-routing enabled.</p>
        
        {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Enter your name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="text" 
            name="phone" 
            placeholder="Enter 10-digit phone number" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Select Precise Location</label>
          <p className="field-hint">Drag the marker to the exact spot of the issue.</p>
          <LocationPicker onLocationChange={handleLocationChange} />
        </div>

        <div className="form-group">
          <label>Describe the Issue</label>
          <textarea 
            name="description" 
            placeholder="Describe the problem... AI will automatically categorize this."
            value={formData.description} 
            onChange={handleChange} 
            rows="5" 
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Evidence (Photo)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'AI Processing...' : 'Submit Report'}
        </button>
      </form>

      <style>{`
        .form-badge {
          display: inline-block;
          background: #EBF8FF;
          color: #2B6CB0;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.7rem;
          text-transform: uppercase;
          margin-bottom: 15px;
        }
        .form-subtitle {
          color: #718096;
          font-size: 0.9rem;
          margin-bottom: 30px;
        }
        .field-hint {
          font-size: 0.75rem;
          color: #a0aec0;
          margin-bottom: 8px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ComplaintForm;
