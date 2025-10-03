import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Note = sequelize.define('Note', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '内容是必填项',
      },
    },
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    validate: {
      isValidTags(value) {
        if (Array.isArray(value)) {
          for (const tag of value) {
            if (typeof tag !== 'string' || tag.length > 20) {
              throw new Error('标签必须是字符串且不能超过20个字符');
            }
          }
        } else {
          throw new Error('标签必须是数组格式');
        }
      },
    },
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wordCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  readingTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastAccessed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'notes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    // 完全移除自定义索引，只使用外键自动创建的索引
  ],
  hooks: {
    beforeSave: (note) => {
      if (note.changed('content')) {
        // 计算字数（去除HTML标签）
        const plainText = note.content.replace(/<[^>]*>/g, '');
        note.wordCount = plainText.length;

        // 计算阅读时间（按每分钟200字计算）
        note.readingTime = Math.ceil(note.wordCount / 200);
      }
    },
  },
});

// 实例方法：更新最后访问时间
Note.prototype.updateLastAccessed = async function () {
  this.lastAccessed = new Date();
  return await this.save();
};

// 索引已在模型定义中配置

export default Note;
