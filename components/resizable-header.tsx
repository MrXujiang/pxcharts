"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ResizableHeaderProps {
  children: React.ReactNode
  width: number
  minWidth?: number
  onResize: (width: number) => void
  className?: string
  fieldId: string
}

export function ResizableHeader({
                                  children,
                                  width,
                                  minWidth = 80,
                                  onResize,
                                  className,
                                  fieldId,
                                }: ResizableHeaderProps) {
  const [isHovering, setIsHovering] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<HTMLDivElement>(null)
  const resizeLineRef = useRef<HTMLDivElement | null>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(width)
  const isResizingRef = useRef<boolean>(false)

  // 移除辅助线
  const removeResizeLine = () => {
    if (resizeLineRef.current && resizeLineRef.current.parentNode) {
      resizeLineRef.current.parentNode.removeChild(resizeLineRef.current)
      resizeLineRef.current = null
    }
  }

  // 处理鼠标按下事件，开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // 设置拖拽状态
    isResizingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = width

    // 创建辅助线
    const resizeLine = document.createElement("div")
    resizeLine.className = "resize-line"
    resizeLine.style.position = "fixed"
    resizeLine.style.top = "0"
    resizeLine.style.bottom = "0"
    resizeLine.style.width = "2px"
    resizeLine.style.backgroundColor = "#3b82f6"
    resizeLine.style.zIndex = "9999"
    resizeLine.style.left = `${e.clientX}px`
    document.body.appendChild(resizeLine)
    resizeLineRef.current = resizeLine

    // 设置全局样式
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    document.body.classList.add("column-resizing")

    // 添加全局事件监听
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // 处理鼠标移动事件
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return

    // 更新辅助线位置
    if (resizeLineRef.current) {
      resizeLineRef.current.style.left = `${e.clientX}px`
    }

    // 计算新宽度
    const deltaX = e.clientX - startXRef.current
    const newWidth = Math.max(minWidth, startWidthRef.current + deltaX)

    // 找到所有相同字段ID的单元格
    const fieldId = headerRef.current?.getAttribute("data-field-id")
    if (fieldId) {
      const allCells = document.querySelectorAll(`[data-field-id="${fieldId}"]`)

      // 实时更新所有相同字段的单元格宽度
      allCells.forEach((cell) => {
        cell.style.width = `${newWidth}px`
        cell.style.minWidth = `${newWidth}px`
        cell.style.maxWidth = `${newWidth}px`
      })
    }
  }

  // 处理鼠标释放事件
  const handleMouseUp = (e: MouseEvent) => {
    if (!isResizingRef.current) return

    // 计算最终宽度
    const deltaX = e.clientX - startXRef.current
    const newWidth = Math.max(minWidth, startWidthRef.current + deltaX)

    // 更新状态
    onResize(newWidth)

    // 清理
    isResizingRef.current = false
    removeResizeLine()

    // 移除全局事件监听
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    // 恢复全局样式
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
    document.body.classList.remove("column-resizing")
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (isResizingRef.current) {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        document.body.classList.remove("column-resizing")
        removeResizeLine()
      }
    }
  }, [])

  return (
      <div
          ref={headerRef}
          data-field-id={fieldId}
          className={cn("relative flex items-center product-cell", className)}
          style={{
            width: `${width}px`,
            minWidth: `${minWidth}px`,
            maxWidth: `${width}px`,
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
      >
        {/* 内容区域 */}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-4">{children}</div>

        {/* 拖拽句柄 */}
        <div
            ref={resizerRef}
            className={cn(
                "absolute right-0 top-0 h-full w-4 cursor-col-resize flex items-center justify-center",
                "transition-opacity duration-150",
                isHovering || isResizingRef.current ? "opacity-100" : "opacity-0",
            )}
            onMouseDown={handleMouseDown}
        >
          <div className="h-full w-1 bg-blue-300 hover:bg-blue-500" />
        </div>
      </div>
  )
}
