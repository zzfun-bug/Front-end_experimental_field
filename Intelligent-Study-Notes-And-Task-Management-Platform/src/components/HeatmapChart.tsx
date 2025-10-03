import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';

interface HeatmapChartProps {
    data: { [date: string]: number };
    year?: number;
    title?: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
    data,
    year = new Date().getFullYear(),
    title,
}) => {
    const { t, tc } = useTranslation();

    // 如果没有传入 title，使用翻译的默认值
    const displayTitle = title || t('analytics.learningActivity');
    // 生成一年的所有日期
    const generateYearDates = (year: number) => {
        const dates = [];
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }

        return dates;
    };

    const yearDates = generateYearDates(year);
    const maxValue = Math.max(...Object.values(data), 1);

    // 获取颜色强度
    const getIntensity = (value: number) => {
        if (value === 0) return 0;
        return Math.ceil((value / maxValue) * 4);
    };

    // 获取颜色类名
    const getColorClass = (intensity: number) => {
        switch (intensity) {
            case 0:
                return 'bg-gray-100 dark:bg-gray-800';
            case 1:
                return 'bg-green-200 dark:bg-green-900';
            case 2:
                return 'bg-green-300 dark:bg-green-700';
            case 3:
                return 'bg-green-400 dark:bg-green-600';
            case 4:
                return 'bg-green-500 dark:bg-green-500';
            default:
                return 'bg-gray-100 dark:bg-gray-800';
        }
    };

    // 按周分组日期
    const weekGroups: Date[][] = [];
    let currentWeek: Date[] = [];

    yearDates.forEach((date, index) => {
        if (index === 0) {
            // 第一周可能不完整，用空白填充
            const dayOfWeek = date.getDay();
            for (let i = 0; i < dayOfWeek; i++) {
                currentWeek.push(new Date(0)); // 使用无效日期作为占位符
            }
        }

        currentWeek.push(date);

        if (currentWeek.length === 7) {
            weekGroups.push(currentWeek);
            currentWeek = [];
        }
    });

    // 处理最后一周
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(new Date(0)); // 用占位符填充
        }
        weekGroups.push(currentWeek);
    }

    const months = [
        t('analytics.jan'), t('analytics.feb'), t('analytics.mar'), t('analytics.apr'),
        t('analytics.may'), t('analytics.jun'), t('analytics.jul'), t('analytics.aug'),
        t('analytics.sep'), t('analytics.oct'), t('analytics.nov'), t('analytics.dec')
    ];

    const weekdays = [
        t('analytics.sun'), t('analytics.mon'), t('analytics.tue'), t('analytics.wed'),
        t('analytics.thu'), t('analytics.fri'), t('analytics.sat')
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{displayTitle}</h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{t('analytics.lowActivity')}</span>
                    <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4].map(intensity => (
                            <div
                                key={intensity}
                                className={`w-3 h-3 rounded-sm ${getColorClass(intensity)}`}
                            />
                        ))}
                    </div>
                    <span>{t('analytics.highActivity')}</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* 月份标签 */}
                    <div className="flex mb-2">
                        <div className="w-8"></div> {/* 空白区域对应星期标签 */}
                        <div className="flex-1 flex">
                            {months.map((month, index) => {
                                // 计算每个月大概占多少列
                                const monthEnd = new Date(year, index + 1, 0);
                                const daysInMonth = monthEnd.getDate();
                                const weeksInMonth = Math.ceil(daysInMonth / 7);

                                return (
                                    <div
                                        key={month}
                                        className="text-xs text-muted-foreground text-center"
                                        style={{ width: `${weeksInMonth * 12}px` }}
                                    >
                                        {month}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 热力图主体 */}
                    <div className="flex">
                        {/* 星期标签 */}
                        <div className="flex flex-col space-y-1 mr-2">
                            {weekdays.map((day, index) => (
                                <div
                                    key={day}
                                    className="w-6 h-3 flex items-center justify-center text-xs text-muted-foreground"
                                >
                                    {index % 2 === 1 ? day : ''}
                                </div>
                            ))}
                        </div>

                        {/* 热力图格子 */}
                        <div className="flex space-x-1">
                            {weekGroups.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col space-y-1">
                                    {week.map((date, dayIndex) => {
                                        const dateStr = date.getTime() === 0 ? '' : date.toISOString().split('T')[0];
                                        const value = dateStr ? (data[dateStr] || 0) : 0;
                                        const intensity = getIntensity(value);

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-3 h-3 rounded-sm ${getColorClass(intensity)} ${dateStr ? 'cursor-pointer hover:ring-1 hover:ring-gray-400' : ''
                                                    }`}
                                                title={
                                                    dateStr
                                                        ? `${dateStr}: ${value} ${t('analytics.activities')}`
                                                        : ''
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
                {tc('analytics.yearActivity', { year, count: Object.values(data).reduce((sum, val) => sum + val, 0) })}
            </div>
        </div>
    );
};

export default HeatmapChart;
