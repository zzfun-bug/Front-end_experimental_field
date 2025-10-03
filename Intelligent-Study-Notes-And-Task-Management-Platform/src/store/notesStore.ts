import { notesService } from '@/services/notes';
import type { CreateNoteData, Note, SearchFilters, UpdateNoteData } from '@/types';
import { create } from 'zustand';

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTags: string[];
  totalCount: number;
}

interface NotesActions {
  fetchNotes: (filters?: SearchFilters) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (noteData: CreateNoteData) => Promise<Note>;
  updateNote: (noteData: UpdateNoteData) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  deleteNotes: (ids: string[]) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  clearCurrentNote: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type NotesStore = NotesState & NotesActions;

export const useNotesStore = create<NotesStore>((set, get) => ({
  // 初始状态
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
  totalCount: 0,

  // 获取笔记列表
  fetchNotes: async (filters?: SearchFilters) => {
    set({ isLoading: true, error: null });
    try {
      const notes = await notesService.getNotes(filters);
      set({
        notes,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取笔记失败',
      });
      throw error;
    }
  },

  // 根据 ID 获取笔记
  fetchNoteById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesService.getNoteById(id);
      set({
        currentNote: note,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取笔记失败',
      });
      throw error;
    }
  },

  // 创建笔记
  createNote: async (noteData: CreateNoteData) => {
    set({ isLoading: true, error: null });
    try {
      const newNote = await notesService.createNote(noteData);

      // 不触发笔记创建通知 - 用户知道自己创建了什么

      set((state) => ({
        notes: [newNote, ...state.notes],
        isLoading: false,
        error: null,
      }));
      return newNote;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '创建笔记失败',
      });
      throw error;
    }
  },

  // 更新笔记
  updateNote: async (noteData: UpdateNoteData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await notesService.updateNote(noteData);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        ),
        currentNote: state.currentNote?.id === updatedNote.id ? updatedNote : state.currentNote,
        isLoading: false,
        error: null,
      }));
      return updatedNote;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '更新笔记失败',
      });
      throw error;
    }
  },

  // 删除笔记
  deleteNote: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await notesService.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        currentNote: state.currentNote?.id === id ? null : state.currentNote,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '删除笔记失败',
      });
      throw error;
    }
  },

  // 批量删除笔记
  deleteNotes: async (ids: string[]) => {
    set({ isLoading: true, error: null });
    try {
      await notesService.deleteNotes(ids);
      set((state) => ({
        notes: state.notes.filter((note) => !ids.includes(note.id)),
        currentNote: state.currentNote && ids.includes(state.currentNote.id) ? null : state.currentNote,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '批量删除笔记失败',
      });
      throw error;
    }
  },

  // 搜索笔记
  searchNotes: async (query: string) => {
    set({ isLoading: true, error: null, searchQuery: query });
    try {
      const notes = await notesService.searchNotes(query);
      set({
        notes,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '搜索笔记失败',
      });
      throw error;
    }
  },

  // 设置搜索查询
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // 设置选中的标签
  setSelectedTags: (tags: string[]) => {
    set({ selectedTags: tags });
  },

  // 清除当前笔记
  clearCurrentNote: () => {
    set({ currentNote: null });
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
