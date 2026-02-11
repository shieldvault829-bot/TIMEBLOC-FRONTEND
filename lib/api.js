import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.railway.app';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data)
};

export const payment = {
  create: (data) => api.post('/create-payment', data)
};

export const post = {
  create: (data) => api.post('/create-post', data),
  get: (id) => api.get(`/user/${id}`)
};

export default api;