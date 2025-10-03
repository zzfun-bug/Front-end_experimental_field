import { tasksService } from '@/services/tasks';
import type { CreateTaskData, Task, TaskFilters, TaskStats, UpdateTaskData } from '@/types';
import { triggerTaskCompletedNotification } from '@/utils/notificationTriggers';
import { create } from 'zustand';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  stats: TaskStats | null;
}

interface TasksActions {
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (taskData: CreateTaskData) => Promise<Task>;
  updateTask: (taskData: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  deleteTasks: (ids: string[]) => Promise<void>;
  updateTaskStatus: (id: string, status: 'pending' | 'done') => Promise<void>;
  updateTasksStatus: (ids: string[], status: 'pending' | 'done') => Promise<void>;
  updateTaskOrder: (taskOrders: Array<{ id: string; order: number }>) => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearCurrentTask: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type TasksStore = TasksState & TasksActions;

export const useTasksStore = create<TasksStore>((set, get) => ({
  // 初始状态
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {},
  stats: null,

  // 获取任务列表
  fetchTasks: async (filters?: TaskFilters) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await tasksService.getTasks(filters);
      set({
        tasks,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取任务失败',
      });
      throw error;
    }
  },

  // 根据 ID 获取任务
  fetchTaskById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await tasksService.getTaskById(id);
      set({
        currentTask: task,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取任务失败',
      });
      throw error;
    }
  },

  // 创建任务
  createTask: async (taskData: CreateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await tasksService.createTask(taskData);

      // 不触发任务创建通知 - 用户知道自己创建了什么

      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
        error: null,
      }));
      return newTask;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '创建任务失败',
      });
      throw error;
    }
  },

  // 更新任务
  updateTask: async (taskData: UpdateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await tasksService.updateTask(taskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
        currentTask: state.currentTask?.id === updatedTask.id ? updatedTask : state.currentTask,
        isLoading: false,
        error: null,
      }));
      return updatedTask;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '更新任务失败',
      });
      throw error;
    }
  },

  // 删除任务
  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await tasksService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '删除任务失败',
      });
      throw error;
    }
  },

  // 批量删除任务
  deleteTasks: async (ids: string[]) => {
    set({ isLoading: true, error: null });
    try {
      await tasksService.deleteTasks(ids);
      set((state) => ({
        tasks: state.tasks.filter((task) => !ids.includes(task.id)),
        currentTask: state.currentTask && ids.includes(state.currentTask.id) ? null : state.currentTask,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '批量删除任务失败',
      });
      throw error;
    }
  },

  // 更新任务状态
  updateTaskStatus: async (id: string, status: 'pending' | 'done') => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await tasksService.updateTaskStatus(id, status);

      // 如果任务被标记为完成，触发通知
      if (status === 'done') {
        triggerTaskCompletedNotification(updatedTask.title);
      }

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
        currentTask: state.currentTask?.id === updatedTask.id ? updatedTask : state.currentTask,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '更新任务状态失败',
      });
      throw error;
    }
  },

  // 批量更新任务状态
  updateTasksStatus: async (ids: string[], status: 'pending' | 'done') => {
    set({ isLoading: true, error: null });
    try {
      await tasksService.updateTasksStatus(ids, status);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          ids.includes(task.id) ? { ...task, status } : task
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '批量更新任务状态失败',
      });
      throw error;
    }
  },

  // 更新任务排序
  updateTaskOrder: async (taskOrders: Array<{ id: string; order: number }>) => {
    set({ isLoading: true, error: null });
    try {
      await tasksService.updateTaskOrder(taskOrders);
      set({
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '更新任务排序失败',
      });
      throw error;
    }
  },

  // 获取任务统计
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await tasksService.getTaskStats();
      set({
        stats,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取任务统计失败',
      });
      throw error;
    }
  },

  // 搜索任务
  searchTasks: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await tasksService.searchTasks(query);
      set({
        tasks,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '搜索任务失败',
      });
      throw error;
    }
  },

  // 设置过滤器
  setFilters: (filters: TaskFilters) => {
    set({ filters });
  },

  // 清除当前任务
  clearCurrentTask: () => {
    set({ currentTask: null });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
