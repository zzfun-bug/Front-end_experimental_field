import type { Note, Task } from '@/types';
import { notesService } from './notes';
import { tasksService } from './tasks';

export interface SearchResult {
  notes: Note[];
  tasks: Task[];
  total: number;
}

export interface SearchHistory {
  query: string;
  timestamp: Date;
  results: number;
}

export const searchService = {
  // 全局搜索
  globalSearch: async (query: string): Promise<SearchResult> => {
    if (!query || query.trim().length === 0) {
      return {
        notes: [],
        tasks: [],
        total: 0,
      };
    }

    try {
      const [notes, tasks] = await Promise.all([
        notesService.searchNotes(query),
        tasksService.searchTasks(query),
      ]);

      const result = {
        notes,
        tasks,
        total: notes.length + tasks.length,
      };

      // 保存搜索历史
      searchService.saveSearchHistory(query, result.total);

      return result;
    } catch (error) {
      console.error('全局搜索失败:', error);
      throw error;
    }
  },

  // 保存搜索历史
  saveSearchHistory: (query: string, resultsCount: number) => {
    try {
      const history = searchService.getSearchHistory();
      const newEntry: SearchHistory = {
        query: query.trim(),
        timestamp: new Date(),
        results: resultsCount,
      };

      // 避免重复，移除相同的查询
      const filteredHistory = history.filter(item => item.query !== newEntry.query);
      
      // 添加新条目到开头，限制最多保存20条
      const updatedHistory = [newEntry, ...filteredHistory].slice(0, 20);
      
      localStorage.setItem('search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  },

  // 获取搜索历史
  getSearchHistory: (): SearchHistory[] => {
    try {
      const history = localStorage.getItem('search_history');
      if (!history) return [];
      
      return JSON.parse(history).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('获取搜索历史失败:', error);
      return [];
    }
  },

  // 清除搜索历史
  clearSearchHistory: () => {
    try {
      localStorage.removeItem('search_history');
    } catch (error) {
      console.error('清除搜索历史失败:', error);
    }
  },

  // 删除特定搜索历史条目
  removeSearchHistoryItem: (query: string) => {
    try {
      const history = searchService.getSearchHistory();
      const updatedHistory = history.filter(item => item.query !== query);
      localStorage.setItem('search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('删除搜索历史条目失败:', error);
    }
  },

  // 获取热门搜索词（基于搜索历史）
  getPopularSearches: (limit: number = 5): string[] => {
    try {
      const history = searchService.getSearchHistory();
      
      // 统计搜索频率
      const queryCount = history.reduce((acc, item) => {
        acc[item.query] = (acc[item.query] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // 按频率排序并返回前N个
      return Object.entries(queryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([query]) => query);
    } catch (error) {
      console.error('获取热门搜索词失败:', error);
      return [];
    }
  },
};
