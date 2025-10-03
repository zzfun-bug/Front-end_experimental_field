import { apiClient } from './api';
import type { 
  Task, 
  CreateTaskData, 
  UpdateTaskData, 
  ApiResponse, 
  PaginatedResponse,
  TaskFilters,
  TaskStats,
  WeeklyStats 
} from '@/types';

export const tasksService = {
  // 获取所有任务
  getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.dueDate?.start) params.append('startDate', filters.dueDate.start);
    if (filters?.dueDate?.end) params.append('endDate', filters.dueDate.end);

    const response = await apiClient.get<Task[]>(`/tasks?${params.toString()}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取任务失败');
  },

  // 获取分页任务
  getTasksPaginated: async (
    page: number = 1, 
    limit: number = 10, 
    filters?: TaskFilters
  ): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.dueDate?.start) params.append('startDate', filters.dueDate.start);
    if (filters?.dueDate?.end) params.append('endDate', filters.dueDate.end);

    const response = await apiClient.get<PaginatedResponse<Task>>(`/tasks/paginated?${params.toString()}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取任务失败');
  },

  // 根据 ID 获取任务
  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取任务失败');
  },

  // 创建任务
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', taskData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '创建任务失败');
  },

  // 更新任务
  updateTask: async (taskData: UpdateTaskData): Promise<Task> => {
    const { id, ...data } = taskData;
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '更新任务失败');
  },

  // 删除任务
  deleteTask: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/tasks/${id}`);
    if (!response.success) {
      throw new Error(response.message || '删除任务失败');
    }
  },

  // 批量删除任务
  deleteTasks: async (ids: string[]): Promise<void> => {
    const response = await apiClient.post('/tasks/batch-delete', { ids });
    if (!response.success) {
      throw new Error(response.message || '批量删除任务失败');
    }
  },

  // 更新任务状态
  updateTaskStatus: async (id: string, status: 'pending' | 'done'): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}/status`, { status });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '更新任务状态失败');
  },

  // 批量更新任务状态
  updateTasksStatus: async (ids: string[], status: 'pending' | 'done'): Promise<void> => {
    const response = await apiClient.patch('/tasks/batch-status', { ids, status });
    if (!response.success) {
      throw new Error(response.message || '批量更新任务状态失败');
    }
  },

  // 更新任务排序
  updateTaskOrder: async (taskOrders: Array<{ id: string; order: number }>): Promise<void> => {
    const response = await apiClient.patch('/tasks/reorder', { taskOrders });
    if (!response.success) {
      throw new Error(response.message || '更新任务排序失败');
    }
  },

  // 获取任务统计信息
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await apiClient.get<TaskStats>('/tasks/stats');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取任务统计失败');
  },

  // 获取每周任务完成率
  getWeeklyStats: async (weeks: number = 12): Promise<WeeklyStats[]> => {
    const response = await apiClient.get<WeeklyStats[]>(`/tasks/weekly-stats?weeks=${weeks}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取每周统计失败');
  },

  // 获取今日任务
  getTodayTasks: async (): Promise<Task[]> => {
    const today = new Date().toISOString().split('T')[0];
    const response = await apiClient.get<Task[]>(`/tasks/today?date=${today}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取今日任务失败');
  },

  // 获取逾期任务
  getOverdueTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks/overdue');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取逾期任务失败');
  },

  // 搜索任务
  searchTasks: async (query: string): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(`/tasks/search?query=${encodeURIComponent(query)}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '搜索任务失败');
  },
};
