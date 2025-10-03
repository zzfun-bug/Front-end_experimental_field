import { type ClassValue, clsx } from 'clsx';
import { format, isValid, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

// 合并 Tailwind CSS 类名
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 日期格式化
export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd'): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return '';
        return format(dateObj, formatStr);
    } catch {
        return '';
    }
}

// 相对时间格式化
export function formatRelativeTime(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return '';

        const now = new Date();
        const diffInMs = now.getTime() - dateObj.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return '今天';
        if (diffInDays === 1) return '昨天';
        if (diffInDays < 7) return `${diffInDays}天前`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}周前`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}个月前`;
        return `${Math.floor(diffInDays / 365)}年前`;
    } catch {
        return '';
    }
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// 生成随机 ID
export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 验证密码强度
export function validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('密码至少需要8个字符');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('密码需要包含至少一个大写字母');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('密码需要包含至少一个小写字母');
    }

    if (!/\d/.test(password)) {
        errors.push('密码需要包含至少一个数字');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// 本地存储工具
export const storage = {
    get: <T>(key: string, defaultValue?: T): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue || null;
        } catch {
            return defaultValue || null;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    },

    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    },
};

// 错误处理工具
export function handleError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return '发生未知错误';
}

// 颜色工具
export function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'high':
            return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
        case 'medium':
            return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
        case 'low':
            return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
        default:
            return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'done':
            return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
        case 'pending':
            return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
        default:
            return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
}
