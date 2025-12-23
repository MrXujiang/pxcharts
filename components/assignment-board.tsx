"use client"
import { useState, useEffect, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, Calendar, CheckCircle, Trash2, GripVertical } from "lucide-react"
import type { TaskData, Task, User } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTaskStore } from "@/lib/task-store"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TaskDetail } from "./task-detail"

interface AssignmentBoardProps {
  data: TaskData
  onTaskClick: (task: Task) => void
  onAddUser?: (user: User) => void
}

// 添加拖拽相关声明
interface SortableUserColumnProps extends UserColumnProps {
  id: string
}

export function AssignmentBoard({ data, onTaskClick, onAddUser }: AssignmentBoardProps) {
  const { toast } = useToast()
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState<string | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({ id: "", name: "" })
  const [newTask, setNewTask] = useState<Partial<Task>>({
    description: "",
    summary: "",
    status: "待开始",
    priority: "重要紧急",
    startDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
    isDelayed: false,
    completed: false,
  })
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // 从任务存储中获取用户和排序、删除功能以及添加任务功能
  const { getSortedUsers, deleteUser, reorderUsers, userOrder, setUserOrder, addTask } = useTaskStore()

  // 获取已排序的用户列表
  const users = getSortedUsers()

  // 使用 useEffect 初始化用户顺序
  useEffect(() => {
    // 如果用户顺序为空，则使用当前显示的用户顺序初始化
    if (userOrder.length === 0 && users.length > 0) {
      setUserOrder(users.map((user) => user.id))
    }
  }, [users, userOrder.length, setUserOrder])

  // 设置拖放传感器，与表格视图保持一致
  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // 8px 是拖动开始的最小距离
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
  )

  // 将任务按用户分组 - 使用useCallback优化性能
  const getTasksByUser = useCallback(() => {
    return users.reduce<Record<string, Task[]>>((acc, user) => {
      acc[user.id] = data.priorityGroups.flatMap((group) => group.tasks.filter((task) => task.assignee.id === user.id))
      return acc
    }, {})
  }, [users, data.priorityGroups])

  const tasksByUser = getTasksByUser()

  const handleAddUser = () => {
    if (!newUser.id || !newUser.name) {
      toast({
        title: "添加失败",
        description: "用户ID和姓名不能为空",
        variant: "destructive",
      })
      return
    }

    if (users.some((user) => user.id === newUser.id)) {
      toast({
        title: "添加失败",
        description: "用户ID已存在",
        variant: "destructive",
      })
      return
    }

    // 创建完整的用户对象
    const userToAdd: User = {
      id: newUser.id,
      name: newUser.name,
      avatar: newUser.avatar,
    }

    // 调用传入的 onAddUser 函数或直接添加到 store
    if (onAddUser) {
      onAddUser(userToAdd)
    }

    toast({
      title: "添加成功",
      description: `已添加用户: ${newUser.name}`,
    })
    setIsAddUserDialogOpen(false)
    setNewUser({ id: "", name: "" })
  }

  // 处理添加任务
  const handleAddTask = () => {
    if (!newTask.description || !isAddTaskDialogOpen) {
      toast({
        title: "添加失败",
        description: "任务描述不能为空",
        variant: "destructive",
      })
      return
    }

    // 找到对应的用户
    const assignee = users.find((user) => user.id === isAddTaskDialogOpen)
    if (!assignee) {
      toast({
        title: "添加失败",
        description: "未找到指定用户",
        variant: "destructive",
      })
      return
    }

    // 创建完整的任务对象
    const taskToAdd: Task = {
      id: `task-${Date.now()}`,
      description: newTask.description || "",
      summary: newTask.summary || "",
      assignee: assignee,
      status: newTask.status || "待开始",
      startDate: newTask.startDate || new Date().toISOString().split("T")[0].replace(/-/g, "/"),
      expectedEndDate: newTask.expectedEndDate,
      actualEndDate: newTask.actualEndDate,
      isDelayed: newTask.isDelayed || false,
      completed: newTask.completed || false,
      priority: newTask.priority || "重要紧急",
    }

    // 添加任务到全局状态
    addTask(taskToAdd)

    toast({
      title: "添加成功",
      description: `已添加任务: ${taskToAdd.description}`,
    })

    // 重置状态并关闭对话框
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

  const handleDeleteUser = (userId: string) => {
    setUserIdToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userIdToDelete || isDeleting) return

    try {
      // 标记正在删除状态，防止重复点击
      setIsDeleting(true)

      // 先关闭对话框
      setDeleteDialogOpen(false)

      // 使用Promise和setTimeout确保UI更新完成后再执行删除操作
      await new Promise((resolve) => {
        setTimeout(() => {
          try {
            // 执行删除操作
            deleteUser(userIdToDelete)

            toast({
              title: "用户已删除",
              description: "用户已成功删除",
            })
          } catch (error) {
            console.error("删除用户时出错:", error)
            toast({
              title: "删除失败",
              description: "删除用户时发生错误",
              variant: "destructive",
            })
          } finally {
            // 无论成功失败，都清除删除状态
            setUserIdToDelete(null)
            setIsDeleting(false)

            // 确保body上没有pointer-events: none样式
            document.body.style.removeProperty("pointer-events")

            resolve(true)
          }
        }, 100)
      })
    } catch (error) {
      console.error("处理删除用户时出错:", error)
      setDeleteDialogOpen(false)
      setUserIdToDelete(null)
      setIsDeleting(false)

      // 确保body上没有pointer-events: none样式
      document.body.style.removeProperty("pointer-events")
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setUserIdToDelete(null)
    setIsDeleting(false)

    // 确保body上没有pointer-events: none样式
    document.body.style.removeProperty("pointer-events")
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = users.findIndex((user) => user.id === active.id)
      const newIndex = users.findIndex((user) => user.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        // 调用存储方法重新排序用户
        reorderUsers(oldIndex, newIndex)

        toast({
          title: "用户顺序已更新",
          description: "人员排列顺序已成功更新",
        })
      }
    }
  }

  // 组件卸载时确保清理样式
  useEffect(() => {
    return () => {
      document.body.style.removeProperty("pointer-events")
    }
  }, [])

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  // 如果正在删除，显示加载状态
  if (isDeleting) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">正在处理...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="flex-1 overflow-hidden flex flex-col h-full">
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
          <div className="flex h-full overflow-x-auto">
            <SortableContext items={users.map((user) => user.id)} strategy={verticalListSortingStrategy}>
              {users.map((user) => (
                  <SortableUserColumn
                      key={user.id}
                      id={user.id}
                      user={user}
                      tasks={tasksByUser[user.id] || []}
                      onTaskClick={handleTaskClick}
                      onAddTask={() => setIsAddTaskDialogOpen(user.id)}
                      onDeleteUser={() => handleDeleteUser(user.id)}
                      isActive={activeId === user.id}
                  />
              ))}
            </SortableContext>

            {/* 新建分组按钮 */}
            <div className="w-64 flex-shrink-0 p-2 flex items-start">
              <Button
                  variant="ghost"
                  className="w-full h-16 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"
                  onClick={() => setIsAddUserDialogOpen(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                <span>添加人员</span>
              </Button>
            </div>
          </div>
        </DndContext>

        {/* 添加人员对话框 */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新人员</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-id" className="text-right">
                  用户ID
                </Label>
                <Input
                    id="user-id"
                    value={newUser.id}
                    onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: zhangsan"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-name" className="text-right">
                  姓名
                </Label>
                <Input
                    id="user-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: 张三"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-avatar" className="text-right">
                  头像颜色
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  {["bg-purple-500", "bg-teal-500", "bg-orange-500", "bg-blue-500", "bg-green-500", "bg-red-500"].map(
                      (color) => (
                          <div
                              key={color}
                              className={`w-8 h-8 rounded-full ${color} cursor-pointer ${newUser.avatar === color ? "ring-2 ring-offset-2 ring-blue-600" : ""}`}
                              onClick={() => setNewUser({ ...newUser, avatar: color })}
                          />
                      ),
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddUser}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 添加任务对话框 */}
        <Dialog
            open={isAddTaskDialogOpen !== null}
            onOpenChange={(open) => {
              if (!open) {
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
            }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新任务</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-description" className="text-right">
                  任务描述
                </Label>
                <Input
                    id="task-description"
                    value={newTask.description || ""}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: 设计登录页面"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-summary" className="text-right">
                  任务总结
                </Label>
                <Textarea
                    id="task-summary"
                    value={newTask.summary || ""}
                    onChange={(e) => setNewTask({ ...newTask, summary: e.target.value })}
                    className="col-span-3"
                    placeholder="例如: 总结任务情况"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-status" className="text-right">
                  任务状态
                </Label>
                <Select
                    value={newTask.status}
                    onValueChange={(value) =>
                        setNewTask({ ...newTask, status: value as "待开始" | "进行中" | "已完成" | "已停滞" })
                    }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="待开始">待开始</SelectItem>
                    <SelectItem value="进行中">进行中</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已停滞">已停滞</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-priority" className="text-right">
                  优先级
                </Label>
                <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                        setNewTask({ ...newTask, priority: value as "重要紧急" | "紧急不重要" | "重要不紧急" })
                    }
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
              <Button onClick={handleAddTask}>添加任务</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 删除用户确认对话框 */}
        <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={(open) => {
              if (!open) handleCancelDelete()
              else setDeleteDialogOpen(open)
            }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>删除确认</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除该用户吗？此操作将删除该用户所有相关的任务，且无法恢复。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeleting}>
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                  onClick={confirmDeleteUser}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
              >
                {isDeleting ? "删除中..." : "删除"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Task Detail Dialog */}
        <Dialog
            open={selectedTask !== null}
            onOpenChange={(open) => {
              if (!open) setSelectedTask(null)
            }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>任务详情</DialogTitle>
            </DialogHeader>
            {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />}
          </DialogContent>
        </Dialog>
      </div>
  )
}

interface UserColumnProps {
  user: User
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: () => void
  onDeleteUser: () => void
  isActive?: boolean
}

function SortableUserColumn({
                              user,
                              tasks,
                              onTaskClick,
                              onAddTask,
                              onDeleteUser,
                              id,
                              isActive,
                            }: SortableUserColumnProps) {
  // 使用 useSortable 添加拖拽功能
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
    backgroundColor: isDragging ? "#f9fafb" : undefined,
    boxShadow: isDragging ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : undefined,
  }

  return (
      <div ref={setNodeRef} style={style} className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col h-full">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div
                {...attributes}
                {...listeners}
                className="cursor-move mr-2 p-1 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className={`${getUserBgColor(user)} text-white`}>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{tasks.length} 个任务</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm mr-2">完成率: {calculateCompletionRate(tasks)}%</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onAddTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加任务
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteUser} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除人员
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{renderUserTasks(tasks, onTaskClick, onAddTask)}</div>
      </div>
  )
}

// 计算任务完成率的函数
function calculateCompletionRate(tasks: Task[]): number {
  return tasks.length > 0 ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0
}

// 获取用户背景色
function getUserBgColor(user: User) {
  if (user.avatar) return user.avatar

  switch (user.id) {
    case "zhoubeihe":
      return "bg-purple-500"
    case "huangpaopu":
      return "bg-teal-500"
    case "liubeila":
      return "bg-orange-500"
    default:
      return "bg-blue-500"
  }
}

// 渲染用户任务的函数
function renderUserTasks(tasks: Task[], onTaskClick: (task: Task) => void, onAddTask: () => void) {
  // 按状态分类任务
  const tasksByStatus = {
    待开始: tasks.filter((task) => task.status === "待开始"),
    进行中: tasks.filter((task) => task.status === "进行中"),
    已完成: tasks.filter((task) => task.status === "已完成"),
    已停滞: tasks.filter((task) => task.status === "已停滞"),
  }

  return (
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-2 space-y-4 pb-6">
          {/* 进行中任务 */}
          {tasksByStatus.进行中.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 mr-2 badge-hover-effect badge-status-in-progress">
                    进行中
                  </Badge>
                  <span className="text-xs text-gray-500">{tasksByStatus.进行中.length} 个任务</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.进行中.map((task) => (
                      <AssignmentCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                  ))}
                </div>
              </div>
          )}

          {/* 待开始任务 */}
          {tasksByStatus.待开始.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Badge className="bg-red-100 text-red-800 border-red-300 mr-2 badge-hover-effect badge-status-pending">
                    待开始
                  </Badge>
                  <span className="text-xs text-gray-500">{tasksByStatus.待开始.length} 个任务</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.待开始.map((task) => (
                      <AssignmentCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                  ))}
                </div>
              </div>
          )}

          {/* 已停滞任务 */}
          {tasksByStatus.已停滞.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Badge className="bg-gray-200 text-gray-800 border-gray-300 mr-2 badge-hover-effect badge-status-stalled">
                    已停滞
                  </Badge>
                  <span className="text-xs text-gray-500">{tasksByStatus.已停滞.length} 个任务</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.已停滞.map((task) => (
                      <AssignmentCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                  ))}
                </div>
              </div>
          )}

          {/* 已完成任务 */}
          {tasksByStatus.已完成.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Badge className="bg-green-100 text-green-800 border-green-300 mr-2 badge-hover-effect badge-status-completed">
                    已完成
                  </Badge>
                  <span className="text-xs text-gray-500">{tasksByStatus.已完成.length} 个任务</span>
                </div>
                <div className="space-y-3">
                  {tasksByStatus.已完成.map((task) => (
                      <AssignmentCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                  ))}
                </div>
              </div>
          )}

          <Button
              variant="ghost"
              className="w-full h-12 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 mt-4"
              onClick={onAddTask}
          >
            <Plus className="h-4 w-4 mr-1" />
            添加任务
          </Button>
        </div>
      </ScrollArea>
  )
}

interface AssignmentCardProps {
  task: Task
  onClick: () => void
}

function AssignmentCard({ task, onClick }: AssignmentCardProps) {
  return (
      <div
          className="bg-white rounded-md border border-gray-200 shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow hover:border-gray-300"
          onClick={onClick}
      >
        <h3 className="font-medium text-sm mb-2">{task.description}</h3>

        <div className="space-y-2 mb-2">
          <div className="flex items-center text-xs">
            <span className="text-gray-500 mr-1">优先级:</span>
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

          {task.expectedEndDate && (
              <div className="flex items-center text-xs">
                <span className="text-gray-500 mr-1">预计完成:</span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{task.expectedEndDate}</span>
                </div>
              </div>
          )}

          <div className="flex items-center text-xs">
            <span className="text-gray-500 mr-1">状态:</span>
            <div className="flex items-center">
              <CheckCircle className={`h-3.5 w-3.5 mr-1 ${task.completed ? "text-green-500" : "text-yellow-500"}`} />
              <span>{task.completed ? "已完成" : "进行中"}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line max-h-20 overflow-y-auto">
          <span className="font-medium">任务情况总结:</span>
          <p className="mt-1">{task.summary}</p>
        </div>
      </div>
  )
}
