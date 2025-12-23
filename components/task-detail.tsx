"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, CheckCircle, Clock, FileText, Users, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useTaskStore } from "@/lib/task-store"

interface TaskDetailProps {
  task: Task
  onClose?: () => void
}

export function TaskDetail({ task: initialTask, onClose }: TaskDetailProps) {
  const { toast } = useToast()
  const { updateTask, data } = useTaskStore()

  // 编辑模式状态
  const [isEditing, setIsEditing] = useState(false)

  // 任务数据状态
  const [task, setTask] = useState<Task>(initialTask)

  // 日期选择器状态
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [expectedDateOpen, setExpectedDateOpen] = useState(false)
  const [actualDateOpen, setActualDateOpen] = useState(false)

  // 从所有任务中提取唯一的用户
  const users = Array.from(
      new Map(
          data.priorityGroups.flatMap((group) => group.tasks).map((task) => [task.assignee.id, task.assignee]),
      ).values(),
  )

  // 当初始任务变化时更新本地状态
  useEffect(() => {
    setTask(initialTask)
  }, [initialTask])

  // 处理字段变化
  const handleChange = (field: keyof Task, value: any) => {
    setTask((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 处理日期变化
  const handleDateChange = (field: "startDate" | "expectedEndDate" | "actualEndDate", date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy/MM/dd")
      handleChange(field, formattedDate)
    } else {
      handleChange(field, undefined)
    }

    // 关闭对应的日期选择器
    if (field === "startDate") setStartDateOpen(false)
    else if (field === "expectedEndDate") setExpectedDateOpen(false)
    else if (field === "actualEndDate") setActualDateOpen(false)
  }

  // 处理执行人变化
  const handleAssigneeChange = (userId: string) => {
    const selectedUser = users.find((user) => user.id === userId)
    if (selectedUser) {
      handleChange("assignee", selectedUser)
    }
  }

  // 保存更改
  const handleSave = () => {
    updateTask(task.id, task)
    setIsEditing(false)
    toast({
      title: "任务已更新",
      description: "任务信息已成功保存",
    })
  }

  // 取消编辑
  const handleCancel = () => {
    setTask(initialTask)
    setIsEditing(false)
  }

  // 处理日期点击
  const handleDateClick = (dateType: "startDate" | "expectedEndDate" | "actualEndDate") => {
    if (!isEditing) return

    if (dateType === "startDate") setStartDateOpen(true)
    else if (dateType === "expectedEndDate") setExpectedDateOpen(true)
    else if (dateType === "actualEndDate") setActualDateOpen(true)
  }

  return (
      <div className="space-y-4" style={{ maxHeight: "80vh", overflowY: "auto", padding: "0 4px" }}>
        <div className="flex items-start justify-between">
          <div>
            {isEditing ? (
                <Input
                    value={task.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="text-xl font-semibold mb-2"
                />
            ) : (
                <h2 className="text-xl font-semibold">{task.description}</h2>
            )}
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                {isEditing ? (
                    <Select value={task.status} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="待开始">待开始</SelectItem>
                        <SelectItem value="进行中">进行中</SelectItem>
                        <SelectItem value="已完成">已完成</SelectItem>
                        <SelectItem value="已暂停">已暂停</SelectItem>
                      </SelectContent>
                    </Select>
                ) : (
                    <Badge
                        className={`
                    ${
                            task.status === "进行中"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : task.status === "已完成"
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : "bg-red-100 text-red-800 border-red-300"
                        }
                    mr-2
                  `}
                    >
                      {task.status}
                    </Badge>
                )}
                <span className="text-sm text-gray-500">创建于 {task.startDate}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    取消
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                </>
            ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    编辑
                  </Button>
                  <Button variant="outline" size="sm">
                    分享
                  </Button>
                </>
            )}
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">详情</TabsTrigger>
            <TabsTrigger value="comments">评论</TabsTrigger>
            <TabsTrigger value="history">历史记录</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>任务执行人</Label>
                {isEditing ? (
                    <Select value={task.assignee.id} onValueChange={handleAssigneeChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择执行人" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                ) : (
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback
                            className={`
                        ${
                                task.assignee.id === "zhoubeihe"
                                    ? "bg-purple-500"
                                    : task.assignee.id === "huangpaopu"
                                        ? "bg-teal-500"
                                        : "bg-orange-500"
                            } text-white
                      `}
                        >
                          {task.assignee.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assignee.name}</span>
                    </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>优先级</Label>
                {isEditing ? (
                    <Select value={task.priority} onValueChange={(value) => handleChange("priority", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="重要紧急">重要紧急</SelectItem>
                        <SelectItem value="紧急不重要">紧急不重要</SelectItem>
                        <SelectItem value="重要不紧急">重要不紧急</SelectItem>
                      </SelectContent>
                    </Select>
                ) : (
                    <Badge
                        className={`
                    ${
                            task.priority === "重要紧急"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : task.priority === "紧急不重要"
                                    ? "bg-orange-100 text-orange-800 border-orange-300"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-300"
                        }
                  `}
                    >
                      {task.priority}
                    </Badge>
                )}
              </div>
              <div className="space-y-2">
                <Label>开始日期</Label>
                {isEditing ? (
                    <div className="relative">
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <div className="cursor-pointer" onClick={() => handleDateClick("startDate")}>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !task.startDate && "text-muted-foreground",
                                )}
                                type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {task.startDate ? task.startDate : <span>选择日期</span>}
                            </Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={task.startDate ? new Date(task.startDate.replace(/\//g, "-")) : undefined}
                              onSelect={(date) => handleDateChange("startDate", date)}
                              initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                ) : (
                    <div className="p-2 border rounded-md">{task.startDate || "未设置"}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>预计完成日期</Label>
                {isEditing ? (
                    <div className="relative">
                      <Popover open={expectedDateOpen} onOpenChange={setExpectedDateOpen}>
                        <PopoverTrigger asChild>
                          <div className="cursor-pointer" onClick={() => handleDateClick("expectedEndDate")}>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !task.expectedEndDate && "text-muted-foreground",
                                )}
                                type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {task.expectedEndDate ? task.expectedEndDate : <span>选择日期</span>}
                            </Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={task.expectedEndDate ? new Date(task.expectedEndDate.replace(/\//g, "-")) : undefined}
                              onSelect={(date) => handleDateChange("expectedEndDate", date)}
                              initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                ) : (
                    <div className="p-2 border rounded-md">{task.expectedEndDate || "未设置"}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>实际完成日期</Label>
                {isEditing ? (
                    <div className="relative">
                      <Popover open={actualDateOpen} onOpenChange={setActualDateOpen}>
                        <PopoverTrigger asChild>
                          <div className="cursor-pointer" onClick={() => handleDateClick("actualEndDate")}>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !task.actualEndDate && "text-muted-foreground",
                                )}
                                type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {task.actualEndDate ? task.actualEndDate : <span>选择日期</span>}
                            </Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={task.actualEndDate ? new Date(task.actualEndDate.replace(/\//g, "-")) : undefined}
                              onSelect={(date) => handleDateChange("actualEndDate", date)}
                              initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                ) : (
                    <Input value={task.actualEndDate || ""} readOnly />
                )}
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>正常</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>任务情况总结</Label>
              {isEditing ? (
                  <Textarea
                      value={task.summary}
                      onChange={(e) => handleChange("summary", e.target.value)}
                      className="min-h-[100px]"
                  />
              ) : (
                  <div className="p-3 bg-gray-50 rounded-md border text-sm whitespace-pre-line">{task.summary}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>备注</Label>
              <Textarea placeholder="添加备注..." className="min-h-[100px]" disabled={!isEditing} />
            </div>

            {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    取消
                  </Button>
                  <Button onClick={handleSave}>保存</Button>
                </div>
            )}
          </TabsContent>
          <TabsContent value="comments" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-500 text-white">周北</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="font-medium">周北河</div>
                    <p className="text-sm">这个任务需要尽快完成，我们下周要向客户展示。</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>2024/11/15 14:30</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      回复
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-500 text-white">刘贝</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="font-medium">刘贝拉</div>
                    <p className="text-sm">已经在处理中，预计周五可以完成初稿。</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>2024/11/15 15:45</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      回复
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 mt-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-orange-500 text-white">小夕</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea placeholder="添加评论..." className="min-h-[80px]" />
                <div className="flex justify-end mt-2">
                  <Button>发送</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm">
                    <span className="font-medium">周北河</span> 将任务状态从 <Badge variant="outline">待开始</Badge>{" "}
                    更改为{" "}
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      进行中
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2024/11/15 09:30</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm">
                    <span className="font-medium">徐小夕</span> 将任务分配给 <span className="font-medium">周北河</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2024/11/14 16:45</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm">
                    <span className="font-medium">徐小夕</span> 创建了任务
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2024/11/14 16:30</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
