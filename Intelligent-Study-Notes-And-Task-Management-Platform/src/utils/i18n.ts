// 国际化翻译系统
import type { Language } from '@/types';

// 翻译文本类型
export interface TranslationKeys {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    search: string;
    filter: string;
    clear: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
  };
  header: {
    searchPlaceholder: string;
    searchFor: string;
    recentSearches: string;
    clearAll: string;
    resultsCount: string;
    noSearchHistory: string;
    switchToDark: string;
    switchToLight: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
    settings: string;
    logout: string;
  };
  auth: {
    login: string;
    register: string;
    logout: string;
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    forgotPasswordTitle: string;
    resetPasswordTitle: string;
    forgotPasswordSubtitle: string;
    resetPasswordSubtitle: string;
    enterEmail: string;
    enterNewPassword: string;
    confirmNewPassword: string;
    sendResetEmail: string;
    backToLogin: string;
    emailSent: string;
    passwordReset: string;
    loginSuccess: string;
    registerSuccess: string;
    loginError: string;
    registerError: string;
    loginTitle: string;
    registerTitle: string;
    loginSubtitle: string;
    registerSubtitle: string;
    rememberMe: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    createAccount: string;
    signIn: string;
    signUp: string;
    loading: string;
    error: string;
    success: string;
    validation: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      passwordMinLength: string;
      usernameRequired: string;
      usernameMinLength: string;
      usernameMaxLength: string;
      confirmPasswordRequired: string;
      passwordsNotMatch: string;
    };
    messages: {
      loginSuccess: string;
      registerSuccess: string;
      loginFailed: string;
      registerFailed: string;
      invalidCredentials: string;
      accountDisabled: string;
      emailAlreadyExists: string;
      usernameAlreadyExists: string;
      networkError: string;
      serverError: string;
    };
  };
  navigation: {
    dashboard: string;
    notes: string;
    tasks: string;
    analytics: string;
    profile: string;
    search: string;
  };
  profile: {
    title: string;
    personalInfo: string;
    themeSettings: string;
    languageSettings: string;
    accountStats: string;
    currentTheme: string;
    lightMode: string;
    darkMode: string;
    chinese: string;
    english: string;
    memberLevel: string;
    storageUsed: string;
    lastLogin: string;
    freeUser: string;
    today: string;
    registrationDate: string;
  };
  notes: {
    title: string;
    createNote: string;
    editNote: string;
    deleteNote: string;
    searchNotes: string;
    noNotes: string;
    noteContent: string;
    noteTags: string;
    noteCreated: string;
    noteUpdated: string;
    noteDeleted: string;
    newNote: string;
    editNoteTitle: string;
    noteTitle: string;
    noteDescription: string;
    addTag: string;
    saveNote: string;
    cancel: string;
    deleteConfirm: string;
    deleteConfirmMessage: string;
    loading: string;
    error: string;
    success: string;
    filterByTag: string;
    sortBy: string;
    sortByDate: string;
    sortByTitle: string;
    sortByUpdated: string;
    allTags: string;
    noTags: string;
    selectNote: string;
    createFirstNote: string;
    createFirstNoteDesc: string;
    searchPlaceholder: string;
    filter: string;
    clear: string;
    tags: string;
    selectedTags: string;
    createdTime: string;
    to: string;
    searchFor: string;
    titleRequired: string;
    contentRequired: string;
    titlePlaceholder: string;
    contentPlaceholder: string;
    characterCount: string;
    saving: string;
  };
  tasks: {
    title: string;
    createTask: string;
    editTask: string;
    deleteTask: string;
    searchTasks: string;
    noTasks: string;
    taskTitle: string;
    taskDescription: string;
    taskPriority: string;
    taskStatus: string;
    taskDueDate: string;
    taskCreated: string;
    taskUpdated: string;
    taskCompleted: string;
    pending: string;
    completed: string;
    highPriority: string;
    mediumPriority: string;
    lowPriority: string;
    newTask: string;
    editTaskTitle: string;
    addTask: string;
    saveTask: string;
    cancel: string;
    deleteConfirm: string;
    deleteConfirmMessage: string;
    loading: string;
    error: string;
    success: string;
    filterByStatus: string;
    filterByPriority: string;
    sortBy: string;
    sortByDate: string;
    sortByTitle: string;
    sortByPriority: string;
    selectTask: string;
    createFirstTask: string;
    createFirstTaskDesc: string;
    toggleStatus: string;
    markComplete: string;
    markPending: string;
    searchPlaceholder: string;
    filter: string;
    clear: string;
    clearAll: string;
    applyFilters: string;
    filterTasks: string;
    status: string;
    priority: string;
    allStatus: string;
    allPriority: string;
    dueDateRange: string;
    startDate: string;
    endDate: string;
    titleRequired: string;
    titleTooLong: string;
    descriptionTooLong: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    characterCount: string;
    saving: string;
    dueDate: string;
    dueDateOptional: string;
    description: string;
    updateTask: string;
  };
  analytics: {
    title: string;
    overview: string;
    noteStats: string;
    taskStats: string;
    productivity: string;
    notesThisWeek: string;
    tasksThisWeek: string;
    studyStreak: string;
    totalStudyTime: string;
    loading: string;
    error: string;
    noData: string;
    noDataDesc: string;
    totalNotes: string;
    totalTasks: string;
    completedTasks: string;
    pendingTasks: string;
    averagePerDay: string;
    totalWords: string;
    averageWords: string;
    overdue: string;
    days: string;
    hours: string;
    minutes: string;
    thisWeek: string;
    lastWeek: string;
    thisMonth: string;
    lastMonth: string;
    productivityTrend: string;
    activityHeatmap: string;
    recentActivity: string;
    completionRate: string;
    taskCompletionRate: string;
    taskTrend: string;
    taskTrendDesc: string;
    productivityTrendDesc: string;
    activityHeatmapDesc: string;
    studyStreakDesc: string;
    totalStudyTimeDesc: string;
    // 月份
    jan: string;
    feb: string;
    mar: string;
    apr: string;
    may: string;
    jun: string;
    jul: string;
    aug: string;
    sep: string;
    oct: string;
    nov: string;
    dec: string;
    // 星期
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    // 活动相关
    activities: string;
    yearActivity: string;
    learningActivity: string;
    notesCreated: string;
    tasksCompleted: string;
    averageDaily: string;
    weeklyGoal: string;
    monthlyGoal: string;
    goalAchieved: string;
    goalNotAchieved: string;
    streakBroken: string;
    streakContinued: string;
    noActivity: string;
    lowActivity: string;
    mediumActivity: string;
    highActivity: string;
    veryHighActivity: string;
  };
  dashboard: {
    title: string;
    welcome: string;
    totalNotes: string;
    totalTasks: string;
    pendingTasks: string;
    completionRate: string;
    recentNotes: string;
    recentNotesDesc: string;
    todayTasks: string;
    todayTasksDesc: string;
    quickActions: string;
    quickActionsDesc: string;
    createNewNote: string;
    addNewTask: string;
    viewAnalytics: string;
    noNotes: string;
    noNotesDesc: string;
    noTasksToday: string;
    noTasksTodayDesc: string;
    highPriority: string;
    mediumPriority: string;
    lowPriority: string;
  };
  search: {
    title: string;
    searchResults: string;
    noResults: string;
    searchHistory: string;
    clearHistory: string;
    searchNotebooks: string;
    searchTasks: string;
    all: string;
    found: string;
    results: string;
    searchPlaceholder: string;
    searchInNotes: string;
    searchInTasks: string;
    searchInAll: string;
    filterByType: string;
    filterByDate: string;
    sortBy: string;
    sortByRelevance: string;
    sortByDate: string;
    sortByTitle: string;
    recentSearches: string;
    clearAll: string;
    noSearchHistory: string;
    searchSuggestions: string;
    popularSearches: string;
    searchTips: string;
    searchTipsDesc: string;
    useQuotes: string;
    useQuotesDesc: string;
    useMinus: string;
    useMinusDesc: string;
    useOr: string;
    useOrDesc: string;
  };
  notifications: {
    welcome: string;
    welcomeMessage: string;
    taskCompleted: string;
    taskCompletedMessage: string;
    taskCreated: string;
    taskCreatedMessage: string;
    noteCreated: string;
    noteCreatedMessage: string;
    taskReminder: string;
    taskReminderMessage: string;
    systemUpdate: string;
    systemUpdateMessage: string;
    testNotification: string;
    testNotificationMessage: string;
    viewTasks: string;
    viewNotes: string;
    learnMore: string;
    getStarted: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
}

// 中文翻译
const zhTranslations: TranslationKeys = {
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    filter: '过滤',
    clear: '清除',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    confirm: '确认',
    back: '返回',
    next: '下一个',
    previous: '上一个',
    submit: '提交',
    reset: '重置',
  },
  header: {
    searchPlaceholder: '搜索笔记、任务...',
    searchFor: '搜索 "{{query}}"',
    recentSearches: '最近搜索',
    clearAll: '清除全部',
    resultsCount: '{{count}} 个结果',
    noSearchHistory: '暂无搜索历史',
    switchToDark: '切换到暗色模式',
    switchToLight: '切换到亮色模式',
    notifications: '通知',
    markAllRead: '全部已读',
    noNotifications: '暂无通知',
    settings: '设置',
    logout: '退出登录',
  },
  auth: {
    login: '登录',
    register: '注册',
    logout: '退出登录',
    email: '邮箱',
    password: '密码',
    username: '用户名',
    confirmPassword: '确认密码',
    forgotPassword: '忘记密码',
    resetPassword: '重置密码',
    forgotPasswordTitle: '忘记密码',
    resetPasswordTitle: '重置密码',
    forgotPasswordSubtitle: '输入您的邮箱地址，我们将发送重置密码的链接',
    resetPasswordSubtitle: '请输入您的新密码',
    enterEmail: '输入邮箱地址',
    enterNewPassword: '输入新密码',
    confirmNewPassword: '确认新密码',
    sendResetEmail: '发送重置邮件',
    backToLogin: '返回登录',
    emailSent: '邮件已发送',
    passwordReset: '密码重置成功',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    loginError: '登录失败',
    registerError: '注册失败',
    loginTitle: '登录',
    registerTitle: '注册',
    loginSubtitle: '欢迎回来！请登录您的账户',
    registerSubtitle: '创建新账户',
    rememberMe: '记住我',
    dontHaveAccount: '还没有账户？',
    alreadyHaveAccount: '已有账户？',
    createAccount: '创建账户',
    signIn: '登录',
    signUp: '注册',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    validation: {
      emailRequired: '请输入邮箱',
      emailInvalid: '请输入有效的邮箱地址',
      passwordRequired: '请输入密码',
      passwordMinLength: '密码至少需要8个字符',
      usernameRequired: '请输入用户名',
      usernameMinLength: '用户名至少需要2个字符',
      usernameMaxLength: '用户名不能超过20个字符',
      confirmPasswordRequired: '请确认密码',
      passwordsNotMatch: '两次输入的密码不一致',
    },
    messages: {
      loginSuccess: '登录成功！',
      registerSuccess: '注册成功！',
      loginFailed: '登录失败',
      registerFailed: '注册失败',
      invalidCredentials: '用户名或密码错误',
      accountDisabled: '账户已被禁用',
      emailAlreadyExists: '邮箱已被使用',
      usernameAlreadyExists: '用户名已被使用',
      networkError: '网络错误，请检查连接',
      serverError: '服务器错误，请稍后重试',
    },
  },
  navigation: {
    dashboard: '仪表盘',
    notes: '笔记',
    tasks: '任务',
    analytics: '数据分析',
    profile: '个人资料',
    search: '搜索',
  },
  profile: {
    title: '个人资料',
    personalInfo: '个人信息',
    themeSettings: '主题设置',
    languageSettings: '语言设置',
    accountStats: '账户统计',
    currentTheme: '当前主题',
    lightMode: '亮色模式',
    darkMode: '暗色模式',
    chinese: '中文',
    english: 'English',
    memberLevel: '会员等级',
    storageUsed: '存储使用',
    lastLogin: '最后登录',
    freeUser: '免费用户',
    today: '今天',
    registrationDate: '注册时间',
  },
  notes: {
    title: '笔记',
    createNote: '创建笔记',
    editNote: '编辑笔记',
    deleteNote: '删除笔记',
    searchNotes: '搜索笔记...',
    noNotes: '暂无笔记',
    noteContent: '笔记内容',
    noteTags: '标签',
    noteCreated: '笔记已创建',
    noteUpdated: '笔记已更新',
    noteDeleted: '笔记已删除',
    newNote: '新建笔记',
    editNoteTitle: '编辑笔记',
    noteTitle: '笔记标题',
    noteDescription: '笔记描述',
    addTag: '添加标签',
    saveNote: '保存笔记',
    cancel: '取消',
    deleteConfirm: '确认删除',
    deleteConfirmMessage: '确定要删除这篇笔记吗？此操作无法撤销。',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    filterByTag: '按标签筛选',
    sortBy: '排序方式',
    sortByDate: '按创建时间',
    sortByTitle: '按标题',
    sortByUpdated: '按更新时间',
    allTags: '所有标签',
    noTags: '无标签',
    selectNote: '选择笔记',
    createFirstNote: '创建第一篇笔记',
    createFirstNoteDesc: '开始记录您的想法和知识',
    searchPlaceholder: '搜索笔记...',
    filter: '过滤',
    clear: '清除',
    tags: '标签',
    selectedTags: '已选择: {{tags}}',
    createdTime: '创建时间',
    to: '至',
    searchFor: '搜索: "{{query}}"',
    titleRequired: '标题不能为空',
    contentRequired: '内容不能为空',
    titlePlaceholder: '输入笔记标题...',
    contentPlaceholder: '开始写下你的想法...',
    characterCount: '{{count}} 字符',
    saving: '保存中...',
  },
  tasks: {
    title: '任务',
    createTask: '创建任务',
    editTask: '编辑任务',
    deleteTask: '删除任务',
    searchTasks: '搜索任务...',
    noTasks: '暂无任务',
    taskTitle: '任务标题',
    taskDescription: '任务描述',
    taskPriority: '优先级',
    taskStatus: '状态',
    taskDueDate: '截止日期',
    taskCreated: '任务已创建',
    taskUpdated: '任务已更新',
    taskCompleted: '任务已完成',
    pending: '待完成',
    completed: '已完成',
    highPriority: '高优先级',
    mediumPriority: '中优先级',
    lowPriority: '低优先级',
    newTask: '新建任务',
    editTaskTitle: '编辑任务',
    addTask: '添加任务',
    saveTask: '保存任务',
    cancel: '取消',
    deleteConfirm: '确认删除',
    deleteConfirmMessage: '确定要删除这个任务吗？此操作无法撤销。',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    filterByStatus: '按状态筛选',
    filterByPriority: '按优先级筛选',
    sortBy: '排序方式',
    sortByDate: '按创建时间',
    sortByTitle: '按标题',
    sortByPriority: '按优先级',
    selectTask: '选择任务',
    createFirstTask: '创建第一个任务',
    createFirstTaskDesc: '开始管理您的任务和待办事项',
    toggleStatus: '切换状态',
    markComplete: '标记完成',
    markPending: '标记待完成',
    searchPlaceholder: '搜索任务...',
    filter: '过滤',
    clear: '清除',
    clearAll: '清除全部',
    applyFilters: '应用过滤器',
    filterTasks: '过滤任务',
    status: '状态',
    priority: '优先级',
    allStatus: '全部状态',
    allPriority: '全部优先级',
    dueDateRange: '截止日期范围',
    startDate: '开始日期',
    endDate: '结束日期',
    titleRequired: '标题不能为空',
    titleTooLong: '标题不能超过200个字符',
    descriptionTooLong: '描述不能超过1000个字符',
    titlePlaceholder: '输入任务标题...',
    descriptionPlaceholder: '输入任务描述...',
    characterCount: '{{current}}/{{max}} 字符',
    saving: '保存中...',
    dueDate: '截止日期',
    dueDateOptional: '选择任务的截止日期（可选）',
    description: '描述',
    updateTask: '更新任务',
  },
  analytics: {
    title: '数据分析',
    overview: '概览',
    noteStats: '笔记统计',
    taskStats: '任务统计',
    productivity: '生产力',
    notesThisWeek: '本周笔记',
    tasksThisWeek: '本周任务',
    studyStreak: '学习连续天数',
    totalStudyTime: '总学习时间',
    loading: '加载中...',
    error: '错误',
    noData: '暂无数据',
    noDataDesc: '开始创建笔记和任务来查看分析数据',
    totalNotes: '总笔记数',
    totalTasks: '总任务数',
    completedTasks: '已完成任务',
    pendingTasks: '待完成任务',
    averagePerDay: '平均每日',
    totalWords: '总字数',
    averageWords: '平均字数',
    overdue: '已逾期',
    days: '天',
    hours: '小时',
    minutes: '分钟',
    thisWeek: '本周',
    lastWeek: '上周',
    thisMonth: '本月',
    lastMonth: '上月',
    productivityTrend: '生产力趋势',
    activityHeatmap: '活动热力图',
    recentActivity: '最近活动',
    completionRate: '完成率',
    taskCompletionRate: '任务完成率',
    taskTrend: '任务完成趋势',
    taskTrendDesc: '最近5周的任务完成情况',
    productivityTrendDesc: '最近7天的学习活动',
    activityHeatmapDesc: '您的全年学习活跃度',
    studyStreakDesc: '连续学习天数',
    totalStudyTimeDesc: '总学习时间',
    // 月份
    jan: '1月',
    feb: '2月',
    mar: '3月',
    apr: '4月',
    may: '5月',
    jun: '6月',
    jul: '7月',
    aug: '8月',
    sep: '9月',
    oct: '10月',
    nov: '11月',
    dec: '12月',
    // 星期
    sun: '日',
    mon: '一',
    tue: '二',
    wed: '三',
    thu: '四',
    fri: '五',
    sat: '六',
    // 活动相关
    activities: '次活动',
    yearActivity: '{{year}} 年共有 {{count}} 次学习活动',
    learningActivity: '学习活跃度',
    notesCreated: '笔记创建',
    tasksCompleted: '任务完成',
    averageDaily: '平均每日',
    weeklyGoal: '周目标',
    monthlyGoal: '月目标',
    goalAchieved: '目标达成',
    goalNotAchieved: '目标未达成',
    streakBroken: '连续中断',
    streakContinued: '连续进行',
    noActivity: '无活动',
    lowActivity: '低活动',
    mediumActivity: '中等活动',
    highActivity: '高活动',
    veryHighActivity: '极高活动',
  },
  search: {
    title: '搜索',
    searchResults: '搜索结果',
    noResults: '未找到相关结果',
    searchHistory: '搜索历史',
    clearHistory: '清除历史',
    searchNotebooks: '搜索笔记...',
    searchTasks: '搜索任务...',
    all: '全部',
    found: '找到',
    results: '个结果',
    searchPlaceholder: '搜索笔记和任务...',
    searchInNotes: '在笔记中搜索',
    searchInTasks: '在任务中搜索',
    searchInAll: '在所有内容中搜索',
    filterByType: '按类型筛选',
    filterByDate: '按日期筛选',
    sortBy: '排序方式',
    sortByRelevance: '按相关性',
    sortByDate: '按日期',
    sortByTitle: '按标题',
    recentSearches: '最近搜索',
    clearAll: '清除全部',
    noSearchHistory: '暂无搜索历史',
    searchSuggestions: '搜索建议',
    popularSearches: '热门搜索',
    searchTips: '搜索技巧',
    searchTipsDesc: '使用以下技巧来优化您的搜索',
    useQuotes: '使用引号',
    useQuotesDesc: '搜索精确短语',
    useMinus: '使用减号',
    useMinusDesc: '排除特定词汇',
    useOr: '使用OR',
    useOrDesc: '搜索多个关键词',
  },
  dashboard: {
    title: '仪表板',
    welcome: '欢迎回来！这里是您的学习概览。',
    totalNotes: '笔记总数',
    totalTasks: '任务总数',
    pendingTasks: '待完成任务',
    completionRate: '完成率',
    recentNotes: '最近笔记',
    recentNotesDesc: '您最近创建的笔记',
    todayTasks: '今日任务',
    todayTasksDesc: '今天需要完成的任务',
    quickActions: '快速操作',
    quickActionsDesc: '快速开始您的工作',
    createNewNote: '创建新笔记',
    addNewTask: '添加新任务',
    viewAnalytics: '查看分析',
    noNotes: '还没有笔记',
    noNotesDesc: '开始创建您的第一篇笔记吧！',
    noTasksToday: '今天没有任务',
    noTasksTodayDesc: '享受轻松的一天！',
    highPriority: '高优先级',
    mediumPriority: '中优先级',
    lowPriority: '低优先级',
  },
  notifications: {
    welcome: '欢迎使用智能学习平台',
    welcomeMessage: '开始您的学习之旅，创建任务和笔记来提升效率！',
    taskCompleted: '任务完成',
    taskCompletedMessage: '恭喜！您已完成任务"{{taskTitle}}"',
    taskCreated: '任务创建成功',
    taskCreatedMessage: '您已成功创建任务"{{taskTitle}}"',
    noteCreated: '笔记创建成功',
    noteCreatedMessage: '您已成功创建笔记"{{noteTitle}}"',
    taskReminder: '任务提醒',
    taskReminderMessage: '任务"{{taskTitle}}"即将到期',
    systemUpdate: '系统更新',
    systemUpdateMessage: '系统已更新到最新版本，新增了多项功能',
    testNotification: '测试通知',
    testNotificationMessage: '这是一个测试通知，用于演示通知功能',
    viewTasks: '查看任务',
    viewNotes: '查看笔记',
    learnMore: '了解更多',
    getStarted: '开始使用',
    justNow: '刚刚',
    minutesAgo: '{{minutes}}分钟前',
    hoursAgo: '{{hours}}小时前',
    daysAgo: '{{days}}天前',
  },
};

// 英文翻译
const enTranslations: TranslationKeys = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
  },
  header: {
    searchPlaceholder: 'Search notes, tasks...',
    searchFor: 'Search "{{query}}"',
    recentSearches: 'Recent Searches',
    clearAll: 'Clear All',
    resultsCount: '{{count}} results',
    noSearchHistory: 'No search history',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    notifications: 'Notifications',
    markAllRead: 'Mark All Read',
    noNotifications: 'No notifications',
    settings: 'Settings',
    logout: 'Logout',
  },
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    forgotPasswordTitle: 'Forgot Password',
    resetPasswordTitle: 'Reset Password',
    forgotPasswordSubtitle: 'Enter your email address and we\'ll send you a link to reset your password',
    resetPasswordSubtitle: 'Please enter your new password',
    enterEmail: 'Enter Email Address',
    enterNewPassword: 'Enter New Password',
    confirmNewPassword: 'Confirm New Password',
    sendResetEmail: 'Send Reset Email',
    backToLogin: 'Back to Login',
    emailSent: 'Email Sent',
    passwordReset: 'Password Reset Successfully',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    loginError: 'Login failed',
    registerError: 'Registration failed',
    loginTitle: 'Login',
    registerTitle: 'Register',
    loginSubtitle: 'Welcome back! Please sign in to your account',
    registerSubtitle: 'Create a new account',
    rememberMe: 'Remember me',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    validation: {
      emailRequired: 'Please enter your email',
      emailInvalid: 'Please enter a valid email address',
      passwordRequired: 'Please enter your password',
      passwordMinLength: 'Password must be at least 8 characters',
      usernameRequired: 'Please enter your username',
      usernameMinLength: 'Username must be at least 2 characters',
      usernameMaxLength: 'Username cannot exceed 20 characters',
      confirmPasswordRequired: 'Please confirm your password',
      passwordsNotMatch: 'Passwords do not match',
    },
    messages: {
      loginSuccess: 'Login successful!',
      registerSuccess: 'Registration successful!',
      loginFailed: 'Login failed',
      registerFailed: 'Registration failed',
      invalidCredentials: 'Invalid username or password',
      accountDisabled: 'Account has been disabled',
      emailAlreadyExists: 'Email already exists',
      usernameAlreadyExists: 'Username already exists',
      networkError: 'Network error, please check your connection',
      serverError: 'Server error, please try again later',
    },
  },
  navigation: {
    dashboard: 'Dashboard',
    notes: 'Notes',
    tasks: 'Tasks',
    analytics: 'Analytics',
    profile: 'Profile',
    search: 'Search',
  },
  profile: {
    title: 'Profile',
    personalInfo: 'Personal Information',
    themeSettings: 'Theme Settings',
    languageSettings: 'Language Settings',
    accountStats: 'Account Statistics',
    currentTheme: 'Current Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    chinese: '中文',
    english: 'English',
    memberLevel: 'Member Level',
    storageUsed: 'Storage Used',
    lastLogin: 'Last Login',
    freeUser: 'Free User',
    today: 'Today',
    registrationDate: 'Registration Date',
  },
  notes: {
    title: 'Notes',
    createNote: 'Create Note',
    editNote: 'Edit Note',
    deleteNote: 'Delete Note',
    searchNotes: 'Search notes...',
    noNotes: 'No notes found',
    noteContent: 'Note Content',
    noteTags: 'Tags',
    noteCreated: 'Note created',
    noteUpdated: 'Note updated',
    noteDeleted: 'Note deleted',
    newNote: 'New Note',
    editNoteTitle: 'Edit Note',
    noteTitle: 'Note Title',
    noteDescription: 'Note Description',
    addTag: 'Add Tag',
    saveNote: 'Save Note',
    cancel: 'Cancel',
    deleteConfirm: 'Confirm Delete',
    deleteConfirmMessage: 'Are you sure you want to delete this note? This action cannot be undone.',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    filterByTag: 'Filter by Tag',
    sortBy: 'Sort By',
    sortByDate: 'By Date',
    sortByTitle: 'By Title',
    sortByUpdated: 'By Updated',
    allTags: 'All Tags',
    noTags: 'No Tags',
    selectNote: 'Select Note',
    createFirstNote: 'Create Your First Note',
    createFirstNoteDesc: 'Start recording your thoughts and knowledge',
    searchPlaceholder: 'Search notes...',
    filter: 'Filter',
    clear: 'Clear',
    tags: 'Tags',
    selectedTags: 'Selected: {{tags}}',
    createdTime: 'Created Time',
    to: 'to',
    searchFor: 'Search: "{{query}}"',
    titleRequired: 'Title is required',
    contentRequired: 'Content is required',
    titlePlaceholder: 'Enter note title...',
    contentPlaceholder: 'Start writing your thoughts...',
    characterCount: '{{count}} characters',
    saving: 'Saving...',
  },
  tasks: {
    title: 'Tasks',
    createTask: 'Create Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    searchTasks: 'Search tasks...',
    noTasks: 'No tasks found',
    taskTitle: 'Task Title',
    taskDescription: 'Task Description',
    taskPriority: 'Priority',
    taskStatus: 'Status',
    taskDueDate: 'Due Date',
    taskCreated: 'Task created',
    taskUpdated: 'Task updated',
    taskCompleted: 'Task completed',
    pending: 'Pending',
    completed: 'Completed',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    newTask: 'New Task',
    editTaskTitle: 'Edit Task',
    addTask: 'Add Task',
    saveTask: 'Save Task',
    cancel: 'Cancel',
    deleteConfirm: 'Confirm Delete',
    deleteConfirmMessage: 'Are you sure you want to delete this task? This action cannot be undone.',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    filterByStatus: 'Filter by Status',
    filterByPriority: 'Filter by Priority',
    sortBy: 'Sort By',
    sortByDate: 'By Date',
    sortByTitle: 'By Title',
    sortByPriority: 'By Priority',
    selectTask: 'Select Task',
    createFirstTask: 'Create Your First Task',
    createFirstTaskDesc: 'Start managing your tasks and todos',
    toggleStatus: 'Toggle Status',
    markComplete: 'Mark Complete',
    markPending: 'Mark Pending',
    searchPlaceholder: 'Search tasks...',
    filter: 'Filter',
    clear: 'Clear',
    clearAll: 'Clear All',
    applyFilters: 'Apply Filters',
    filterTasks: 'Filter Tasks',
    status: 'Status',
    priority: 'Priority',
    allStatus: 'All Status',
    allPriority: 'All Priority',
    dueDateRange: 'Due Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    titleRequired: 'Title is required',
    titleTooLong: 'Title cannot exceed 200 characters',
    descriptionTooLong: 'Description cannot exceed 1000 characters',
    titlePlaceholder: 'Enter task title...',
    descriptionPlaceholder: 'Enter task description...',
    characterCount: '{{current}}/{{max}} characters',
    saving: 'Saving...',
    dueDate: 'Due Date',
    dueDateOptional: 'Select task due date (optional)',
    description: 'Description',
    updateTask: 'Update Task',
  },
  analytics: {
    title: 'Analytics',
    overview: 'Overview',
    noteStats: 'Note Statistics',
    taskStats: 'Task Statistics',
    productivity: 'Productivity',
    notesThisWeek: 'Notes This Week',
    tasksThisWeek: 'Tasks This Week',
    studyStreak: 'Study Streak',
    totalStudyTime: 'Total Study Time',
    loading: 'Loading...',
    error: 'Error',
    noData: 'No Data',
    noDataDesc: 'Start creating notes and tasks to view analytics data',
    totalNotes: 'Total Notes',
    totalTasks: 'Total Tasks',
    completedTasks: 'Completed Tasks',
    pendingTasks: 'Pending Tasks',
    averagePerDay: 'Average Per Day',
    totalWords: 'Total Words',
    averageWords: 'Average Words',
    overdue: 'Overdue',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    productivityTrend: 'Productivity Trend',
    activityHeatmap: 'Activity Heatmap',
    recentActivity: 'Recent Activity',
    completionRate: 'Completion Rate',
    taskCompletionRate: 'Task Completion Rate',
    taskTrend: 'Task Completion Trend',
    taskTrendDesc: 'Task completion over the last 5 weeks',
    productivityTrendDesc: 'Learning activity over the last 7 days',
    activityHeatmapDesc: 'Your annual learning activity',
    studyStreakDesc: 'Consecutive study days',
    totalStudyTimeDesc: 'Total study time',
    // 月份
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
    // 星期
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    // 活动相关
    activities: 'activities',
    yearActivity: '{{year}} had {{count}} learning activities',
    learningActivity: 'Learning Activity',
    notesCreated: 'Notes Created',
    tasksCompleted: 'Tasks Completed',
    averageDaily: 'Average Daily',
    weeklyGoal: 'Weekly Goal',
    monthlyGoal: 'Monthly Goal',
    goalAchieved: 'Goal Achieved',
    goalNotAchieved: 'Goal Not Achieved',
    streakBroken: 'Streak Broken',
    streakContinued: 'Streak Continued',
    noActivity: 'No Activity',
    lowActivity: 'Low Activity',
    mediumActivity: 'Medium Activity',
    highActivity: 'High Activity',
    veryHighActivity: 'Very High Activity',
  },
  search: {
    title: 'Search',
    searchResults: 'Search Results',
    noResults: 'No results found',
    searchHistory: 'Search History',
    clearHistory: 'Clear History',
    searchNotebooks: 'Search notes...',
    searchTasks: 'Search tasks...',
    all: 'All',
    found: 'Found',
    results: 'results',
    searchPlaceholder: 'Search notes and tasks...',
    searchInNotes: 'Search in Notes',
    searchInTasks: 'Search in Tasks',
    searchInAll: 'Search in All',
    filterByType: 'Filter by Type',
    filterByDate: 'Filter by Date',
    sortBy: 'Sort By',
    sortByRelevance: 'By Relevance',
    sortByDate: 'By Date',
    sortByTitle: 'By Title',
    recentSearches: 'Recent Searches',
    clearAll: 'Clear All',
    noSearchHistory: 'No search history',
    searchSuggestions: 'Search Suggestions',
    popularSearches: 'Popular Searches',
    searchTips: 'Search Tips',
    searchTipsDesc: 'Use these tips to optimize your search',
    useQuotes: 'Use Quotes',
    useQuotesDesc: 'Search for exact phrases',
    useMinus: 'Use Minus',
    useMinusDesc: 'Exclude specific words',
    useOr: 'Use OR',
    useOrDesc: 'Search for multiple keywords',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back! Here\'s your learning overview.',
    totalNotes: 'Total Notes',
    totalTasks: 'Total Tasks',
    pendingTasks: 'Pending Tasks',
    completionRate: 'Completion Rate',
    recentNotes: 'Recent Notes',
    recentNotesDesc: 'Your recently created notes',
    todayTasks: 'Today\'s Tasks',
    todayTasksDesc: 'Tasks to complete today',
    quickActions: 'Quick Actions',
    quickActionsDesc: 'Quickly start your work',
    createNewNote: 'Create New Note',
    addNewTask: 'Add New Task',
    viewAnalytics: 'View Analytics',
    noNotes: 'No notes yet',
    noNotesDesc: 'Start creating your first note!',
    noTasksToday: 'No tasks today',
    noTasksTodayDesc: 'Enjoy a relaxing day!',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
  },
  notifications: {
    welcome: 'Welcome to Smart Learning Platform',
    welcomeMessage: 'Start your learning journey, create tasks and notes to improve efficiency!',
    taskCompleted: 'Task Completed',
    taskCompletedMessage: 'Congratulations! You have completed task "{{taskTitle}}"',
    taskCreated: 'Task Created Successfully',
    taskCreatedMessage: 'You have successfully created task "{{taskTitle}}"',
    noteCreated: 'Note Created Successfully',
    noteCreatedMessage: 'You have successfully created note "{{noteTitle}}"',
    taskReminder: 'Task Reminder',
    taskReminderMessage: 'Task "{{taskTitle}}" is due soon',
    systemUpdate: 'System Update',
    systemUpdateMessage: 'System has been updated to the latest version with new features',
    testNotification: 'Test Notification',
    testNotificationMessage: 'This is a test notification to demonstrate the notification feature',
    viewTasks: 'View Tasks',
    viewNotes: 'View Notes',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    justNow: 'Just now',
    minutesAgo: '{{minutes}} minutes ago',
    hoursAgo: '{{hours}} hours ago',
    daysAgo: '{{days}} days ago',
  },
};

// 所有翻译
const translations = {
  zh: zhTranslations,
  en: enTranslations,
};

// 获取翻译文本的工具函数
export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let translation: any = translations[language];

  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k];
    } else {
      // 如果找不到翻译，返回中文作为默认
      translation = translations.zh;
      for (const fallbackKey of keys) {
        if (translation && typeof translation === 'object' && fallbackKey in translation) {
          translation = translation[fallbackKey];
        } else {
          return key; // 如果都找不到，返回原始key
        }
      }
      break;
    }
  }

  return typeof translation === 'string' ? translation : key;
};

// 简化的翻译函数
export const t = getTranslation;

export { translations };

