import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials } from '@/types';
import { cn } from '@/utils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  // 清除错误信息
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // 错误已在 store 中处理
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 头部 */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            {t('auth.loginTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>

        {/* 登录表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* 邮箱输入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                {t('auth.email')}
              </label>
              <input
                {...register('email', {
                  required: t('auth.validation.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('auth.validation.emailInvalid'),
                  },
                })}
                type="email"
                autoComplete="email"
                className={cn(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground input-dark-safe focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-input focus:ring-primary'
                )}
                placeholder={t('auth.email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                {t('auth.password')}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: t('auth.validation.passwordRequired'),
                    minLength: {
                      value: 8,
                      message: t('auth.validation.passwordMinLength'),
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={cn(
                    'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-muted-foreground input-dark-safe focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-input focus:ring-primary'
                  )}
                  placeholder={t('auth.password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            </div>
          )}

          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('auth.signIn')
              )}
            </button>
          </div>

          {/* 忘记密码链接 */}
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80"
            >
              {t('auth.forgotPassword')}？
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
