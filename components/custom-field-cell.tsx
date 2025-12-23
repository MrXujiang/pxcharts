"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import type { FieldType, CustomFieldValue } from "@/lib/types"

interface CustomFieldCellProps {
    fieldId: string
    fieldType: FieldType
    value: CustomFieldValue | undefined
    options?: string[]
    onSave: (value: any) => void
    className?: string
    editMode?: boolean
}

export function CustomFieldCell({
                                    fieldId,
                                    fieldType,
                                    value,
                                    options = [],
                                    onSave,
                                    className = "",
                                    editMode = false,
                                }: CustomFieldCellProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState<any>(value?.value || "")

    // 处理双击事件
    const handleDoubleClick = () => {
        if (!editMode) {
            setIsEditing(true)
            setEditValue(value?.value || "")
        }
    }

    // 处理保存
    const handleSave = () => {
        onSave(editValue)
        setIsEditing(false)
    }

    // 处理取消
    const handleCancel = () => {
        setIsEditing(false)
        setEditValue(value?.value || "")
    }

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSave()
        } else if (e.key === "Escape") {
            handleCancel()
        }
    }

    // 渲染编辑模式
    const renderEditMode = () => {
        switch (fieldType) {
            case "文本":
                return (
                    <Input
                        value={editValue || ""}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        autoFocus
                        className="h-8 py-1"
                    />
                )
            case "数值":
                return (
                    <Input
                        type="number"
                        value={editValue || ""}
                        onChange={(e) => setEditValue(e.target.valueAsNumber || 0)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        autoFocus
                        className="h-8 py-1"
                    />
                )
            case "标签":
                return (
                    <Select
                        value={editValue || ""}
                        onValueChange={(v) => {
                            setEditValue(v)
                            onSave(v)
                            setIsEditing(false)
                        }}
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="选择标签" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.length > 0 ? (
                                options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))
                            ) : (
                                <>
                                    <SelectItem value="低">低</SelectItem>
                                    <SelectItem value="中">中</SelectItem>
                                    <SelectItem value="高">高</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                )
            case "单选":
                return (
                    <Select
                        value={editValue || ""}
                        onValueChange={(v) => {
                            setEditValue(v)
                            onSave(v)
                            setIsEditing(false)
                        }}
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="选择选项" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            case "复选":
                return (
                    <div className="flex items-center space-x-2 py-1">
                        <Checkbox
                            checked={!!editValue}
                            onCheckedChange={(checked) => {
                                setEditValue(!!checked)
                                onSave(!!checked)
                                setIsEditing(false)
                            }}
                        />
                        <span>是</span>
                    </div>
                )
            case "富文本":
                return (
                    <Textarea
                        value={editValue || ""}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.ctrlKey) {
                                handleSave()
                            } else if (e.key === "Escape") {
                                handleCancel()
                            }
                        }}
                        onBlur={handleSave}
                        autoFocus
                        className="min-h-[80px] p-2"
                    />
                )
            case "图片":
                return (
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="输入图片URL"
                                value={editValue || ""}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-8 py-1"
                            />
                            <Button size="sm" onClick={handleSave}>
                                保存
                            </Button>
                        </div>
                        {editValue && (
                            <div className="mt-1">
                                <img
                                    src={editValue || "/placeholder.svg"}
                                    alt="预览"
                                    className="max-h-20 max-w-full object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = "/broken-image-icon.png"
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )
            default:
                return (
                    <Input
                        value={editValue || ""}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        autoFocus
                        className="h-8 py-1"
                    />
                )
        }
    }

    // 渲染显示模式
    const renderDisplayMode = () => {
        const displayValue = value?.value

        switch (fieldType) {
            case "文本":
            case "数值":
                return <div className="truncate">{displayValue || "-"}</div>
            case "标签":
                return displayValue ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                        {displayValue}
                    </Badge>
                ) : (
                    "-"
                )
            case "单选":
                return <div className="truncate">{displayValue || "-"}</div>
            case "复选":
                return (
                    <div className="flex justify-center">
                        <Checkbox checked={!!displayValue} disabled />
                    </div>
                )
            case "富文本":
                return (
                    <div className="truncate max-w-xs" title={displayValue}>
                        {displayValue || "-"}
                    </div>
                )
            case "图片":
                return displayValue ? (
                    <div className="flex justify-center">
                        <img
                            src={displayValue || "/placeholder.svg"}
                            alt="图片"
                            className="h-8 w-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.src = "/broken-image-icon.png"
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center text-gray-400">
                        <ImageIcon className="h-4 w-4" />
                    </div>
                )
            default:
                return <div className="truncate">{displayValue || "-"}</div>
        }
    }

    // 如果是编辑模式或者正在编辑
    if (editMode || isEditing) {
        return (
            <div className="px-1" onClick={(e) => e.stopPropagation()}>
                {renderEditMode()}
            </div>
        )
    }

    // 显示模式
    return (
        <div
            className={`truncate cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded ${className}`}
            onDoubleClick={handleDoubleClick}
        >
            {renderDisplayMode()}
        </div>
    )
}
