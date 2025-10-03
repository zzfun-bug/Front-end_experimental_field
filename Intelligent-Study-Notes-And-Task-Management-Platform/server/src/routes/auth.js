import express from 'express';
import {
  changePassword,
  getCurrentUser,
  getUserStats,
  login,
  register,
  updateProfile,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateLogin,
  validateRegister,
} from '../middleware/validation.js';

const router = express.Router();

// 公开路由
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// 需要认证的路由
router.get('/me', authenticate, getCurrentUser);
router.get('/stats', authenticate, getUserStats);
router.put('/me', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
