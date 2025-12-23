export interface User {
  id: string
  name: string
  avatar?: string
  role?: string
  department?: string
}

export interface Task {
  id: string
  description: string
  summary: string
  assignee: User
  status: "待开始" | "进行中" | "已完成" | "已停滞"
  startDate: string
  expectedEndDate?: string
  actualEndDate?: string
  isDelayed: boolean
  completed: boolean
  priority: "重要紧急" | "紧急不重要" | "重要不紧急"
  customFields?: Record<string, CustomFieldValue> // 新增：自定义字段
}

export interface PriorityGroup {
  id: string
  name: string
  tasks: Task[]
}

export interface TaskData {
  priorityGroups: PriorityGroup[]
}

// 新增：视图配置类型
export interface ViewConfig {
  rowHeight: "低" | "中等" | "高" | "超高"
  editMode: boolean
  expandedGroups: Record<string, boolean>
  expandedTasks: Record<string, boolean>
  headerDraggable: boolean // 新增：控制表头是否可拖拽
}

// 新增：筛选配置类型
export interface FilterConfig {
  status: string | null
  priority: string | null
  assignee: string | null
  dateRange: {
    start?: string
    end?: string
  } | null
  isActive: boolean
}

// 新增：排序配置类型
export interface SortConfig {
  field: string | null
  direction: "asc" | "desc"
  isActive: boolean
}

// 添加字段类型定义
export type FieldType = "文本" | "数值" | "标签" | "单选" | "复选" | "富文本" | "图片"

// 扩展字段配置类型
export interface FieldConfig {
  id: string
  name: string
  visible: boolean
  width: number // 添加默认宽度属性
  type: FieldType // 添加字段类型
  options?: string[] // 用于单选和复选类型的选项
}

// 添加自定义字段值类型
export interface CustomFieldValue {
  type: FieldType
  value: any
}

export type TaskStatus = "待开始" | "进行中" | "已完成" | "已停滞"
export type TaskPriority = "重要紧急" | "紧急不重要" | "重要不紧急"
