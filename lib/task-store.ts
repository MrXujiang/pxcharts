"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { TaskData, Task, User, PriorityGroup, FilterConfig, SortConfig, ViewConfig, FieldType } from "@/lib/types"
import { initialData } from "@/lib/data"

// 在初始化visibleFields时添加默认宽度
const initialVisibleFields = [
  { id: "description", name: "任务描述", visible: true, width: 240, type: "文本" as FieldType },
  { id: "summary", name: "任务情况总结", visible: true, width: 240, type: "文本" as FieldType },
  { id: "assignee", name: "任务执行人", visible: true, width: 120, type: "单选" as FieldType },
  { id: "status", name: "进展状态", visible: true, width: 100, type: "标签" as FieldType },
  { id: "priority", name: "优先级", visible: true, width: 100, type: "标签" as FieldType },
  { id: "startDate", name: "开始日期", visible: true, width: 120, type: "文本" as FieldType },
  { id: "expectedEndDate", name: "预计完成日期", visible: true, width: 120, type: "文本" as FieldType },
  { id: "isDelayed", name: "是否延期", visible: true, width: 100, type: "复选" as FieldType },
  { id: "actualEndDate", name: "实际完成日期", visible: true, width: 120, type: "文本" as FieldType },
  { id: "completed", name: "最终状态", visible: true, width: 100, type: "复选" as FieldType },
]

interface TaskStore {
  data: TaskData
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredData: TaskData
  addTask: (task: Task) => void
  addMultipleTasks: (tasks: Task[]) => void // 新增批量添加任务方法
  updateTask: (taskId: string, updates: Partial<Task>) => void
  addUser: (user: User) => void
  moveTask: (taskId: string, newStatus: Task["status"]) => void
  reorderTasks: (priorityGroupId: string, oldIndex: number, newIndex: number, targetGroupId?: string) => void

  // 视图配置
  viewConfig: ViewConfig
  updateViewConfig: (updates: Partial<ViewConfig>) => void

  // 筛选配置
  filterConfig: FilterConfig
  setFilterConfig: (config: FilterConfig) => void
  applyFilters: () => void

  // 排序配置
  sortConfig: SortConfig
  setSortConfig: (config: SortConfig) => void
  applySorting: () => void

  // 分组配置
  groupBy: string
  setGroupBy: (field: string) => void
  regroupData: () => TaskData

  // 字段配置
  visibleFields: { id: string; name: string; visible: boolean; width: number; type: FieldType; options?: string[] }[]
  setVisibleFields: (
      fields: { id: string; name: string; visible: boolean; width: number; type: FieldType; options?: string[] }[],
  ) => void
  updateFieldWidth: (fieldId: string, width: number) => void

  // 表头顺序
  headerOrder: string[]
  setHeaderOrder: (order: string[]) => void
  reorderHeaders: (oldIndex: number, newIndex: number) => void

  // 添加删除用户方法
  deleteUser: (userId: string) => void

  // 添加重新排序用户方法
  reorderUsers: (oldIndex: number, newIndex: number) => void

  // 添加获取已排序用户的方法
  getSortedUsers: () => User[]

  // 添加用户顺序存储
  userOrder: string[]
  setUserOrder: (userIds: string[]) => void

  // 添加字段相关方法
  addField: (field: { id: string; name: string; type: FieldType; options?: string[] }) => void
  updateFieldType: (fieldId: string, type: FieldType) => void

  // 添加自定义字段值方法
  updateTaskCustomField: (taskId: string, fieldId: string, value: any) => void
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
          data: initialData,
          searchQuery: "",

          // 视图配置
          viewConfig: {
            rowHeight: "中等",
            editMode: false,
            expandedGroups: {
              重要紧急: true,
              紧急不重要: true,
              重要不紧急: true,
            },
            expandedTasks: {},
            headerDraggable: false, // 默认不启用表头拖拽
          },

          updateViewConfig: (updates) => {
            set((state) => ({
              viewConfig: {
                ...state.viewConfig,
                ...updates,
              },
            }))
          },

          // 筛选配置
          filterConfig: {
            status: null,
            priority: null,
            assignee: null,
            dateRange: null,
            isActive: false,
          },

          setFilterConfig: (config) => {
            set({ filterConfig: config })
            get().applyFilters()
          },

          // 排序配置
          sortConfig: {
            field: null,
            direction: "asc",
            isActive: false,
          },

          setSortConfig: (config) => {
            set({ sortConfig: config })
            get().applySorting()
          },

          // 分组配置
          groupBy: "priority", // 默认按优先级分组

          setGroupBy: (field) => {
            set({ groupBy: field })
            const regroupedData = get().regroupData()
            set({ filteredData: regroupedData })
          },

          // 可见字段
          visibleFields: initialVisibleFields,

          // 表头顺序
          headerOrder: initialVisibleFields.filter((f) => f.visible).map((f) => f.id),

          setHeaderOrder: (order) => {
            set({ headerOrder: order })
          },

          reorderHeaders: (oldIndex, newIndex) => {
            set((state) => {
              const items = Array.from(state.headerOrder)
              const [reorderedItem] = items.splice(oldIndex, 1)
              items.splice(newIndex, 0, reorderedItem)

              return { headerOrder: items }
            })
          },

          setVisibleFields: (fields) => {
            set({ visibleFields: fields })
          },

          setSearchQuery: (query: string) => {
            set((state) => {
              const filtered = filterData(state.data, query, state.filterConfig)
              return {
                searchQuery: query,
                filteredData: filtered,
              }
            })
          },

          filteredData: initialData,

          addTask: (task: Task) => {
            set((state) => {
              const newData = { ...state.data }
              const targetGroupId = task.priority
              const groupIndex = newData.priorityGroups.findIndex((group) => group.id === targetGroupId)

              if (groupIndex !== -1) {
                newData.priorityGroups[groupIndex].tasks = [...newData.priorityGroups[groupIndex].tasks, task]
              } else if (newData.priorityGroups.length > 0) {
                newData.priorityGroups[0].tasks = [...newData.priorityGroups[0].tasks, task]
              }

              const filtered = filterData(newData, state.searchQuery, state.filterConfig)
              return {
                data: newData,
                filteredData: filtered,
              }
            })
          },

          // 添加 addMultipleTasks 方法到 useTaskStore 中
          // 在 addTask 方法后添加以下代码:

          // 批量添加任务
          addMultipleTasks: (tasks: Task[]) => {
            set((state) => {
              const newState = { ...state }

              // 为每个任务分配到对应的优先级组
              tasks.forEach((task) => {
                const priorityGroup = newState.data.priorityGroups.find((group) => group.id === task.priority)

                if (priorityGroup) {
                  // 确保任务ID唯一
                  if (!task.id || newState.data.priorityGroups.some((g) => g.tasks.some((t) => t.id === task.id))) {
                    task.id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                  }

                  priorityGroup.tasks.push(task)
                }
              })

              // 应用过滤和排序
              applyFiltersAndSort(newState)

              return newState
            })
          },

          updateTask: (taskId: string, updates: Partial<Task>) => {
            set((state) => {
              const newData = JSON.parse(JSON.stringify(state.data))

              for (const group of newData.priorityGroups) {
                const taskIndex = group.tasks.findIndex((task: Task) => task.id === taskId)
                if (taskIndex !== -1) {
                  group.tasks[taskIndex] = { ...group.tasks[taskIndex], ...updates }
                  break
                }
              }

              const filtered = filterData(newData, state.searchQuery, state.filterConfig)
              return {
                data: newData,
                filteredData: filtered,
              }
            })
          },

          // 添加用户顺序字段
          userOrder: [],

          setUserOrder: (userIds: string[]) => {
            set({ userOrder: userIds })
          },

          deleteUser: (userId: string) => {
            set((state) => {
              const newData = JSON.parse(JSON.stringify(state.data))

              // 从每个优先级组中移除该用户的任务
              for (const group of newData.priorityGroups) {
                group.tasks = group.tasks.filter((task: Task) => task.assignee.id !== userId)
              }

              // 更新用户顺序
              const newUserOrder = state.userOrder.filter((id) => id !== userId)

              const filtered = filterData(newData, state.searchQuery, state.filterConfig)
              return {
                data: newData,
                filteredData: filtered,
                userOrder: newUserOrder,
              }
            })
          },

          reorderUsers: (oldIndex: number, newIndex: number) => {
            set((state) => {
              const newUserOrder = [...state.userOrder]
              const [removed] = newUserOrder.splice(oldIndex, 1)
              newUserOrder.splice(newIndex, 0, removed)

              return { userOrder: newUserOrder }
            })
          },

          getSortedUsers: () => {
            const state = get()
            const allUsers = Array.from(
                new Map(
                    state.data.priorityGroups.flatMap((group) => group.tasks).map((task) => [task.assignee.id, task.assignee]),
                ).values(),
            )

            // 如果有存储的用户顺序，按照该顺序排序
            if (state.userOrder.length > 0) {
              // 创建一个映射以加快查询速度
              const userMap = new Map(allUsers.map((user) => [user.id, user]))

              // 按存储的顺序排序，并添加那些可能不在顺序中但存在的用户
              const orderedUsers = [
                ...state.userOrder.filter((id) => userMap.has(id)).map((id) => userMap.get(id)!),
                ...allUsers.filter((user) => !state.userOrder.includes(user.id)),
              ]

              return orderedUsers
            }

            // 如果没有存储的顺序，返回原始用户列表
            return allUsers
          },

          addUser: (user: User) => {
            set((state) => {
              // 检查用户是否已存在
              const existingUsers = state.data.priorityGroups
                  .flatMap((group) => group.tasks)
                  .map((task) => task.assignee.id)

              if (existingUsers.includes(user.id)) {
                return state // 用户已存在，不做更改
              }

              // 创建一个空任务来确保用户显示在列表中
              const emptyTask: Task = {
                id: `empty-task-${Date.now()}-${user.id}`,
                description: "欢迎使用任务管理系统",
                summary: "这是一个示例任务，您可以添加更多任务或删除此任务。",
                assignee: user,
                status: "待开始",
                startDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
                expectedEndDate: undefined,
                actualEndDate: undefined,
                isDelayed: false,
                completed: false,
                priority: "重要紧急",
              }

              // 找到对应的优先级组
              const newData = { ...state.data }
              const groupIndex = newData.priorityGroups.findIndex((group) => group.id === "重要紧急")

              if (groupIndex !== -1) {
                newData.priorityGroups[groupIndex].tasks = [...newData.priorityGroups[groupIndex].tasks, emptyTask]
              } else if (newData.priorityGroups.length > 0) {
                newData.priorityGroups[0].tasks = [...newData.priorityGroups[0].tasks, emptyTask]
              }

              // 将新用户添加到用户顺序中
              const newUserOrder = [...state.userOrder, user.id]

              const filtered = filterData(newData, state.searchQuery, state.filterConfig)
              return {
                data: newData,
                filteredData: filtered,
                userOrder: newUserOrder,
              }
            })
          },

          moveTask: (taskId: string, newStatus: Task["status"]) => {
            set((state) => {
              const newData = JSON.parse(JSON.stringify(state.data))
              let taskToUpdate: Task | null = null
              let taskGroup: PriorityGroup | null = null
              let taskIndex = -1

              // 找到要移动的任务
              for (const group of newData.priorityGroups) {
                const index = group.tasks.findIndex((task: Task) => task.id === taskId)
                if (index !== -1) {
                  taskToUpdate = { ...group.tasks[index] }
                  taskGroup = group
                  taskIndex = index
                  break
                }
              }

              if (taskToUpdate && taskGroup) {
                // 更新任务状态
                taskToUpdate.status = newStatus

                // 如果移动到"已完成"状态，自动设置completed为true
                if (newStatus === "已完成") {
                  taskToUpdate.completed = true
                  taskToUpdate.actualEndDate = new Date().toISOString().split("T")[0].replace(/-/g, "/")
                } else if (taskToUpdate.status === "已完成") {
                  // 如果从"已完成"移出，设置completed为false
                  taskToUpdate.completed = false
                  taskToUpdate.actualEndDate = undefined
                }

                // 更新任务
                taskGroup.tasks[taskIndex] = taskToUpdate
              }

              const filtered = filterData(newData, state.searchQuery, state.filterConfig)
              return {
                data: newData,
                filteredData: filtered,
              }
            })
          },

          // 修改reorderTasks方法以支持跨优先级组拖拽
          reorderTasks: (priorityGroupId: string, oldIndex: number, newIndex: number, targetGroupId?: string) => {
            set((state) => {
              const newData = JSON.parse(JSON.stringify(state.data))

              // 找到源组和目标组
              const sourceGroupIndex = newData.priorityGroups.findIndex((group) => group.id === priorityGroupId)

              // 如果没有找到源组，直接返回
              if (sourceGroupIndex === -1) return state

              // 获取要移动的任务
              const [taskToMove] = newData.priorityGroups[sourceGroupIndex].tasks.splice(oldIndex, 1)

              // 如果有目标组ID且与源组不同（跨优先级拖拽）
              if (targetGroupId && targetGroupId !== priorityGroupId) {
                // 更新任务的优先级
                taskToMove.priority = targetGroupId

                // 找到目标组并插入任务
                const targetGroupIndex = newData.priorityGroups.findIndex((group) => group.id === targetGroupId)

                if (targetGroupIndex !== -1) {
                  // 确保不会越界
                  const insertAt = Math.min(newIndex, newData.priorityGroups[targetGroupIndex].tasks.length)
                  newData.priorityGroups[targetGroupIndex].tasks.splice(insertAt, 0, taskToMove)
                } else {
                  // 如果找不到目标组，把任务放回原组
                  newData.priorityGroups[sourceGroupIndex].tasks.splice(oldIndex, 0, taskToMove)
                }
              } else {
                // 同一组内拖拽，直接插入
                newData.priorityGroups[sourceGroupIndex].tasks.splice(newIndex, 0, taskToMove)
              }

              const filtered = filterData(newData, state.searchQuery, state.filterConfig)
              return {
                data: newData,
                filteredData: filtered,
              }
            })
          },

          // 应用筛选
          applyFilters: () => {
            set((state) => {
              const filteredData = filterData(state.data, state.searchQuery, state.filterConfig)
              return { filteredData }
            })
          },

          // 应用排序
          applySorting: () => {
            set((state) => {
              const sortedData = JSON.parse(JSON.stringify(state.filteredData))

              if (state.sortConfig.isActive && state.sortConfig.field) {
                for (const group of sortedData.priorityGroups) {
                  group.tasks = sortTasks(group.tasks, state.sortConfig.field!, state.sortConfig.direction)
                }
              }

              return { filteredData: sortedData }
            })
          },

          // 重新分组数据
          regroupData: () => {
            const { data, groupBy, searchQuery, filterConfig } = get()

            // 如果按优先级分组（默认行为）
            if (groupBy === "priority") {
              return filterData(data, searchQuery, filterConfig)
            }

            // 获取所有任务
            const allTasks = data.priorityGroups.flatMap((group) => group.tasks)

            // 根据选择的字段进行分组
            const groupedTasks: Record<string, Task[]> = {}

            allTasks.forEach((task) => {
              let groupKey = ""

              switch (groupBy) {
                case "status":
                  groupKey = task.status
                  break
                case "assignee":
                  groupKey = task.assignee.name
                  break
                case "completed":
                  groupKey = task.completed ? "已完成" : "进行中"
                  break
                default:
                  groupKey = task.priority
              }

              if (!groupedTasks[groupKey]) {
                groupedTasks[groupKey] = []
              }

              groupedTasks[groupKey].push(task)
            })

            // 创建新的分组结构
            const newGroups: PriorityGroup[] = Object.keys(groupedTasks).map((key) => ({
              id: key,
              name: key,
              tasks: groupedTasks[key],
            }))

            // 创建新的数据结构
            const newData: TaskData = {
              ...data,
              priorityGroups: newGroups,
            }

            return filterData(newData, searchQuery, filterConfig)
          },

          // 更新列宽的方法
          updateFieldWidth: (fieldId: string, width: number) => {
            set((state) => {
              // 确保宽度不小于最小值
              const safeWidth = Math.max(80, width)

              // 更新字段宽度
              const updatedFields = state.visibleFields.map((field) =>
                  field.id === fieldId ? { ...field, width: safeWidth } : field,
              )

              return { visibleFields: updatedFields }
            })
          },

          addField: (field) => {
            set((state) => {
              // 检查字段ID是否已存在
              if (state.visibleFields.some((f) => f.id === field.id)) {
                return state
              }

              // 创建新字段配置
              const newField = {
                id: field.id,
                name: field.name,
                visible: true,
                width: 150, // 默认宽度
                type: field.type,
                options: field.options,
              }

              // 更新字段列表
              const updatedFields = [...state.visibleFields, newField]

              // 更新表头顺序
              const updatedHeaderOrder = [...state.headerOrder, field.id]

              return {
                visibleFields: updatedFields,
                headerOrder: updatedHeaderOrder,
              }
            })
          },

          updateFieldType: (fieldId, type) => {
            set((state) => {
              const updatedFields = state.visibleFields.map((field) => (field.id === fieldId ? { ...field, type } : field))

              return { visibleFields: updatedFields }
            })
          },

          updateTaskCustomField: (taskId, fieldId, value) => {
            set((state) => {
              const newData = JSON.parse(JSON.stringify(state.data))

              // 查找并更新任务
              for (const group of newData.priorityGroups) {
                const taskIndex = group.tasks.findIndex((task) => task.id === taskId)
                if (taskIndex !== -1) {
                  // 确保customFields存在
                  if (!group.tasks[taskIndex].customFields) {
                    group.tasks[taskIndex].customFields = {}
                  }

                  // 更新自定义字段值
                  group.tasks[taskIndex].customFields[fieldId] = {
                    type: state.visibleFields.find((f) => f.id === fieldId)?.type || "文本",
                    value: value,
                  }
                  break
                }
              }

              const filtered = filterData(newData, state.searchQuery, state.filterConfig)
              return {
                data: newData,
                filteredData: filtered,
              }
            })
          },
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
        },
    ),
)

// 筛选数据函数
function filterData(data: TaskData, query: string, filterConfig: FilterConfig): TaskData {
  const filteredData = JSON.parse(JSON.stringify(data))
  const lowerQuery = query.toLowerCase()

  // 应用搜索查询
  filteredData.priorityGroups = filteredData.priorityGroups.map((group) => ({
    ...group,
    tasks: group.tasks.filter(
        (task) =>
            task.description.toLowerCase().includes(lowerQuery) ||
            task.assignee.name.toLowerCase().includes(lowerQuery) ||
            task.summary.toLowerCase().includes(lowerQuery) ||
            task.status.toLowerCase().includes(lowerQuery) ||
            task.priority.toLowerCase().includes(lowerQuery),
    ),
  }))

  // 如果没有激活筛选，直接返回
  if (!filterConfig.isActive) {
    return filteredData
  }

  // 应用筛选条件
  filteredData.priorityGroups = filteredData.priorityGroups.map((group) => ({
    ...group,
    tasks: group.tasks.filter((task) => {
      // 状态筛选
      if (filterConfig.status && task.status !== filterConfig.status) {
        return false
      }

      // 优先级筛选
      if (filterConfig.priority && task.priority !== filterConfig.priority) {
        return false
      }

      // 执行人筛选
      if (filterConfig.assignee && task.assignee.id !== filterConfig.assignee) {
        return false
      }

      // 日期范围筛选
      if (filterConfig.dateRange) {
        const taskDate = new Date(task.startDate.replace(/\//g, "-"))
        const startDate = filterConfig.dateRange.start ? new Date(filterConfig.dateRange.start) : null
        const endDate = filterConfig.dateRange.end ? new Date(filterConfig.dateRange.end) : null

        if (startDate && taskDate < startDate) {
          return false
        }

        if (endDate && taskDate > endDate) {
          return false
        }
      }

      return true
    }),
  }))

  return filteredData
}

// 辅助函数：排序任务
function sortTasks(tasks: Task[], field: string, direction: "asc" | "desc"): Task[] {
  return [...tasks].sort((a, b) => {
    let valueA, valueB

    // 根据字段获取值
    switch (field) {
      case "description":
        valueA = a.description
        valueB = b.description
        break
      case "assignee":
        valueA = a.assignee.name
        valueB = b.assignee.name
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      case "startDate":
        valueA = new Date(a.startDate.replace(/\//g, "-")).getTime()
        valueB = new Date(b.startDate.replace(/\//g, "-")).getTime()
        break
      case "expectedEndDate":
        valueA = a.expectedEndDate
            ? new Date(a.expectedEndDate.replace(/\//g, "-")).getTime()
            : Number.POSITIVE_INFINITY
        valueB = b.expectedEndDate
            ? new Date(b.expectedEndDate.replace(/\//g, "-")).getTime()
            : Number.POSITIVE_INFINITY
        break
      case "actualEndDate":
        valueA = a.actualEndDate ? new Date(a.actualEndDate.replace(/\//g, "-")).getTime() : Number.POSITIVE_INFINITY
        valueB = b.actualEndDate ? new Date(b.actualEndDate.replace(/\//g, "-")).getTime() : Number.POSITIVE_INFINITY
        break
      case "completed":
        valueA = a.completed ? 1 : 0
        valueB = b.completed ? 1 : 0
        break
      default:
        // 处理自定义字段
        if (field.startsWith("custom_")) {
          valueA = a.customFields?.[field]?.value || ""
          valueB = b.customFields?.[field]?.value || ""
        } else {
          valueA = (a as any)[field] || ""
          valueB = (b as any)[field] || ""
        }
    }

    // 比较值
    if (valueA < valueB) {
      return direction === "asc" ? -1 : 1
    }
    if (valueA > valueB) {
      return direction === "asc" ? 1 : -1
    }
    return 0
  })
}

function applyFiltersAndSort(state: any) {
  const filteredData = filterData(state.data, state.searchQuery, state.filterConfig)
  state.filteredData = JSON.parse(JSON.stringify(filteredData))

  if (state.sortConfig.isActive && state.sortConfig.field) {
    for (const group of state.filteredData.priorityGroups) {
      group.tasks = sortTasks(group.tasks, state.sortConfig.field!, state.sortConfig.direction)
    }
  }
}
