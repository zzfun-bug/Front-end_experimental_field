import { Op } from 'sequelize';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { errorResponse, paginatedResponse, serverErrorResponse, successResponse } from '../utils/response.js';

// 获取所有任务
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query, status, priority, startDate, endDate, sortBy = 'created_at', sortOrder = 'desc' } = req.query;

    // 构建查询条件
    const where = { userId };

    // 搜索条件
    if (query) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
        { category: { [Op.like]: `%${query}%` } }
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    // 排序
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const tasks = await Task.findAll({
      where,
      order,
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, tasks, '获取任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取分页任务
export const getTasksPaginated = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, priority, startDate, endDate, sortBy = 'created_at', sortOrder = 'desc' } = req.query;

    // 构建查询条件
    const where = { userId };

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    // 排序
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const offset = (page - 1) * limit;

    const { count: total, rows: tasks } = await Task.findAndCountAll({
      where,
      order,
      offset,
      limit,
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    paginatedResponse(res, tasks, { page, limit, total }, '获取任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 根据ID获取任务
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({
      where: { id, userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    if (!task) {
      return errorResponse(res, '任务不存在', 404);
    }

    successResponse(res, task, '获取任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 创建任务
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, dueDate, category, estimatedTime } = req.body;

    const task = await Task.create({
      userId,
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      category,
      estimatedTime,
    });

    const populatedTask = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, populatedTask, '创建任务成功', 201);
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 更新任务
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, priority, status, dueDate, category, estimatedTime, actualTime } = req.body;

    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return errorResponse(res, '任务不存在', 404);
    }

    // 更新字段
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (category !== undefined) task.category = category;
    if (estimatedTime !== undefined) task.estimatedTime = estimatedTime;
    if (actualTime !== undefined) task.actualTime = actualTime;

    await task.save();

    const populatedTask = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, populatedTask, '更新任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 删除任务
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedCount = await Task.destroy({ where: { id, userId } });

    if (deletedCount === 0) {
      return errorResponse(res, '任务不存在', 404);
    }

    successResponse(res, null, '删除任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 批量删除任务
export const deleteTasks = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, '请提供有效的任务ID列表', 400);
    }

    const deletedCount = await Task.destroy({
      where: {
        id: { [Op.in]: ids },
        userId,
      }
    });

    successResponse(res, { deletedCount }, '批量删除任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 更新任务状态
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return errorResponse(res, '任务不存在', 404);
    }

    task.status = status;
    await task.save();

    const populatedTask = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, populatedTask, '更新任务状态成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 批量更新任务状态
export const updateTasksStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, '请提供有效的任务ID列表', 400);
    }

    const [affectedCount] = await Task.update(
      { status },
      {
        where: {
          id: { [Op.in]: ids },
          userId
        }
      }
    );

    successResponse(res, { modifiedCount: affectedCount }, '批量更新任务状态成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 更新任务排序
export const updateTaskOrder = async (req, res) => {
  try {
    const { taskOrders } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(taskOrders) || taskOrders.length === 0) {
      return errorResponse(res, '请提供有效的任务排序数据', 400);
    }

    // 批量更新任务排序
    const updatePromises = taskOrders.map(({ id, order }) =>
      Task.update({ order }, { where: { id, userId } })
    );

    await Promise.all(updatePromises);

    successResponse(res, null, '更新任务排序成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取任务统计
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取总数
    const total = await Task.count({ where: { userId } });

    // 获取已完成数量
    const completed = await Task.count({
      where: { userId, status: 'done' }
    });

    // 获取待处理数量
    const pending = await Task.count({
      where: { userId, status: 'pending' }
    });

    // 获取过期数量
    const overdue = await Task.count({
      where: {
        userId,
        status: 'pending',
        dueDate: {
          [Op.ne]: null,
          [Op.lt]: new Date()
        }
      }
    });

    const result = {
      total,
      completed,
      pending,
      overdue,
    };

    successResponse(res, result, '获取任务统计成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取每周任务完成率
export const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const weeks = parseInt(req.query.weeks) || 12;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    // 简化的统计实现，获取最近几周的任务
    const tasks = await Task.findAll({
      where: {
        userId,
        created_at: { [Op.gte]: startDate }
      },
      order: [['created_at', 'DESC']]
    });

    // 手动按周分组 - 基于完成时间统计
    const weeklyStats = {};

    // 先初始化最近几周的数据
    for (let i = 0; i < weeks; i++) {
      const weekDate = new Date();
      weekDate.setDate(weekDate.getDate() - i * 7);
      const year = weekDate.getFullYear();
      const week = Math.ceil((weekDate.getDate() - weekDate.getDay() + 1) / 7);
      const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;
      weeklyStats[weekKey] = { total: 0, completed: 0 };
    }

    // 统计完成的任务（基于完成时间）
    tasks.forEach(task => {
      if (task.status === 'done' && task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const year = completedDate.getFullYear();
        const week = Math.ceil((completedDate.getDate() - completedDate.getDay() + 1) / 7);
        const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;

        if (weeklyStats[weekKey]) {
          weeklyStats[weekKey].completed++;
        }
      }
    });

    // 统计总任务数（基于创建时间）
    tasks.forEach(task => {
      const taskDate = new Date(task.created_at);
      const year = taskDate.getFullYear();
      const week = Math.ceil((taskDate.getDate() - taskDate.getDay() + 1) / 7);
      const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;

      if (weeklyStats[weekKey]) {
        weeklyStats[weekKey].total++;
      }
    });

    const result = Object.entries(weeklyStats)
      .map(([week, stats]) => ({ week, ...stats }))
      .slice(0, weeks);

    successResponse(res, result, '获取每周统计成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取今日任务
export const getTodayTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const tasks = await Task.findAll({
      where: {
        userId,
        dueDate: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
      },
      order: [['priority', 'DESC'], ['created_at', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, tasks, '获取今日任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取逾期任务
export const getOverdueTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.findAll({
      where: {
        userId,
        status: 'pending',
        dueDate: { [Op.lt]: new Date() },
      },
      order: [['dueDate', 'ASC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, tasks, '获取逾期任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 搜索任务
export const searchTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return errorResponse(res, '搜索关键词不能为空', 400);
    }

    const tasks = await Task.findAll({
      where: {
        userId,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { category: { [Op.like]: `%${query}%` } }
        ]
      },
      order: [['updated_at', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }],
      limit: 50
    });

    successResponse(res, tasks, '搜索任务成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};
