"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditableCellProps {
  value: string | number | null
  onChange: (value: string) => void
  className?: string
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onChange, className }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value?.toString() || "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value?.toString() || "")
  }, [value])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange && onChange(inputValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setInputValue(value?.toString() || "")
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  if (isEditing) {
    return (
        <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="border rounded px-1 py-0.5 w-full"
        />
    )
  }

  return (
      <div
          className={cn(
              "editable-cell cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded whitespace-nowrap overflow-hidden text-overflow-ellipsis",
              className,
          )}
          onClick={handleClick}
      >
        {value || <span className="text-gray-400 italic">点击编辑</span>}
      </div>
  )
}

export default EditableCell
