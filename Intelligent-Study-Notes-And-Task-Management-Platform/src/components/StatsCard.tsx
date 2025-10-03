import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        type: 'increase' | 'decrease' | 'neutral';
    };
    icon: LucideIcon;
    iconColor?: string;
    description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    iconColor = 'text-blue-500',
    description,
}) => {
    const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
        switch (type) {
            case 'increase':
                return 'text-green-600';
            case 'decrease':
                return 'text-red-600';
            case 'neutral':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    };

    const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
        switch (type) {
            case 'increase':
                return '↗';
            case 'decrease':
                return '↘';
            case 'neutral':
                return '→';
            default:
                return '';
        }
    };

    return (
        <div className="card">
            <div className="card-content">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                            {title}
                        </p>
                        <div className="flex items-baseline space-x-2">
                            <p className="text-2xl font-bold text-foreground">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </p>
                            {change && (
                                <span className={`text-sm font-medium ${getChangeColor(change.type)}`}>
                                    {getChangeIcon(change.type)} {Math.abs(change.value)}%
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg bg-opacity-10 ${iconColor.replace('text-', 'bg-').replace('-500', '-100')}`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
