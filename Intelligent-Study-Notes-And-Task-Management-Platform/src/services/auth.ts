import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  User
} from '@/types';
import { storage } from '@/utils';
import { apiClient } from './api';

export const authService = {
  // 用户注册
  register: async (credentials: RegisterCredentials): Promise<AuthUser> => {
    const response = await apiClient.post<AuthUser>('/auth/register', credentials);
    if (response.success && response.data) {
      // authStore 会处理数据的持久化，这里不需要手动保存
      return response.data;
    }
    throw new Error(response.message || '注册失败');
  },

  // 用户登录
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    const response = await apiClient.post<AuthUser>('/auth/login', credentials);
    if (response.success && response.data) {
      console.log('🔐 AuthService: 登录成功', {
        hasToken: !!response.data.token,
        tokenLength: response.data.token?.length,
        user: response.data.user.username
      });

      // authStore 会处理数据的持久化，这里不需要手动保存
      return response.data;
    }
    throw new Error(response.message || '登录失败');
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取用户信息失败');
  },

  // 更新用户信息
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/me', userData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '更新用户信息失败');
  },

  // 用户登出
  logout: (): void => {
    storage.remove('token');
    storage.remove('user');
    localStorage.removeItem('auth-storage');
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    const token = storage.get<string>('token');
    const user = storage.get<User>('user');
    return !!(token && user);
  },

  // 获取本地存储的用户信息
  getStoredUser: (): User | null => {
    return storage.get<User>('user');
  },

  // 获取本地存储的 token
  getStoredToken: (): string | null => {
    return storage.get<string>('token');
  },
};
