"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useTaskStore } from "@/lib/task-store"
import type { FilterConfig } from "@/lib/types"
import { X } from "lucide-react"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterDialog({ open, onOpenChange }: FilterDialogProps) {
  const { data, filterConfig, setFilterConfig } = useTaskStore()
  const [localFilterConfig, setLocalFilterConfig] = useState<FilterConfig>({ ...filterConfig })

  // 当对话框打开时，重置本地筛选配置
  useEffect(() => {
    if (open) {
      setLocalFilterConfig({ ...filterConfig })
    }
  }, [open, filterConfig])

  // 从所有任务中提取唯一的用户
  const users = Array.from(
    new Map(
      data.priorityGroups.flatMap((group) => group.tasks).map((task) => [task.assignee.id, task.assignee]),
    ).values(),
  )

  // 从所有任务中提取唯一的状态
  const statuses = Array.from(new Set(data.priorityGroups.flatMap((group) => group.tasks).map((task) => task.status)))

  // 从所有任务中提取唯一的优先级
  const priorities = Array.from(
    new Set(data.priorityGroups.flatMap((group) => group.tasks).map((task) => task.priority)),
  )

  const handleApplyFilter = () => {
    // 设置筛选为激活状态
    const newFilterConfig = {
      ...localFilterConfig,
      isActive:
        !!localFilterConfig.status ||
        !!localFilterConfig.priority ||
        !!localFilterConfig.assignee ||
        !!localFilterConfig.dateRange,
    }

    setFilterConfig(newFilterConfig)
    onOpenChange(false)
  }

  const handleClearFilter = () => {
    const emptyConfig: FilterConfig = {
      status: null,
      priority: null,
      assignee: null,
      dateRange: null,
      isActive: false,
    }

    setLocalFilterConfig(emptyConfig)
    setFilterConfig(emptyConfig)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>筛选任务</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-status" className="text-right">
              状态
            </Label>
            <div className="col-span-3 relative">
              <Select
                value={localFilterConfig.status || ""}
                onValueChange={(value) => setLocalFilterConfig({ ...localFilterConfig, status: value || null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {localFilterConfig.status && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setLocalFilterConfig({ ...localFilterConfig, status: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-priority" className="text-right">
              优先级
            </Label>
            <div className="col-span-3 relative">
              <Select
                value={localFilterConfig.priority || ""}
                onValueChange={(value) => setLocalFilterConfig({ ...localFilterConfig, priority: value || null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {localFilterConfig.priority && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setLocalFilterConfig({ ...localFilterConfig, priority: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filter-assignee" className="text-right">
              执行人
            </Label>
            <div className="col-span-3 relative">
              <Select
                value={localFilterConfig.assignee || ""}
                onValueChange={(value) => setLocalFilterConfig({ ...localFilterConfig, assignee: value || null })}
              >
                <SelectTrigger>
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
              {localFilterConfig.assignee && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setLocalFilterConfig({ ...localFilterConfig, assignee: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">日期范围</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  placeholder="开始日期"
                  value={localFilterConfig.dateRange?.start || ""}
                  onChange={(e) => {
                    setLocalFilterConfig({
                      ...localFilterConfig,
                      dateRange: {
                        ...(localFilterConfig.dateRange || {}),
                        start: e.target.value || undefined,
                      },
                    })
                  }}
                />
                <span>至</span>
                <Input
                  type="date"
                  placeholder="结束日期"
                  value={localFilterConfig.dateRange?.end || ""}
                  onChange={(e) => {
                    setLocalFilterConfig({
                      ...localFilterConfig,
                      dateRange: {
                        ...(localFilterConfig.dateRange || {}),
                        end: e.target.value || undefined,
                      },
                    })
                  }}
                />
                {(localFilterConfig.dateRange?.start || localFilterConfig.dateRange?.end) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocalFilterConfig({ ...localFilterConfig, dateRange: null })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClearFilter}>
            清除筛选
          </Button>
          <Button onClick={handleApplyFilter}>应用筛选</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
