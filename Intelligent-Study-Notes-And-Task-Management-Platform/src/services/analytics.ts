import type { AnalyticsData } from '@/types';
import { apiClient } from './api';
import { notesService } from './notes';
import { tasksService } from './tasks';

export const analyticsService = {
    // 获取完整的分析数据
    getAnalyticsData: async (): Promise<AnalyticsData> => {
        try {
            // 一次性获取所有基础数据，避免重复请求
            const [noteStats, taskStats, weeklyTaskStats, notesResponse, tasksResponse] = await Promise.all([
                notesService.getNoteStats(),
                tasksService.getTaskStats(),
                tasksService.getWeeklyStats(5),
                apiClient.get<any[]>('/notes'),
                apiClient.get<any[]>('/tasks'),
            ]);

            const allNotes = notesResponse.success ? notesResponse.data || [] : [];
            const allTasks = tasksResponse.success ? tasksResponse.data || [] : [];

            // 计算最近活动数据（使用已获取的数据）
            const recentActivity = analyticsService.calculateRecentActivity(allNotes, allTasks);

            return {
                noteStats,
                taskStats,
                weeklyTaskStats,
                recentActivity,
            };
        } catch (error) {
            console.error('获取分析数据失败:', error);
            throw error;
        }
    },

    // 计算最近活动数据（使用已获取的数据）
    calculateRecentActivity: (allNotes: any[], allTasks: any[]) => {
        try {
            // 获取本周的开始和结束时间
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            // 获取本周笔记数量
            const notesThisWeek = allNotes.filter(note => {
                if (!note.createdAt) return false;
                const noteDate = new Date(note.createdAt);
                return !isNaN(noteDate.getTime()) && noteDate >= startOfWeek && noteDate <= endOfWeek;
            }).length;

            // 获取本周完成的任务数量
            console.log('所有任务数据:', allTasks);
            console.log('本周时间范围:', { startOfWeek, endOfWeek });

            const tasksCompletedThisWeek = allTasks.filter(task => {
                console.log('检查任务:', {
                    id: task.id,
                    title: task.title,
                    status: task.status,
                    completedAt: task.completedAt,
                    updatedAt: task.updatedAt
                });

                if (task.status !== 'done') {
                    console.log('任务未完成，跳过');
                    return false;
                }

                if (!task.completedAt) {
                    console.log('任务没有completedAt字段，尝试使用updatedAt');
                    if (!task.updatedAt) {
                        console.log('任务也没有updatedAt字段，跳过');
                        return false;
                    }
                    const taskDate = new Date(task.updatedAt);
                    const isInRange = !isNaN(taskDate.getTime()) && taskDate >= startOfWeek && taskDate <= endOfWeek;
                    console.log('使用updatedAt检查结果:', { taskDate, isInRange });
                    return isInRange;
                }

                const taskDate = new Date(task.completedAt);
                const isInRange = !isNaN(taskDate.getTime()) && taskDate >= startOfWeek && taskDate <= endOfWeek;
                console.log('使用completedAt检查结果:', { taskDate, isInRange });
                return isInRange;
            }).length;

            console.log('本周完成任务数量:', tasksCompletedThisWeek);

            // 计算学习连续天数
            const studyStreak = analyticsService.calculateStudyStreakFromData(allNotes, allTasks);

            // 计算总学习时间（基于笔记阅读时间的估算）
            const totalStudyTime = allNotes.reduce((total, note) => {
                return total + (note.readingTime || 0);
            }, 0);

            return {
                notesThisWeek,
                tasksCompletedThisWeek,
                studyStreak,
                totalStudyTime,
            };
        } catch (error) {
            console.error('计算最近活动数据失败:', error);
            return {
                notesThisWeek: 0,
                tasksCompletedThisWeek: 0,
                studyStreak: 0,
                totalStudyTime: 0,
            };
        }
    },

    // 获取最近活动统计（保留原方法以兼容）
    getRecentActivity: async () => {
        try {
            const [notesResponse, tasksResponse] = await Promise.all([
                apiClient.get<any[]>('/notes'),
                apiClient.get<any[]>('/tasks'),
            ]);

            const allNotes = notesResponse.success ? notesResponse.data || [] : [];
            const allTasks = tasksResponse.success ? tasksResponse.data || [] : [];

            return analyticsService.calculateRecentActivity(allNotes, allTasks);
        } catch (error) {
            console.error('获取最近活动数据失败:', error);
            return {
                notesThisWeek: 0,
                tasksCompletedThisWeek: 0,
                studyStreak: 0,
                totalStudyTime: 0,
            };
        }
    },

    // 计算学习连续天数（使用已获取的数据）
    calculateStudyStreakFromData: (notes: any[], tasks: any[]): number => {
        try {
            // 收集所有活动日期
            const activityDates = new Set<string>();

            notes.forEach(note => {
                if (note.createdAt) {
                    const noteDate = new Date(note.createdAt);
                    if (!isNaN(noteDate.getTime())) {
                        const date = noteDate.toDateString();
                        activityDates.add(date);
                    }
                }
            });

            tasks.forEach(task => {
                if (task.status === 'done' && task.completedAt) {
                    const taskDate = new Date(task.completedAt);
                    if (!isNaN(taskDate.getTime())) {
                        const date = taskDate.toDateString();
                        activityDates.add(date);
                    }
                }
            });

            // 计算连续天数
            const sortedDates = Array.from(activityDates)
                .map(dateStr => new Date(dateStr))
                .sort((a, b) => b.getTime() - a.getTime());

            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < sortedDates.length; i++) {
                const currentDate = new Date(sortedDates[i]);
                currentDate.setHours(0, 0, 0, 0);

                const expectedDate = new Date(today);
                expectedDate.setDate(today.getDate() - streak);

                if (currentDate.getTime() === expectedDate.getTime()) {
                    streak++;
                } else if (streak === 0 && currentDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
                    // 如果今天没有活动，但昨天有，从昨天开始计算
                    streak++;
                } else {
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error('计算学习连续天数失败:', error);
            return 0;
        }
    },

    // 计算学习连续天数（保留原方法以兼容）
    calculateStudyStreak: async (): Promise<number> => {
        try {
            const [notesResponse, tasksResponse] = await Promise.all([
                apiClient.get<any[]>('/notes'),
                apiClient.get<any[]>('/tasks'),
            ]);

            const notes = notesResponse.success ? notesResponse.data || [] : [];
            const tasks = tasksResponse.success ? tasksResponse.data || [] : [];

            return analyticsService.calculateStudyStreakFromData(notes, tasks);
        } catch (error) {
            console.error('计算学习连续天数失败:', error);
            return 0;
        }
    },

    // 获取学习热力图数据
    getHeatmapData: async (year: number = new Date().getFullYear()) => {
        try {
            const [notesResponse, tasksResponse] = await Promise.all([
                apiClient.get<any[]>('/notes'),
                apiClient.get<any[]>('/tasks'),
            ]);

            const notes = notesResponse.success ? notesResponse.data || [] : [];
            const tasks = tasksResponse.success ? tasksResponse.data || [] : [];

            // 按日期统计活动
            const dailyActivity: { [date: string]: number } = {};

            // 统计笔记创建
            notes.forEach(note => {
                if (note.createdAt) {
                    const noteDate = new Date(note.createdAt);
                    if (!isNaN(noteDate.getTime())) {
                        // 使用本地时间而不是 UTC 时间
                        const year = noteDate.getFullYear();
                        const month = String(noteDate.getMonth() + 1).padStart(2, '0');
                        const day = String(noteDate.getDate()).padStart(2, '0');
                        const date = `${year}-${month}-${day}`;

                        if (date.startsWith(year.toString())) {
                            dailyActivity[date] = (dailyActivity[date] || 0) + 1;
                        }
                    }
                }
            });

            // 统计任务完成
            tasks.forEach(task => {
                if (task.status === 'done' && task.completedAt) {
                    const taskDate = new Date(task.completedAt);
                    if (!isNaN(taskDate.getTime())) {
                        // 使用本地时间而不是 UTC 时间
                        const year = taskDate.getFullYear();
                        const month = String(taskDate.getMonth() + 1).padStart(2, '0');
                        const day = String(taskDate.getDate()).padStart(2, '0');
                        const date = `${year}-${month}-${day}`;

                        if (date.startsWith(year.toString())) {
                            dailyActivity[date] = (dailyActivity[date] || 0) + 1;
                        }
                    }
                }
            });

            return dailyActivity;
        } catch (error) {
            console.error('获取热力图数据失败:', error);
            return {};
        }
    },

    // 获取生产力趋势数据
    getProductivityTrend: async (days: number = 30) => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);

            const [notesResponse, tasksResponse] = await Promise.all([
                apiClient.get<any[]>('/notes'),
                apiClient.get<any[]>('/tasks'),
            ]);

            const notes = notesResponse.success ? notesResponse.data || [] : [];
            const tasks = tasksResponse.success ? tasksResponse.data || [] : [];

            const dailyData: { [date: string]: { notes: number; tasks: number; words: number } } = {};

            // 初始化所有日期 - 使用本地时间
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                dailyData[dateStr] = { notes: 0, tasks: 0, words: 0 };
            }

            // 统计笔记数据
            notes.forEach(note => {
                if (note.createdAt) {
                    const noteDate = new Date(note.createdAt);
                    if (!isNaN(noteDate.getTime())) {
                        // 使用本地时间而不是 UTC 时间
                        const year = noteDate.getFullYear();
                        const month = String(noteDate.getMonth() + 1).padStart(2, '0');
                        const day = String(noteDate.getDate()).padStart(2, '0');
                        const date = `${year}-${month}-${day}`;

                        if (dailyData[date]) {
                            dailyData[date].notes++;
                            dailyData[date].words += note.wordCount || 0;
                        }
                    }
                }
            });

            // 统计任务完成数据
            tasks.forEach(task => {
                if (task.status === 'done' && task.completedAt) {
                    const taskDate = new Date(task.completedAt);
                    if (!isNaN(taskDate.getTime())) {
                        // 使用本地时间而不是 UTC 时间
                        const year = taskDate.getFullYear();
                        const month = String(taskDate.getMonth() + 1).padStart(2, '0');
                        const day = String(taskDate.getDate()).padStart(2, '0');
                        const date = `${year}-${month}-${day}`;

                        if (dailyData[date]) {
                            dailyData[date].tasks++;
                        }
                    }
                }
            });

            return Object.entries(dailyData)
                .map(([date, data]) => ({ date, ...data }))
                .sort((a, b) => a.date.localeCompare(b.date));
        } catch (error) {
            console.error('获取生产力趋势数据失败:', error);
            return [];
        }
    },
};
