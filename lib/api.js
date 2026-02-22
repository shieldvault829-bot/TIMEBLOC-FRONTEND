import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.railway.app';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const postAPI = {
  create: (data) => api.post('/posts', data),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  getTrending: () => api.get('/posts/trending/all')
};

export const storyAPI = {
  create: (data) => api.post('/stories', data),
  getFollowing: () => api.get('/stories/following'),
  view: (storyId) => api.post(`/stories/${storyId}/view`)
};

export const followAPI = {
  follow: (userId) => api.post(`/follow/${userId}`),
  unfollow: (userId) => api.delete(`/follow/${userId}`),
  getFollowers: (userId) => api.get(`/follow/followers/${userId}`),
  getFollowing: (userId) => api.get(`/follow/following/${userId}`)
};

export const likeAPI = {
  likePost: (postId) => api.post(`/likes/post/${postId}`),
  unlikePost: (postId) => api.delete(`/likes/post/${postId}`)
};

export const commentAPI = {
  create: (postId, content) => api.post(`/comments/post/${postId}`, { content }),
  getPostComments: (postId) => api.get(`/comments/post/${postId}`)
};

export default api;