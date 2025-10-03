import { useTranslation } from '@/hooks/useTranslation';
import type { CreateNoteData, Note, UpdateNoteData } from '@/types';
import { Plus, Save, Tag, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NoteEditorProps {
    note?: Note | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (noteData: CreateNoteData | UpdateNoteData) => Promise<void>;
    isLoading?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
    note,
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}) => {
    const { t, tc } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    // 当笔记改变时更新表单
    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setTags(note.tags || []);
        } else {
            setTitle('');
            setContent('');
            setTags([]);
        }
        setErrors({});
    }, [note]);

    // 验证表单
    const validateForm = () => {
        const newErrors: { title?: string; content?: string } = {};

        if (!title.trim()) {
            newErrors.title = t('notes.titleRequired');
        }

        if (!content.trim()) {
            newErrors.content = t('notes.contentRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 添加标签
    const handleAddTag = () => {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setNewTag('');
        }
    };

    // 删除标签
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSave();
        }
    };

    // 重置表单
    const resetForm = () => {
        setTitle('');
        setContent('');
        setTags([]);
        setNewTag('');
        setErrors({});
    };

    // 处理取消/关闭
    const handleCancel = () => {
        // 只有在创建新笔记时才重置表单，编辑时不重置
        if (!note) {
            resetForm();
        }
        onClose();
    };

    // 保存笔记
    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const noteData = {
                title: title.trim(),
                content: content.trim(),
                tags,
            };

            if (note) {
                await onSave({ ...noteData, id: note.id } as UpdateNoteData);
            } else {
                await onSave(noteData as CreateNoteData);
            }

            // 保存成功后重置表单并关闭
            resetForm();
            onClose();
        } catch (error) {
            console.error('保存笔记失败:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {note ? t('notes.editNote') : t('notes.createNote')}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-4">
                    {/* 标题输入 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('notes.noteTitle')} <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('notes.titlePlaceholder')}
                            className={`input w-full ${errors.title ? 'border-destructive' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.title && (
                            <p className="text-destructive text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* 标签管理 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">{t('notes.noteTags')}</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                                >
                                    <Tag size={12} className="mr-1" />
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 hover:text-destructive"
                                        disabled={isLoading}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                placeholder={t('notes.addTag')}
                                className="input flex-1"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAddTag}
                                className="btn btn-outline"
                                disabled={isLoading || !newTag.trim()}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* 内容编辑器 */}
                    <div className="flex-1 flex flex-col">
                        <label className="block text-sm font-medium mb-2">
                            {t('notes.noteContent')} <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('notes.contentPlaceholder')}
                            className={`input flex-1 min-h-[300px] resize-none ${errors.content ? 'border-destructive' : ''
                                }`}
                            disabled={isLoading}
                        />
                        {errors.content && (
                            <p className="text-destructive text-sm mt-1">{errors.content}</p>
                        )}
                    </div>
                </div>

                {/* 底部操作 */}
                <div className="flex items-center justify-between p-6 border-t bg-secondary/20">
                    <div className="text-sm text-muted-foreground">
                        {content.length > 0 && (
                            <span>{tc('notes.characterCount', { count: content.length })}</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleCancel}
                            className="btn btn-outline"
                            disabled={isLoading}
                        >
                            {t('notes.cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn btn-primary"
                            disabled={isLoading || !title.trim() || !content.trim()}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {t('notes.saving')}
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Save size={16} className="mr-2" />
                                    {t('notes.saveNote')}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
