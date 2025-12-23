"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useTaskStore } from "@/lib/task-store"
import { useToast } from "@/hooks/use-toast"

export function ExportDataButton() {
  const { data } = useTaskStore()
  const { toast } = useToast()

  const exportTaskData = () => {
    try {
      // 获取所有任务
      const tasks = data.priorityGroups.flatMap((group) => group.tasks)

      // 转换为 JSON 字符串
      const jsonData = JSON.stringify(tasks, null, 2)

      // 创建 Blob
      const blob = new Blob([jsonData], { type: "application/json" })

      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `task-management-export-${new Date().toISOString().split("T")[0]}.json`

      // 触发下载
      document.body.appendChild(a)
      a.click()

      // 清理
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "导出成功",
        description: "任务数据已成功导出为 JSON 文件",
      })
    } catch (error) {
      toast({
        title: "导出失败",
        description: "导出数据时发生错误，请稍后重试",
        variant: "destructive",
      })
      console.error("导出数据失败:", error)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={exportTaskData}>
      <Download className="h-3.5 w-3.5 mr-1" />
      导出数据
    </Button>
  )
}
