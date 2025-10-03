import { useTranslation } from '@/hooks/useTranslation';
import { UserStats, userStatsService } from '@/services/userStats';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { formatDate } from '@/utils';
import { Clock, Crown, HardDrive, Save, Settings, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { theme, toggleTheme, language, setLanguage } = useUIStore();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('更新资料失败:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  // 获取用户统计数据
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setIsLoadingStats(true);
        const stats = await userStatsService.getUserStats();
        setUserStats(stats);
      } catch (error) {
        console.error('获取用户统计失败:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('profile.title')}</h1>
        <p className="text-muted-foreground">{language === 'zh' ? '管理您的账户信息和偏好设置' : 'Manage your account information and preferences'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 个人信息卡片 */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="card-title">{t('profile.personalInfo')}</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('common.edit')}
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="btn btn-outline btn-sm"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary btn-sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {t('common.save')}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-content space-y-4">
              {/* 头像 */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium">{user?.username}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* 表单字段 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('auth.username')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{user?.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('auth.email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('profile.registrationDate')}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt ? formatDate(user.createdAt, 'yyyy-MM-dd') : (language === 'zh' ? '未知' : 'Unknown')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 偏好设置 */}
        <div className="space-y-6">
          {/* 主题设置 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t('profile.themeSettings')}</h3>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span className="text-sm font-medium">{t('profile.currentTheme')}</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {theme === 'light' ? t('profile.lightMode') : t('profile.darkMode')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 语言设置 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t('profile.languageSettings')}</h3>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      await setLanguage('zh');
                    } catch (error) {
                      console.error('设置语言失败:', error);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${language === 'zh' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                >
                  <span className="text-sm font-medium">{t('profile.chinese')}</span>
                  {language === 'zh' && <span className="text-sm">✓</span>}
                </button>
                <button
                  onClick={async () => {
                    try {
                      await setLanguage('en');
                    } catch (error) {
                      console.error('设置语言失败:', error);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                >
                  <span className="text-sm font-medium">{t('profile.english')}</span>
                  {language === 'en' && <span className="text-sm">✓</span>}
                </button>
              </div>
            </div>
          </div>

          {/* 账户统计 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t('profile.accountStats')}</h3>
            </div>
            <div className="card-content">
              {isLoadingStats ? (
                <div className="space-y-3">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ) : userStats ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Crown className="h-4 w-4 mr-1" />
                      {t('profile.memberLevel')}
                    </span>
                    <span className={`text-sm font-medium ${userStats.memberLevel === 'premium' ? 'text-yellow-500' : 'text-muted-foreground'
                      }`}>
                      {userStats.memberLevel === 'premium' ? '高级会员' : t('profile.freeUser')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <HardDrive className="h-4 w-4 mr-1" />
                      {t('profile.storageUsed')}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {userStats.storageUsed} / {userStats.storageLimit}
                      </span>
                      <div className="w-20 h-1 bg-muted rounded-full mt-1">
                        <div
                          className={`h-1 rounded-full ${userStats.storagePercentage > 80 ? 'bg-red-500' :
                              userStats.storagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${Math.min(userStats.storagePercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {t('profile.lastLogin')}
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(userStats.lastLogin, 'MM-dd HH:mm')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      使用天数
                    </span>
                    <span className="text-sm font-medium">
                      {userStats.daysSinceRegistration} 天
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      笔记总数
                    </span>
                    <span className="text-sm font-medium">
                      {userStats.totalNotes} 篇
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      任务完成率
                    </span>
                    <span className="text-sm font-medium">
                      {userStats.totalTasks > 0
                        ? Math.round((userStats.completedTasks / userStats.totalTasks) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {language === 'zh' ? '无法加载统计数据' : 'Unable to load statistics'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
