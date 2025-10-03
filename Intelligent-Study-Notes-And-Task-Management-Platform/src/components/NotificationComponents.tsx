import { useTranslation } from '@/hooks/useTranslation';
import { Notification, NotificationService, NotificationType } from '@/services/notifications';
import { AlertCircle, Bell, CheckCircle, Info, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// 通知图标组件
interface NotificationIconProps {
  onClick: () => void;
  unreadCount: number;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ onClick, unreadCount }) => {
  const { t } = useTranslation();

  return (
    <button
      className="p-2 rounded-md hover:bg-accent transition-colors relative"
      onClick={onClick}
      title={t('header.notifications')}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full">
          {unreadCount > 9 && (
            <span className="absolute -top-1 -right-1 text-xs text-white bg-red-500 rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </span>
      )}
    </button>
  );
};

// 通知面板组件
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemoveNotification: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification,
  onClearAll,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notifications.justNow');
    if (minutes < 60) return t('notifications.minutesAgo').replace('{{minutes}}', minutes.toString());
    if (hours < 24) return t('notifications.hoursAgo').replace('{{hours}}', hours.toString());
    return t('notifications.daysAgo').replace('{{days}}', days.toString());
  };

  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
      />

      <div
        className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-20 max-h-96 overflow-hidden"
        onMouseLeave={onClose}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {t('header.notifications')}
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMarkAllAsRead();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t('header.markAllRead')}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClearAll();
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t('header.clearAll')}
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('header.noNotifications')}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${!notification.isRead
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500'
                  : 'opacity-75'
                  }`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground font-semibold' : 'text-muted-foreground'
                        }`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <button
                          onClick={() => onRemoveNotification(notification.id)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm mt-1 ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                      {notification.message}
                    </p>
                    {notification.actionUrl && notification.actionText && (
                      <button
                        onClick={() => {
                          onMarkAsRead(notification.id);
                        }}
                        className="text-xs text-primary hover:text-primary/80 mt-2"
                      >
                        {notification.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// 通知钩子
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNotifications(NotificationService.getNotifications());
    const unsubscribe = NotificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    NotificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    NotificationService.markAllAsRead();
  };

  const removeNotification = (id: string) => {
    NotificationService.removeNotification(id);
  };

  const clearAll = () => {
    NotificationService.clearAll();
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return {
    notifications,
    unreadCount,
    isOpen,
    togglePanel,
    closePanel,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};
