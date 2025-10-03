import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError('无效的重置链接');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: 调用重置密码API
      // await resetPassword(token, data.password);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSuccess(true);
    } catch (err) {
      setError('重置失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
              <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              {t('auth.passwordReset')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              您的密码已成功重置，现在可以使用新密码登录了。
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('auth.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 头部 */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            {t('auth.resetPasswordTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('auth.resetPasswordSubtitle')}
          </p>
        </div>

        {/* 表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* 新密码 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                {t('auth.enterNewPassword')}
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
                  autoComplete="new-password"
                  className={cn(
                    'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-muted-foreground input-dark-safe focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-input focus:ring-primary'
                  )}
                  placeholder={t('auth.enterNewPassword')}
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

            {/* 确认密码 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                {t('auth.confirmNewPassword')}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword', {
                    required: t('auth.validation.confirmPasswordRequired'),
                    validate: (value) =>
                      value === password || t('auth.validation.passwordsNotMatch'),
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cn(
                    'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-muted-foreground input-dark-safe focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-input focus:ring-primary'
                  )}
                  placeholder={t('auth.confirmNewPassword')}
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
                t('auth.resetPassword')
              )}
            </button>
          </div>

          {/* 返回登录 */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('auth.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
