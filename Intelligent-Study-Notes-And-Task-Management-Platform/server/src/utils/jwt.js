import jwt from 'jsonwebtoken';

// 生成JWT token
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-development-only';
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// 验证JWT token
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-development-only';
  return jwt.verify(token, secret);
};

// 生成刷新token
export const generateRefreshToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-development-only';
  return jwt.sign(payload, secret, {
    expiresIn: '30d',
  });
};
