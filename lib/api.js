import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data)
};

export const paymentAPI = {
    createPayment: (data) => api.post('/create-payment', data)
};

export const postAPI = {
    createPost: (data) => api.post('/create-post', data),
    getUserPosts: (userId) => api.get(`/user/${userId}`)
};

export const userAPI = {
    getUser: (userId) => api.get(`/user/${userId}`),
    getDashboard: (userId) => api.get(`/dashboard/${userId}`)
};

export const socialAPI = {
    follow: (data) => api.post('/follow', data),
    like: (data) => api.post('/like', data)
};

export const storyAPI = {
    createStory: (data) => api.post('/create-story', data)
};

export const referralAPI = {
    createReferral: (data) => api.post('/referral', data)
};

export const galleryAPI = {
    uploadFile: (data) => api.post('/upload-gallery', data)
};

export const healthAPI = {
    check: () => api.get('/health')
};

export default api;