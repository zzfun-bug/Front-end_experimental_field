import { useTranslation } from '@/hooks/useTranslation';
import { useNotesStore } from '@/store/notesStore';
import { useTasksStore } from '@/store/tasksStore';
import { formatDate } from '@/utils';
import {
    Calendar,
    CheckSquare,
    Clock,
    FileText,
    Target,
    TrendingUp
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { notes, fetchNotes } = useNotesStore();
    const { tasks, fetchTasks, fetchStats, stats } = useTasksStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        console.log('📊 DashboardPage 开始加载数据...');

        const loadData = async () => {
            try {
                await Promise.all([
                    fetchNotes(),
                    fetchTasks(),
                    fetchStats()
                ]);
                console.log('📊 DashboardPage 数据加载完成');
            } catch (error) {
                console.error('📊 DashboardPage 数据加载失败:', error);
            }
        };

        loadData();
    }, [fetchNotes, fetchTasks, fetchStats, tasks]);

    // 获取最近笔记
    const recentNotes = notes.slice(0, 5);

    // 获取今日任务
    const todayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return task.dueDate.split('T')[0] === today;
    });

    // 获取待完成任务
    const pendingTasks = tasks.filter(task => task.status === 'pending');

    // 快速操作处理函数
    const handleCreateNote = () => {
        navigate('/notes');
        // 可以在这里添加一个状态来自动打开新建笔记的模态框
    };

    const handleCreateTask = () => {
        navigate('/tasks');
        // 可以在这里添加一个状态来自动打开新建任务的模态框
    };

    const handleViewAnalytics = () => {
        navigate('/analytics');
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
                <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 笔记总数 */}
                <div className="card">
                    <div className="card-content">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.totalNotes')}</p>
                                <p className="text-2xl font-bold">{notes.length}</p>
                            </div>
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* 任务总数 */}
                <div className="card">
                    <div className="card-content">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.totalTasks')}</p>
                                <p className="text-2xl font-bold">{tasks.length}</p>
                            </div>
                            <CheckSquare className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* 待完成任务 */}
                <div className="card">
                    <div className="card-content">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.pendingTasks')}</p>
                                <p className="text-2xl font-bold">{pendingTasks.length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* 完成率 */}
                <div className="card">
                    <div className="card-content">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.completionRate')}</p>
                                <p className="text-2xl font-bold">
                                    {tasks.length > 0 ? Math.round((stats?.completed || 0) / tasks.length * 100) : 0}%
                                </p>
                            </div>
                            <Target className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要内容区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 最近笔记 */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('dashboard.recentNotes')}</h3>
                        <p className="card-description">{t('dashboard.recentNotesDesc')}</p>
                    </div>
                    <div className="card-content">
                        {recentNotes.length > 0 ? (
                            <div className="space-y-4">
                                {recentNotes.map((note) => (
                                    <div key={note.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-foreground truncate">
                                                {note.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(note.createdAt, 'MM-dd HH:mm')}
                                            </p>
                                            {note.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {note.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>{t('dashboard.noNotes')}</p>
                                <p className="text-sm">{t('dashboard.noNotesDesc')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 今日任务 */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('dashboard.todayTasks')}</h3>
                        <p className="card-description">{t('dashboard.todayTasksDesc')}</p>
                    </div>
                    <div className="card-content">
                        {todayTasks.length > 0 ? (
                            <div className="space-y-3">
                                {todayTasks.map((task) => (
                                    <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'done'}
                                            onChange={() => {
                                                // TODO: 实现任务状态切换
                                            }}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-foreground truncate">
                                                {task.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {task.priority === 'high' && `🔴 ${t('dashboard.highPriority')}`}
                                                {task.priority === 'medium' && `🟡 ${t('dashboard.mediumPriority')}`}
                                                {task.priority === 'low' && `🟢 ${t('dashboard.lowPriority')}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>{t('dashboard.noTasksToday')}</p>
                                <p className="text-sm">{t('dashboard.noTasksTodayDesc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 快速操作 */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{t('dashboard.quickActions')}</h3>
                    <p className="card-description">{t('dashboard.quickActionsDesc')}</p>
                </div>
                <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={handleCreateNote}
                            className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary hover:text-primary transition-colors"
                        >
                            <FileText className="h-6 w-6 mr-2" />
                            {t('dashboard.createNewNote')}
                        </button>
                        <button
                            onClick={handleCreateTask}
                            className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary hover:text-primary transition-colors"
                        >
                            <CheckSquare className="h-6 w-6 mr-2" />
                            {t('dashboard.addNewTask')}
                        </button>
                        <button
                            onClick={handleViewAnalytics}
                            className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary hover:text-primary transition-colors"
                        >
                            <TrendingUp className="h-6 w-6 mr-2" />
                            {t('dashboard.viewAnalytics')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
