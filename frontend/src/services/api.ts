import axios from 'axios';
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  UserProfile,
  Team,
  TaskComment,
  TaskAttachment,
  TaskPriority,
  TaskSchedule,
  TaskRecurrence,
  TaskDependence,
  History,
  TaskReport,
  UserTeams,
  LoginCredentials,
  RegisterData,
  TokenResponse,
  ApiResponse,
  PaginatedResponse
} from '../types';

const API_BASE_URL = 'http://localhost:8000';
const API_VERSION = 'v1';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
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

// Error handling utility
const handleApiError = (error: any): string => {
  if (error.response?.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data;
    } else if (typeof error.response.data === 'object') {
      return Object.values(error.response.data).flat().join(' ');
    }
  }
  return error.message || 'Bir hata oluştu';
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<TokenResponse>> => {
    try {
      const response = await api.post('/api/token/', credentials);
      const data = response.data as TokenResponse;
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return response as ApiResponse<TokenResponse>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/v1/register/', userData);
      return response as ApiResponse;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  refreshToken: async (): Promise<ApiResponse<{ access: string }>> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('Refresh token bulunamadı');
      
      const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
      const data = response.data as { access: string };
      localStorage.setItem('token', data.access);
      return response as ApiResponse<{ access: string }>;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error(handleApiError(error));
    }
  },
  verifyToken: async (): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token bulunamadı');
      
      const response = await api.post('/api/token/verify/', { token });
      return response as ApiResponse;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },
};

// Task API with better error handling
export const taskAPI = {
  getAll: async (): Promise<ApiResponse<Task[]>> => {
    try {
      const response = await api.get(`/api/${API_VERSION}/tasks/`);
      return response as ApiResponse<Task[]>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.get(`/api/${API_VERSION}/tasks/${id}/`);
      return response as ApiResponse<Task>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (taskData: CreateTaskData): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.post(`/api/${API_VERSION}/tasks/`, taskData);
      return response as ApiResponse<Task>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, taskData: UpdateTaskData): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.put(`/api/${API_VERSION}/tasks/${id}/`, taskData);
      return response as ApiResponse<Task>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/tasks/${id}/`);
      return response as ApiResponse;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  toggleComplete: async (id: number): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.post(`/api/${API_VERSION}/tasks/${id}/toggle/`);
      return response as ApiResponse<Task>;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// UserProfile API
export const userProfileAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/userprofiles/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/userprofiles/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (profileData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/userprofiles/`, profileData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, profileData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/userprofiles/${id}/`, profileData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/userprofiles/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// Team API
export const teamAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/teams/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/teams/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (teamData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/teams/`, teamData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, teamData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/teams/${id}/`, teamData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/teams/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// TaskComment API
export const taskCommentAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskcomments/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskcomments/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (commentData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/taskcomments/`, commentData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, commentData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/taskcomments/${id}/`, commentData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/taskcomments/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getByTask: async (taskId: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskcomments/?task=${taskId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// TaskAttachment API
export const taskAttachmentAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskattachments/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskattachments/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (attachmentData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/taskattachments/`, attachmentData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, attachmentData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/taskattachments/${id}/`, attachmentData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/taskattachments/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getByTask: async (taskId: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskattachments/?task=${taskId}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// TaskPriority API
export const taskPriorityAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskpriorities/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskpriorities/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (priorityData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/taskpriorities/`, priorityData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, priorityData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/taskpriorities/${id}/`, priorityData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/taskpriorities/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// TaskSchedule API
export const taskScheduleAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskschedules/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskschedules/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (scheduleData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/taskschedules/`, scheduleData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, scheduleData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/taskschedules/${id}/`, scheduleData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/taskschedules/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// TaskRecurrence API
export const taskRecurrenceAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskrecurrences/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskrecurrences/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (recurrenceData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/taskrecurrences/`, recurrenceData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, recurrenceData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/taskrecurrences/${id}/`, recurrenceData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/taskrecurrences/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// TaskDependence API
export const taskDependenceAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskdependences/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskdependences/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (dependenceData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/taskdependences/`, dependenceData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, dependenceData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/taskdependences/${id}/`, dependenceData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/taskdependences/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// History API
export const historyAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/histories/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/histories/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (historyData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/histories/`, historyData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, historyData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/histories/${id}/`, historyData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/histories/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// TaskReport API
export const taskReportAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskreports/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/taskreports/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (reportData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/taskreports/`, reportData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, reportData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/taskreports/${id}/`, reportData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/taskreports/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// UserTeams API
export const userTeamsAPI = {
  getAll: async () => {
    try {
      const response = await api.get(`/api/${API_VERSION}/userteams/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/api/${API_VERSION}/userteams/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  create: async (userTeamData: any) => {
    try {
      const response = await api.post(`/api/${API_VERSION}/userteams/`, userTeamData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  update: async (id: number, userTeamData: any) => {
    try {
      const response = await api.put(`/api/${API_VERSION}/userteams/${id}/`, userTeamData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/api/${API_VERSION}/userteams/${id}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default api;
