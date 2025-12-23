"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTaskStore } from "@/lib/task-store"

interface GroupByDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupByDialog({ open, onOpenChange }: GroupByDialogProps) {
  const { groupBy, setGroupBy } = useTaskStore()
  const [localGroupBy, setLocalGroupBy] = useState(groupBy)

  // 当对话框打开时，重置本地分组配置
  useEffect(() => {
    if (open) {
      setLocalGroupBy(groupBy)
    }
  }, [open, groupBy])

  const handleApplyGrouping = () => {
    setGroupBy(localGroupBy)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>分组方式</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={localGroupBy} onValueChange={setLocalGroupBy}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="priority" id="priority" />
              <Label htmlFor="priority">按优先级分组</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="status" id="status" />
              <Label htmlFor="status">按状态分组</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="assignee" id="assignee" />
              <Label htmlFor="assignee">按执行人分组</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed">按完成状态分组</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleApplyGrouping}>应用分组</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
