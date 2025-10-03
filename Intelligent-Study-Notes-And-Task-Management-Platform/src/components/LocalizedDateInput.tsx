import { useTranslation } from '@/hooks/useTranslation';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LocalizedDateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const LocalizedDateInput: React.FC<LocalizedDateInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  min,
  max,
}) => {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 格式化日期显示
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    if (language === 'en') {
      // 英文格式: MM/DD/YYYY
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } else {
      // 中文格式: YYYY/MM/DD
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
  };

  // 更新显示值
  useEffect(() => {
    setDisplayValue(formatDateForDisplay(value));
  }, [value, language]);

  // 处理日期选择
  const handleDateSelect = (selectedDate: string) => {
    onChange(selectedDate);
    setIsOpen(false);
  };

  // 生成月份的所有日期
  const generateMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // 添加上个月的末尾几天（用于填充第一周）
    const prevMonth = new Date(year, month, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        dateString: '',
      });
    }

    // 添加当前月的所有日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateString === new Date().toISOString().split('T')[0];
      const isSelected = dateString === value;

      days.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        dateString,
      });
    }

    // 添加下个月的开头几天（用于填充最后一周）
    const remainingDays = 42 - days.length; // 6周 x 7天 = 42天
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        dateString: '',
      });
    }

    return days;
  };

  // 检查日期是否在允许范围内
  const isDateInRange = (dateString: string) => {
    if (!dateString) return false;
    if (min && dateString < min) return false;
    if (max && dateString > max) return false;
    return true;
  };

  const monthDays = generateMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());
  const monthNames = language === 'en'
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const weekDays = language === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="relative">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          value={displayValue}
          placeholder={placeholder || (language === 'en' ? 'MM/DD/YYYY' : '年/月/日')}
          className={`input pl-10 pr-10 ${className}`}
          disabled={disabled}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <Calendar size={16} />
        </button>
      </div>

      {/* 日期选择器下拉 */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 w-80">
            <div className="p-4">
              {/* 月份导航 */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <h3 className="font-medium text-foreground">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* 星期标题 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* 日期网格 */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (day.isCurrentMonth && day.dateString && isDateInRange(day.dateString)) {
                        handleDateSelect(day.dateString);
                      }
                    }}
                    disabled={!day.isCurrentMonth || !day.dateString || !isDateInRange(day.dateString)}
                    className={`
                      h-8 w-8 text-xs rounded-md transition-colors
                      ${day.isCurrentMonth
                        ? 'text-foreground hover:bg-muted'
                        : 'text-muted-foreground cursor-not-allowed'
                      }
                      ${day.isSelected
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : ''
                      }
                      ${day.isToday
                        ? 'ring-2 ring-primary/50'
                        : ''
                      }
                      ${!day.isCurrentMonth || !day.dateString || !isDateInRange(day.dateString)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                      }
                    `}
                  >
                    {day.date}
                  </button>
                ))}
              </div>

              {/* 快速选择按钮 */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => handleDateSelect(new Date().toISOString().split('T')[0])}
                  className="btn btn-outline btn-sm flex-1"
                >
                  {language === 'en' ? 'Today' : '今天'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    handleDateSelect(tomorrow.toISOString().split('T')[0]);
                  }}
                  className="btn btn-outline btn-sm flex-1"
                >
                  {language === 'en' ? 'Tomorrow' : '明天'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocalizedDateInput;
