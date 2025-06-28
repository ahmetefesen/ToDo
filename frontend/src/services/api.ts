import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatalarında login sayfasına yönlendir
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

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/api/token/', credentials),
  register: (userData: { username: string; password: string; email?: string }) =>
    api.post('/api/register/', userData),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Task API
export const taskAPI = {
  getAll: () => api.get('/api/tasks/'),
  getById: (id: number) => api.get(`/api/tasks/${id}/`),
  create: (taskData: any) => api.post('/api/tasks/', taskData),
  update: (id: number, taskData: any) => api.put(`/api/tasks/${id}/`, taskData),
  delete: (id: number) => api.delete(`/api/tasks/${id}/`),
  toggleComplete: (id: number) => api.post(`/api/tasks/${id}/toggle/`),
};

// UserProfile API
export const userProfileAPI = {
  getAll: () => api.get('/api/userprofiles/'),
  getById: (id: number) => api.get(`/api/userprofiles/${id}/`),
  create: (profileData: any) => api.post('/api/userprofiles/', profileData),
  update: (id: number, profileData: any) => api.put(`/api/userprofiles/${id}/`, profileData),
  delete: (id: number) => api.delete(`/api/userprofiles/${id}/`),
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/api/teams/'),
  getById: (id: number) => api.get(`/api/teams/${id}/`),
  create: (teamData: any) => api.post('/api/teams/', teamData),
  update: (id: number, teamData: any) => api.put(`/api/teams/${id}/`, teamData),
  delete: (id: number) => api.delete(`/api/teams/${id}/`),
};

// TaskComment API
export const taskCommentAPI = {
  getAll: () => api.get('/api/taskcomments/'),
  getById: (id: number) => api.get(`/api/taskcomments/${id}/`),
  create: (commentData: any) => api.post('/api/taskcomments/', commentData),
  update: (id: number, commentData: any) => api.put(`/api/taskcomments/${id}/`, commentData),
  delete: (id: number) => api.delete(`/api/taskcomments/${id}/`),
  getByTask: (taskId: number) => api.get(`/api/taskcomments/?task=${taskId}`),
};

// TaskAttachment API
export const taskAttachmentAPI = {
  getAll: () => api.get('/api/taskattachments/'),
  getById: (id: number) => api.get(`/api/taskattachments/${id}/`),
  create: (attachmentData: any) => api.post('/api/taskattachments/', attachmentData),
  update: (id: number, attachmentData: any) => api.put(`/api/taskattachments/${id}/`, attachmentData),
  delete: (id: number) => api.delete(`/api/taskattachments/${id}/`),
  getByTask: (taskId: number) => api.get(`/api/taskattachments/?task=${taskId}`),
};

// TaskPriority API
export const taskPriorityAPI = {
  getAll: () => api.get('/api/taskpriorities/'),
  getById: (id: number) => api.get(`/api/taskpriorities/${id}/`),
  create: (priorityData: any) => api.post('/api/taskpriorities/', priorityData),
  update: (id: number, priorityData: any) => api.put(`/api/taskpriorities/${id}/`, priorityData),
  delete: (id: number) => api.delete(`/api/taskpriorities/${id}/`),
};

// TaskSchedule API
export const taskScheduleAPI = {
  getAll: () => api.get('/api/taskschedules/'),
  getById: (id: number) => api.get(`/api/taskschedules/${id}/`),
  create: (scheduleData: any) => api.post('/api/taskschedules/', scheduleData),
  update: (id: number, scheduleData: any) => api.put(`/api/taskschedules/${id}/`, scheduleData),
  delete: (id: number) => api.delete(`/api/taskschedules/${id}/`),
};

// TaskRecurrence API
export const taskRecurrenceAPI = {
  getAll: () => api.get('/api/taskrecurrences/'),
  getById: (id: number) => api.get(`/api/taskrecurrences/${id}/`),
  create: (recurrenceData: any) => api.post('/api/taskrecurrences/', recurrenceData),
  update: (id: number, recurrenceData: any) => api.put(`/api/taskrecurrences/${id}/`, recurrenceData),
  delete: (id: number) => api.delete(`/api/taskrecurrences/${id}/`),
};

// TaskDependence API
export const taskDependenceAPI = {
  getAll: () => api.get('/api/taskdependences/'),
  getById: (id: number) => api.get(`/api/taskdependences/${id}/`),
  create: (dependenceData: any) => api.post('/api/taskdependences/', dependenceData),
  update: (id: number, dependenceData: any) => api.put(`/api/taskdependences/${id}/`, dependenceData),
  delete: (id: number) => api.delete(`/api/taskdependences/${id}/`),
};

// History API
export const historyAPI = {
  getAll: () => api.get('/api/histories/'),
  getById: (id: number) => api.get(`/api/histories/${id}/`),
  create: (historyData: any) => api.post('/api/histories/', historyData),
  update: (id: number, historyData: any) => api.put(`/api/histories/${id}/`, historyData),
  delete: (id: number) => api.delete(`/api/histories/${id}/`),
};

// TaskReport API
export const taskReportAPI = {
  getAll: () => api.get('/api/taskreports/'),
  getById: (id: number) => api.get(`/api/taskreports/${id}/`),
  create: (reportData: any) => api.post('/api/taskreports/', reportData),
  update: (id: number, reportData: any) => api.put(`/api/taskreports/${id}/`, reportData),
  delete: (id: number) => api.delete(`/api/taskreports/${id}/`),
};

// UserTeams API
export const userTeamsAPI = {
  getAll: () => api.get('/api/userteams/'),
  getById: (id: number) => api.get(`/api/userteams/${id}/`),
  create: (userTeamData: any) => api.post('/api/userteams/', userTeamData),
  update: (id: number, userTeamData: any) => api.put(`/api/userteams/${id}/`, userTeamData),
  delete: (id: number) => api.delete(`/api/userteams/${id}/`),
};

export default api;
