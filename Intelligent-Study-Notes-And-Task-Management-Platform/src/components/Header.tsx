import { NotificationIcon, NotificationPanel, useNotifications } from '@/components/NotificationComponents';
import { useTranslation } from '@/hooks/useTranslation';
import { searchService, type SearchHistory } from '@/services/search';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  Clock,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen, isMobile } = useUIStore();
  const navigate = useNavigate();
  const { t, tc } = useTranslation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // 使用通知系统
  const {
    notifications,
    unreadCount,
    isOpen: isNotificationOpen,
    togglePanel: toggleNotificationPanel,
    closePanel: closeNotificationPanel,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll: clearAllNotifications,
  } = useNotifications();

  // 加载搜索历史
  useEffect(() => {
    setSearchHistory(searchService.getSearchHistory());
  }, []);

  // 处理搜索
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchService.globalSearch(query);
      // 导航到搜索结果页面
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 处理搜索输入变化
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  // 点击历史搜索项
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // 删除历史搜索项
  const handleRemoveHistory = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    searchService.removeSearchHistoryItem(query);
    setSearchHistory(searchService.getSearchHistory());
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* 左侧 */}
        <div className="flex items-center space-x-4">
          {/* 移动端菜单按钮 */}
          {isMobile && (
            <button
              className="p-2 rounded-md hover:bg-accent"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Search size={20} />
            </button>
          )}

          {/* 搜索框 */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              className="pl-10 pr-4 py-2 w-64 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />

            {/* 搜索结果下拉框 */}
            {showSearchResults && (
              <div
                ref={searchResultsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
              >
                {searchQuery.trim() ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{tc('header.searchFor', { query: searchQuery })}</span>
                      {isSearching && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      )}
                    </div>
                    <button
                      onClick={() => handleSearch(searchQuery)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors flex items-center"
                    >
                      <Search size={14} className="mr-2 text-muted-foreground" />
                      {tc('header.searchFor', { query: searchQuery })}
                    </button>
                  </div>
                ) : searchHistory.length > 0 ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{t('header.recentSearches')}</span>
                      <button
                        onClick={() => {
                          searchService.clearSearchHistory();
                          setSearchHistory([]);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        {t('header.clearAll')}
                      </button>
                    </div>
                    {searchHistory.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors group cursor-pointer"
                        onClick={() => handleHistoryClick(item.query)}
                      >
                        <div className="flex items-center flex-1">
                          <Clock size={14} className="mr-2 text-muted-foreground" />
                          <span className="truncate">{item.query}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({tc('header.resultsCount', { count: item.results })})
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveHistory(item.query, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    {t('header.noSearchHistory')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右侧 */}
        <div className="flex items-center space-x-4">
          {/* 主题切换 */}
          <button
            className="p-2 rounded-md hover:bg-accent transition-colors"
            onClick={toggleTheme}
            title={theme === 'light' ? t('header.switchToDark') : t('header.switchToLight')}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* 通知 */}
          <div className="relative">
            <NotificationIcon
              onClick={toggleNotificationPanel}
              unreadCount={unreadCount}
            />
            <NotificationPanel
              isOpen={isNotificationOpen}
              onClose={closeNotificationPanel}
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onRemoveNotification={removeNotification}
              onClearAll={clearAllNotifications}
            />
          </div>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User size={16} className="text-primary-foreground" />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.username}
              </span>
            </button>

            {/* 下拉菜单 */}
            {showUserMenu && (
              <>
                {/* 遮罩层 */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />

                {/* 菜单内容 */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-md shadow-lg z-20">
                  <div className="p-3 border-b">
                    <div className="text-sm font-medium">{user?.username}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>

                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                      onClick={handleSettings}
                    >
                      <Settings size={16} className="mr-2" />
                      {t('header.settings')}
                    </button>

                    <button
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors text-red-600 dark:text-red-400"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      {t('header.logout')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
