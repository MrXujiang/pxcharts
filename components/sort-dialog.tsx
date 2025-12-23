"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskStore } from "@/lib/task-store"
import type { SortConfig } from "@/lib/types"

interface SortDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SortDialog({ open, onOpenChange }: SortDialogProps) {
  const { sortConfig, setSortConfig } = useTaskStore()
  const [localSortConfig, setLocalSortConfig] = useState<SortConfig>({ ...sortConfig })

  // 当对话框打开时，重置本地排序配置
  useEffect(() => {
    if (open) {
      setLocalSortConfig({ ...sortConfig })
    }
  }, [open, sortConfig])

  const handleApplySort = () => {
    // 设置排序为激活状态
    const newSortConfig = {
      ...localSortConfig,
      isActive: !!localSortConfig.field,
    }

    setSortConfig(newSortConfig)
    onOpenChange(false)
  }

  const handleClearSort = () => {
    const emptyConfig: SortConfig = {
      field: null,
      direction: "asc",
      isActive: false,
    }

    setLocalSortConfig(emptyConfig)
    setSortConfig(emptyConfig)
    onOpenChange(false)
  }

  // 可排序的字段
  const sortableFields = [
    { id: "description", name: "任务描述" },
    { id: "assignee", name: "任务执行人" },
    { id: "status", name: "进展状态" },
    { id: "priority", name: "优先级" },
    { id: "startDate", name: "开始日期" },
    { id: "expectedEndDate", name: "预计完成日期" },
    { id: "actualEndDate", name: "实际完成日期" },
    { id: "completed", name: "完成状态" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>排序任务</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sort-field" className="text-right">
              排序字段
            </Label>
            <Select
              value={localSortConfig.field || ""}
              onValueChange={(value) => setLocalSortConfig({ ...localSortConfig, field: value || null })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="选择排序字段" />
              </SelectTrigger>
              <SelectContent>
                {sortableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {localSortConfig.field && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">排序方向</Label>
              <RadioGroup
                value={localSortConfig.direction}
                onValueChange={(value) =>
                  setLocalSortConfig({ ...localSortConfig, direction: value as "asc" | "desc" })
                }
                className="col-span-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asc" id="asc" />
                  <Label htmlFor="asc">升序（A-Z，1-9）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="desc" id="desc" />
                  <Label htmlFor="desc">降序（Z-A，9-1）</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClearSort}>
            清除排序
          </Button>
          <Button onClick={handleApplySort} disabled={!localSortConfig.field}>
            应用排序
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
