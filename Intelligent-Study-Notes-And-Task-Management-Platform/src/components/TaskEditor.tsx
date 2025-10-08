import { useTranslation } from '@/hooks/useTranslation';
import type { CreateTaskData, Task, UpdateTaskData } from '@/types';
import { Flag, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import LocalizedDateInput from './LocalizedDateInput';

interface TaskEditorProps {
    task?: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: CreateTaskData | UpdateTaskData) => Promise<void>;
    isLoading?: boolean;
}

const TaskEditor: React.FC<TaskEditorProps> = ({
    task,
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}) => {
    const { t, tc } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [dueDate, setDueDate] = useState('');
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    // 当任务改变时更新表单
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
            setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
        } else {
            setTitle('');
            setDescription('');
            setPriority('medium');
            setDueDate('');
        }
        setErrors({});
    }, [task]);

    // 验证表单
    const validateForm = () => {
        const newErrors: { title?: string; description?: string } = {};

        if (!title.trim()) {
            newErrors.title = t('tasks.titleRequired');
        }

        if (title.trim().length > 200) {
            newErrors.title = t('tasks.titleTooLong');
        }

        if (description.trim().length > 1000) {
            newErrors.description = t('tasks.descriptionTooLong');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSave();
        }
    };

    // 重置表单
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
        setErrors({});
    };

    // 处理取消/关闭
    const handleCancel = () => {
        // 只有在创建新任务时才重置表单，编辑时不重置
        if (!task) {
            resetForm();
        }
        onClose();
    };

    // 保存任务
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const taskData = {
                title: title.trim(),
                description: description.trim(),
                priority,
                dueDate: dueDate || undefined,
            };

            if (task) {
                await onSave({ id: task.id, ...taskData });
            } else {
                await onSave(taskData);
            }

            // 保存成功后重置表单并关闭
            resetForm();
            onClose();
        } catch (error) {
            console.error('保存任务失败:', error);
        }
    };

    // 获取优先级颜色
    const getPriorityColor = (priorityLevel: string) => {
        switch (priorityLevel) {
            case 'high':
                return 'text-red-500 border-red-200 bg-red-50';
            case 'medium':
                return 'text-yellow-500 border-yellow-200 bg-yellow-50';
            case 'low':
                return 'text-green-500 border-green-200 bg-green-50';
            default:
                return 'text-gray-500 border-gray-200 bg-gray-50';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">
                        {task ? t('tasks.editTask') : t('tasks.createTask')}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 表单内容 */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* 标题 */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            {t('tasks.taskTitle')} <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('tasks.titlePlaceholder')}
                            className={`input w-full ${errors.title ? 'border-destructive' : ''}`}
                            disabled={isLoading}
                            maxLength={200}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive mt-1">{errors.title}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {tc('tasks.characterCount', { current: title.length, max: 200 })}
                        </p>
                    </div>

                    {/* 描述 */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            {t('tasks.description')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('tasks.descriptionPlaceholder')}
                            rows={4}
                            className={`input w-full resize-none ${errors.description ? 'border-destructive' : ''}`}
                            disabled={isLoading}
                            maxLength={1000}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive mt-1">{errors.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {tc('tasks.characterCount', { current: description.length, max: 1000 })}
                        </p>
                    </div>

                    {/* 优先级和截止日期 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 优先级 */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t('tasks.priority')}
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'high', label: t('tasks.highPriority'), icon: '🔴' },
                                    { value: 'medium', label: t('tasks.mediumPriority'), icon: '🟡' },
                                    { value: 'low', label: t('tasks.lowPriority'), icon: '🟢' },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-all ${priority === option.value
                                            ? getPriorityColor(option.value)
                                            : 'border-border hover:bg-muted'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={option.value}
                                            checked={priority === option.value}
                                            onChange={(e) => setPriority(e.target.value as any)}
                                            className="sr-only"
                                            disabled={isLoading}
                                        />
                                        <span className="text-lg">{option.icon}</span>
                                        <div className="flex items-center space-x-2">
                                            <Flag size={16} />
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 截止日期 */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {t('tasks.dueDate')}
                            </label>
                            <LocalizedDateInput
                                value={dueDate}
                                onChange={setDueDate}
                                className="w-full"
                                disabled={isLoading}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {t('tasks.dueDateOptional')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 底部操作 */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
                    <button
                        onClick={handleCancel}
                        className="btn btn-outline"
                        disabled={isLoading}
                    >
                        {t('tasks.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        disabled={isLoading || !title.trim()}
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{t('tasks.saving')}</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Save size={16} />
                                <span>{task ? t('tasks.updateTask') : t('tasks.createTask')}</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskEditor;
