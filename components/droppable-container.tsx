"use client"

import { useDroppable } from "@dnd-kit/core"
import type { ReactNode } from "react"

interface DroppableContainerProps {
  id: string
  children: ReactNode
}

export function DroppableContainer({ id, children }: DroppableContainerProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`${isOver ? "bg-blue-50" : ""} transition-colors duration-200 flex-1`}
      style={{ minWidth: "320px" }}
    >
      {children}
    </div>
  )
}
