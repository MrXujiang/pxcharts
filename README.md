<div align="center">
  <h1>📊 pxcharts 多维表格开源版</h1>
  <img src="./new.png" alt="pxcharts多维表格" />
  <p>一个功能强大、界面精美的开源多维表格任务管理系统</p>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/MrXujiang/pxcharts/pulls)
</div>

---

## ✨ 特性

- 🎯 **多视图支持** - 表格视图、看板视图、人员分配视图，满足不同场景需求
- 🎨 **精美UI设计** - 基于 shadcn/ui + Tailwind CSS，简洁现代的界面风格
- 🔄 **拖拽排序** - 支持任务拖拽排序、列拖拽排序，灵活自定义
- 📊 **数据统计** - 内置任务统计看板，数据可视化展示
- 🔍 **高级筛选** - 支持多条件筛选、排序、分组，快速定位目标数据
- 💾 **数据导入导出** - 支持 JSON 格式的数据导入导出
- 🎭 **自定义字段** - 支持添加自定义字段，灵活扩展数据结构
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌈 **主题定制** - 支持浅色/深色主题切换
- ⚡ **性能优化** - 基于 Next.js 15 + React 19，性能卓越

## 🎬 在线演示

🌐 [在线体验](https://pxcharts.turntip.cn)

## 📸 界面预览

### 表格视图
强大的表格管理功能，支持拖拽排序、行内编辑、自定义字段等

### 看板视图
直观的看板展示，支持任务状态拖拽切换

### 统计看板
数据可视化展示，一目了然掌握任务进度

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本（推荐）

### 安装

```bash
# 克隆项目
git clone https://github.com/MrXujiang/pxcharts.git

# 进入项目目录
cd pxcharts

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 构建生产版本

```bash
# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## 📦 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) - React 全栈框架
- **UI组件**: [shadcn/ui](https://ui.shadcn.com/) - 高质量 React 组件库
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理
- **拖拽**: [@dnd-kit](https://dndkit.com/) - 现代拖拽库
- **图表**: [Recharts](https://recharts.org/) - React 图表库
- **表单**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - 表单验证
- **类型**: [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 📖 文档

- [技术架构文档](./docs/ARCHITECTURE.md) - 详细的技术实现和架构设计
- [English Documentation](./docs/ARCHITECTURE_EN.md) - Technical architecture documentation in English
- [English README](./README_EN.md) - Project introduction in English

## 📚 核心功能

### 1. 多维表格管理
- ✅ 任务增删改查
- ✅ 拖拽排序
- ✅ 行内编辑
- ✅ 批量操作
- ✅ 自定义字段
- ✅ 列宽调整
- ✅ 列顺序调整

### 2. 视图系统
- ✅ 表格视图
- ✅ 看板视图
- ✅ 人员分配视图
- ✅ 统计看板

### 3. 数据操作
- ✅ 高级筛选
- ✅ 多级排序
- ✅ 分组展示
- ✅ 数据导入
- ✅ 数据导出

### 4. 用户体验
- ✅ 搜索功能
- ✅ 响应式布局
- ✅ 主题切换
- ✅ 快捷操作
- ✅ 提示反馈

## 🗂️ 项目结构

```
pxcharts/
├── app/                    # Next.js 应用目录
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # 组件目录
│   ├── ui/               # UI 基础组件
│   ├── views/            # 视图组件
│   ├── charts/           # 图表组件
│   └── ...               # 业务组件
├── lib/                   # 工具库
│   ├── types.ts          # 类型定义
│   ├── task-store.ts     # 状态管理
│   └── utils.ts          # 工具函数
├── hooks/                 # 自定义 Hooks
├── public/                # 静态资源
└── styles/                # 样式文件
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 开源协议

本项目采用 [GPL-3.0 license](LICENSE) 协议开源

⚠️ **重要声明**: 本项目只作为个人学习参考，如需商用使用，请联系作者授权

## 👨‍💻 作者

**徐小夕 (MrXujiang)**

- GitHub: [@MrXujiang](https://github.com/MrXujiang)
- 个人网站: [http://pxcharts.com](http://pxcharts.com)

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 ⭐️ Star！

## 📮 联系我们

- 提交 Issue: [GitHub Issues](https://github.com/MrXujiang/pxcharts/issues)
- 微信: cxzk_168

## 🔗 相关项目

- [pxcharts Ultra 版](http://ultra.mute.turntip.cn) - 功能增强商用版本
- [pxcharts 多维表格智能云](https://pxcharts.turntip.cn) - 云端增强版
- [H5-Dooring](https://github.com/MrXujiang/h5-Dooring) - 让H5制作像搭积木一样简单
- [JitWord 协同AI文档](https://jitword.com) - AI 赋能的协同文档工具

## 💝 赞助支持

如果这个项目帮助到了你，可以请作者喝杯咖啡 ☕️

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/MrXujiang">徐小夕</a>
</div>
