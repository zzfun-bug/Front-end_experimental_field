import { DataTypes, Op } from 'sequelize';
import { sequelize } from '../config/database.js';

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    validate: {
      notEmpty: {
        msg: '用户ID是必填项',
      },
    },
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: {
        args: [1, 200],
        msg: '标题长度必须在1-200个字符之间',
      },
      notEmpty: {
        msg: '标题是必填项',
      },
    },
  },
  description: {
    type: DataTypes.STRING(1000),
    defaultValue: '',
    validate: {
      len: {
        args: [0, 1000],
        msg: '描述不能超过1000个字符',
      },
    },
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'done'),
    defaultValue: 'pending',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'general',
    validate: {
      len: {
        args: [0, 50],
        msg: '分类不能超过50个字符',
      },
    },
  },
  estimatedTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  actualTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    // 完全移除自定义索引，只使用外键自动创建的索引
  ],
  hooks: {
    beforeSave: (task) => {
      if (task.changed('status') && task.status === 'done' && !task.completedAt) {
        task.completedAt = new Date();
      } else if (task.changed('status') && task.status === 'pending') {
        task.completedAt = null;
      }
    },
  },
});

// 虚拟字段：检查任务是否逾期
Task.prototype.getIsOverdue = function () {
  if (!this.dueDate || this.status === 'done') return false;
  return new Date() > this.dueDate;
};

// 静态方法：获取任务完成率
Task.getCompletionRate = async function (userId, startDate, endDate) {
  const whereClause = { userId };
  if (startDate && endDate) {
    whereClause.created_at = {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    };
  }

  const total = await this.count({ where: whereClause });
  const completed = await this.count({
    where: { ...whereClause, status: 'done' }
  });

  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

// 索引已在模型定义中配置

export default Task;
