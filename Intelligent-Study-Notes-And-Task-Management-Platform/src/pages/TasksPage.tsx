import TaskCard from '@/components/TaskCard';
import TaskEditor from '@/components/TaskEditor';
import TasksFilter from '@/components/TasksFilter';
import { useTranslation } from '@/hooks/useTranslation';
import { useTasksStore } from '@/store/tasksStore';
import type { CreateTaskData, Task, TaskFilters, UpdateTaskData } from '@/types';
import { AlertCircle, Calendar, CheckSquare, Clock, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const TasksPage: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const {
    tasks,
    isLoading,
    error,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    clearError,
  } = useTasksStore();
  const { t } = useTranslation();

  // 初始化加载任务
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 过滤任务（基于过滤器）
  const filteredTasks = tasks;

  // 按状态分组任务
  const pendingTasks = filteredTasks.filter((task) => task.status === 'pending');
  const completedTasks = filteredTasks.filter((task) => task.status === 'done');

  // 处理新建任务
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsEditorOpen(true);
  };

  // 处理编辑任务
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditorOpen(true);
  };

  // 处理保存任务
  const handleSaveTask = async (taskData: CreateTaskData | UpdateTaskData) => {
    try {
      if ('id' in taskData) {
        await updateTask(taskData);
      } else {
        await createTask(taskData);
      }
      setIsEditorOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error(t('tasks.saveTask') + ' failed:', error);
    }
  };

  // 处理删除任务
  const handleDeleteTask = async (id: string) => {
    if (window.confirm(t('tasks.deleteConfirmMessage'))) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error(t('tasks.deleteTask') + ' failed:', error);
      }
    }
  };

  // 处理任务状态切换
  const handleToggleTaskStatus = async (id: string, status: 'pending' | 'done') => {
    try {
      await updateTaskStatus(id, status);
    } catch (error) {
      console.error(t('tasks.toggleStatus') + ' failed:', error);
    }
  };

  // 处理过滤器
  const handleFilter = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    fetchTasks(newFilters);
  };

  // 清除过滤器
  const handleClearFilters = () => {
    setFilters({});
    fetchTasks();
  };

  // 处理任务选择
  const handleSelectTask = (task: Task) => {
    setSelectedTasks((prev) =>
      prev.includes(task.id)
        ? prev.filter((id) => id !== task.id)
        : [...prev, task.id]
    );
  };

  // 统计信息
  const stats = {
    total: tasks.length,
    pending: pendingTasks.length,
    completed: completedTasks.length,
    overdue: pendingTasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < new Date()
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
            <button
              onClick={clearError}
              className="ml-auto text-destructive hover:text-destructive/80"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('tasks.title')}</h1>
          <p className="text-muted-foreground">{t('tasks.title')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn btn-outline">
            <Calendar className="h-4 w-4 mr-2" />
            {t('tasks.title')}
          </button>
          <button onClick={handleCreateTask} className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            {t('tasks.newTask')}
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.title')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.pending')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.completed')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.title')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <TasksFilter
        onFilter={handleFilter}
        onClear={handleClearFilters}
        currentFilters={filters}
      />

      {/* 任务列表 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>{t('tasks.loading')}</span>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card">
            <div className="card-content">
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {Object.keys(filters).length > 0 ? t('tasks.noTasks') : t('tasks.noTasks')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {Object.keys(filters).length > 0
                    ? t('tasks.noTasks')
                    : t('tasks.createFirstTaskDesc')}
                </p>
                {Object.keys(filters).length === 0 && (
                  <button onClick={handleCreateTask} className="btn btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('tasks.createTask')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 待完成任务 */}
            {pendingTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {t('tasks.pending')} ({pendingTasks.length})
                </h2>
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleStatus={handleToggleTaskStatus}
                      onSelect={handleSelectTask}
                      isSelected={selectedTasks.includes(task.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 已完成任务 */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  {t('tasks.completed')} ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleStatus={handleToggleTaskStatus}
                      onSelect={handleSelectTask}
                      isSelected={selectedTasks.includes(task.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 任务编辑器 */}
      <TaskEditor
        task={editingTask}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TasksPage;
