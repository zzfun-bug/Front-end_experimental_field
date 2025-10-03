import React from 'react';

interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

interface SimpleChartProps {
    data: ChartDataPoint[];
    type: 'bar' | 'line';
    height?: number;
    showValues?: boolean;
    title?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
    data,
    type,
    height = 200,
    showValues = false,
    title,
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
                <div className="text-center">
                    <p>暂无数据</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    // 调试信息
    console.log('图表数据:', data);
    console.log('最大值:', maxValue, '最小值:', minValue, '范围:', range);

    const getBarHeight = (value: number) => {
        if (isNaN(value) || !isFinite(value)) return 0;

        // 如果所有值都相同（range为0），返回底部位置
        if (range === 0) {
            return height - 40; // 底部位置
        }

        // 正常计算高度，包括零值
        const normalizedValue = (value - minValue) / range;
        const barHeight = normalizedValue * (height - 40);
        return Math.max(0, Math.min(height - 40, barHeight));
    };

    // 调试：打印每个数据点的坐标
    const debugPoints = data.map((item, index) => {
        const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
        const y = height - getBarHeight(item.value) + 20;
        console.log(`数据点 ${index}: 值=${item.value}, X=${x}%, Y=${y}, getBarHeight=${getBarHeight(item.value)}`);
        return { x, y, value: item.value };
    });
    console.log('所有数据点坐标:', debugPoints);

    const defaultColors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-pink-500',
        'bg-indigo-500',
    ];

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
            )}

            {type === 'bar' && (
                <div className="flex items-end justify-between space-x-2" style={{ height: height + 60 }}>
                    {data.map((item, index) => {
                        const barHeight = getBarHeight(item.value);
                        const colorClass = item.color || defaultColors[index % defaultColors.length];

                        return (
                            <div key={index} className="flex flex-col items-center flex-1 max-w-16">
                                {showValues && (
                                    <div className="text-xs text-muted-foreground mb-1">
                                        {item.value}
                                    </div>
                                )}
                                <div
                                    className={`w-full ${colorClass} rounded-t transition-all duration-300 hover:opacity-80`}
                                    style={{ height: Math.max(barHeight, 4) }}
                                    title={`${item.label}: ${item.value}`}
                                />
                                <div className="text-xs text-muted-foreground mt-2 text-center break-words">
                                    {item.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {type === 'line' && (
                <div className="relative" style={{ height: height + 40 }}>
                    <svg width="100%" height={height + 40} className="overflow-visible">
                        {/* 网格线 */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                            <line
                                key={index}
                                x1="0"
                                y1={height * ratio + 20}
                                x2="100%"
                                y2={height * ratio + 20}
                                stroke="currentColor"
                                strokeOpacity="0.1"
                                strokeWidth="1"
                            />
                        ))}

                        {/* 数据线 */}
                        {data.length > 1 && (
                            <polyline
                                fill="none"
                                stroke="rgb(59 130 246)"
                                strokeWidth="2"
                                points={data.map((item, index) => {
                                    // 计算X坐标，与X轴标签的justify-between布局对齐
                                    // 每个标签占据 100/data.length 的宽度，圆点应该在每个标签的中心
                                    const labelWidth = 100 / data.length;
                                    const x = (index * labelWidth) + (labelWidth / 2);

                                    // 计算Y坐标（像素值）
                                    const barHeight = getBarHeight(item.value);
                                    const y = height - barHeight + 20;

                                    // 确保坐标有效
                                    const validX = Math.max(0, Math.min(100, x));
                                    const validY = Math.max(20, Math.min(height + 20, y));

                                    console.log(`折线点 ${index}: 值=${item.value}, X=${validX}%, Y=${validY}, barHeight=${barHeight}`);

                                    // 返回像素坐标
                                    return `${validX * (height + 40) / 100},${validY}`;
                                }).join(' ')}
                            />
                        )}

                        {/* 数据点 */}
                        {data.map((item, index) => {
                            // 计算X坐标，与X轴标签的justify-between布局对齐
                            // 每个标签占据 100/data.length 的宽度，圆点应该在每个标签的中心
                            const labelWidth = 100 / data.length;
                            const x = (index * labelWidth) + (labelWidth / 2);

                            // 计算Y坐标（像素值）
                            const barHeight = getBarHeight(item.value);
                            const y = height - barHeight + 20;

                            // 确保坐标有效
                            const validX = Math.max(0, Math.min(100, x));
                            const validY = Math.max(20, Math.min(height + 20, y));

                            // 转换为像素坐标
                            const pixelX = validX * (height + 40) / 100;

                            return (
                                <g key={index}>
                                    <circle
                                        cx={pixelX}
                                        cy={validY}
                                        r="4"
                                        fill="rgb(59 130 246)"
                                        className="hover:r-6 transition-all cursor-pointer"
                                    />
                                    {showValues && (
                                        <text
                                            x={pixelX}
                                            y={validY - 10}
                                            textAnchor="middle"
                                            className="text-xs fill-current text-muted-foreground"
                                        >
                                            {item.value}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* X轴标签 */}
                    <div className="flex justify-between mt-2">
                        {data.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="text-xs text-muted-foreground text-center"
                                    style={{
                                        width: `${100 / data.length}%`,
                                        transform: 'translateX(0)'
                                    }}
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleChart;
