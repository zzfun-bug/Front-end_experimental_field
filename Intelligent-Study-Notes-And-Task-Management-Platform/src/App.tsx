import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DashboardPage from '@/pages/DashboardPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import LoginPage from '@/pages/LoginPage';
import NotesPage from '@/pages/NotesPage';
import ProfilePage from '@/pages/ProfilePage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import SearchPage from '@/pages/SearchPage';
import TasksPage from '@/pages/TasksPage';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import type { User } from '@/types';
import { storage } from '@/utils';
import { addWelcomeNotification } from '@/utils/notificationTriggers';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const { isAuthenticated, user, token } = useAuthStore();
  const { theme, language } = useUIStore();

  // 初始化主题
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // 设置 HTML lang 属性以控制日期控件格式
  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en-US' : 'zh-CN';
  }, [language]);

  // 检查本地存储的认证状态
  useEffect(() => {
    if (!isAuthenticated && !user && !token) {
      console.log('🔍 App.tsx: 尝试恢复认证状态');

      // 首先检查 Zustand persist 存储
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          if (parsed?.state?.token && parsed?.state?.user) {
            console.log('✅ 从 auth-storage 恢复认证状态');
            useAuthStore.setState({
              user: parsed.state.user,
              token: parsed.state.token,
              isAuthenticated: true,
            });
            return;
          }
        }
      } catch (error) {
        console.log('解析 auth-storage 失败:', error);
      }

      // 备用方案：从直接存储恢复
      const directToken = storage.get<string>('token');
      const storedUser = storage.get<User>('user');

      if (directToken && storedUser) {
        console.log('✅ 从直接存储恢复认证状态');
        useAuthStore.setState({
          user: storedUser,
          token: directToken,
          isAuthenticated: true,
        });
      } else {
        console.log('❌ 未找到有效的认证数据');
      }
    }
  }, [isAuthenticated, user, token]);

  // 用户登录成功后添加欢迎通知
  useEffect(() => {
    if (isAuthenticated && user) {
      // 延迟一点时间确保用户界面已经加载完成
      setTimeout(() => {
        addWelcomeNotification();
      }, 1000);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 受保护的路由 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 页面 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
