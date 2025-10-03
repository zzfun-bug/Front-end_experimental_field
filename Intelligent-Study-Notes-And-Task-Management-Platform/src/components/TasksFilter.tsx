import LocalizedDateInput from './LocalizedDateInput';
import type { TaskFilters } from '@/types';
import { Filter, Flag, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TasksFilterProps {
    onFilter: (filters: TaskFilters) => void;
    onClear: () => void;
    currentFilters?: TaskFilters;
}

const TasksFilter: React.FC<TasksFilterProps> = ({
    onFilter,
    onClear,
    currentFilters = {},
}) => {
    const { t, language } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState<'pending' | 'done' | ''>('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // 初始化过滤器状态
    React.useEffect(() => {
        setSearchQuery(currentFilters.query || '');
        setStatus(currentFilters.status || '');
        setPriority(currentFilters.priority || '');
        setStartDate(currentFilters.dueDate?.start || '');
        setEndDate(currentFilters.dueDate?.end || '');
    }, [currentFilters]);

    // 处理搜索
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        applyFilters({ query });
    };

    // 应用过滤器
    const applyFilters = (overrides: Partial<TaskFilters> = {}) => {
        const filters: TaskFilters = {
            query: searchQuery,
            status: status || undefined,
            priority: priority || undefined,
            dueDate: startDate && endDate ? { start: startDate, end: endDate } : undefined,
            ...overrides,
        };

        // 移除空值
        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof TaskFilters];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                delete filters[key as keyof TaskFilters];
            }
        });

        onFilter(filters);
    };

    // 应用过滤器（保留原方法以兼容）
    const handleApplyFilters = () => {
        applyFilters();
        setIsOpen(false);
    };

    // 清除过滤器
    const handleClearFilters = () => {
        setSearchQuery('');
        setStatus('');
        setPriority('');
        setStartDate('');
        setEndDate('');
        onClear();
        setIsOpen(false);
    };

    // 检查是否有活动的过滤器
    const hasActiveFilters = searchQuery || status || priority || startDate || endDate;

    return (
        <div className="space-y-4">
            {/* 搜索栏 */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder={t('tasks.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="input pl-10 pr-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => handleSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* 过滤器按钮 */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`btn ${isOpen ? 'btn-primary' : 'btn-outline'}`}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {t('tasks.filter')}
                        {hasActiveFilters && (
                            <span className="ml-2 bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                {[searchQuery, status, priority, startDate, endDate].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {/* 过滤器面板 */}
                    {isOpen && (
                        <>
                            {/* 遮罩层 */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsOpen(false)}
                            />

                            {/* 面板内容 */}
                            <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-20">
                                <div className="p-4 space-y-4">
                                    {/* 头部 */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-foreground">{t('tasks.filterTasks')}</h3>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-1 hover:bg-muted rounded-md transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* 状态过滤 */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            {t('tasks.status')}
                                        </label>
                                        <div className="space-y-2">
                                            {[
                                                { value: '', label: t('tasks.allStatus') },
                                                { value: 'pending', label: t('tasks.pending') },
                                                { value: 'done', label: t('tasks.completed') },
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={option.value}
                                                        checked={status === option.value}
                                                        onChange={(e) => setStatus(e.target.value as any)}
                                                        className="radio"
                                                    />
                                                    <span className="text-sm text-foreground">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 优先级过滤 */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            <Flag size={16} className="inline mr-1" />
                                            {t('tasks.priority')}
                                        </label>
                                        <div className="space-y-2">
                                            {[
                                                { value: '', label: t('tasks.allPriority') },
                                                { value: 'high', label: t('tasks.highPriority') },
                                                { value: 'medium', label: t('tasks.mediumPriority') },
                                                { value: 'low', label: t('tasks.lowPriority') },
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value={option.value}
                                                        checked={priority === option.value}
                                                        onChange={(e) => setPriority(e.target.value as any)}
                                                        className="radio"
                                                    />
                                                    <span className="text-sm text-foreground">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 日期范围过滤 */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            {t('tasks.dueDateRange')}
                                        </label>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1">{t('tasks.startDate')}</label>
                                                <LocalizedDateInput
                                                    value={startDate}
                                                    onChange={setStartDate}
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-muted-foreground mb-1">{t('tasks.endDate')}</label>
                                                <LocalizedDateInput
                                                    value={endDate}
                                                    onChange={setEndDate}
                                                    className="text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <button
                                            onClick={handleClearFilters}
                                            className="btn btn-outline btn-sm"
                                        >
                                            {t('tasks.clearAll')}
                                        </button>
                                        <button
                                            onClick={handleApplyFilters}
                                            className="btn btn-primary btn-sm"
                                        >
                                            {t('tasks.applyFilters')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* 清除按钮 */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="btn btn-outline btn-sm"
                    >
                        <X className="h-4 w-4 mr-1" />
                        {t('tasks.clear')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TasksFilter;