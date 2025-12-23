"use client"
import { useState } from "react"
import { useEffect } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, Calendar, CheckCircle, Move, GripVertical } from "lucide-react"
import type { TaskData, Task, User } from "@/lib/types"
import { useTaskStore } from "@/lib/task-store"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "@/components/sortable-item"
import { DroppableContainer } from "@/components/droppable-container"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface KanbanBoardProps {
  data: TaskData
  onTaskClick: (task: Task) => void
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
  onAddTask?: (task: Partial<Task>) => void
}

export function KanbanBoard({ data, onTaskClick, onTaskUpdate, onAddTask }: KanbanBoardProps) {
  const { toast } = useToast()
  const { moveTask } = useTaskStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    description: "",
    summary: "",
    status: "待开始",
    priority: "重要紧急",
    startDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
    isDelayed: false,
    completed: false,
  })
  // 用于存储任务移动信息的状态，避免在渲染期间调用toast
  const [taskMoveInfo, setTaskMoveInfo] = useState<{
    taskId: string | null
    description: string
    fromStatus: string
    toStatus: string
  } | null>(null)

  // 新增：用于存储需要更新的任务信息，避免在渲染期间调用updateTask
  const [taskUpdateInfo, setTaskUpdateInfo] = useState<{
    taskId: string
    updates: Partial<Task>
  } | null>(null)

  const [tasks, setTasks] = useState(() => {
    // 将任务按状态分组
    const tasksByStatus = {
      已停滞: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "已停滞")),
      待开始: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "待开始")),
      进行中: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "进行中")),
      已完成: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "已完成")),
    }

    // 添加一些已停滞的任务（示例数据中没有）
    if (tasksByStatus.已停滞.length === 0) {
      tasksByStatus.已停滞 = [
        {
          id: "10",
          description: "提升员工培训",
          summary: "1. 任务执行人黄泡泡正在处理其它事情，任务已停滞。 2. 任务预计���下周恢复。",
          assignee: {
            id: "huangpaopu",
            name: "黄泡泡",
          },
          status: "已停滞",
          startDate: "2024/10/15",
          isDelayed: true,
          completed: false,
          priority: "重要不紧急",
        },
      ]
    }

    return tasksByStatus
  })

  // 使用useEffect来显示任务移动的toast通知，避免在渲染期间调用toast
  useEffect(() => {
    if (taskMoveInfo && taskMoveInfo.taskId) {
      toast({
        title: "任务状态已更新",
        description: `"${taskMoveInfo.description}" 已移动到 ${taskMoveInfo.toStatus}`,
      })
      // 重置状态，避免重复显示
      setTaskMoveInfo(null)
    }
  }, [taskMoveInfo, toast])

  // 新增：使用useEffect来处理任务更新，避免在渲染期间调用updateTask
  useEffect(() => {
    if (taskUpdateInfo) {
      // 延迟执行moveTask，确保它在渲染完成后执行
      const timer = setTimeout(() => {
        moveTask(taskUpdateInfo.taskId, taskUpdateInfo.updates.status as Task["status"])
        setTaskUpdateInfo(null)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [taskUpdateInfo, moveTask])

  // 从所有任务中提取唯一的用户
  const users: User[] = Array.from(
      new Map(
          data.priorityGroups.flatMap((group) => group.tasks).map((task) => [task.assignee.id, task.assignee]),
      ).values(),
  )

  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
  )

  const findContainer = (id: string) => {
    if (id in tasks) return id

    return Object.keys(tasks).find((key) => tasks[key as keyof typeof tasks].some((task) => task.id === id))
  }

  const getTaskById = (id: string) => {
    const container = findContainer(id)
    if (!container) return null

    const taskGroup = tasks[container as keyof typeof tasks]
    return taskGroup.find((task) => task.id === id) || null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeContainer = findContainer(active.id as string)
    const overContainer = findContainer(over.id as string)

    if (!activeContainer || !overContainer) {
      setActiveId(null)
      return
    }

    // 如果是在同一列内拖拽（上下排序）
    if (activeContainer === overContainer) {
      const activeIndex = tasks[activeContainer as keyof typeof tasks].findIndex((item) => item.id === active.id)
      const overIndex = tasks[overContainer as keyof typeof tasks].findIndex((item) => item.id === over.id)

      if (activeIndex !== overIndex) {
        setTasks((prev) => {
          const result = { ...prev }
          const column = [...prev[activeContainer as keyof typeof prev]]
          const [removed] = column.splice(activeIndex, 1)
          column.splice(overIndex, 0, removed)
          result[activeContainer as keyof typeof prev] = column

          // 使用taskMoveInfo而不是直接调用toast
          setTaskMoveInfo({
            taskId: removed.id,
            description: removed.description,
            fromStatus: activeContainer,
            toStatus: activeContainer,
          })

          return result
        })
      }
      setActiveId(null)
      return
    }

    // 如果是跨列拖拽（左右移动）
    setTasks((prev) => {
      const activeItems = prev[activeContainer as keyof typeof prev]
      const overItems = prev[overContainer as keyof typeof prev]

      // 找到被拖拽的任务
      const activeIndex = activeItems.findIndex((item) => item.id === active.id)
      const activeTask = activeItems[activeIndex]

      // 更新任务状态
      const updatedTask = { ...activeTask, status: overContainer as Task["status"] }

      // 如果是移动到"已完成"状态，自动设置completed为true
      if (overContainer === "已完成") {
        updatedTask.completed = true
        updatedTask.actualEndDate = new Date().toISOString().split("T")[0].replace(/-/g, "/")
      } else if (activeContainer === "已完成") {
        // 如果从"已完成"移出，设置completed为false
        updatedTask.completed = false
        updatedTask.actualEndDate = undefined
      }

      // 更新状态
      const result = {
        ...prev,
        [activeContainer]: [...prev[activeContainer as keyof typeof prev]].filter((item) => item.id !== active.id),
        [overContainer]: [...prev[overContainer as keyof typeof prev], updatedTask],
      }

      // 调用外部更新函数（如果提供）
      if (onTaskUpdate) {
        // 使用setTimeout确保在渲染完成后调用
        setTimeout(() => {
          onTaskUpdate(activeTask.id, {
            status: overContainer as Task["status"],
            completed: updatedTask.completed,
          })
        }, 0)
      }

      // 不再直接调用moveTask，而是通过状态更新
      setTaskUpdateInfo({
        taskId: activeTask.id,
        updates: {
          status: overContainer as Task["status"],
          completed: updatedTask.completed,
          actualEndDate: updatedTask.actualEndDate,
        },
      })

      // 使用taskMoveInfo而不是直接调用toast
      setTaskMoveInfo({
        taskId: activeTask.id,
        description: activeTask.description,
        fromStatus: activeContainer,
        toStatus: overContainer,
      })

      return result
    })

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeTask = activeId ? getTaskById(activeId) : null

  const handleAddTask = () => {
    if (!newTask.description || !newTask.assignee) {
      // 这个toast调用是在事件处理函数中，所以是安全的
      toast({
        title: "添加失败",
        description: "任务描述和执行人不能为空",
        variant: "destructive",
      })
      return
    }

    if (onAddTask) {
      const taskWithStatus = {
        ...newTask,
        status: isAddTaskDialogOpen as Task["status"],
      }

      // 使用setTimeout确保在渲染完成后调用
      setTimeout(() => {
        onAddTask(taskWithStatus)
      }, 0)

      // 更新本地状态
      setTasks((prev) => ({
        ...prev,
        [isAddTaskDialogOpen as string]: [
          ...prev[isAddTaskDialogOpen as keyof typeof prev],
          {
            id: `new-${Date.now()}`,
            ...(taskWithStatus as Task),
          },
        ],
      }))

      // 这个toast调用是在事件处理函数中，所以是安全的
      toast({
        title: "添加成功",
        description: `已添加任务: ${newTask.description}`,
      })
      setIsAddTaskDialogOpen(null)
      setNewTask({
        description: "",
        summary: "",
        status: "待开始",
        priority: "重要紧急",
        startDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
        isDelayed: false,
        completed: false,
      })
    }
  }

  // 更新看板数据
  useEffect(() => {
    setTasks({
      已停滞: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "已停滞")),
      待开始: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "待开始")),
      进行中: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "进行中")),
      已完成: data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.status === "已完成")),
    })
  }, [data])

  return (
      <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
      >
        <div className="flex-1 overflow-hidden flex flex-col h-full">
          <div className="flex h-full overflow-x-auto">
            {/* 已停滞 */}
            <DroppableContainer id="已停滞">
              <KanbanColumn
                  title="已停滞"
                  count={tasks.已停滞.length}
                  tasks={tasks.已停滞}
                  onTaskClick={onTaskClick}
                  colorClass="bg-gray-200"
                  onAddClick={() => setIsAddTaskDialogOpen("已停滞")}
              />
            </DroppableContainer>

            {/* 待开始 */}
            <DroppableContainer id="待开始">
              <KanbanColumn
                  title="待开始"
                  count={tasks.待开始.length}
                  tasks={tasks.待开始}
                  onTaskClick={onTaskClick}
                  colorClass="bg-red-100"
                  onAddClick={() => setIsAddTaskDialogOpen("待开始")}
              />
            </DroppableContainer>

            {/* 进行中 */}
            <DroppableContainer id="进行中">
              <KanbanColumn
                  title="进行中"
                  count={tasks.进行中.length}
                  tasks={tasks.进行中}
                  onTaskClick={onTaskClick}
                  colorClass="bg-yellow-100"
                  onAddClick={() => setIsAddTaskDialogOpen("进行中")}
              />
            </DroppableContainer>

            {/* 已完成 */}
            <DroppableContainer id="已完成">
              <KanbanColumn
                  title="已完成"
                  count={tasks.已完成.length}
                  tasks={tasks.已完成}
                  onTaskClick={onTaskClick}
                  colorClass="bg-green-100"
                  onAddClick={() => setIsAddTaskDialogOpen("已完成")}
              />
            </DroppableContainer>

            {/* 新建分组按钮 */}
            {/*<div className="w-10 flex-shrink-0 p-2">*/}
            {/*  <Button*/}
            {/*      variant="ghost"*/}
            {/*      className="w-full h-full flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"*/}
            {/*  >*/}
            {/*    <Plus className="h-5 w-5" />*/}
            {/*    <span className="ml-1">新建分组</span>*/}
            {/*  </Button>*/}
            {/*</div>*/}
          </div>
        </div>

        <DragOverlay>
          {activeId && activeTask ? (
              <div className="bg-white rounded-md border border-gray-200 shadow-md p-3 w-[280px] opacity-90">
                <h3 className="font-medium text-sm mb-2 flex items-center">
                  <Move className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                  {activeTask.description}
                </h3>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-xs">
                    <span className="text-gray-500 mr-1">任务执行人:</span>
                    <div className="flex items-center">
                      <Avatar className="h-4 w-4 mr-1">
                        <AvatarFallback
                            className={`
                        ${
                                activeTask.assignee.id === "zhoubeihe"
                                    ? "bg-purple-500"
                                    : activeTask.assignee.id === "huangpaopu"
                                        ? "bg-teal-500"
                                        : "bg-orange-500"
                            } text-white text-[8px]
                      `}
                        >
                          {activeTask.assignee.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{activeTask.assignee.name}</span>
                    </div>
                  </div>
                </div>
              </div>
          ) : null}
        </DragOverlay>

        {/* 添加任务对话框 */}
        <Dialog open={!!isAddTaskDialogOpen} onOpenChange={(open) => !open && setIsAddTaskDialogOpen(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>添加新任务到 {isAddTaskDialogOpen}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-description" className="text-right">
                  任务描述
                </Label>
                <Input
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="col-span-3"
                    placeholder="请输入任务描述"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-summary" className="text-right">
                  任务情况总结
                </Label>
                <Textarea
                    id="task-summary"
                    value={newTask.summary}
                    onChange={(e) => setNewTask({ ...newTask, summary: e.target.value })}
                    className="col-span-3"
                    placeholder="请输入任务情况总结"
                    rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-assignee" className="text-right">
                  任务执行人
                </Label>
                <Select
                    value={newTask.assignee?.id}
                    onValueChange={(value) => {
                      const selectedUser = users.find((user) => user.id === value)
                      if (selectedUser) {
                        setNewTask({ ...newTask, assignee: selectedUser })
                      }
                    }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择执行人" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center">
                            <Avatar className="h-4 w-4 mr-2">
                              <AvatarFallback
                                  className={`
                              ${
                                      user.id === "zhoubeihe"
                                          ? "bg-purple-500"
                                          : user.id === "huangpaopu"
                                              ? "bg-teal-500"
                                              : "bg-orange-500"
                                  } text-white text-[8px]
                            `}
                              >
                                {user.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-priority" className="text-right">
                  优先级
                </Label>
                <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="重要紧急">重要紧急</SelectItem>
                    <SelectItem value="紧急不重要">紧急不重要</SelectItem>
                    <SelectItem value="重要不紧急">重要不紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-start-date" className="text-right">
                  开始日期
                </Label>
                <Input
                    id="task-start-date"
                    type="date"
                    value={newTask.startDate?.replace(/\//g, "-")}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value.replace(/-/g, "/") })}
                    className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-expected-end-date" className="text-right">
                  预计完成日期
                </Label>
                <Input
                    id="task-expected-end-date"
                    type="date"
                    value={newTask.expectedEndDate?.replace(/\//g, "-")}
                    onChange={(e) => setNewTask({ ...newTask, expectedEndDate: e.target.value.replace(/-/g, "/") })}
                    className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(null)}>
                取消
              </Button>
              <Button onClick={handleAddTask}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DndContext>
  )
}

interface KanbanColumnProps {
  title: string
  count: number
  tasks: Task[]
  onTaskClick: (task: Task) => void
  colorClass: string
  onAddClick: () => void
}

function KanbanColumn({ title, count, tasks, onTaskClick, colorClass, onAddClick }: KanbanColumnProps) {
  return (
      <div className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col h-full">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <Badge className={`${colorClass} border-0 text-gray-800 mr-2 badge-hover-effect`}>{title}</Badge>
            <span className="text-sm text-gray-500">{count}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-2 space-y-3 pb-4">
              <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                    <SortableItem key={task.id} id={task.id}>
                      <KanbanCard task={task} onClick={() => onTaskClick(task)} />
                    </SortableItem>
                ))}
              </SortableContext>
              <Button
                  variant="ghost"
                  className="w-full h-12 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"
                  onClick={onAddClick}
              >
                <Plus className="h-4 w-4 mr-1" />
                添加任务
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>
  )
}

interface KanbanCardProps {
  task: Task
  onClick: () => void
}

function KanbanCard({ task, onClick }: KanbanCardProps) {
  return (
      <div
          className="bg-white rounded-md border border-gray-200 shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow relative"
          onClick={onClick}
      >
        <div className="absolute top-3 left-1 cursor-move touch-none opacity-50 hover:opacity-100">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <h3 className="font-medium text-sm mb-2 pl-5">{task.description}</h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs">
            <span className="text-gray-500 mr-1">是否延期:</span>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">正常</span>
            </div>
          </div>

          <div className="flex items-center text-xs">
            <span className="text-gray-500 mr-1">任务执行人:</span>
            <div className="flex items-center">
              <Avatar className="h-4 w-4 mr-1">
                <AvatarFallback
                    className={`
                  ${
                        task.assignee.id === "zhoubeihe"
                            ? "bg-purple-500"
                            : task.assignee.id === "huangpaopu"
                                ? "bg-teal-500"
                                : "bg-orange-500"
                    } text-white text-[8px]
                `}
                >
                  {task.assignee.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span>{task.assignee.name}</span>
            </div>
          </div>

          {task.expectedEndDate && (
              <div className="flex items-center text-xs">
                <span className="text-gray-500 mr-1">预计完成日期:</span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{task.expectedEndDate}</span>
                </div>
              </div>
          )}

          <div className="flex items-center text-xs">
            <span className="text-gray-500 mr-1">重要紧急程度:</span>
            <Badge
                className={`
              badge-hover-effect
              ${
                    task.priority === "重要紧急"
                        ? "bg-red-100 text-red-800 border-red-300 badge-priority-urgent"
                        : task.priority === "紧急不重要"
                            ? "bg-orange-100 text-orange-800 border-orange-300 badge-priority-important"
                            : "bg-yellow-100 text-yellow-800 border-yellow-300 badge-priority-normal"
                } text-[10px] py-0 px-1 h-4
            `}
            >
              {task.priority}
            </Badge>
          </div>
        </div>

        <div className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line max-h-20 overflow-y-auto">
          <span className="font-medium">任务情况总结:</span>
          <p className="mt-1">{task.summary}</p>
        </div>
      </div>
  )
}
