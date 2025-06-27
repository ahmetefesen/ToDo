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
  getAll: () => api.get('/tasks/'),
  getById: (id: number) => api.get(`/tasks/${id}/`),
  create: (taskData: any) => api.post('/tasks/', taskData),
  update: (id: number, taskData: any) => api.put(`/tasks/${id}/`, taskData),
  delete: (id: number) => api.delete(`/tasks/${id}/`),
  toggleComplete: (id: number) => api.post(`/tasks/${id}/toggle/`),
};

// UserProfile API
export const userProfileAPI = {
  getAll: () => api.get('/userprofiles/'),
  getById: (id: number) => api.get(`/userprofiles/${id}/`),
  create: (profileData: any) => api.post('/userprofiles/', profileData),
  update: (id: number, profileData: any) => api.put(`/userprofiles/${id}/`, profileData),
  delete: (id: number) => api.delete(`/userprofiles/${id}/`),
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/teams/'),
  getById: (id: number) => api.get(`/teams/${id}/`),
  create: (teamData: any) => api.post('/teams/', teamData),
  update: (id: number, teamData: any) => api.put(`/teams/${id}/`, teamData),
  delete: (id: number) => api.delete(`/teams/${id}/`),
};

// TaskComment API
export const taskCommentAPI = {
  getAll: () => api.get('/taskcomments/'),
  getById: (id: number) => api.get(`/taskcomments/${id}/`),
  create: (commentData: any) => api.post('/taskcomments/', commentData),
  update: (id: number, commentData: any) => api.put(`/taskcomments/${id}/`, commentData),
  delete: (id: number) => api.delete(`/taskcomments/${id}/`),
  getByTask: (taskId: number) => api.get(`/taskcomments/?task=${taskId}`),
};

// TaskAttachment API
export const taskAttachmentAPI = {
  getAll: () => api.get('/taskattachments/'),
  getById: (id: number) => api.get(`/taskattachments/${id}/`),
  create: (attachmentData: any) => api.post('/taskattachments/', attachmentData),
  update: (id: number, attachmentData: any) => api.put(`/taskattachments/${id}/`, attachmentData),
  delete: (id: number) => api.delete(`/taskattachments/${id}/`),
  getByTask: (taskId: number) => api.get(`/taskattachments/?task=${taskId}`),
};

// TaskPriority API
export const taskPriorityAPI = {
  getAll: () => api.get('/taskpriorities/'),
  getById: (id: number) => api.get(`/taskpriorities/${id}/`),
  create: (priorityData: any) => api.post('/taskpriorities/', priorityData),
  update: (id: number, priorityData: any) => api.put(`/taskpriorities/${id}/`, priorityData),
  delete: (id: number) => api.delete(`/taskpriorities/${id}/`),
};

// TaskSchedule API
export const taskScheduleAPI = {
  getAll: () => api.get('/taskschedules/'),
  getById: (id: number) => api.get(`/taskschedules/${id}/`),
  create: (scheduleData: any) => api.post('/taskschedules/', scheduleData),
  update: (id: number, scheduleData: any) => api.put(`/taskschedules/${id}/`, scheduleData),
  delete: (id: number) => api.delete(`/taskschedules/${id}/`),
};

// TaskRecurrence API
export const taskRecurrenceAPI = {
  getAll: () => api.get('/taskrecurrences/'),
  getById: (id: number) => api.get(`/taskrecurrences/${id}/`),
  create: (recurrenceData: any) => api.post('/taskrecurrences/', recurrenceData),
  update: (id: number, recurrenceData: any) => api.put(`/taskrecurrences/${id}/`, recurrenceData),
  delete: (id: number) => api.delete(`/taskrecurrences/${id}/`),
};

// TaskDependence API
export const taskDependenceAPI = {
  getAll: () => api.get('/taskdependences/'),
  getById: (id: number) => api.get(`/taskdependences/${id}/`),
  create: (dependenceData: any) => api.post('/taskdependences/', dependenceData),
  update: (id: number, dependenceData: any) => api.put(`/taskdependences/${id}/`, dependenceData),
  delete: (id: number) => api.delete(`/taskdependences/${id}/`),
};

// History API
export const historyAPI = {
  getAll: () => api.get('/histories/'),
  getById: (id: number) => api.get(`/histories/${id}/`),
  create: (historyData: any) => api.post('/histories/', historyData),
  update: (id: number, historyData: any) => api.put(`/histories/${id}/`, historyData),
  delete: (id: number) => api.delete(`/histories/${id}/`),
};

// TaskReport API
export const taskReportAPI = {
  getAll: () => api.get('/taskreports/'),
  getById: (id: number) => api.get(`/taskreports/${id}/`),
  create: (reportData: any) => api.post('/taskreports/', reportData),
  update: (id: number, reportData: any) => api.put(`/taskreports/${id}/`, reportData),
  delete: (id: number) => api.delete(`/taskreports/${id}/`),
};

// UserTeams API
export const userTeamsAPI = {
  getAll: () => api.get('/userteams/'),
  getById: (id: number) => api.get(`/userteams/${id}/`),
  create: (userTeamData: any) => api.post('/userteams/', userTeamData),
  update: (id: number, userTeamData: any) => api.put(`/userteams/${id}/`, userTeamData),
  delete: (id: number) => api.delete(`/userteams/${id}/`),
};

export default api;
