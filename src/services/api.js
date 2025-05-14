import axios from 'axios';

const API_URL = '/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },
};

// User endpoints
export const users = {
    getCurrentUser: () => api.get('/users/me/'),
    updateProfile: (data) => api.patch('/users/me/', data),
    changePassword: (data) => api.post('/users/change-password/', data),
};

// Task endpoints
export const tasks = {
    getAll: (params) => api.get('/tasks/', { params }),
    getById: (id) => api.get(`/tasks/${id}/`),
    create: (data) => api.post('/tasks/', data),
    update: (id, data) => api.patch(`/tasks/${id}/`, data),
    delete: (id) => api.delete(`/tasks/${id}/`),
    assign: (id, userId) => api.post(`/tasks/${id}/assign/`, { user_id: userId }),
    complete: (id) => api.post(`/tasks/${id}/complete/`),
};

// Comment endpoints
export const comments = {
    getByTask: (taskId) => api.get('/comments/', { params: { task: taskId } }),
    create: (data) => api.post('/comments/', data),
    update: (id, data) => api.patch(`/comments/${id}/`, data),
    delete: (id) => api.delete(`/comments/${id}/`),
};

// Activity endpoints
export const activities = {
    getAll: () => api.get('/activities/'),
};

// Notification endpoints
export const notifications = {
    getAll: () => api.get('/notifications/'),
    markRead: (id) => api.post(`/notifications/${id}/mark_read/`),
    markAllRead: () => api.post('/notifications/mark_all_read/'),
};

export default {
    auth,
    users,
    tasks,
    comments,
    activities,
    notifications,
}; 