import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// 导入配置和中间件
import connectDB from './config/database.js';
import { serverErrorResponse } from './utils/response.js';

// 导入路由
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import taskRoutes from './routes/tasks.js';

// 导入模型关联（必须在使用模型之前导入）
import './models/index.js';

// 加载环境变量
dotenv.config({ path: '../env.config' });

// 连接数据库
connectDB();

const app = express();

// 安全中间件
app.use(helmet());

// 压缩响应
app.use(compression());

// 请求日志 - 已禁用以减少日志噪音
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined'));
// }

// CORS 配置
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 增加到1000个请求，适合开发环境
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试',
  },
  // 开发环境跳过某些IP
  skip: (req) => {
    // 在开发环境中跳过本地请求
    return process.env.NODE_ENV === 'development' &&
      (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1');
  },
});

app.use('/api/', limiter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在',
  });
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
  console.error('全局错误:', error);

  // Sequelize 验证错误
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors,
    });
  }

  // Sequelize 唯一约束错误
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0]?.path || 'unknown';
    return res.status(400).json({
      success: false,
      message: `${field} 已存在`,
    });
  }

  // JWT 错误
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '无效的token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token已过期',
    });
  }

  // 默认服务器错误
  serverErrorResponse(res, error);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📱 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API地址: http://localhost:${PORT}/api`);
});

export default app;
