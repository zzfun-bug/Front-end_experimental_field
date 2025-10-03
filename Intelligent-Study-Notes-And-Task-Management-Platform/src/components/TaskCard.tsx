import type { Task } from '@/types';
import { Calendar, CheckCircle, Circle, Clock, Edit, Flag, Trash2 } from 'lucide-react';
import React from 'react';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: 'pending' | 'done') => void;
    onSelect?: (task: Task) => void;
    isSelected?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onEdit,
    onDelete,
    onToggleStatus,
    onSelect,
    isSelected = false,
}) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-500';
            case 'medium':
                return 'text-yellow-500';
            case 'low':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'high':
                return '高';
            case 'medium':
                return '中';
            case 'low':
                return '低';
            default:
                return '未知';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return '今天';
        } else if (diffDays === 1) {
            return '明天';
        } else if (diffDays === -1) {
            return '昨天';
        } else if (diffDays > 0) {
            return `${diffDays}天后`;
        } else {
            return `${Math.abs(diffDays)}天前`;
        }
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';

    return (
        <div
            className={`card hover:shadow-md transition-all duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''
                } ${task.status === 'done' ? 'opacity-75' : ''}`}
            onClick={() => onSelect?.(task)}
        >
            <div className="card-content">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        {/* 状态切换按钮 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleStatus(task.id, task.status === 'pending' ? 'done' : 'pending');
                            }}
                            className={`mt-1 transition-colors ${task.status === 'done'
                                    ? 'text-green-500 hover:text-green-600'
                                    : 'text-gray-400 hover:text-green-500'
                                }`}
                        >
                            {task.status === 'done' ? (
                                <CheckCircle size={20} />
                            ) : (
                                <Circle size={20} />
                            )}
                        </button>

                        {/* 任务内容 */}
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`font-medium text-foreground mb-1 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''
                                    }`}
                            >
                                {task.title}
                            </h3>
                            {task.description && (
                                <p
                                    className={`text-sm text-muted-foreground mb-2 ${task.status === 'done' ? 'line-through' : ''
                                        }`}
                                >
                                    {task.description}
                                </p>
                            )}

                            {/* 任务元信息 */}
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {/* 优先级 */}
                                <div className="flex items-center space-x-1">
                                    <Flag size={12} className={getPriorityColor(task.priority)} />
                                    <span>{getPriorityText(task.priority)}优先级</span>
                                </div>

                                {/* 截止日期 */}
                                {task.dueDate && (
                                    <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500' : ''
                                        }`}>
                                        <Calendar size={12} />
                                        <span>{formatDate(task.dueDate)}</span>
                                        {isOverdue && <Clock size={12} className="text-red-500" />}
                                    </div>
                                )}

                                {/* 创建时间 */}
                                <div className="flex items-center space-x-1">
                                    <Clock size={12} />
                                    <span>
                                        {new Date(task.createdAt).toLocaleDateString('zh-CN', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-1 ml-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(task);
                            }}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            title="编辑任务"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(task.id);
                            }}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            title="删除任务"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
