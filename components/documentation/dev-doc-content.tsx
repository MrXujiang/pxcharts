"use client"

export function DevDocContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">使用和二开文档</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          本篇文档详细介绍多维表格的使用方法和二次开发指南，帮助您充分利用和扩展多维表格的功能。
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">环境准备</h2>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">在开始之前，请确保您已经安装了以下工具：</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Node.js (v18+)</li>
              <li>pnpm 或 yarn</li>
              <li>Git</li>
            </ul>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md my-4">
              <h4 className="font-medium mb-2">开发环境配置</h4>
              <pre className="text-sm overflow-auto">
                <code>
                  {`
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">项目结构</h2>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">多维表格的项目结构如下：</p>
            <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto">
              <code>
                {`flowmix/mute/
├── app/                      # App Router 目录
│   ├── page.tsx              # 首页
│   ├── layout.tsx            # 根布局
│   └── deployment/           # 部署页面
├── components/               # 组件目录
│   ├── ui/                   # UI组件
│   ├── views/                # 视图组件
│   ├── charts/               # 图表组件
│   ├── documentation/        # 文档组件
│   └── ...                   # 其他组件
├── lib/                      # 工具和数据
│   ├── data.ts               # 示例数据
│   ├── types.ts              # 类型定义
│   ├── utils.ts              # 工具函数
│   └── task-store.ts         # 任务状态管理
├── hooks/                    # 自定义 Hooks
│   ├── use-local-storage.ts  # 本地存储Hook
│   ├── use-media-query.ts    # 媒体查询Hook
│   └── ...                   # 其他Hook
├── public/                   # 静态资源
└── ...                       # 其他配置文件`}
              </code>
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">数据结构</h2>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              了解多维表格的数据结构对于二次开发至关重要。以下是核心数据模型：
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md my-4 overflow-auto">
              <h4 className="font-medium mb-2">任务类型定义</h4>
              <pre className="text-sm">
                <code>
                  {`// 任务类型定义
interface Task {
  id: string;                // 任务唯一标识符
  description: string;       // 任务描述
  summary: string;           // 任务情况总结
  assignee: User;            // 任务执行人
  status: "已停滞" | "待开始" | "进行中" | "已完成";  // 任务状态
  startDate: string;         // 开始日期 (格式: YYYY/MM/DD)
  expectedEndDate?: string;  // 预计完成日期 (可选)
  actualEndDate?: string;    // 实际完成日期 (可选)
  isDelayed: boolean;        // 是否延期
  completed: boolean;        // 是否已完成
  priority: "重要紧急" | "紧急不重要" | "重要不紧急";  // 优先级
}`}
                </code>
              </pre>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md my-4 overflow-auto">
              <h4 className="font-medium mb-2">用户类型定义</h4>
              <pre className="text-sm">
                <code>
                  {`// 用户类型定义
interface User {
  id: string;          // 用户唯一标识符
  name: string;        // 用户名称
  avatar?: string;     // 用户头像 (可选)
  role?: string;       // 用户角色 (可选)
  department?: string; // 所属部门 (可选)
}`}
                </code>
              </pre>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md my-4 overflow-auto">
              <h4 className="font-medium mb-2">状态管理</h4>
              <pre className="text-sm">
                <code>
                  {`// 使用Zustand进行状态管理
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  // 其他方法...
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updatedTask) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteTask: (id) => 
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      // 其他方法实现...
    }),
    {
      name: 'task-storage',
    }
  )
)`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">二次开发指南</h2>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">要对多维表格进行二次开发，我们可以按照以下步骤操作：</p>

            <h3 className="text-lg font-medium mt-6 mb-2">1. 添加新功能</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">以下是添加新功能的一般步骤：</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                在 <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">lib/types.ts</code>{" "}
                中添加新的类型定义
              </li>
              <li>
                在 <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">lib/task-store.ts</code>{" "}
                中添加新的状态和方法
              </li>
              <li>创建新的组件或修改现有组件</li>
              <li>更新视图以展示新功能</li>
            </ol>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md my-4">
              <h4 className="font-medium mb-2">示例：添加任务标签功能</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">1. 更新类型定义</p>
              <pre className="text-sm mb-4">
                <code>
                  {`// lib/types.ts
interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Task {
  // 现有字段...
  tags: Tag[];  // 新增字段
}`}
                </code>
              </pre>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">2. 更新状态管理</p>
              <pre className="text-sm mb-4">
                <code>
                  {`// lib/task-store.ts
interface TaskState {
  // 现有状态...
  tags: Tag[];
  addTag: (tag: Tag) => void;
  addTagToTask: (taskId: string, tagId: string) => void;
  removeTagFromTask: (taskId: string, tagId: string) => void;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      // 现有状态和方法...
      tags: [],
      addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
      addTagToTask: (taskId, tagId) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === taskId 
              ? { 
                  ...task, 
                  tags: [...task.tags, state.tags.find(t => t.id === tagId)!] 
                } 
              : task
          ),
        })),
      removeTagFromTask: (taskId, tagId) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === taskId 
              ? { 
                  ...task, 
                  tags: task.tags.filter(tag => tag.id !== tagId) 
                } 
              : task
          ),
        })),
    }),
    {
      name: 'task-storage',
    }
  )
)`}
                </code>
              </pre>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">3. 创建标签组件</p>
              <pre className="text-sm">
                <code>
                  {`// components/tag-badge.tsx
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
}

export function TagBadge({ tag, onRemove }: TagBadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        "bg-opacity-20 mr-1"
      )}
      style={{ backgroundColor: \`\${tag.color}33\`, color: tag.color }}
    >
      {tag.name}
      {onRemove && (
        <button 
          onClick={onRemove} 
          className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
        >
          <span className="sr-only">Remove</span>
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </span>
  );
}`}
                </code>
              </pre>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-2">2. 自定义UI组件</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              我们可以通过以下方式自定义UI：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>修改现有组件的样式</li>
              <li>创建新的UI组件</li>
              <li>调整主题配置</li>
            </ul>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md my-4">
              <h4 className="font-medium mb-2">示例：自定义按钮组件</h4>
              <pre className="text-sm">
                <code>
                  {`// components/ui/custom-button.tsx
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface CustomButtonProps extends ButtonProps {
  gradient?: boolean;
}

export function CustomButton({ 
  gradient, 
  className, 
  children, 
  ...props 
}: CustomButtonProps) {
  return (
    <Button
      className={cn(
        gradient && "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">API参考</h2>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">多维表格提供了丰富的API，方便您进行二次开发：</p>

            <h3 className="text-lg font-medium mt-4 mb-2">任务管理API</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      方法名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      参数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      返回值
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      描述
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      addTask
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">task: Task</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">void</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">添加新任务</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      updateTask
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      id: string, task: Partial&lt;Task&gt;
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">void</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">更新任务信息</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      deleteTask
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">id: string</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">void</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">删除任务</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">常见问题解答</h2>
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium">如何添加自定义字段？</h4>
              <p className="text-sm text-muted-foreground mt-1">
                要添加自定义字段，需要修改 Task
                接口定义，更新初始数据结构，并调整相关组件以显示和编辑新字段。详细步骤请参考上面的"添加新功能"部分。
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-medium">如何实现数据持久化？</h4>
              <p className="text-sm text-muted-foreground mt-1">
                多维表格默认使用 localStorage 进行数据持久化。如需使用其他存储方式，可以修改 Zustand 的 persist
                中间件配置，或实现自定义存储适配器。
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-medium">如何添加新的视图类型？</h4>
              <p className="text-sm text-muted-foreground mt-1">
                添加新的视图类型需要创建新的视图组件，并在主界面中添加视图切换逻辑。您可以参考现有的表格视图、看板视图等实现方式。
              </p>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-medium">如何集成第三方服务？</h4>
              <p className="text-sm text-muted-foreground mt-1">
                您可以使用 API 客户端（如 axios）与第三方服务进行集成。建议创建专门的服务模块来处理 API
                调用，并使用环境变量存储 API 密钥等敏感信息。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
