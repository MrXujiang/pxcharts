# pxcharts 技术架构文档

> 本文档详细介绍 pxcharts 多维表格的技术实现和架构设计

## 目录

- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [核心模块](#核心模块)
- [数据流设计](#数据流设计)
- [状态管理](#状态管理)
- [拖拽系统](#拖拽系统)
- [性能优化](#性能优化)
- [开发规范](#开发规范)

## 技术栈

### 前端框架
- **Next.js 15.2** - React 服务端渲染框架
  - App Router 路由系统
  - 服务端组件与客户端组件混合渲染
  - 自动代码分割和优化
  
- **React 19** - 用户界面库
  - 最新的并发特性
  - 自动批处理优化
  - Hooks API

### UI 组件库
- **shadcn/ui** - 基于 Radix UI 的组件系统
  - 40+ 可定制化组件
  - 完整的无障碍支持
  - 主题系统集成

- **Tailwind CSS** - 原子化 CSS 框架
  - JIT 编译模式
  - 自定义主题配置
  - 响应式设计系统

### 状态管理
- **Zustand** - 轻量级状态管理
  - 基于 Flux 架构
  - 中间件系统（persist）
  - TypeScript 完整支持
  - 本地存储持久化

### 拖拽功能
- **@dnd-kit** - 现代化拖拽库
  - 模块化设计
  - 高性能优化
  - 触摸设备支持
  - 自定义传感器

### 数据可视化
- **Recharts** - React 图表库
  - 声明式 API
  - 响应式设计
  - 丰富的图表类型

### 表单处理
- **React Hook Form** - 表单状态管理
  - 高性能表单验证
  - 最小重渲染
  
- **Zod** - TypeScript 优先的模式验证
  - 类型推导
  - 运行时验证

### 开发工具
- **TypeScript 5** - 静态类型检查
- **ESLint** - 代码质量检查
- **PostCSS** - CSS 处理工具

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                     应用层 (App Layer)                   │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router                                     │
│  ├── app/page.tsx (主页面)                              │
│  ├── app/layout.tsx (根布局)                            │
│  └── app/globals.css (全局样式)                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    视图层 (View Layer)                   │
├─────────────────────────────────────────────────────────┤
│  views/                                                 │
│  ├── StatisticsView (统计看板)                          │
│  ├── DocumentationView (文档中心)                       │
│  ├── AssignmentView (人员分配)                          │
│  └── DeploymentView (部署指南)                          │
│                                                         │
│  核心组件/                                               │
│  ├── TaskManagementTable (表格视图)                     │
│  ├── KanbanBoard (看板视图)                             │
│  ├── AssignmentBoard (人员看板)                         │
│  └── TaskDetail (任务详情)                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   业务组件层 (Components)                 │
├─────────────────────────────────────────────────────────┤
│  功能组件/                                               │
│  ├── FilterDialog (筛选对话框)                          │
│  ├── SortDialog (排序对话框)                            │
│  ├── GroupByDialog (分组对话框)                         │
│  ├── FieldConfigDialog (字段配置)                       │
│  ├── AddTaskDialog (添加任务)                           │
│  ├── AddUserDialog (添加用户)                           │
│  ├── AddFieldDialog (添加字段)                          │
│  └── ImportTasksDialog (导入任务)                       │
│                                                         │
│  编辑组件/                                               │
│  ├── EditableCell (可编辑单元格)                        │
│  ├── CustomFieldCell (自定义字段单元格)                 │
│  └── ResizableHeader (可调整大小的表头)                 │
│                                                         │
│  拖拽组件/                                               │
│  ├── SortableItem (可排序项)                            │
│  └── DroppableContainer (可放置容器)                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  UI 组件层 (UI Components)               │
├─────────────────────────────────────────────────────────┤
│  shadcn/ui 基础组件 (40+)                                │
│  ├── Button, Input, Select, Checkbox                   │
│  ├── Dialog, Sheet, Popover, Tooltip                   │
│  ├── Table, Card, Badge, Avatar                        │
│  ├── Tabs, Accordion, ScrollArea                       │
│  └── Toast, Alert, Progress                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   数据层 (Data Layer)                    │
├─────────────────────────────────────────────────────────┤
│  状态管理 (Zustand Store)                                │
│  ├── task-store.ts (任务状态管理)                       │
│  │   ├── 数据状态 (data, filteredData)                 │
│  │   ├── 视图配置 (viewConfig)                         │
│  │   ├── 筛选配置 (filterConfig)                       │
│  │   ├── 排序配置 (sortConfig)                         │
│  │   ├── 字段配置 (visibleFields)                      │
│  │   └── 用户顺序 (userOrder)                          │
│  │                                                      │
│  ├── 数据操作                                            │
│  │   ├── addTask, updateTask, deleteUser               │
│  │   ├── moveTask, reorderTasks                        │
│  │   ├── addField, updateFieldWidth                    │
│  │   └── applyFilters, applySorting                    │
│  │                                                      │
│  └── 持久化 (localStorage)                              │
│      └── task-management-storage                       │
│                                                         │
│  类型定义 (types.ts)                                     │
│  ├── Task, User, PriorityGroup                         │
│  ├── ViewConfig, FilterConfig, SortConfig              │
│  └── FieldConfig, CustomFieldValue                     │
│                                                         │
│  初始数据 (data.ts, mock.ts)                             │
│  └── initialData, mockTasks                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  工具层 (Utilities)                      │
├─────────────────────────────────────────────────────────┤
│  hooks/                                                 │
│  ├── use-local-storage (本地存储)                       │
│  ├── use-media-query (响应式查询)                       │
│  ├── use-mobile (移动端检测)                            │
│  └── use-toast (消息提示)                               │
│                                                         │
│  lib/utils.ts                                           │
│  └── cn (className 合并工具)                            │
└─────────────────────────────────────────────────────────┘
```

### 分层设计原则

1. **应用层**: Next.js App Router，处理路由和页面级配置
2. **视图层**: 独立的视图组件，负责不同功能模块的展示
3. **业务组件层**: 可复用的业务组件，封装特定业务逻辑
4. **UI组件层**: 通用UI组件，无业务逻辑
5. **数据层**: 统一的状态管理和数据操作
6. **工具层**: 公共工具函数和自定义Hooks

## 核心模块

### 1. 任务管理模块

#### 数据结构

```typescript
interface Task {
  id: string                    // 唯一标识
  description: string           // 任务描述
  summary: string              // 任务总结
  assignee: User               // 执行人
  status: TaskStatus           // 进展状态
  startDate: string            // 开始日期
  expectedEndDate?: string     // 预计完成日期
  actualEndDate?: string       // 实际完成日期
  isDelayed: boolean          // 是否延期
  completed: boolean          // 完成状态
  priority: TaskPriority      // 优先级
  customFields?: Record<string, CustomFieldValue>  // 自定义字段
}

interface PriorityGroup {
  id: string                   // 分组ID
  name: string                 // 分组名称
  tasks: Task[]                // 任务列表
}
```

#### 核心功能

1. **CRUD 操作**
   - `addTask`: 添加任务
   - `updateTask`: 更新任务
   - `deleteTask`: 删除任务（通过删除用户实现）
   - `addMultipleTasks`: 批量导入任务

2. **任务移动**
   - `moveTask`: 更改任务状态
   - `reorderTasks`: 拖拽排序（支持跨优先级组）

3. **数据过滤**
   - 按状态筛选
   - 按优先级筛选
   - 按执行人筛选
   - 按日期范围筛选
   - 组合条件筛选

4. **数据排序**
   - 支持多字段排序
   - 升序/降序切换
   - 自定义字段排序

5. **数据分组**
   - 按优先级分组（默认）
   - 按状态分组
   - 按执行人分组
   - 按完成状态分组

### 2. 视图系统

#### 表格视图 (TaskManagementTable)

**特性:**
- 可拖拽排序任务
- 可调整列宽
- 可拖拽调整列顺序
- 行内编辑
- 分组展开/折叠
- 任务展开/折叠
- 响应式行高调整

**实现细节:**
```typescript
// 列宽调整实现
const handleColumnResize = (fieldId: string, width: number) => {
  updateFieldWidth(fieldId, width)
  // 动态更新表格总宽度
  calculateTableWidth()
}

// 拖拽排序实现
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  // 找到源任务和目标位置
  // 支持跨优先级组拖拽
  reorderTasks(sourceGroupId, activeIndex, overIndex, targetGroupId)
}
```

#### 看板视图 (KanbanBoard)

**特性:**
- 按状态分栏展示
- 卡片拖拽切换状态
- 快速添加任务
- 卡片悬浮预览

**实现:**
```typescript
// 使用 @dnd-kit 实现拖拽
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <DroppableContainer status="待开始">
    <SortableContext items={tasks}>
      {tasks.map(task => <SortableItem task={task} />)}
    </SortableContext>
  </DroppableContainer>
</DndContext>
```

#### 人员分配视图 (AssignmentBoard)

**特性:**
- 按人员分组展示任务
- 工作量可视化
- 人员拖拽排序
- 添加/删除人员

### 3. 字段配置系统

#### 内置字段

```typescript
const defaultFields = [
  { id: "description", name: "任务描述", type: "文本" },
  { id: "summary", name: "任务情况总结", type: "文本" },
  { id: "assignee", name: "任务执行人", type: "单选" },
  { id: "status", name: "进展状态", type: "标签" },
  { id: "priority", name: "优先级", type: "标签" },
  { id: "startDate", name: "开始日期", type: "文本" },
  { id: "expectedEndDate", name: "预计完成日期", type: "文本" },
  { id: "isDelayed", name: "是否延期", type: "复选" },
  { id: "actualEndDate", name: "实际完成日期", type: "文本" },
  { id: "completed", name: "最终状态", type: "复选" },
]
```

#### 自定义字段

**支持的字段类型:**
- 文本 (Text)
- 数值 (Number)
- 标签 (Tag)
- 单选 (Single Select)
- 复选 (Multi Select)
- 富文本 (Rich Text)
- 图片 (Image)

**实现:**
```typescript
interface FieldConfig {
  id: string           // 字段ID (custom_xxx)
  name: string         // 字段名称
  visible: boolean     // 是否可见
  width: number        // 列宽
  type: FieldType      // 字段类型
  options?: string[]   // 选项（用于单选/复选）
}

// 添加自定义字段
const addField = (field: FieldConfig) => {
  // 更新字段配置
  setVisibleFields([...visibleFields, field])
  // 更新表头顺序
  setHeaderOrder([...headerOrder, field.id])
}

// 更新自定义字段值
const updateTaskCustomField = (taskId, fieldId, value) => {
  // 更新任务的 customFields
  task.customFields[fieldId] = { type, value }
}
```

### 4. 导入导出系统

#### 导出功能

```typescript
const exportTaskData = () => {
  const tasks = data.priorityGroups.flatMap(group => group.tasks)
  const jsonData = JSON.stringify(tasks, null, 2)
  const blob = new Blob([jsonData], { type: "application/json" })
  // 下载文件
  downloadFile(blob, `tasks-export-${date}.json`)
}
```

#### 导入功能

**支持格式:**
- JSON 格式任务数据
- 自动验证数据结构
- 批量导入任务
- 错误提示

**实现:**
```typescript
const importTasks = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const tasks = JSON.parse(e.target.result)
    // 验证数据
    validateTasks(tasks)
    // 批量添加
    addMultipleTasks(tasks)
  }
  reader.readAsText(file)
}
```

## 数据流设计

### 单向数据流

```
用户操作 → 事件处理器 → Store Action → State 更新 → UI 重新渲染
```

### 数据流示例

```typescript
// 1. 用户点击更新任务
<Button onClick={() => handleTaskUpdate(taskId, updates)} />

// 2. 事件处理器
const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
  updateTask(taskId, updates)  // 调用 Store
  toast({ title: "任务已更新" })
}

// 3. Store Action
const updateTask = (taskId, updates) => {
  set((state) => {
    // 不可变更新
    const newData = JSON.parse(JSON.stringify(state.data))
    // 找到并更新任务
    updateTaskInGroups(newData, taskId, updates)
    // 应用筛选
    const filtered = filterData(newData, state.searchQuery, state.filterConfig)
    return { data: newData, filteredData: filtered }
  })
}

// 4. UI 自动重新渲染（React 订阅机制）
```

### 状态订阅

```typescript
// 组件订阅 Store
const { data, updateTask } = useTaskStore()

// Zustand 自动追踪依赖
// 只有使用到的状态变化时才重新渲染
```

## 状态管理

### Zustand Store 结构

```typescript
interface TaskStore {
  // === 数据状态 ===
  data: TaskData                    // 原始数据
  filteredData: TaskData            // 过滤后的数据
  searchQuery: string               // 搜索关键词
  
  // === 视图配置 ===
  viewConfig: {
    rowHeight: RowHeight           // 行高
    editMode: boolean              // 编辑模式
    expandedGroups: Record<string, boolean>    // 分组展开状态
    expandedTasks: Record<string, boolean>     // 任务展开状态
    headerDraggable: boolean       // 表头可拖拽
  }
  
  // === 筛选配置 ===
  filterConfig: {
    status: string | null          // 状态筛选
    priority: string | null        // 优先级筛选
    assignee: string | null        // 执行人筛选
    dateRange: {                   // 日期范围
      start?: string
      end?: string
    } | null
    isActive: boolean              // 是否启用筛选
  }
  
  // === 排序配置 ===
  sortConfig: {
    field: string | null           // 排序字段
    direction: "asc" | "desc"     // 排序方向
    isActive: boolean              // 是否启用排序
  }
  
  // === 分组配置 ===
  groupBy: string                  // 分组字段
  
  // === 字段配置 ===
  visibleFields: FieldConfig[]     // 可见字段列表
  headerOrder: string[]            // 表头顺序
  
  // === 用户配置 ===
  userOrder: string[]              // 用户顺序
  
  // === Actions ===
  // 数据操作
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  addMultipleTasks: (tasks: Task[]) => void
  moveTask: (taskId: string, newStatus: TaskStatus) => void
  reorderTasks: (groupId, oldIndex, newIndex, targetGroupId?) => void
  
  // 用户操作
  addUser: (user: User) => void
  deleteUser: (userId: string) => void
  reorderUsers: (oldIndex, newIndex) => void
  
  // 字段操作
  addField: (field: FieldConfig) => void
  updateFieldWidth: (fieldId: string, width: number) => void
  updateFieldType: (fieldId: string, type: FieldType) => void
  updateTaskCustomField: (taskId, fieldId, value) => void
  
  // 配置操作
  updateViewConfig: (updates: Partial<ViewConfig>) => void
  setFilterConfig: (config: FilterConfig) => void
  setSortConfig: (config: SortConfig) => void
  setGroupBy: (field: string) => void
  setVisibleFields: (fields: FieldConfig[]) => void
  setHeaderOrder: (order: string[]) => void
  reorderHeaders: (oldIndex, newIndex) => void
  
  // 数据处理
  applyFilters: () => void
  applySorting: () => void
  regroupData: () => TaskData
}
```

### 持久化策略

```typescript
// 使用 Zustand persist 中间件
persist(
  (set, get) => ({
    // store 实现
  }),
  {
    name: "task-management-storage",
    partialize: (state) => ({
      data: state.data,
      viewConfig: state.viewConfig,
      filterConfig: state.filterConfig,
      sortConfig: state.sortConfig,
      groupBy: state.groupBy,
      visibleFields: state.visibleFields,
      userOrder: state.userOrder,
      headerOrder: state.headerOrder,
    }),
  }
)
```

**持久化的数据:**
- 任务数据
- 视图配置
- 筛选/排序/分组配置
- 字段配置
- 用户顺序

**不持久化的数据:**
- 搜索关键词
- 过滤后的数据（计算得出）

## 拖拽系统

### @dnd-kit 架构

```typescript
// 1. 创建传感器
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }  // 防止误触
  }),
  useSensor(KeyboardSensor)  // 键盘支持
)

// 2. DndContext 上下文
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}  // 碰撞检测算法
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  {/* 可拖拽内容 */}
</DndContext>

// 3. SortableContext 排序上下文
<SortableContext
  items={tasks.map(t => t.id)}
  strategy={verticalListSortingStrategy}
>
  {tasks.map(task => <SortableItem task={task} />)}
</SortableContext>

// 4. 可排序项
const SortableItem = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })
  
  return (
    <div
      ref={setNodeRef}
      style={{ transform, transition }}
      {...attributes}
      {...listeners}
    >
      {/* 任务内容 */}
    </div>
  )
}
```

### 拖拽场景实现

#### 1. 任务拖拽排序

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  
  // 查找源任务和目标位置
  const sourceGroup = findGroup(active.id)
  const targetGroup = findGroup(over.id)
  const sourceIndex = findIndex(active.id)
  const targetIndex = findIndex(over.id)
  
  // 支持跨组拖拽
  if (sourceGroup !== targetGroup) {
    // 更新任务优先级
    updateTaskPriority(active.id, targetGroup.id)
  }
  
  // 重新排序
  reorderTasks(sourceGroup.id, sourceIndex, targetIndex, targetGroup.id)
}
```

#### 2. 表头拖拽调整顺序

```typescript
const handleHeaderDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  const oldIndex = headerOrder.indexOf(active.id)
  const newIndex = headerOrder.indexOf(over.id)
  
  // 调整表头顺序
  reorderHeaders(oldIndex, newIndex)
}
```

#### 3. 看板卡片拖拽

```typescript
// 可放置容器
const DroppableContainer = ({ status, children }) => {
  const { setNodeRef } = useDroppable({ id: status })
  
  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  )
}

// 拖拽结束时更新任务状态
const handleKanbanDragEnd = (event: DragEndEvent) => {
  const newStatus = event.over?.id
  moveTask(event.active.id, newStatus)
}
```

## 性能优化

### 1. React 性能优化

#### 组件优化

```typescript
// 使用 React.memo 避免不必要的重渲染
const TaskRow = React.memo(({ task, onUpdate }) => {
  // 组件实现
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.task.id === nextProps.task.id
})

// 使用 useCallback 缓存函数
const handleTaskUpdate = useCallback((taskId, updates) => {
  updateTask(taskId, updates)
}, [updateTask])

// 使用 useMemo 缓存计算结果
const sortedTasks = useMemo(() => {
  return tasks.sort(compareFn)
}, [tasks, sortConfig])
```

#### 虚拟列表（待实现）

对于大量任务数据，可以实现虚拟滚动:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

const VirtualTaskList = ({ tasks }) => {
  const parentRef = useRef()
  
  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })
  
  return (
    <div ref={parentRef}>
      {rowVirtualizer.getVirtualItems().map(virtualRow => (
        <TaskRow key={virtualRow.key} task={tasks[virtualRow.index]} />
      ))}
    </div>
  )
}
```

### 2. Zustand 性能优化

```typescript
// 选择性订阅，避免不必要的重渲染
const tasks = useTaskStore(state => state.data.tasks)  // ✓ 只订阅 tasks
const store = useTaskStore()  // ✗ 订阅整个 store

// 使用 shallow 比较
import { shallow } from 'zustand/shallow'

const [tasks, updateTask] = useTaskStore(
  state => [state.data.tasks, state.updateTask],
  shallow
)
```

### 3. 拖拽性能优化

```typescript
// 使用 useSensor 限制拖拽触发
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,  // 需要拖拽 8px 才触发
    }
  })
)

// 拖拽时降低渲染频率
const [isDragging, setIsDragging] = useState(false)

const handleDragStart = () => {
  setIsDragging(true)
  // 禁用部分动画和效果
}

const handleDragEnd = () => {
  setIsDragging(false)
  // 恢复动画和效果
}
```

### 4. 列宽调整优化

```typescript
// 使用 requestAnimationFrame 优化调整性能
const handleMouseMove = (e) => {
  requestAnimationFrame(() => {
    const newWidth = calculateWidth(e)
    updateColumnWidth(newWidth)
  })
}

// 使用 CSS 变量动态更新宽度
const updateColumnWidth = (fieldId, width) => {
  document.documentElement.style.setProperty(
    `--column-${fieldId}-width`,
    `${width}px`
  )
}
```

### 5. 数据处理优化

```typescript
// 使用 JSON.parse(JSON.stringify()) 深拷贝（简单场景）
const newData = JSON.parse(JSON.stringify(state.data))

// 大数据量时使用 immer（待引入）
import { produce } from 'immer'

const updateTask = produce((draft, taskId, updates) => {
  const task = findTaskInDraft(draft, taskId)
  Object.assign(task, updates)
})

// 批量更新优化
const updateMultipleTasks = (updates) => {
  set((state) => {
    const newData = { ...state.data }
    updates.forEach(({ taskId, updates }) => {
      updateTaskInData(newData, taskId, updates)
    })
    return { data: newData }
  })
}
```

### 6. Next.js 优化

```typescript
// next.config.mjs 配置
const nextConfig = {
  // 图片优化
  images: {
    unoptimized: true,  // 根据需求启用/禁用
  },
  
  // 生产构建优化
  swcMinify: true,
  
  // 代码分割
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*'],
  }
}
```

## 开发规范

### 代码组织

```
components/
├── ui/              # 通用 UI 组件（无业务逻辑）
├── views/           # 视图组件（页面级）
├── charts/          # 图表组件
├── documentation/   # 文档组件
└── *.tsx           # 业务组件

lib/
├── types.ts        # 类型定义
├── task-store.ts   # 状态管理
├── data.ts         # 数据定义
├── mock.ts         # Mock 数据
└── utils.ts        # 工具函数

hooks/
├── use-*.ts        # 自定义 Hooks

app/
├── layout.tsx      # 根布局
├── page.tsx        # 首页
└── globals.css     # 全局样式
```

### 命名规范

```typescript
// 组件：PascalCase
const TaskManagementTable = () => {}

// 函数/变量：camelCase
const handleTaskUpdate = () => {}
const isActive = true

// 常量：UPPER_SNAKE_CASE
const MAX_TASKS = 100

// 类型/接口：PascalCase
interface Task {}
type TaskStatus = "待开始" | "进行中"

// 文件名：kebab-case
task-management-table.tsx
use-local-storage.ts
```

### TypeScript 使用

```typescript
// 严格类型定义
interface Task {
  id: string
  // ...其他字段
}

// 使用类型推导
const tasks = useTaskStore(state => state.data.tasks)  // 自动推导为 Task[]

// 泛型使用
const updateField = <T extends FieldType>(
  fieldId: string,
  value: FieldValueMap[T]
) => {}

// 避免 any，使用 unknown
const parseData = (data: unknown) => {
  if (isTask(data)) {
    // 类型守卫
    return data
  }
}
```

### 组件编写规范

```typescript
// 1. 导入顺序
import React from 'react'                    // React 相关
import { Button } from '@/components/ui'     // UI 组件
import { useTaskStore } from '@/lib/store'   // Store
import type { Task } from '@/lib/types'      // 类型
import { cn } from '@/lib/utils'             // 工具

// 2. 组件定义
interface TaskRowProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, onUpdate }) => {
  // 3. Hooks（固定顺序）
  const [isEditing, setIsEditing] = useState(false)
  const updateTask = useTaskStore(state => state.updateTask)
  
  // 4. 事件处理器
  const handleClick = useCallback(() => {
    setIsEditing(true)
  }, [])
  
  // 5. 渲染
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  )
}
```

### 样式规范

```typescript
// 使用 Tailwind CSS 原子类
<div className="flex items-center gap-2 px-4 py-2">

// 使用 cn 工具合并类名
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>

// 动态样式使用 style 属性
<div style={{ width: `${width}px` }}>

// 复杂样式使用 CSS 模块（如需要）
import styles from './task-row.module.css'
```

### 状态管理规范

```typescript
// Store 中使用不可变更新
set((state) => ({
  ...state,
  data: {
    ...state.data,
    tasks: [...state.data.tasks, newTask]
  }
}))

// 复杂状态更新使用 produce（immer）
set(produce((draft) => {
  draft.data.tasks.push(newTask)
}))

// 避免直接修改状态
state.data.tasks.push(newTask)  // ✗ 错误
set({ data: { ...state.data, tasks: [...tasks, newTask] }})  // ✓ 正确
```

### 错误处理

```typescript
// 使用 try-catch 处理异步操作
const importTasks = async (file: File) => {
  try {
    const data = await parseFile(file)
    addMultipleTasks(data)
    toast({ title: "导入成功" })
  } catch (error) {
    toast({
      title: "导入失败",
      description: error.message,
      variant: "destructive"
    })
  }
}

// 类型守卫
const isTask = (data: unknown): data is Task => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'description' in data
  )
}
```

### 性能注意事项

```typescript
// ✓ 使用 useCallback 缓存回调
const handleClick = useCallback(() => {
  doSomething()
}, [dependencies])

// ✓ 使用 useMemo 缓存计算
const filteredTasks = useMemo(() => {
  return tasks.filter(filterFn)
}, [tasks, filterFn])

// ✓ 选择性订阅 Store
const tasks = useTaskStore(state => state.tasks)

// ✗ 避免在循环中创建函数
{tasks.map(task => (
  <div onClick={() => handleClick(task.id)}>  // ✗ 每次渲染都创建新函数
))}

// ✓ 正确做法
{tasks.map(task => (
  <TaskRow task={task} onClick={handleClick} />  // ✓ 传递稳定引用
))}
```

## 扩展建议

### 未来可以添加的功能

1. **后端集成**
   - RESTful API 或 GraphQL
   - 数据库持久化（PostgreSQL/MongoDB）
   - 用户认证和授权

2. **协作功能**
   - 实时协作（WebSocket）
   - 评论和讨论
   - 变更历史记录

3. **高级功能**
   - 甘特图视图
   - 时间线视图
   - 工作流自动化
   - 通知系统

4. **性能优化**
   - 虚拟滚动
   - 分页加载
   - 服务端渲染优化

5. **移动端优化**
   - PWA 支持
   - 原生 App（React Native）
   - 触摸手势优化

## 总结

pxcharts 是一个技术先进、架构清晰的现代化多维表格应用。通过合理的分层设计、强大的状态管理、流畅的拖拽交互和细致的性能优化，为用户提供了出色的使用体验。

**核心优势:**
- 🏗️ 清晰的模块化架构
- ⚡ 高性能的状态管理
- 🎨 优雅的 UI 设计
- 🔧 完善的类型系统
- 📱 响应式适配
- 🚀 可扩展性强

---

> 最后更新时间: 2025-12-23
> 版本: 1.0.0
