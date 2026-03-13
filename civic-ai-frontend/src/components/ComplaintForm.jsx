import React, { useState } from 'react';
import axios from 'axios';
import LocationPicker from './LocationPicker';
import '../styles/ComplaintForm.css';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '', 
    description: '',
    priority: 'Medium',
    image: null
  });

  // Step 6: Store updated coordinates in form state
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
      // Step 7: Update complaint submission with selected coordinates
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('locationText', formData.location);
      data.append('description', formData.description);
      data.append('priority', formData.priority);
      data.append('latitude', pickedLocation.latitude);
      data.append('longitude', pickedLocation.longitude);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await axios.post('http://localhost:5000/api/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatus({ type: 'success', message: 'Complaint submitted with precise location!' });
      // Reset form but keep location picker at the last spot or reset it too?
      setFormData({ name: '', phone: '', location: '', description: '', priority: 'Medium', image: null });
      
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
        <h2>Submit a Civic Complaint</h2>
        
        {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Landmark / Street (Optional)</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Near Metro Station" />
        </div>

        {/* Step 6 & 9: Integrate LocationPicker */}
        <LocationPicker onLocationChange={handleLocationChange} />

        <div className="form-group">
          <label>Issue Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required></textarea>
        </div>

        <div className="form-group">
          <label>Upload Photo</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Processing...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
