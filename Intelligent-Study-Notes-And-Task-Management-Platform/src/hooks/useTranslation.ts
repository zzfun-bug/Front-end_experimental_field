import { useUIStore } from '@/store/uiStore';
import type { Language } from '@/types';
import { getTranslation } from '@/utils/i18n';

// 翻译hook
export const useTranslation = () => {
  const { language } = useUIStore();

  // 翻译函数
  const t = (key: string): string => {
    // 确保 language 有默认值
    const currentLanguage = language || 'zh';
    return getTranslation(currentLanguage, key);
  };

  // 带插值的翻译函数
  const tc = (key: string, values: Record<string, string | number> = {}): string => {
    const currentLanguage = language || 'zh';
    let translation = getTranslation(currentLanguage, key);

    // 替换占位符 {{key}} 为实际值
    Object.entries(values).forEach(([k, v]) => {
      translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    });

    return translation;
  };

  // 获取当前语言
  const getCurrentLanguage = (): Language => {
    return language || 'zh';
  };

  // 检查是否为中文
  const isZh = (): boolean => {
    return (language || 'zh') === 'zh';
  };

  // 检查是否为英文
  const isEn = (): boolean => {
    return (language || 'zh') === 'en';
  };

  return {
    t,
    tc,
    language: language || 'zh',
    getCurrentLanguage,
    isZh,
    isEn,
  };
};
