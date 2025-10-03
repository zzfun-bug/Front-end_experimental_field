import { body, param, query, validationResult } from 'express-validator';

// 处理验证错误
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '输入数据验证失败',
      errors: errors.array(),
    });
  }
  next();
};

// 用户注册验证
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('用户名长度必须在2-20个字符之间'),

  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('密码至少需要8个字符'),

  handleValidationErrors,
];

// 用户登录验证
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('密码不能为空'),

  handleValidationErrors,
];

// 笔记创建/更新验证
export const validateNote = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('标题长度必须在1-200个字符之间'),

  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('内容不能为空'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('标签必须是数组格式'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('每个标签长度必须在1-20个字符之间'),

  handleValidationErrors,
];

// 任务创建/更新验证
export const validateTask = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('标题长度必须在1-200个字符之间'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('描述不能超过1000个字符'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('优先级必须是 low、medium 或 high'),

  body('status')
    .optional()
    .isIn(['pending', 'done'])
    .withMessage('状态必须是 pending 或 done'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('截止日期必须是有效的日期格式'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('分类不能超过50个字符'),

  handleValidationErrors,
];

// MySQL ID 验证
export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isInt({ min: 1 })
    .withMessage('无效的ID格式'),

  handleValidationErrors,
];

// 分页参数验证
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是大于0的整数'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须在1-100之间'),

  handleValidationErrors,
];

// 搜索参数验证
export const validateSearch = [
  query('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('搜索关键词长度必须在1-100个字符之间'),

  query('tags')
    .optional()
    .isString()
    .withMessage('标签参数必须是字符串格式'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('开始日期必须是有效的日期格式'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('结束日期必须是有效的日期格式'),

  handleValidationErrors,
];
