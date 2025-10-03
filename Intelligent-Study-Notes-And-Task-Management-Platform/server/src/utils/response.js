// 成功响应
export const successResponse = (res, data = null, message = '操作成功', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// 错误响应
export const errorResponse = (res, message = '操作失败', statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

// 服务器错误响应
export const serverErrorResponse = (res, error = null) => {
  console.error('服务器错误:', error);
  return res.status(500).json({
    success: false,
    message: '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && error && { error: error.message }),
  });
};

// 未授权响应
export const unauthorizedResponse = (res, message = '未授权访问') => {
  return res.status(401).json({
    success: false,
    message,
  });
};

// 禁止访问响应
export const forbiddenResponse = (res, message = '禁止访问') => {
  return res.status(403).json({
    success: false,
    message,
  });
};

// 未找到响应
export const notFoundResponse = (res, message = '资源未找到') => {
  return res.status(404).json({
    success: false,
    message,
  });
};

// 分页响应
export const paginatedResponse = (res, data, pagination, message = '获取成功') => {
  return res.status(200).json({
    success: true,
    message,
    data: data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};
