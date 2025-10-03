import NoteCard from '@/components/NoteCard';
import NoteEditor from '@/components/NoteEditor';
import NotesFilter from '@/components/NotesFilter';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotesStore } from '@/store/notesStore';
import type { CreateNoteData, Note, SearchFilters, UpdateNoteData } from '@/types';
import { AlertCircle, FileText, Loader2, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const NotesPage: React.FC = () => {
  const {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    clearError,
  } = useNotesStore();
  const { t } = useTranslation();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 加载笔记数据
  useEffect(() => {
    loadNotes();
  }, []);

  // 提取所有可用标签
  useEffect(() => {
    const allTags = new Set<string>();
    notes.forEach(note => {
      note.tags?.forEach(tag => allTags.add(tag));
    });
    setAvailableTags(Array.from(allTags).sort());
  }, [notes]);

  // 加载笔记
  const loadNotes = async (filters?: SearchFilters) => {
    try {
      await fetchNotes(filters);
    } catch (error) {
      console.error(t('notes.loading') + ' failed:', error);
    }
  };

  // 创建新笔记
  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  // 编辑笔记
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // 删除笔记
  const handleDeleteNote = async (id: string) => {
    if (window.confirm(t('notes.deleteConfirmMessage'))) {
      try {
        await deleteNote(id);
        // 如果删除的是当前选中的笔记，清除选中状态
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error(t('notes.deleteNote') + ' failed:', error);
      }
    }
  };

  // 保存笔记
  const handleSaveNote = async (noteData: CreateNoteData | UpdateNoteData) => {
    try {
      if ('id' in noteData) {
        // 更新笔记
        await updateNote(noteData as UpdateNoteData);
      } else {
        // 创建笔记
        await createNote(noteData as CreateNoteData);
      }
    } catch (error) {
      console.error(t('notes.saveNote') + ' failed:', error);
      throw error;
    }
  };

  // 关闭编辑器
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  // 应用过滤器
  const handleFilter = (filters: SearchFilters) => {
    loadNotes(filters);
  };

  // 清除过滤器
  const handleClearFilter = () => {
    loadNotes();
  };

  // 选择笔记
  const handleSelectNote = (note: Note) => {
    setSelectedNote(selectedNote?.id === note.id ? null : note);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('notes.title')}</h1>
          <p className="text-muted-foreground">
            {t('notes.title')} • {notes.length} {t('notes.title')}
          </p>
        </div>
        <button
          onClick={handleCreateNote}
          className="btn btn-primary"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('notes.newNote')}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <span className="text-destructive">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-destructive hover:text-destructive/80"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 搜索和过滤 */}
      <NotesFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
        availableTags={availableTags}
      />

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t('notes.loading')}</span>
        </div>
      )}

      {/* 笔记列表 */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onSelect={handleSelectNote}
                isSelected={selectedNote?.id === note.id}
              />
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('notes.noNotes')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('notes.createFirstNoteDesc')}
                </p>
                <button
                  onClick={handleCreateNote}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('notes.createNote')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 笔记编辑器 */}
      <NoteEditor
        note={editingNote}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NotesPage;
