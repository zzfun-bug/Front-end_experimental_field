import type { Note } from '@/types';
import { Calendar, Edit, Tag, Trash2 } from 'lucide-react';
import React from 'react';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    onSelect?: (note: Note) => void;
    isSelected?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
    note,
    onEdit,
    onDelete,
    onSelect,
    isSelected = false,
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getPreview = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const handleCardClick = () => {
        if (onSelect) {
            onSelect(note);
        }
    };

    return (
        <div
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''
                }`}
            onClick={handleCardClick}
        >
            <div className="card-content">
                {/* 笔记标题 */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                        {note.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(note);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="编辑笔记"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                             onClick={(e) => {
                                 e.stopPropagation();
                                 onDelete(note.id);
                             }}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="删除笔记"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* 笔记内容预览 */}
                <div className="mb-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                        {getPreview(note.content)}
                    </p>
                </div>

                {/* 标签 */}
                {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center flex-wrap gap-1 mb-3">
                        <Tag size={14} className="text-muted-foreground" />
                        {note.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                        {note.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                                +{note.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* 创建时间 */}
                <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar size={12} className="mr-1" />
                    <span>{formatDate(note.createdAt)}</span>
                    {note.updatedAt !== note.createdAt && (
                        <span className="ml-2">• 已编辑</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
