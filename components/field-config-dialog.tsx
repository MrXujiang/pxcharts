"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface FieldConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  visibleFields: { id: string; name: string; visible: boolean; width: number; type?: string }[]
  setVisibleFields: (fields: { id: string; name: string; visible: boolean; width: number; type?: string }[]) => void
}

export function FieldConfigDialog({
                                    open,
                                    onOpenChange,
                                    visibleFields = [],
                                    setVisibleFields,
                                  }: FieldConfigDialogProps) {
  const { toast } = useToast()
  // 初始化本地字段配置
  const [localVisibleFields, setLocalVisibleFields] = useState<string[]>([])

  // 当对话框打开时，重置本地字段配置
  useEffect(() => {
    if (open) {
      setLocalVisibleFields(visibleFields.filter((f) => f.visible).map((f) => f.id))
    }
  }, [open, visibleFields])

  const handleToggleField = (fieldId: string) => {
    if (localVisibleFields.includes(fieldId)) {
      // 如果字段已经可见，则隐藏它（但确保至少有一个字段可见）
      if (localVisibleFields.length > 1) {
        setLocalVisibleFields(localVisibleFields.filter((id) => id !== fieldId))
      }
    } else {
      // 如果字段不可见，则显示它
      setLocalVisibleFields([...localVisibleFields, fieldId])
    }
  }

  const handleApplyFieldConfig = () => {
    // 确保至少有一个字段可见
    if (localVisibleFields.length === 0) {
      toast({
        title: "配置错误",
        description: "至少需要一个可见字段",
        variant: "destructive",
      })
      return
    }

    // 更新字段配置
    const updatedFields = visibleFields.map((field) => ({
      ...field,
      visible: localVisibleFields.includes(field.id),
    }))

    setVisibleFields(updatedFields)
    onOpenChange(false)

    toast({
      title: "字段配置已更新",
      description: "表格显示字段已成功更新",
    })
  }

  // 重置列宽的函数
  const resetFieldWidths = () => {
    // 定义默认宽度映射
    const defaultWidths = {
      description: 240,
      summary: 240,
      assignee: 120,
      status: 100,
      priority: 100,
      startDate: 120,
      expectedEndDate: 120,
      isDelayed: 100,
      actualEndDate: 120,
      completed: 100,
    }

    // 更新所有字段的宽度为默认值，但保持可见性不变
    const updatedFields = visibleFields.map((field) => ({
      ...field,
      width: defaultWidths[field.id as keyof typeof defaultWidths] || 150,
    }))

    setVisibleFields(updatedFields)

    toast({
      title: "列宽已重置",
      description: "所有列宽已恢复为默认值",
    })
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>配置显示字段</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4 py-2">
              {visibleFields.map((field) => {
                const isChecked = localVisibleFields.includes(field.id)
                const isDisabled = isChecked && localVisibleFields.length === 1

                return (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                          id={`field-${field.id}`}
                          checked={isChecked}
                          onCheckedChange={() => handleToggleField(field.id)}
                          disabled={isDisabled}
                      />
                      <Label htmlFor={`field-${field.id}`} className={isDisabled ? "opacity-50" : ""}>
                        {field.name}
                        {field && <span className="ml-2 text-xs text-gray-500">(当前宽度: {field.width}px)</span>}
                      </Label>
                    </div>
                )
              })}
            </div>
          </ScrollArea>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={resetFieldWidths}>
              重置列宽
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button onClick={handleApplyFieldConfig}>应用配置</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
