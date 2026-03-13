import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Placeholder

export const submitComplaint = async (data) => {
  return await axios.post(`${API_BASE_URL}/complaints`, data);
};

export const getComplaints = async () => {
  return await axios.get(`${API_BASE_URL}/complaints`);
};

export const getComplaintStatus = async (id) => {
  return await axios.get(`${API_BASE_URL}/complaints/${id}`);
};
