# pxcharts Technical Architecture Documentation

> This document provides detailed technical implementation and architecture design of pxcharts multi-dimensional table

## Table of Contents

- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Core Modules](#core-modules)
- [Data Flow Design](#data-flow-design)
- [State Management](#state-management)
- [Drag and Drop System](#drag-and-drop-system)
- [Performance Optimization](#performance-optimization)
- [Development Guidelines](#development-guidelines)

## Tech Stack

### Frontend Framework
- **Next.js 15.2** - React server-side rendering framework
  - App Router system
  - Server and client component hybrid rendering
  - Automatic code splitting and optimization
  
- **React 19** - UI library
  - Latest concurrent features
  - Automatic batching optimization
  - Hooks API

### UI Component Library
- **shadcn/ui** - Component system based on Radix UI
  - 40+ customizable components
  - Full accessibility support
  - Theme system integration

- **Tailwind CSS** - Atomic CSS framework
  - JIT compilation mode
  - Custom theme configuration
  - Responsive design system

### State Management
- **Zustand** - Lightweight state management
  - Flux architecture based
  - Middleware system (persist)
  - Full TypeScript support
  - LocalStorage persistence

### Drag and Drop
- **@dnd-kit** - Modern drag and drop library
  - Modular design
  - High performance optimization
  - Touch device support
  - Custom sensors

### Data Visualization
- **Recharts** - React chart library
  - Declarative API
  - Responsive design
  - Rich chart types

### Form Handling
- **React Hook Form** - Form state management
  - High performance validation
  - Minimal re-renders
  
- **Zod** - TypeScript-first schema validation
  - Type inference
  - Runtime validation

### Development Tools
- **TypeScript 5** - Static type checking
- **ESLint** - Code quality checking
- **PostCSS** - CSS processing tool

## System Architecture

### Overall Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router                                     │
│  ├── app/page.tsx (Main page)                           │
│  ├── app/layout.tsx (Root layout)                       │
│  └── app/globals.css (Global styles)                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      View Layer                          │
├─────────────────────────────────────────────────────────┤
│  views/                                                 │
│  ├── StatisticsView (Statistics dashboard)             │
│  ├── DocumentationView (Documentation center)          │
│  ├── AssignmentView (Staff assignment)                 │
│  └── DeploymentView (Deployment guide)                 │
│                                                         │
│  Core Components/                                       │
│  ├── TaskManagementTable (Table view)                  │
│  ├── KanbanBoard (Kanban view)                         │
│  ├── AssignmentBoard (Assignment board)                │
│  └── TaskDetail (Task details)                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Business Components                    │
├─────────────────────────────────────────────────────────┤
│  Feature Components/                                    │
│  ├── FilterDialog (Filter dialog)                      │
│  ├── SortDialog (Sort dialog)                          │
│  ├── GroupByDialog (Group by dialog)                   │
│  ├── FieldConfigDialog (Field configuration)           │
│  ├── AddTaskDialog (Add task)                          │
│  ├── AddUserDialog (Add user)                          │
│  ├── AddFieldDialog (Add field)                        │
│  └── ImportTasksDialog (Import tasks)                  │
│                                                         │
│  Edit Components/                                       │
│  ├── EditableCell (Editable cell)                      │
│  ├── CustomFieldCell (Custom field cell)               │
│  └── ResizableHeader (Resizable header)                │
│                                                         │
│  Drag Components/                                       │
│  ├── SortableItem (Sortable item)                      │
│  └── DroppableContainer (Droppable container)          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    UI Components                         │
├─────────────────────────────────────────────────────────┤
│  shadcn/ui Base Components (40+)                        │
│  ├── Button, Input, Select, Checkbox                   │
│  ├── Dialog, Sheet, Popover, Tooltip                   │
│  ├── Table, Card, Badge, Avatar                        │
│  ├── Tabs, Accordion, ScrollArea                       │
│  └── Toast, Alert, Progress                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
├─────────────────────────────────────────────────────────┤
│  State Management (Zustand Store)                       │
│  ├── task-store.ts (Task state management)             │
│  │   ├── Data state (data, filteredData)               │
│  │   ├── View config (viewConfig)                      │
│  │   ├── Filter config (filterConfig)                  │
│  │   ├── Sort config (sortConfig)                      │
│  │   ├── Field config (visibleFields)                  │
│  │   └── User order (userOrder)                        │
│  │                                                      │
│  ├── Data Operations                                    │
│  │   ├── addTask, updateTask, deleteUser               │
│  │   ├── moveTask, reorderTasks                        │
│  │   ├── addField, updateFieldWidth                    │
│  │   └── applyFilters, applySorting                    │
│  │                                                      │
│  └── Persistence (localStorage)                        │
│      └── task-management-storage                       │
│                                                         │
│  Type Definitions (types.ts)                            │
│  ├── Task, User, PriorityGroup                         │
│  ├── ViewConfig, FilterConfig, SortConfig              │
│  └── FieldConfig, CustomFieldValue                     │
│                                                         │
│  Initial Data (data.ts, mock.ts)                        │
│  └── initialData, mockTasks                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Utilities Layer                       │
├─────────────────────────────────────────────────────────┤
│  hooks/                                                 │
│  ├── use-local-storage (Local storage)                 │
│  ├── use-media-query (Responsive query)                │
│  ├── use-mobile (Mobile detection)                     │
│  └── use-toast (Toast notification)                    │
│                                                         │
│  lib/utils.ts                                           │
│  └── cn (className merge utility)                      │
└─────────────────────────────────────────────────────────┘
```

### Layered Design Principles

1. **Application Layer**: Next.js App Router, handles routing and page-level configuration
2. **View Layer**: Independent view components for different feature modules
3. **Business Component Layer**: Reusable business components with specific logic
4. **UI Component Layer**: Generic UI components without business logic
5. **Data Layer**: Unified state management and data operations
6. **Utilities Layer**: Common utility functions and custom hooks

## Core Modules

### 1. Task Management Module

#### Data Structure

```typescript
interface Task {
  id: string                    // Unique identifier
  description: string           // Task description
  summary: string              // Task summary
  assignee: User               // Assignee
  status: TaskStatus           // Progress status
  startDate: string            // Start date
  expectedEndDate?: string     // Expected completion date
  actualEndDate?: string       // Actual completion date
  isDelayed: boolean          // Is delayed
  completed: boolean          // Completion status
  priority: TaskPriority      // Priority
  customFields?: Record<string, CustomFieldValue>  // Custom fields
}

interface PriorityGroup {
  id: string                   // Group ID
  name: string                 // Group name
  tasks: Task[]                // Task list
}
```

#### Core Features

1. **CRUD Operations**
   - `addTask`: Add task
   - `updateTask`: Update task
   - `deleteTask`: Delete task (via deleting user)
   - `addMultipleTasks`: Batch import tasks

2. **Task Movement**
   - `moveTask`: Change task status
   - `reorderTasks`: Drag and drop sorting (supports cross-priority group)

3. **Data Filtering**
   - Filter by status
   - Filter by priority
   - Filter by assignee
   - Filter by date range
   - Combined condition filtering

4. **Data Sorting**
   - Multi-field sorting
   - Ascending/descending toggle
   - Custom field sorting

5. **Data Grouping**
   - Group by priority (default)
   - Group by status
   - Group by assignee
   - Group by completion status

### 2. View System

#### Table View (TaskManagementTable)

**Features:**
- Drag and drop task sorting
- Resizable columns
- Drag and drop column reordering
- Inline editing
- Group expand/collapse
- Task expand/collapse
- Responsive row height adjustment

**Implementation:**
```typescript
// Column resize implementation
const handleColumnResize = (fieldId: string, width: number) => {
  updateFieldWidth(fieldId, width)
  // Dynamically update table total width
  calculateTableWidth()
}

// Drag and drop sorting implementation
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  // Find source task and target position
  // Support cross-priority group dragging
  reorderTasks(sourceGroupId, activeIndex, overIndex, targetGroupId)
}
```

#### Kanban View (KanbanBoard)

**Features:**
- Display by status columns
- Card drag to change status
- Quick add task
- Card hover preview

**Implementation:**
```typescript
// Drag and drop using @dnd-kit
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

#### Assignment View (AssignmentBoard)

**Features:**
- Display tasks grouped by assignee
- Workload visualization
- User drag and drop sorting
- Add/delete users

### 3. Field Configuration System

#### Built-in Fields

```typescript
const defaultFields = [
  { id: "description", name: "Task Description", type: "Text" },
  { id: "summary", name: "Task Summary", type: "Text" },
  { id: "assignee", name: "Assignee", type: "Single Select" },
  { id: "status", name: "Status", type: "Tag" },
  { id: "priority", name: "Priority", type: "Tag" },
  { id: "startDate", name: "Start Date", type: "Text" },
  { id: "expectedEndDate", name: "Expected End Date", type: "Text" },
  { id: "isDelayed", name: "Is Delayed", type: "Checkbox" },
  { id: "actualEndDate", name: "Actual End Date", type: "Text" },
  { id: "completed", name: "Final Status", type: "Checkbox" },
]
```

#### Custom Fields

**Supported field types:**
- Text
- Number
- Tag
- Single Select
- Multi Select
- Rich Text
- Image

**Implementation:**
```typescript
interface FieldConfig {
  id: string           // Field ID (custom_xxx)
  name: string         // Field name
  visible: boolean     // Is visible
  width: number        // Column width
  type: FieldType      // Field type
  options?: string[]   // Options (for select types)
}

// Add custom field
const addField = (field: FieldConfig) => {
  // Update field configuration
  setVisibleFields([...visibleFields, field])
  // Update header order
  setHeaderOrder([...headerOrder, field.id])
}

// Update custom field value
const updateTaskCustomField = (taskId, fieldId, value) => {
  // Update task's customFields
  task.customFields[fieldId] = { type, value }
}
```

### 4. Import/Export System

#### Export Feature

```typescript
const exportTaskData = () => {
  const tasks = data.priorityGroups.flatMap(group => group.tasks)
  const jsonData = JSON.stringify(tasks, null, 2)
  const blob = new Blob([jsonData], { type: "application/json" })
  // Download file
  downloadFile(blob, `tasks-export-${date}.json`)
}
```

#### Import Feature

**Supported formats:**
- JSON format task data
- Automatic data structure validation
- Batch import tasks
- Error notification

**Implementation:**
```typescript
const importTasks = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const tasks = JSON.parse(e.target.result)
    // Validate data
    validateTasks(tasks)
    // Batch add
    addMultipleTasks(tasks)
  }
  reader.readAsText(file)
}
```

## Data Flow Design

### Unidirectional Data Flow

```
User Action → Event Handler → Store Action → State Update → UI Re-render
```

### Data Flow Example

```typescript
// 1. User clicks to update task
<Button onClick={() => handleTaskUpdate(taskId, updates)} />

// 2. Event handler
const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
  updateTask(taskId, updates)  // Call Store
  toast({ title: "Task updated" })
}

// 3. Store Action
const updateTask = (taskId, updates) => {
  set((state) => {
    // Immutable update
    const newData = JSON.parse(JSON.stringify(state.data))
    // Find and update task
    updateTaskInGroups(newData, taskId, updates)
    // Apply filter
    const filtered = filterData(newData, state.searchQuery, state.filterConfig)
    return { data: newData, filteredData: filtered }
  })
}

// 4. UI automatically re-renders (React subscription mechanism)
```

### State Subscription

```typescript
// Component subscribes to Store
const { data, updateTask } = useTaskStore()

// Zustand automatically tracks dependencies
// Re-renders only when used state changes
```

## State Management

### Zustand Store Structure

```typescript
interface TaskStore {
  // === Data State ===
  data: TaskData                    // Raw data
  filteredData: TaskData            // Filtered data
  searchQuery: string               // Search query
  
  // === View Configuration ===
  viewConfig: {
    rowHeight: RowHeight           // Row height
    editMode: boolean              // Edit mode
    expandedGroups: Record<string, boolean>    // Group expand state
    expandedTasks: Record<string, boolean>     // Task expand state
    headerDraggable: boolean       // Header draggable
  }
  
  // === Filter Configuration ===
  filterConfig: {
    status: string | null          // Status filter
    priority: string | null        // Priority filter
    assignee: string | null        // Assignee filter
    dateRange: {                   // Date range
      start?: string
      end?: string
    } | null
    isActive: boolean              // Is filter active
  }
  
  // === Sort Configuration ===
  sortConfig: {
    field: string | null           // Sort field
    direction: "asc" | "desc"     // Sort direction
    isActive: boolean              // Is sort active
  }
  
  // === Group Configuration ===
  groupBy: string                  // Group field
  
  // === Field Configuration ===
  visibleFields: FieldConfig[]     // Visible fields list
  headerOrder: string[]            // Header order
  
  // === User Configuration ===
  userOrder: string[]              // User order
  
  // === Actions ===
  // Data operations
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  addMultipleTasks: (tasks: Task[]) => void
  moveTask: (taskId: string, newStatus: TaskStatus) => void
  reorderTasks: (groupId, oldIndex, newIndex, targetGroupId?) => void
  
  // User operations
  addUser: (user: User) => void
  deleteUser: (userId: string) => void
  reorderUsers: (oldIndex, newIndex) => void
  
  // Field operations
  addField: (field: FieldConfig) => void
  updateFieldWidth: (fieldId: string, width: number) => void
  updateFieldType: (fieldId: string, type: FieldType) => void
  updateTaskCustomField: (taskId, fieldId, value) => void
  
  // Configuration operations
  updateViewConfig: (updates: Partial<ViewConfig>) => void
  setFilterConfig: (config: FilterConfig) => void
  setSortConfig: (config: SortConfig) => void
  setGroupBy: (field: string) => void
  setVisibleFields: (fields: FieldConfig[]) => void
  setHeaderOrder: (order: string[]) => void
  reorderHeaders: (oldIndex, newIndex) => void
  
  // Data processing
  applyFilters: () => void
  applySorting: () => void
  regroupData: () => TaskData
}
```

### Persistence Strategy

```typescript
// Using Zustand persist middleware
persist(
  (set, get) => ({
    // store implementation
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

**Persisted data:**
- Task data
- View configuration
- Filter/sort/group configuration
- Field configuration
- User order

**Non-persisted data:**
- Search query
- Filtered data (computed)

## Drag and Drop System

### @dnd-kit Architecture

```typescript
// 1. Create sensors
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }  // Prevent accidental trigger
  }),
  useSensor(KeyboardSensor)  // Keyboard support
)

// 2. DndContext
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}  // Collision detection algorithm
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  {/* Draggable content */}
</DndContext>

// 3. SortableContext
<SortableContext
  items={tasks.map(t => t.id)}
  strategy={verticalListSortingStrategy}
>
  {tasks.map(task => <SortableItem task={task} />)}
</SortableContext>

// 4. Sortable item
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
      {/* Task content */}
    </div>
  )
}
```

### Drag and Drop Scenarios

#### 1. Task Drag and Drop Sorting

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  
  // Find source task and target position
  const sourceGroup = findGroup(active.id)
  const targetGroup = findGroup(over.id)
  const sourceIndex = findIndex(active.id)
  const targetIndex = findIndex(over.id)
  
  // Support cross-group dragging
  if (sourceGroup !== targetGroup) {
    // Update task priority
    updateTaskPriority(active.id, targetGroup.id)
  }
  
  // Reorder
  reorderTasks(sourceGroup.id, sourceIndex, targetIndex, targetGroup.id)
}
```

#### 2. Header Drag and Drop Reordering

```typescript
const handleHeaderDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  const oldIndex = headerOrder.indexOf(active.id)
  const newIndex = headerOrder.indexOf(over.id)
  
  // Adjust header order
  reorderHeaders(oldIndex, newIndex)
}
```

#### 3. Kanban Card Dragging

```typescript
// Droppable container
const DroppableContainer = ({ status, children }) => {
  const { setNodeRef } = useDroppable({ id: status })
  
  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  )
}

// Update task status on drag end
const handleKanbanDragEnd = (event: DragEndEvent) => {
  const newStatus = event.over?.id
  moveTask(event.active.id, newStatus)
}
```

## Performance Optimization

### 1. React Performance Optimization

#### Component Optimization

```typescript
// Use React.memo to avoid unnecessary re-renders
const TaskRow = React.memo(({ task, onUpdate }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.task.id === nextProps.task.id
})

// Use useCallback to cache functions
const handleTaskUpdate = useCallback((taskId, updates) => {
  updateTask(taskId, updates)
}, [updateTask])

// Use useMemo to cache computed results
const sortedTasks = useMemo(() => {
  return tasks.sort(compareFn)
}, [tasks, sortConfig])
```

#### Virtual List (To be implemented)

For large task data, implement virtual scrolling:

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

### 2. Zustand Performance Optimization

```typescript
// Selective subscription to avoid unnecessary re-renders
const tasks = useTaskStore(state => state.data.tasks)  // ✓ Only subscribe to tasks
const store = useTaskStore()  // ✗ Subscribe to entire store

// Use shallow comparison
import { shallow } from 'zustand/shallow'

const [tasks, updateTask] = useTaskStore(
  state => [state.data.tasks, state.updateTask],
  shallow
)
```

### 3. Drag and Drop Performance Optimization

```typescript
// Use useSensor to limit drag trigger
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,  // Requires 8px drag to trigger
    }
  })
)

// Reduce render frequency during drag
const [isDragging, setIsDragging] = useState(false)

const handleDragStart = () => {
  setIsDragging(true)
  // Disable some animations and effects
}

const handleDragEnd = () => {
  setIsDragging(false)
  // Restore animations and effects
}
```

### 4. Column Resize Optimization

```typescript
// Use requestAnimationFrame to optimize resize performance
const handleMouseMove = (e) => {
  requestAnimationFrame(() => {
    const newWidth = calculateWidth(e)
    updateColumnWidth(newWidth)
  })
}

// Use CSS variables to dynamically update width
const updateColumnWidth = (fieldId, width) => {
  document.documentElement.style.setProperty(
    `--column-${fieldId}-width`,
    `${width}px`
  )
}
```

### 5. Data Processing Optimization

```typescript
// Use JSON.parse(JSON.stringify()) for deep copy (simple scenarios)
const newData = JSON.parse(JSON.stringify(state.data))

// Use immer for large data (to be introduced)
import { produce } from 'immer'

const updateTask = produce((draft, taskId, updates) => {
  const task = findTaskInDraft(draft, taskId)
  Object.assign(task, updates)
})

// Batch update optimization
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

### 6. Next.js Optimization

```typescript
// next.config.mjs configuration
const nextConfig = {
  // Image optimization
  images: {
    unoptimized: true,  // Enable/disable as needed
  },
  
  // Production build optimization
  swcMinify: true,
  
  // Code splitting
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*'],
  }
}
```

## Development Guidelines

### Code Organization

```
components/
├── ui/              # Generic UI components (no business logic)
├── views/           # View components (page-level)
├── charts/          # Chart components
├── documentation/   # Documentation components
└── *.tsx           # Business components

lib/
├── types.ts        # Type definitions
├── task-store.ts   # State management
├── data.ts         # Data definitions
├── mock.ts         # Mock data
└── utils.ts        # Utility functions

hooks/
├── use-*.ts        # Custom hooks

app/
├── layout.tsx      # Root layout
├── page.tsx        # Home page
└── globals.css     # Global styles
```

### Naming Conventions

```typescript
// Components: PascalCase
const TaskManagementTable = () => {}

// Functions/variables: camelCase
const handleTaskUpdate = () => {}
const isActive = true

// Constants: UPPER_SNAKE_CASE
const MAX_TASKS = 100

// Types/interfaces: PascalCase
interface Task {}
type TaskStatus = "pending" | "in-progress"

// File names: kebab-case
task-management-table.tsx
use-local-storage.ts
```

### TypeScript Usage

```typescript
// Strict type definitions
interface Task {
  id: string
  // ...other fields
}

// Use type inference
const tasks = useTaskStore(state => state.data.tasks)  // Automatically inferred as Task[]

// Generic usage
const updateField = <T extends FieldType>(
  fieldId: string,
  value: FieldValueMap[T]
) => {}

// Avoid any, use unknown
const parseData = (data: unknown) => {
  if (isTask(data)) {
    // Type guard
    return data
  }
}
```

### Component Writing Guidelines

```typescript
// 1. Import order
import React from 'react'                    // React related
import { Button } from '@/components/ui'     // UI components
import { useTaskStore } from '@/lib/store'   // Store
import type { Task } from '@/lib/types'      // Types
import { cn } from '@/lib/utils'             // Utils

// 2. Component definition
interface TaskRowProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, onUpdate }) => {
  // 3. Hooks (fixed order)
  const [isEditing, setIsEditing] = useState(false)
  const updateTask = useTaskStore(state => state.updateTask)
  
  // 4. Event handlers
  const handleClick = useCallback(() => {
    setIsEditing(true)
  }, [])
  
  // 5. Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  )
}
```

### Style Guidelines

```typescript
// Use Tailwind CSS atomic classes
<div className="flex items-center gap-2 px-4 py-2">

// Use cn utility to merge class names
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>

// Dynamic styles use style attribute
<div style={{ width: `${width}px` }}>

// Complex styles use CSS modules (if needed)
import styles from './task-row.module.css'
```

### State Management Guidelines

```typescript
// Use immutable updates in Store
set((state) => ({
  ...state,
  data: {
    ...state.data,
    tasks: [...state.data.tasks, newTask]
  }
}))

// Use produce (immer) for complex state updates
set(produce((draft) => {
  draft.data.tasks.push(newTask)
}))

// Avoid direct state mutation
state.data.tasks.push(newTask)  // ✗ Wrong
set({ data: { ...state.data, tasks: [...tasks, newTask] }})  // ✓ Correct
```

### Error Handling

```typescript
// Use try-catch for async operations
const importTasks = async (file: File) => {
  try {
    const data = await parseFile(file)
    addMultipleTasks(data)
    toast({ title: "Import successful" })
  } catch (error) {
    toast({
      title: "Import failed",
      description: error.message,
      variant: "destructive"
    })
  }
}

// Type guards
const isTask = (data: unknown): data is Task => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'description' in data
  )
}
```

### Performance Considerations

```typescript
// ✓ Use useCallback to cache callbacks
const handleClick = useCallback(() => {
  doSomething()
}, [dependencies])

// ✓ Use useMemo to cache computations
const filteredTasks = useMemo(() => {
  return tasks.filter(filterFn)
}, [tasks, filterFn])

// ✓ Selective Store subscription
const tasks = useTaskStore(state => state.tasks)

// ✗ Avoid creating functions in loops
{tasks.map(task => (
  <div onClick={() => handleClick(task.id)}>  // ✗ Creates new function each render
))}

// ✓ Correct approach
{tasks.map(task => (
  <TaskRow task={task} onClick={handleClick} />  // ✓ Pass stable reference
))}
```

## Extension Suggestions

### Future Features to Consider

1. **Backend Integration**
   - RESTful API or GraphQL
   - Database persistence (PostgreSQL/MongoDB)
   - User authentication and authorization

2. **Collaboration Features**
   - Real-time collaboration (WebSocket)
   - Comments and discussions
   - Change history

3. **Advanced Features**
   - Gantt chart view
   - Timeline view
   - Workflow automation
   - Notification system

4. **Performance Optimization**
   - Virtual scrolling
   - Pagination
   - Server-side rendering optimization

5. **Mobile Optimization**
   - PWA support
   - Native app (React Native)
   - Touch gesture optimization

## Summary

pxcharts is a technologically advanced, architecturally clear modern multi-dimensional table application. Through reasonable layered design, powerful state management, smooth drag and drop interactions, and meticulous performance optimization, it provides users with an excellent user experience.

**Core Advantages:**
- 🏗️ Clear modular architecture
- ⚡ High-performance state management
- 🎨 Elegant UI design
- 🔧 Complete type system
- 📱 Responsive adaptation
- 🚀 Strong extensibility

---

> Last updated: 2025-12-23
> Version: 1.0.0
