import api from './api';

export interface UserStats {
    memberLevel: 'free' | 'premium';
    storageUsed: string;
    storageLimit: string;
    storagePercentage: number;
    lastLogin: string;
    totalNotes: number;
    totalTasks: number;
    completedTasks: number;
    daysSinceRegistration: number;
    registrationDate: string;
}

export const userStatsService = {
    // 获取用户账户统计
    async getUserStats(): Promise<UserStats> {
        const response = await api.get('/auth/stats');
        return response.data.data;
    },
};
