import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 20],
        msg: '用户名长度必须在2-20个字符之间',
      },
      notEmpty: {
        msg: '用户名是必填项',
      },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: '请输入有效的邮箱地址',
      },
      notEmpty: {
        msg: '邮箱是必填项',
      },
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [8, 255],
        msg: '密码至少需要8个字符',
      },
      notEmpty: {
        msg: '密码是必填项',
      },
    },
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark'),
    defaultValue: 'light',
  },
  language: {
    type: DataTypes.ENUM('zh', 'en'),
    defaultValue: 'zh',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active', // 明确指定数据库字段名
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_login', // 明确指定数据库字段名
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    // 完全移除自定义索引，只使用 UNIQUE 约束自动创建的索引
  ],
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// 实例方法：验证密码
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 实例方法：更新最后登录时间
User.prototype.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

// 索引已在模型定义中配置

export default User;
