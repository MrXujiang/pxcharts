"use client"

import { useTaskStore } from "@/lib/task-store"
import { AssignmentBoard } from "@/components/assignment-board"
import type { Task, User } from "@/lib/types"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AssignmentView() {
  const { data, addUser, updateTask } = useTaskStore()
  const { toast } = useToast()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    // 这里可以添加打开任务详情对话框的逻辑
    toast({
      title: "任务详情",
      description: `您点击了任务: ${task.description}`,
    })
  }

  const handleAddUser = (user: User) => {
    // 直接调用 store 的 addUser 方法
    addUser(user)
    toast({
      title: "添加成功",
      description: `已添加用户: ${user.name}`,
    })
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden">
        <AssignmentBoard data={data} onTaskClick={handleTaskClick} onAddUser={handleAddUser} />
      </div>
    </div>
  )
}
