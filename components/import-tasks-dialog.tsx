"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useTaskStore } from "@/lib/task-store"
import { FileJson, AlertCircle, Check } from "lucide-react"
import type { Task } from "@/lib/types"

interface ImportTasksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportTasksDialog({ open, onOpenChange }: ImportTasksDialogProps) {
  const { toast } = useToast()
  const { addMultipleTasks } = useTaskStore()
  const [file, setFile] = useState<File | null>(null)
  const [parsedTasks, setParsedTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    validateAndParseFile(selectedFile)
  }

  // 处理文件拖放
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return

    setFile(droppedFile)
    validateAndParseFile(droppedFile)
  }

  // 阻止默认拖放行为
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // 验证并解析文件
  const validateAndParseFile = async (file: File) => {
    setError(null)
    setParsedTasks([])

    // 检查文件类型
    if (!file.name.endsWith(".json")) {
      setError("请选择有效的JSON文件")
      return
    }

    try {
      // 读取文件内容
      const text = await file.text()
      const data = JSON.parse(text)

      // 验证数据是否为数组
      if (!Array.isArray(data)) {
        setError("JSON格式无效，应为任务对象数组")
        return
      }

      // 验证每个任务对象的结构
      const validationErrors: string[] = []
      const validTasks: Task[] = []

      data.forEach((task, index) => {
        // 检查必要字段
        if (!task.description) {
          validationErrors.push(`任务 #${index + 1}: 缺少描述字段`)
        }
        if (!task.summary) {
          validationErrors.push(`任务 #${index + 1}: 缺少总结字段`)
        }
        if (!task.assignee || !task.assignee.id || !task.assignee.name) {
          validationErrors.push(`任务 #${index + 1}: 缺少有效的执行人信息`)
        }
        if (!task.status) {
          validationErrors.push(`任务 #${index + 1}: 缺少状态字段`)
        }
        if (!task.startDate) {
          validationErrors.push(`任务 #${index + 1}: 缺少开始日期字段`)
        }
        if (!task.priority) {
          validationErrors.push(`任务 #${index + 1}: 缺少优先级字段`)
        }

        // 如果没有错误，添加到有效任务列表
        if (!validationErrors.some((err) => err.includes(`任务 #${index + 1}:`))) {
          // 确保任务有唯一ID
          const validTask: Task = {
            ...task,
            id: task.id || `imported-task-${Date.now()}-${index}`,
          }
          validTasks.push(validTask)
        }
      })

      // 如果有验证错误，显示错误信息
      if (validationErrors.length > 0) {
        setError(
          `数据格式有误:\n${validationErrors.slice(0, 5).join("\n")}${validationErrors.length > 5 ? "\n..." : ""}`,
        )
        return
      }

      // 设置解析后的任务
      setParsedTasks(validTasks)
    } catch (err) {
      setError("JSON格式无效，请检查文件内容")
    }
  }

  // 导入任务
  const handleImport = () => {
    if (parsedTasks.length === 0) {
      setError("没有有效的任务数据可导入")
      return
    }

    setIsLoading(true)

    try {
      // 导入任务
      addMultipleTasks(parsedTasks)

      // 显示成功消息
      toast({
        title: "导入成功",
        description: `成功导入 ${parsedTasks.length} 个任务`,
      })

      // 重置状态并关闭对话框
      setFile(null)
      setParsedTasks([])
      setError(null)
      onOpenChange(false)
    } catch (err) {
      setError("导入任务时出错")
    } finally {
      setIsLoading(false)
    }
  }

  // 触发文件选择
  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>导入任务数据</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 文件上传区域 */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
              error ? "border-red-300" : "border-gray-300"
            }`}
            onClick={handleClickUpload}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            <FileJson className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium mb-1">点击或拖放JSON文件到此处</p>
            <p className="text-xs text-gray-500">支持JSON格式的任务数据文件</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* 文件信息 */}
          {file && !error && (
            <div className="text-sm">
              <p className="font-medium">已选择文件:</p>
              <p className="text-gray-600">{file.name}</p>
            </div>
          )}

          {/* 数据预览 */}
          {parsedTasks.length > 0 && (
            <div className="text-sm">
              <p className="font-medium mb-2">数据预览 ({parsedTasks.length} 个任务):</p>
              <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
                {parsedTasks.slice(0, 5).map((task, index) => (
                  <div key={index} className="mb-2 pb-2 border-b last:border-0 last:mb-0 last:pb-0">
                    <p className="font-medium">{task.description}</p>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{task.assignee.name}</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{task.status}</span>
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">{task.priority}</span>
                    </div>
                  </div>
                ))}
                {parsedTasks.length > 5 && (
                  <p className="text-gray-500 text-xs mt-2">...还有 {parsedTasks.length - 5} 个任务</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            取消
          </Button>
          <Button onClick={handleImport} disabled={parsedTasks.length === 0 || isLoading} className="flex items-center">
            {isLoading ? (
              "导入中..."
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                导入任务
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
