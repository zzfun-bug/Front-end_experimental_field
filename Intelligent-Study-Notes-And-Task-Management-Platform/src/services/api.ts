import type { ApiResponse } from '@/types';
import { storage } from '@/utils';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取 token 的函数 - 同时检查多个来源
const getAuthToken = (): string | null => {
  // 1. 先从 localStorage 的 auth-storage 中获取 (Zustand persist)
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed?.state?.token) {
        return parsed.state.token;
      }
    }
  } catch (error) {
    console.log('解析 auth-storage 失败:', error);
  }

  // 2. 再从直接的 token 键获取
  const directToken = storage.get<string>('token');
  if (directToken) {
    return directToken;
  }

  return null;
};

// 请求拦截器 - 添加认证 token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    console.log('🔑 API 请求拦截器:', {
      url: config.url,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 30)}...` : 'null'
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ 已添加 Authorization header');
    } else {
      console.log('❌ 没有找到有效的 token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误和 token 过期
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    console.log('🚨 API 请求错误:', error.response?.status, error.response?.data);

    // 处理429错误 - 请求过于频繁
    if (error.response?.status === 429) {
      console.log('⚠️ 请求过于频繁，等待后重试...');

      // 显示用户友好的提示
      if (typeof window !== 'undefined') {
        // 可以在这里添加toast通知
        console.log('💡 提示：请求过于频繁，系统正在自动重试...');
      }

      // 等待2秒后重试
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 重试原始请求
      try {
        return await api.request(error.config);
      } catch (retryError) {
        console.log('🔄 重试失败:', retryError);
        throw retryError;
      }
    }

    // 如果是验证错误，详细显示错误信息
    if (error.response?.status === 400 && error.response?.data?.errors) {
      console.log('📋 详细验证错误:', error.response.data.errors);
      error.response.data.errors.forEach((err, index) => {
        console.log(`   ${index + 1}. ${err.msg} (字段: ${err.path || err.param})`);
      });
    }

    if (error.response?.status === 401) {
      console.log('🚨 401 错误，Token 可能过期');
      // Token 过期，清除本地存储和 auth-storage
      storage.remove('token');
      storage.remove('user');
      localStorage.removeItem('auth-storage');

      console.log('🚨 清除了所有认证数据，等待组件重新渲染');
    }
    return Promise.reject(error);
  }
);

// 通用 API 请求方法
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.get(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.post(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.put(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.delete(url, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.patch(url, data, config).then((res) => res.data),
};

export default api;
