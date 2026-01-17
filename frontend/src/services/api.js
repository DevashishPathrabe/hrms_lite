import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeesAPI = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (data) => api.post('/api/employees', data),
  delete: (id) => api.delete(`/api/employees/${id}`),
  getAttendance: (id, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    const queryString = queryParams.toString();
    return api.get(`/api/employees/${id}/attendance${queryString ? `?${queryString}` : ''}`);
  },
  getAttendanceSummary: (id) => api.get(`/api/employees/${id}/attendance/summary`),
};

export const attendanceAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.employee_id) queryParams.append('employee_id', params.employee_id);
    const queryString = queryParams.toString();
    return api.get(`/api/attendance${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => api.post('/api/attendance', data),
};

export default api;
