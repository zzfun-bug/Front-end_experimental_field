import { useTranslation } from '@/hooks/useTranslation';
import type { SearchFilters } from '@/types';
import { Calendar, Filter, Search, Tag, X } from 'lucide-react';
import React, { useState } from 'react';

interface NotesFilterProps {
    onFilter: (filters: SearchFilters) => void;
    onClear: () => void;
    availableTags?: string[];
}

const NotesFilter: React.FC<NotesFilterProps> = ({
    onFilter,
    onClear,
    availableTags = [],
}) => {
    const { t, tc, language } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

    // 处理搜索
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        applyFilters({ query });
    };

    // 应用过滤器
    const applyFilters = (overrides: Partial<SearchFilters> = {}) => {
        const filters: SearchFilters = {
            query: searchQuery,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            dateRange: dateRange.start && dateRange.end ? dateRange : undefined,
            ...overrides,
        };

        // 移除空值
        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof SearchFilters];
            if (!value || (Array.isArray(value) && value.length === 0)) {
                delete filters[key as keyof SearchFilters];
            }
        });

        onFilter(filters);
    };

    // 切换标签选择
    const toggleTag = (tag: string) => {
        const newSelectedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(newSelectedTags);
        applyFilters({ tags: newSelectedTags.length > 0 ? newSelectedTags : undefined });
    };

    // 设置日期范围
    const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
        const newDateRange = { ...dateRange, [field]: value };
        setDateRange(newDateRange);

        if (newDateRange.start && newDateRange.end) {
            applyFilters({ dateRange: newDateRange });
        }
    };

    // 清除所有过滤器
    const handleClearAll = () => {
        setSearchQuery('');
        setSelectedTags([]);
        setDateRange({ start: '', end: '' });
        setShowAdvancedFilter(false);
        onClear();
    };

    // 检查是否有活动的过滤器
    const hasActiveFilters = searchQuery || selectedTags.length > 0 || dateRange.start || dateRange.end;

    return (
        <div className="space-y-4">
            {/* 搜索栏 */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder={t('notes.searchPlaceholder')}
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

                <button
                    onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                    className={`btn ${showAdvancedFilter ? 'btn-primary' : 'btn-outline'}`}
                >
                    <Filter className="h-4 w-4 mr-2" />
                    {t('notes.filter')}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="btn btn-outline text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <X className="h-4 w-4 mr-2" />
                        {t('notes.clear')}
                    </button>
                )}
            </div>

            {/* 高级过滤器 */}
            {showAdvancedFilter && (
                <div className="card">
                    <div className="card-content space-y-4">
                        {/* 标签过滤 */}
                        {availableTags.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Tag size={16} className="inline mr-1" />
                                    {t('notes.tags')}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                {selectedTags.length > 0 && (
                                    <div className="mt-2">
                                        <span className="text-sm text-muted-foreground">
                                            {tc('notes.selectedTags', { tags: selectedTags.join(', ') })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 日期范围过滤 */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Calendar size={16} className="inline mr-1" />
                                {t('notes.createdTime')}
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                                    className="input"
                                    lang={language === 'en' ? 'en-US' : 'zh-CN'}
                                />
                                <span className="text-muted-foreground">{t('notes.to')}</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                                    className="input"
                                    lang={language === 'en' ? 'en-US' : 'zh-CN'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 活动过滤器显示 */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                            {tc('notes.searchFor', { query: searchQuery })}
                            <button
                                onClick={() => handleSearch('')}
                                className="ml-2 hover:text-primary/80"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}

                    {selectedTags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                        >
                            <Tag size={12} className="mr-1" />
                            {tag}
                            <button
                                onClick={() => toggleTag(tag)}
                                className="ml-2 hover:text-muted-foreground"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}

                    {(dateRange.start || dateRange.end) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                            <Calendar size={12} className="mr-1" />
                            {dateRange.start} - {dateRange.end}
                            <button
                                onClick={() => {
                                    setDateRange({ start: '', end: '' });
                                    applyFilters({ dateRange: undefined });
                                }}
                                className="ml-2 hover:text-muted-foreground"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotesFilter;
