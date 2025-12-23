"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Plus, X } from "lucide-react"
import type { FieldType } from "@/lib/types"

interface AddFieldDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddField: (field: { id: string; name: string; type: FieldType; options?: string[] }) => void
}

export function AddFieldDialog({ open, onOpenChange, onAddField }: AddFieldDialogProps) {
    const { toast } = useToast()
    const [fieldName, setFieldName] = useState("")
    const [fieldType, setFieldType] = useState<FieldType>("文本")
    const [options, setOptions] = useState<string[]>([])
    const [newOption, setNewOption] = useState("")

    // 重置表单
    const resetForm = () => {
        setFieldName("")
        setFieldType("文本")
        setOptions([])
        setNewOption("")
    }

    // 当对话框关闭时重置表单
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm()
        }
        onOpenChange(open)
    }

    // 添加选项
    const addOption = () => {
        if (!newOption.trim()) return
        if (options.includes(newOption.trim())) {
            toast({
                title: "选项已存在",
                description: `选项 "${newOption}" 已经存在`,
                variant: "destructive",
            })
            return
        }
        setOptions([...options, newOption.trim()])
        setNewOption("")
    }

    // 删除选项
    const removeOption = (option: string) => {
        setOptions(options.filter((o) => o !== option))
    }

    // 提交表单
    const handleSubmit = () => {
        if (!fieldName.trim()) {
            toast({
                title: "字段名称不能为空",
                description: "请输入有效的字段名称",
                variant: "destructive",
            })
            return
        }

        // 生成唯一ID
        const fieldId = `custom_${Date.now()}_${fieldName.replace(/\s+/g, "_").toLowerCase()}`

        // 检查是否需要选项
        if ((fieldType === "单选" || fieldType === "标签") && options.length === 0) {
            toast({
                title: "需要选项",
                description: `${fieldType}类型的字段需要至少一个选项`,
                variant: "destructive",
            })
            return
        }

        // 创建字段对象
        const newField = {
            id: fieldId,
            name: fieldName,
            type: fieldType,
            options: ["单选", "标签"].includes(fieldType) ? options : undefined,
        }

        // 调用添加字段函数
        onAddField(newField)
        handleOpenChange(false)
        toast({
            title: "字段已添加",
            description: `字段 "${fieldName}" 已成功添加`,
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>添加新字段</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="field-name">字段名称</Label>
                        <Input
                            id="field-name"
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            placeholder="输入字段名称"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="field-type">字段类型</Label>
                        <Select value={fieldType} onValueChange={(value) => setFieldType(value as FieldType)}>
                            <SelectTrigger id="field-type">
                                <SelectValue placeholder="选择字段类型" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="文本">文本</SelectItem>
                                <SelectItem value="数值">数值</SelectItem>
                                <SelectItem value="标签">标签</SelectItem>
                                <SelectItem value="单选">单选</SelectItem>
                                <SelectItem value="复选">复选</SelectItem>
                                <SelectItem value="富文本">富文本</SelectItem>
                                <SelectItem value="图片">图片</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 选项配置（仅对单选和标签类型显示） */}
                    {(fieldType === "单选" || fieldType === "标签") && (
                        <div className="space-y-2">
                            <Label>选项列表</Label>
                            <div className="flex space-x-2">
                                <Input
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    placeholder="输入选项"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            addOption()
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addOption} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <ScrollArea className="h-[100px] border rounded-md p-2">
                                {options.length > 0 ? (
                                    <div className="space-y-2">
                                        {options.map((option) => (
                                            <div key={option} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <span>{option}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeOption(option)}
                                                    className="h-6 w-6"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">暂无选项，请添加</div>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit}>添加字段</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
