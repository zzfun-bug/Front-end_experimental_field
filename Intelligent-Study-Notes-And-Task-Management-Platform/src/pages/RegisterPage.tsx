import { useAuthStore } from '@/store/authStore';
import type { RegisterCredentials } from '@/types';
import { cn, validatePassword } from '@/utils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterCredentials & { confirmPassword: string }>();

  const password = watch('password');

  // 清除错误信息
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterCredentials & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;

    // 验证密码强度
    const passwordValidation = validatePassword(registerData.password);
    if (!passwordValidation.isValid) {
      return;
    }

    try {
      await registerUser(registerData);
      navigate('/dashboard', { replace: true });
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
            创建新账户
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            或者{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              登录现有账户
            </Link>
          </p>
        </div>

        {/* 注册表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* 用户名输入 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                用户名
              </label>
              <input
                {...register('username', {
                  required: '请输入用户名',
                  minLength: {
                    value: 2,
                    message: '用户名至少需要2个字符',
                  },
                  maxLength: {
                    value: 20,
                    message: '用户名不能超过20个字符',
                  },
                })}
                type="text"
                autoComplete="username"
                className={cn(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-muted-foreground input-dark-safe focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                  errors.username
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-input focus:ring-primary'
                )}
                placeholder="请输入用户名"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* 邮箱输入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                邮箱地址
              </label>
              <input
                {...register('email', {
                  required: '请输入邮箱地址',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '请输入有效的邮箱地址',
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
                placeholder="请输入您的邮箱"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                密码
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: '请输入密码',
                    minLength: {
                      value: 8,
                      message: '密码至少需要8个字符',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cn(
                    'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-muted-foreground input-dark-safe focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-input focus:ring-primary'
                  )}
                  placeholder="请输入密码"
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

              {/* 密码强度提示 */}
              {password && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <div className={cn(
                      'flex items-center',
                      password.length >= 8 ? 'text-green-600' : 'text-red-600'
                    )}>
                      <span className="mr-1">{password.length >= 8 ? '✓' : '✗'}</span>
                      至少8个字符
                    </div>
                    <div className={cn(
                      'flex items-center',
                      /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'
                    )}>
                      <span className="mr-1">{/[A-Z]/.test(password) ? '✓' : '✗'}</span>
                      包含大写字母
                    </div>
                    <div className={cn(
                      'flex items-center',
                      /[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'
                    )}>
                      <span className="mr-1">{/[a-z]/.test(password) ? '✓' : '✗'}</span>
                      包含小写字母
                    </div>
                    <div className={cn(
                      'flex items-center',
                      /\d/.test(password) ? 'text-green-600' : 'text-red-600'
                    )}>
                      <span className="mr-1">{/\d/.test(password) ? '✓' : '✗'}</span>
                      包含数字
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 确认密码输入 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                确认密码
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword', {
                    required: '请确认密码',
                    validate: (value) =>
                      value === password || '两次输入的密码不一致',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cn(
                    'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-muted-foreground input-dark-safe focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-input focus:ring-primary'
                  )}
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                '创建账户'
              )}
            </button>
          </div>

          {/* 服务条款 */}
          <div className="text-center text-xs text-muted-foreground">
            创建账户即表示您同意我们的{' '}
            <Link to="/terms" className="text-primary hover:text-primary/80">
              服务条款
            </Link>{' '}
            和{' '}
            <Link to="/privacy" className="text-primary hover:text-primary/80">
              隐私政策
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
