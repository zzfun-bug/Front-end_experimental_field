# 🚀 前端实验场

这是一个综合性的前端学习与实践仓库，包含了多个不同类型的项目，从基础的前端技术练习到完整的全栈应用开发。

## 📁 项目结构

### 🎯 核心项目

#### 1. CDTU 参观预约系统
**技术栈**: Java + Spring + MySQL + UniApp + Vue.js + Element UI + uView UI + FastJSON + Jetty + Maven
- 🏢 学校参观预约管理
- 👥 用户端和管理端分离
- 💻 管理员 Web 端（Vue.js + Element UI）
- 📱 用户移动端（UniApp + 微信小程序）
- 🔐 用户认证与权限管理
- 🎨 双端 UI 组件库（Element UI + uView UI）
- 📦 Maven 项目管理
- 🌐 CORS 跨域处理

#### 2. 智能学习笔记与任务管理平台
**技术栈**: React + TypeScript + Node.js + MySQL + Tailwind CSS
- 📝 完整的笔记管理系统
- ✅ 任务管理与优先级设置
- 📊 数据可视化与分析
- 🌐 多语言支持（中英文）
- 🎨 主题切换（亮色/暗色模式）
- 📱 响应式设计


#### 3. 天气预报应用
**技术栈**: Node.js + Express + 百度地图API
- 🌤️ 实时天气查询
- 🗺️ 地图集成
- 🔄 CORS 代理服务

### 🎨 前端技术练习

#### 1. 单组件效果库 (SingleComponentEffects)
包含 20+ 个精美的 CSS 效果组件：
- 🌙 视差滚动效果
- 🎬 全屏视频背景
- 🎭 CSS 滚动转换效果
- 📱 响应式导航菜单
- ⚡ 加载动画效果
- 🎨 悬停效果与动画
- 📝 登录表单设计
- 🌈 霓虹灯文本效果

#### 2. JavaScript 实践 (Js_Practice)
- 🔗 API 数据获取练习
- 🎮 交互式小游戏
- 📊 数据处理与展示
- 🎯 表单验证与用户输入

### 🛠️ 开发工具与配置
- 📦 完整的项目配置（package.json, tsconfig.json, vite.config.ts）
- 🎨 Tailwind CSS 样式系统
- 🔧 ESLint + Prettier 代码规范
- 📱 移动端适配与响应式设计

## 🚀 快速开始

### 智能学习平台
```bash
# 前端
cd Intelligent-Study-Notes-And-Task-Management-Platform
npm install
npm run dev

# 后端
cd server
npm install
npm run dev
```

### 参观预约系统
```bash
# 后端
cd CDTU-Visit-Reservation-System/admin_port
mvn clean install
mvn jetty:run

# 管理员 Web 端
# 访问 http://localhost:8080/cdtu-visit/pages/login.html

# 用户移动端（UniApp）
cd CDTU-Visit-Reservation-System/user_port
# 使用 HBuilderX 打开项目
```

### 天气预报应用
```bash
cd WeatherForecast
npm install
npm start
```

## 🎯 学习目标

这个仓库旨在：
- 📚 掌握现代前端开发技术栈
- 🎨 学习各种 CSS 效果和动画技巧
- 🔧 实践全栈应用开发
- 📱 掌握移动端开发技术
- 🎯 提升项目架构和代码组织能力

## 📖 技术栈总览

- **前端框架**: React, Vue, UniApp
- **样式技术**: CSS3, Tailwind CSS, SCSS
- **后端技术**: Node.js, Java Spring
- **数据库**: MySQL
- **开发工具**: Vite, Maven, TypeScript
- **版本控制**: Git

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License

