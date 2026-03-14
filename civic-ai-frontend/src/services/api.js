import axios from '../utils/axiosConfig';

export const loginAdmin = async (credentials) => {
  return await axios.post('/auth/login', credentials);
};

export const submitComplaint = async (data) => {
  return await axios.post('/complaints', data);
};

export const getComplaints = async (params = {}) => {
  return await axios.get('/complaints', { params });
};

export const getAnalyticsHealth = async () => {
  return await axios.get('/analytics/civic-health');
};

export const getAnalyticsPerformance = async () => {
  return await axios.get('/analytics/department-performance');
};

export const getAnalyticsHotspots = async () => {
  return await axios.get('/analytics/hotspots');
};

export const getAnalyticsAlerts = async () => {
  return await axios.get('/analytics/emergency-alerts');
};

export const getAnalyticsLiveMetrics = async () => {
  return await axios.get('/analytics/live-metrics');
};

// Ticket / Token Management
export const getTickets = async () => {
  return await axios.get('/tickets');
};

export const assignTicket = async (id, assignedAuthority) => {
  return await axios.patch(`/tickets/${id}/assign`, { assignedAuthority });
};

export const closeTicket = async (id) => {
  return await axios.patch(`/tickets/${id}/close`);
};

export default axios;
