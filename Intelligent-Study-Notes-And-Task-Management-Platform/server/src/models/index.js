import Note from './Note.js';
import Task from './Task.js';
import User from './User.js';

// 定义模型关联关系
// 用户与笔记的关系（一对多）
User.hasMany(Note, {
    foreignKey: 'userId',
    as: 'notes',
    onDelete: 'CASCADE',
});

Note.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

// 用户与任务的关系（一对多）
User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks',
    onDelete: 'CASCADE',
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

export {
    Note,
    Task, User
};

