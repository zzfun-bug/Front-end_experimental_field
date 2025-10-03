import { Op } from 'sequelize';
import Note from '../models/Note.js';
import User from '../models/User.js';
import { errorResponse, paginatedResponse, serverErrorResponse, successResponse } from '../utils/response.js';

// 获取所有笔记
export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query, tags, startDate, endDate, sortBy = 'created_at', sortOrder = 'desc' } = req.query;

    // 构建查询条件
    const where = { userId };

    // 搜索条件 (简化版，Sequelize 的全文搜索需要额外配置)
    if (query) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { content: { [Op.like]: `%${query}%` } }
      ];
    }

    // 标签过滤
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = { [Op.overlap]: tagArray };
    }

    // 日期范围过滤
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    // 排序
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const notes = await Note.findAll({
      where,
      order,
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, notes, '获取笔记成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取分页笔记
export const getNotesPaginated = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { query, tags, startDate, endDate, sortBy = 'created_at', sortOrder = 'desc' } = req.query;

    // 构建查询条件
    const where = { userId };

    // 搜索条件 (简化版，Sequelize 的全文搜索需要额外配置)
    if (query) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { content: { [Op.like]: `%${query}%` } }
      ];
    }

    // 标签过滤
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = { [Op.overlap]: tagArray };
    }

    // 日期范围过滤
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    // 排序
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const offset = (page - 1) * limit;

    const { count: total, rows: notes } = await Note.findAndCountAll({
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

    paginatedResponse(res, notes, { page, limit, total }, '获取笔记成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 根据ID获取笔记
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({
      where: { id, userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    if (!note) {
      return errorResponse(res, '笔记不存在', 404);
    }

    // 更新最后访问时间
    await Note.update(
      { lastAccessed: new Date() },
      { where: { id } }
    );

    successResponse(res, note, '获取笔记成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 创建笔记
export const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, tags = [], isPublic = false } = req.body;

    const note = await Note.create({
      userId,
      title,
      content,
      tags,
      isPublic,
    });

    const populatedNote = await Note.findByPk(note.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, populatedNote, '创建笔记成功', 201);
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 更新笔记
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content, tags, isPublic } = req.body;

    const note = await Note.findOne({ where: { id, userId } });

    if (!note) {
      return errorResponse(res, '笔记不存在', 404);
    }

    // 更新字段
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    await note.update(updateData);

    const populatedNote = await Note.findByPk(note.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'avatar']
      }]
    });

    successResponse(res, populatedNote, '更新笔记成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 删除笔记
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedCount = await Note.destroy({
      where: { id, userId }
    });

    if (deletedCount === 0) {
      return errorResponse(res, '笔记不存在', 404);
    }

    successResponse(res, null, '删除笔记成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 批量删除笔记
export const deleteNotes = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, '请提供有效的笔记ID列表', 400);
    }

    const deletedCount = await Note.destroy({
      where: {
        id: { [Op.in]: ids },
        userId,
      }
    });

    successResponse(res, { deletedCount }, '批量删除笔记成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 搜索笔记
export const searchNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return errorResponse(res, '搜索关键词不能为空', 400);
    }

    const notes = await Note.findAll({
      where: {
        userId,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } }
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

    successResponse(res, notes, '搜索笔记成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取所有标签
export const getTags = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取所有笔记的标签
    const notes = await Note.findAll({
      where: { userId },
      attributes: ['tags']
    });

    // 统计标签
    const tagCount = {};
    notes.forEach(note => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    // 转换为数组并排序
    const tagList = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    successResponse(res, tagList, '获取标签成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};

// 获取笔记统计
export const getNoteStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取基本统计
    const totalNotes = await Note.count({ where: { userId } });

    const notes = await Note.findAll({
      where: { userId },
      attributes: ['wordCount', 'created_at']
    });

    const totalWords = notes.reduce((sum, note) => sum + (note.wordCount || 0), 0);
    const averageWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;

    // 按月统计（简化版）
    const monthlyStats = {};
    notes.forEach(note => {
      const date = new Date(note.created_at);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
    });

    const notesByMonth = Object.entries(monthlyStats)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    const result = {
      totalNotes,
      totalWords,
      averageWordsPerNote,
      notesByMonth,
    };

    successResponse(res, result, '获取笔记统计成功');
  } catch (error) {
    serverErrorResponse(res, error);
  }
};
