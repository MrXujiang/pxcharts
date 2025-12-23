"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 初始化状态
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 获取本地存储中的值
      if (typeof window === "undefined") {
        return initialValue
      }

      const item = window.localStorage.getItem(key)
      // 解析存储的JSON或返回初始值
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // 如果出错，返回初始值
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 返回一个包装版本的 useState setter 函数
  // 将新值同步到 localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许值是一个函数
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // 保存到 state
      setStoredValue(valueToStore)

      // 保存到 localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage item "${key}":`, error)
        }
      }
    }

    // 添加事件监听器
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
    }

    // 清理事件监听器
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [key])

  return [storedValue, setValue]
}
