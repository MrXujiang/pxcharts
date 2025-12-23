"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskStore } from "@/lib/task-store"
import type { Task } from "@/lib/types"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: Partial<Task>) => void
}

export function AddTaskDialog({ open, onOpenChange, onAddTask }: AddTaskDialogProps) {
  const { data } = useTaskStore()
  const [newTask, setNewTask] = useState<Partial<Task>>({
    description: "",
    summary: "",
    priority: "重要紧急",
    status: "待开始",
    assignee: { id: "zhoubeihe", name: "周北北" },
    startDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
  })

  // 从所有任务中提取唯一的用户
  const users = Array.from(
    new Map(
      data.priorityGroups.flatMap((group) => group.tasks).map((task) => [task.assignee.id, task.assignee]),
    ).values(),
  )

  const handleSubmit = () => {
    if (!newTask.description) {
      return
    }
    onAddTask(newTask)
    setNewTask({
      description: "",
      summary: "",
      priority: "重要紧急",
      status: "待开始",
      assignee: { id: "zhoubeihe", name: "周北北" },
      startDate: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="col-span-3"
              placeholder="请输入任务描述"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-summary" className="text-right">
              任务总结
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
            <Label htmlFor="task-priority" className="text-right">
              优先级
            </Label>
            <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
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
            <Label htmlFor="task-status" className="text-right">
              状态
            </Label>
            <Select
              value={newTask.status}
              onValueChange={(value) => setNewTask({ ...newTask, status: value as Task["status"] })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="待开始">待开始</SelectItem>
                <SelectItem value="进行中">进行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="已暂停">已暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-assignee" className="text-right">
              执行人
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
                    {user.name}
                  </SelectItem>
                ))}
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
            <Label htmlFor="task-end-date" className="text-right">
              预计完成日期
            </Label>
            <Input
              id="task-end-date"
              type="date"
              value={newTask.expectedEndDate?.replace(/\//g, "-") || ""}
              onChange={(e) =>
                setNewTask({ ...newTask, expectedEndDate: e.target.value.replace(/-/g, "/") || undefined })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
