import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface ForgotPasswordForm {
    email: string;
}

const ForgotPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>();

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true);
        setError('');

        try {
            // TODO: 调用忘记密码API
            // await forgotPassword(data.email);

            // 模拟API调用
            console.log('发送重置邮件到:', data.email);
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsEmailSent(true);
        } catch (err) {
            setError('发送失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
                            <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-foreground">
                            {t('auth.emailSent')}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            我们已向您的邮箱发送了重置密码的链接，请查收邮件并按照说明操作。
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
                        {t('auth.forgotPasswordTitle')}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t('auth.forgotPasswordSubtitle')}
                    </p>
                </div>

                {/* 表单 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                            placeholder={t('auth.enterEmail')}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
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
                                t('auth.sendResetEmail')
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

export default ForgotPasswordPage;
