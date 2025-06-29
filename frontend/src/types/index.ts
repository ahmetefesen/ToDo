// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

// Task Types
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

// User Profile Types
export interface UserProfile {
  id: number;
  user: number;
  role?: string;
  created_at: string;
  updated_at: string;
}

// Team Types
export interface Team {
  id: number;
  name: string;
  owner?: number;
  created_at: string;
  updated_at: string;
  members: number[];
}

// Task Comment Types
export interface TaskComment {
  id: number;
  task: number;
  user?: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// Task Attachment Types
export interface TaskAttachment {
  id: number;
  task: number;
  file_name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

// Task Priority Types
export interface TaskPriority {
  id: number;
  task: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Task Schedule Types
export interface TaskSchedule {
  id: number;
  task: number;
  schedule_date?: string;
  reminder_date?: string;
  created_at: string;
  updated_at: string;
}

// Task Recurrence Types
export interface TaskRecurrence {
  id: number;
  task: number;
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

// Task Dependence Types
export interface TaskDependence {
  id: number;
  task: number;
  dependent_task: number;
  created_at: string;
  updated_at: string;
}

// History Types
export interface History {
  id: number;
  task: number;
  task_name: string;
  changes: string;
  updated_at: string;
}

// Task Report Types
export interface TaskReport {
  id: number;
  user?: number;
  report_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  date?: string;
  created_at: string;
  updated_at: string;
}

// User Teams Types
export interface UserTeams {
  id: number;
  user: number;
  team: number;
  created_at: string;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Pagination Types
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Filter Types
export interface TaskFilters {
  status?: string;
  priority?: string;
  user?: number;
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
}

// Sort Types
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
} 