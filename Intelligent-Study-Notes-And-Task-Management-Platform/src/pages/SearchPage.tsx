import { useTranslation } from '@/hooks/useTranslation';
import { searchService, type SearchResult } from '@/services/search';
import type { Note, Task } from '@/types';
import { ArrowLeft, Calendar, CheckSquare, Clock, FileText, Flag, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const { t } = useTranslation();

    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'notes' | 'tasks'>('all');

    useEffect(() => {
        if (query) {
            performSearch(query);
        }
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await searchService.globalSearch(searchQuery);
            setSearchResult(result);
        } catch (error) {
            console.error(t('search.title') + ' failed:', error);
            setError(error instanceof Error ? error.message : t('search.noResults'));
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'high': return '高';
            case 'medium': return '中';
            case 'low': return '低';
            default: return '无';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'done' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50';
    };

    const getStatusText = (status: string) => {
        return status === 'done' ? '已完成' : '待完成';
    };

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
                    {part}
                </mark>
            ) : part
        );
    };

    const handleNoteClick = (noteId: string) => {
        navigate(`/notes?id=${noteId}`);
    };

    const handleTaskClick = (taskId: string) => {
        navigate(`/tasks?id=${taskId}`);
    };

    if (!query) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <Search size={64} className="mx-auto text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">搜索</h1>
                    <p className="text-muted-foreground">请输入搜索关键词</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {/* 头部 */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 p-2 hover:bg-accent rounded-md transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        搜索结果
                    </h1>
                    <p className="text-muted-foreground">
                        关键词: "{query}"
                        {searchResult && (
                            <span className="ml-2">
                                找到 {searchResult.total} 个结果
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* 加载状态 */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                    <span className="ml-3 text-muted-foreground">搜索中...</span>
                </div>
            )}

            {/* 错误状态 */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* 搜索结果 */}
            {searchResult && !isLoading && (
                <>
                    {/* 标签页 */}
                    <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            全部 ({searchResult.total})
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'notes'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            笔记 ({searchResult.notes.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'tasks'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            任务 ({searchResult.tasks.length})
                        </button>
                    </div>

                    {/* 结果列表 */}
                    <div className="space-y-4">
                        {/* 笔记结果 */}
                        {(activeTab === 'all' || activeTab === 'notes') && searchResult.notes.map((note: Note) => (
                            <div
                                key={note.id}
                                onClick={() => handleNoteClick(note.id)}
                                className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        <FileText size={20} className="text-blue-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {highlightText(note.title, query)}
                                        </h3>
                                    </div>
                                    <span className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded">
                                        笔记
                                    </span>
                                </div>

                                {note.content && (
                                    <p className="text-muted-foreground mb-3 line-clamp-2">
                                        {highlightText(note.content.substring(0, 200), query)}
                                        {note.content.length > 200 && '...'}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-1" />
                                            {formatDate(note.createdAt)}
                                        </div>
                                        {note.tags && note.tags.length > 0 && (
                                            <div className="flex items-center space-x-1">
                                                {note.tags.slice(0, 3).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {note.tags.length > 3 && (
                                                    <span className="text-xs">+{note.tags.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {(note as any).readingTime && (
                                        <div className="flex items-center">
                                            <Clock size={14} className="mr-1" />
                                            {(note as any).readingTime} 分钟阅读
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* 任务结果 */}
                        {(activeTab === 'all' || activeTab === 'tasks') && searchResult.tasks.map((task: Task) => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.id)}
                                className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        <CheckSquare size={20} className="text-green-600 mr-3" />
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {highlightText(task.title, query)}
                                        </h3>
                                    </div>
                                    <span className="text-xs text-muted-foreground bg-green-50 px-2 py-1 rounded">
                                        任务
                                    </span>
                                </div>

                                {task.description && (
                                    <p className="text-muted-foreground mb-3 line-clamp-2">
                                        {highlightText(task.description, query)}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                            {getStatusText(task.status)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            <Flag size={12} className="inline mr-1" />
                                            {getPriorityText(task.priority)}优先级
                                        </span>
                                        {(task as any).category && (
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                                {(task as any).category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar size={14} className="mr-1" />
                                        {task.dueDate ? formatDate(task.dueDate) : formatDate(task.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 无结果 */}
                        {searchResult.total === 0 && (
                            <div className="text-center py-12">
                                <Search size={64} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">未找到相关结果</h3>
                                <p className="text-muted-foreground">
                                    尝试使用不同的关键词或检查拼写
                                </p>
                            </div>
                        )}

                        {/* 分类无结果 */}
                        {activeTab === 'notes' && searchResult.notes.length === 0 && searchResult.total > 0 && (
                            <div className="text-center py-12">
                                <FileText size={64} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">未找到相关笔记</h3>
                                <p className="text-muted-foreground">
                                    但在任务中找到了 {searchResult.tasks.length} 个结果
                                </p>
                            </div>
                        )}

                        {activeTab === 'tasks' && searchResult.tasks.length === 0 && searchResult.total > 0 && (
                            <div className="text-center py-12">
                                <CheckSquare size={64} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">未找到相关任务</h3>
                                <p className="text-muted-foreground">
                                    但在笔记中找到了 {searchResult.notes.length} 个结果
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchPage;
