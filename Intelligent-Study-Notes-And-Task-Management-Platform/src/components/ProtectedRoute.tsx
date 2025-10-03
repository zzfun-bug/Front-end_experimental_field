import { useAuthStore } from '@/store/authStore';
import type { BaseComponentProps } from '@/types';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps extends BaseComponentProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // 保存用户尝试访问的页面，登录后可以重定向回去
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
