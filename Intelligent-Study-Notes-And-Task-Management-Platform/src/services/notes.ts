import type {
  CreateNoteData,
  Note,
  PaginatedResponse,
  SearchFilters,
  UpdateNoteData
} from '@/types';
import { apiClient } from './api';

export const notesService = {
  // 获取所有笔记
  getNotes: async (filters?: SearchFilters): Promise<Note[]> => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start);
    if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end);

    const response = await apiClient.get<Note[]>(`/notes?${params.toString()}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取笔记失败');
  },

  // 获取分页笔记
  getNotesPaginated: async (
    page: number = 1,
    limit: number = 10,
    filters?: SearchFilters
  ): Promise<PaginatedResponse<Note>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.query) params.append('query', filters.query);
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start);
    if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end);

    const response = await apiClient.get<PaginatedResponse<Note>>(`/notes/paginated?${params.toString()}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取笔记失败');
  },

  // 根据 ID 获取笔记
  getNoteById: async (id: string): Promise<Note> => {
    const response = await apiClient.get<Note>(`/notes/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取笔记失败');
  },

  // 创建笔记
  createNote: async (noteData: CreateNoteData): Promise<Note> => {
    const response = await apiClient.post<Note>('/notes', noteData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '创建笔记失败');
  },

  // 更新笔记
  updateNote: async (noteData: UpdateNoteData): Promise<Note> => {
    const { id, ...data } = noteData;
    const response = await apiClient.put<Note>(`/notes/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '更新笔记失败');
  },

  // 删除笔记
  deleteNote: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/notes/${id}`);
    if (!response.success) {
      throw new Error(response.message || '删除笔记失败');
    }
  },

  // 批量删除笔记
  deleteNotes: async (ids: string[]): Promise<void> => {
    const response = await apiClient.post('/notes/batch-delete', { ids });
    if (!response.success) {
      throw new Error(response.message || '批量删除笔记失败');
    }
  },

  // 搜索笔记
  searchNotes: async (query: string): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>(`/notes/search?query=${encodeURIComponent(query)}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '搜索笔记失败');
  },

  // 获取所有标签
  getTags: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/notes/tags');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取标签失败');
  },

  // 获取笔记统计信息
  getNoteStats: async (): Promise<{
    totalNotes: number;
    totalWords: number;
    averageWordsPerNote: number;
    notesByMonth: Array<{ month: string; count: number }>;
  }> => {
    const response = await apiClient.get('/notes/stats');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取笔记统计失败');
  },
};
