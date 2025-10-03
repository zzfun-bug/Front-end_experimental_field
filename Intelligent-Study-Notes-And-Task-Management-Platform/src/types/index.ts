// 用户相关类型
export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    theme: 'light' | 'dark';
    createdAt: string;
    updatedAt: string;
}

export interface AuthUser {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

// 笔记相关类型
export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateNoteData {
    title: string;
    content: string;
    tags: string[];
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
    id: string;
}

// 任务相关类型
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'done';

export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate?: string;
    status: TaskStatus;
    createdAt: string;
}

export interface CreateTaskData {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
    id: string;
    status?: TaskStatus;
}

// API 响应类型
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// 统计数据类型
export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
}

export interface WeeklyStats {
    week: string;
    completed: number;
    total: number;
}

export interface NoteStats {
    totalNotes: number;
    totalWords: number;
    averageWordsPerNote: number;
    notesByMonth: Array<{ month: string; count: number }>;
}

export interface AnalyticsData {
    noteStats: NoteStats;
    taskStats: TaskStats;
    weeklyTaskStats: WeeklyStats[];
    recentActivity: {
        notesThisWeek: number;
        tasksCompletedThisWeek: number;
        studyStreak: number;
        totalStudyTime: number;
    };
}

// 主题类型
export type Theme = 'light' | 'dark';

// 语言类型
export type Language = 'zh' | 'en';

// 通用组件 Props
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

// 表单相关类型
export interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

// 搜索和过滤类型
export interface SearchFilters {
    query?: string;
    tags?: string[];
    dateRange?: {
        start: string;
        end: string;
    };
}

export interface TaskFilters {
    query?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: {
        start: string;
        end: string;
    };
}
