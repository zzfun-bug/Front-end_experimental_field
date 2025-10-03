import HeatmapChart from '@/components/HeatmapChart';
import SimpleChart from '@/components/SimpleChart';
import StatsCard from '@/components/StatsCard';
import { useTranslation } from '@/hooks/useTranslation';
import { analyticsService } from '@/services/analytics';
import type { AnalyticsData } from '@/types';
import { AlertCircle, CheckSquare, Clock, FileText, Flame, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [heatmapData, setHeatmapData] = useState<{ [date: string]: number }>({});
  const [productivityTrend, setProductivityTrend] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 优化：减少并发请求，先获取主要数据
      const analytics = await analyticsService.getAnalyticsData();
      setAnalyticsData(analytics);

      // 然后获取额外的图表数据
      const [heatmap, productivity] = await Promise.all([
        analyticsService.getHeatmapData(),
        analyticsService.getProductivityTrend(30),
      ]);

      setHeatmapData(heatmap);
      setProductivityTrend(productivity);
    } catch (error) {
      console.error(t('analytics.loading') + ' failed:', error);
      setError(error instanceof Error ? error.message : t('analytics.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}${t('analytics.minutes')}`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}${t('analytics.hours')}${remainingMinutes}${t('analytics.minutes')}` : `${hours}${t('analytics.hours')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('analytics.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.overview')}</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{t('analytics.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('analytics.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.overview')}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
            <button
              onClick={loadAnalyticsData}
              className="ml-auto text-destructive hover:text-destructive/80"
            >
              {t('common.reset')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('analytics.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.overview')}</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p>{t('analytics.noData')}</p>
        </div>
      </div>
    );
  }

  // 准备图表数据
  const weeklyTasksChartData = analyticsData.weeklyTaskStats.slice(0, 7).reverse().map(stat => ({
    label: stat.week.split('-W')[1] || stat.week,
    value: stat.completed,
  }));

  // 调试信息
  console.log('周任务统计原始数据:', analyticsData.weeklyTaskStats);
  console.log('周任务图表数据:', weeklyTasksChartData);

  const productivityChartData = productivityTrend.slice(-7).map(item => {
    // 安全地处理日期
    const date = new Date(item.date);
    const day = isNaN(date.getTime()) ? item.date.split('-')[2] : date.getDate().toString();

    return {
      label: day,
      value: item.notes + item.tasks,
    };
  });

  // 调试信息
  console.log('生产力趋势原始数据:', productivityTrend.slice(-7));
  console.log('图表数据:', productivityChartData);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">{t('analytics.overview')}</p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('analytics.tasksThisWeek')}
          value={analyticsData.recentActivity.tasksCompletedThisWeek}
          icon={Target}
          iconColor="text-green-500"
          description={t('analytics.lastWeek')}
        />

        <StatsCard
          title={t('analytics.totalStudyTime')}
          value={formatStudyTime(analyticsData.recentActivity.totalStudyTime)}
          icon={Clock}
          iconColor="text-blue-500"
          description={t('analytics.totalStudyTimeDesc')}
        />

        <StatsCard
          title={t('analytics.noteStats')}
          value={formatNumber(analyticsData.noteStats.totalWords)}
          icon={FileText}
          iconColor="text-purple-500"
          description={`${t('analytics.totalNotes')} ${analyticsData.noteStats.totalNotes}`}
        />

        <StatsCard
          title={t('analytics.studyStreak')}
          value={analyticsData.recentActivity.studyStreak}
          icon={Flame}
          iconColor="text-orange-500"
          description={t('analytics.studyStreakDesc')}
        />
      </div>

      {/* 详细统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t('analytics.taskStats')}</h3>
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.totalTasks')}</span>
                <span className="font-medium">{analyticsData.taskStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.completedTasks')}</span>
                <span className="font-medium text-green-600">{analyticsData.taskStats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.pendingTasks')}</span>
                <span className="font-medium text-yellow-600">{analyticsData.taskStats.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.overdue')}</span>
                <span className="font-medium text-red-600">{analyticsData.taskStats.overdue}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t('analytics.noteStats')}</h3>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.totalNotes')}</span>
                <span className="font-medium">{analyticsData.noteStats.totalNotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.totalWords')}</span>
                <span className="font-medium">{analyticsData.noteStats.totalWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.averageWords')}</span>
                <span className="font-medium">{analyticsData.noteStats.averageWordsPerNote}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('analytics.notesThisWeek')}</span>
                <span className="font-medium text-blue-600">{analyticsData.recentActivity.notesThisWeek}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t('analytics.completionRate')}</h3>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">{t('analytics.taskCompletionRate')}</span>
                  <span className="font-medium">
                    {analyticsData.taskStats.total > 0
                      ? Math.round((analyticsData.taskStats.completed / analyticsData.taskStats.total) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${analyticsData.taskStats.total > 0
                        ? (analyticsData.taskStats.completed / analyticsData.taskStats.total) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('analytics.taskTrend')}</h3>
            <p className="card-description">{t('analytics.taskTrendDesc')}</p>
          </div>
          <div className="card-content">
            <SimpleChart
              data={weeklyTasksChartData}
              type="bar"
              height={200}
              showValues={true}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('analytics.productivityTrend')}</h3>
            <p className="card-description">{t('analytics.productivityTrendDesc')}</p>
          </div>
          <div className="card-content">
            <SimpleChart
              data={productivityChartData}
              type="line"
              height={200}
              showValues={true}
            />
          </div>
        </div>
      </div>

      {/* 学习热力图 */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('analytics.activityHeatmap')}</h3>
          <p className="card-description">{t('analytics.activityHeatmapDesc')}</p>
        </div>
        <div className="card-content">
          <HeatmapChart data={heatmapData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
