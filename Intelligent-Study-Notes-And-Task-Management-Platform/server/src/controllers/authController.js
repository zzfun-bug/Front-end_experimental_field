import { Op } from 'sequelize';
import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { errorResponse, serverErrorResponse, successResponse } from '../utils/response.js';

// 用户注册
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return errorResponse(res, '用户名或邮箱已存在', 400);
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
    });

    // 生成token
    const token = generateToken({ id: user.id });

    // 返回用户信息（不包含密码）
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      theme: user.theme,
      language: user.language,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    successResponse(res, { user: userData, token }, '注册成功', 201);
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 用户登录
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户（包含密码字段）
    const user = await User.scope('withPassword').findOne({
      where: { email }
    });

    if (!user) {
      return errorResponse(res, '邮箱或密码错误', 401);
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse(res, '邮箱或密码错误', 401);
    }

    // 检查账户状态
    if (!user.isActive) {
      return errorResponse(res, '账户已被禁用', 401);
    }

    // 更新最后登录时间
    await user.updateLastLogin();

    // 生成token
    const token = generateToken({ id: user.id });

    // 返回用户信息（不包含密码）
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      theme: user.theme,
      language: user.language,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    successResponse(res, { user: userData, token }, '登录成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取当前用户信息
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    // 格式化返回数据以匹配前端期望的字段名
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      theme: user.theme,
      language: user.language,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    successResponse(res, userData, '获取用户信息成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 更新用户资料
export const updateProfile = async (req, res) => {
  try {
    const { username, email, avatar, theme, language } = req.body;
    const userId = req.user.id;

    // 检查用户名和邮箱是否被其他用户使用
    if (username || email) {
      const whereConditions = [];
      if (username) whereConditions.push({ username });
      if (email) whereConditions.push({ email });

      const existingUser = await User.findOne({
        where: {
          id: { [Op.ne]: userId },
          [Op.or]: whereConditions,
        },
      });

      if (existingUser) {
        return errorResponse(res, '用户名或邮箱已被使用', 400);
      }
    }

    // 更新用户信息
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (theme) updateData.theme = theme;
    if (language) updateData.language = language;

    const [updatedRowsCount] = await User.update(
      updateData,
      {
        where: { id: userId },
      }
    );

    if (updatedRowsCount === 0) {
      return errorResponse(res, '用户不存在', 404);
    }

    // 获取更新后的用户信息
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    // 格式化返回数据以匹配前端期望的字段名
    const userData = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      theme: updatedUser.theme,
      language: updatedUser.language,
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    successResponse(res, userData, '更新用户信息成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取用户账户统计
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取笔记统计
    const { Note } = await import('../models/index.js');
    const totalNotes = await Note.count({ where: { userId } });

    // 获取任务统计
    const { Task } = await import('../models/index.js');
    const totalTasks = await Task.count({ where: { userId } });
    const completedTasks = await Task.count({
      where: { userId, status: 'done' }
    });

    // 计算存储使用量（简化计算）
    const notes = await Note.findAll({
      where: { userId },
      attributes: ['content']
    });

    // 计算文本内容大小（字节）
    const totalContentSize = notes.reduce((size, note) => {
      return size + (note.content ? Buffer.byteLength(note.content, 'utf8') : 0);
    }, 0);

    // 转换为MB
    const storageUsedMB = (totalContentSize / (1024 * 1024)).toFixed(2);
    const storageLimitMB = 100; // 免费用户限制100MB

    // 计算会员等级（简化逻辑）
    const memberLevel = totalNotes > 50 || totalTasks > 100 ? 'premium' : 'free';

    // 获取最后登录时间
    const user = await User.findByPk(userId);
    const lastLogin = user.lastLogin || user.createdAt;

    // 计算使用天数
    const daysSinceRegistration = Math.floor(
      (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    const stats = {
      memberLevel,
      storageUsed: `${storageUsedMB} MB`,
      storageLimit: `${storageLimitMB} MB`,
      storagePercentage: Math.round((storageUsedMB / storageLimitMB) * 100),
      lastLogin,
      totalNotes,
      totalTasks,
      completedTasks,
      daysSinceRegistration,
      registrationDate: user.createdAt
    };

    successResponse(res, stats, '获取账户统计成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 修改密码
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // 获取用户（包含密码字段）
    const user = await User.scope('withPassword').findByPk(userId);

    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    // 验证当前密码
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return errorResponse(res, '当前密码错误', 400);
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    successResponse(res, null, '密码修改成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};
