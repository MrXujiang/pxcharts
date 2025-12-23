<div align="center">
  <h1>📊 pxcharts - Open Source Multi-dimensional Table</h1>
  <p>A powerful and beautifully designed open-source multi-dimensional table task management system</p>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/MrXujiang/pxcharts/pulls)
</div>

---

## ✨ Features

-   🎯 **Multiple Views** - Table view, Kanban view, Assignment view for different scenarios
-   🎨 **Beautiful UI Design** - Based on shadcn/ui + Tailwind CSS, clean and modern interface
-   🔄 **Drag & Drop** - Support task drag & drop sorting, column reordering, flexible customization
-   📊 **Data Statistics** - Built-in task statistics dashboard with data visualization
-   🔍 **Advanced Filtering** - Multi-condition filtering, sorting, grouping for quick data location
-   💾 **Import/Export** - Support JSON format data import and export
-   🎭 **Custom Fields** - Add custom fields to flexibly extend data structure
-   📱 **Responsive Design** - Perfect adaptation for desktop and mobile
-   🌈 **Theme Customization** - Support light/dark theme switching
-   ⚡ **Performance Optimized** - Based on Next.js 15 + React 19, excellent performance

## 🎬 Live Demo

🌐 [Live Demo](https://pxcharts.turntip.cn)

## 📸 Screenshots

### Table View

Powerful table management with drag & drop sorting, inline editing, custom fields, and more

### Kanban View

Intuitive kanban display with task status drag & drop switching

### Statistics Dashboard

Data visualization for clear task progress overview

## 🚀 Quick Start

### Requirements

-   Node.js 18.17 or higher
-   pnpm 8.0 or higher (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/MrXujiang/pxcharts.git

# Navigate to project directory
cd pxcharts

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application

### Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## 📦 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) - React full-stack framework
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - High-quality React component library
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Atomic CSS framework
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
-   **Drag & Drop**: [@dnd-kit](https://dndkit.com/) - Modern drag & drop library
-   **Charts**: [Recharts](https://recharts.org/) - React charting library
-   **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form validation
-   **Type Safety**: [TypeScript](https://www.typescriptlang.org/) - Type-safe development

## 📖 Documentation

-   [Technical Architecture (Chinese)](./docs/ARCHITECTURE.md) - Detailed technical implementation and architecture design
-   [Technical Architecture (English)](./docs/ARCHITECTURE_EN.md) - Technical architecture documentation in English
-   [中文文档](./README.md) - Project introduction in Chinese

## 📚 Core Features

### 1. Multi-dimensional Table Management

-   ✅ Task CRUD operations
-   ✅ Drag & drop sorting
-   ✅ Inline editing
-   ✅ Batch operations
-   ✅ Custom fields
-   ✅ Column width adjustment
-   ✅ Column order adjustment

### 2. View System

-   ✅ Table view
-   ✅ Kanban view
-   ✅ Assignment view
-   ✅ Statistics dashboard

### 3. Data Operations

-   ✅ Advanced filtering
-   ✅ Multi-level sorting
-   ✅ Grouped display
-   ✅ Data import
-   ✅ Data export

### 4. User Experience

-   ✅ Search functionality
-   ✅ Responsive layout
-   ✅ Theme switching
-   ✅ Quick actions
-   ✅ Feedback notifications

## 🗂️ Project Structure

```
pxcharts/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Components directory
│   ├── ui/               # UI base components
│   ├── views/            # View components
│   ├── charts/           # Chart components
│   └── ...               # Business components
├── lib/                   # Utilities
│   ├── types.ts          # Type definitions
│   ├── task-store.ts     # State management
│   └── utils.ts          # Utility functions
├── hooks/                 # Custom hooks
├── public/                # Static assets
└── styles/                # Style files
```

## 🤝 Contributing

We welcome all forms of contributions!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [GPL-3.0 license](LICENSE)

⚠️ **Important Notice**: This project is for personal learning reference only. For commercial use, please contact the author for authorization

## 👨‍💻 Author

**Xu Xiaoxi (MrXujiang)**

-   GitHub: [@MrXujiang](https://github.com/MrXujiang)
-   Website: [http://pxcharts.com](http://pxcharts.com)

## 🌟 Star History

If this project helps you, please give us a ⭐️ Star!

## 📮 Contact Us

-   Submit Issue: [GitHub Issues](https://github.com/MrXujiang/pxcharts/issues)
-   WeChat: cxzk_168

## 🔗 Related Projects

-   [pxcharts Ultra Edition](http://ultra.mute.turntip.cn) - Enhanced commercial version
-   [pxcharts Cloud Edition](https://pxcharts.turntip.cn) - Cloud-enhanced version
-   [H5-Dooring](https://github.com/MrXujiang/h5-Dooring) - Make H5 creation as simple as building blocks
-   [JitWord Collaborative AI Document](https://jitword.com) - AI-powered collaborative document tool
-   [Intelligent Cloud Documents](https://mindlink.turntip.cn/) - MinLlink Doc
-   [Smart office workstation](https://ai.flowmix.cn/) - FlowmixAI

## 💝 Sponsorship

If this project helps you, you can buy the author a coffee ☕️

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/MrXujiang">Xu Xiaoxi</a>
</div>

