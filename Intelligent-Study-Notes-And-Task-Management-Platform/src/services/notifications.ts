// 通知类型
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// 通知接口
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}

// 通知服务
export class NotificationService {
  private static notifications: Notification[] = [];
  private static listeners: ((notifications: Notification[]) => void)[] = [];

  // 获取所有通知
  static getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // 获取未读通知数量
  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // 添加通知
  static addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false,
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();
  }

  // 标记通知为已读
  static markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.notifyListeners();
    }
  }

  // 标记所有通知为已读
  static markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.notifyListeners();
  }

  // 删除通知
  static removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // 清除所有通知
  static clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // 订阅通知变化
  static subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}