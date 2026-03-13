import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ComplaintForm.css';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '', // For the address/landmark text
    description: '',
    image: null
  });
  
  // Coordinates for geospatial duplication check
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Auto-detect geolocation as required for $geoNear functionality
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.warn('Geolocation detection skipped:', error.message)
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // 1. Build a FormData object as required for image uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('location', formData.location); // Text address
    data.append('description', formData.description);
    
    // Coordinates are required for backend GeoJSON conversion
    if (coords.lat && coords.lng) {
      data.append('lat', coords.lat);
      data.append('lng', coords.lng);
    } else {
      // Provide defaults or prevent submission if accuracy is critical
      data.append('lat', 12.9716); // Default lat (e.g., Bangalore)
      data.append('lng', 77.5946); // Default lng
    }
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // POST request to correctly configured backend URL
      const response = await axios.post('http://localhost:5000/api/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus({ 
        type: 'success', 
        message: response.data.message || 'Complaint submitted successfully!' 
      });
      
      // Reset form on success
      setFormData({ name: '', location: '', description: '', image: null });
      document.getElementById('image').value = '';
    } catch (error) {
      console.error('Submission error:', error);
      // Display error message directly from the backend response
      const errorMsg = error.response?.data?.error || 'Failed to submit. Check your connection.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="complaint-form-v2" onSubmit={handleSubmit}>
        <h2>Submit a Civic Complaint</h2>
        
        {status.message && (
          <div className={`alert ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location / Address</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Street name or landmark"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Complaint Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Photo (Optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
        </div>

        <div className="location-info">
          {coords.lat ? (
            <p className="success-text">✓ Location Captured Automatically</p>
          ) : (
            <p className="warning-text">Detecting Location...</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
