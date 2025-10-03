import { NotificationService } from '@/services/notifications';
import { getTranslation } from './i18n';

// 获取当前语言的翻译函数
const getCurrentLanguage = (): 'zh' | 'en' => {
    try {
        const uiStorage = localStorage.getItem('ui-storage');
        if (uiStorage) {
            const parsed = JSON.parse(uiStorage);
            return parsed?.state?.language || 'zh';
        }
    } catch (error) {
        console.log('获取语言设置失败:', error);
    }
    return 'zh';
};

// 任务完成通知
export const triggerTaskCompletedNotification = (taskTitle: string) => {
    const language = getCurrentLanguage();
    NotificationService.addNotification({
        title: getTranslation(language, 'notifications.taskCompleted'),
        message: getTranslation(language, 'notifications.taskCompletedMessage').replace('{{taskTitle}}', taskTitle),
        type: 'success',
        actionUrl: '/tasks',
        actionText: getTranslation(language, 'notifications.viewTasks')
    });
};

// 欢迎通知（仅首次登录）
export const addWelcomeNotification = () => {
    const language = getCurrentLanguage();

    // 检查是否已经显示过欢迎通知
    const hasShownWelcome = localStorage.getItem('hasShownWelcome');
    if (hasShownWelcome) {
        return; // 已经显示过，不再显示
    }

    NotificationService.addNotification({
        title: getTranslation(language, 'notifications.welcome'),
        message: getTranslation(language, 'notifications.welcomeMessage'),
        type: 'info',
        actionUrl: '/dashboard',
        actionText: getTranslation(language, 'notifications.getStarted')
    });

    // 标记已显示欢迎通知
    localStorage.setItem('hasShownWelcome', 'true');
};

// 清除所有通知
export const clearAllNotifications = () => {
    NotificationService.clearAll();
    console.log('🧹 已清除所有通知');
};

export default {
    triggerTaskCompletedNotification,
    addWelcomeNotification,
    clearAllNotifications,
};