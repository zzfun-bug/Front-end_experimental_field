import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Language } from '@/types';
import { authService } from '@/services/auth';

interface UIState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  isMobile: boolean;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => Promise<void>;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setIsMobile: (isMobile: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      theme: 'light',
      language: 'zh',
      sidebarOpen: true,
      isMobile: false,

      // 设置主题
      setTheme: (theme: Theme) => {
        set({ theme });
        // 更新 HTML 根元素的 class
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },

      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // 设置语言
      setLanguage: async (language: Language) => {
        set({ language });
        
        // 同步到后端
        try {
          await authService.updateProfile({ language });
        } catch (error) {
          console.error('同步语言设置到后端失败:', error);
          // 如果同步失败，可以考虑回滚或显示错误提示
        }
      },

      // 设置侧边栏状态
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      // 切换侧边栏
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      // 设置移动端状态
      setIsMobile: (isMobile: boolean) => {
        set({ isMobile });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
