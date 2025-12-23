"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (user: { id: string; name: string; avatar?: string; role?: string; department?: string }) => void
}

export function AddUserDialog({ open, onOpenChange, onAddUser }: AddUserDialogProps) {
  const { toast } = useToast()
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("member")
  const [userDepartment, setUserDepartment] = useState("development")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId.trim() || !userName.trim()) {
      toast({
        title: "输入错误",
        description: "用户ID和姓名不能为空",
        variant: "destructive",
      })
      return
    }

    // 创建新用户
    const newUser = {
      id: userId,
      name: userName,
      role: userRole,
      department: userDepartment,
    }

    onAddUser(newUser)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setUserId("")
    setUserName("")
    setUserRole("member")
    setUserDepartment("development")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新用户</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">用户ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="例如: zhangsan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">用户姓名</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="例如: 张三"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">角色</Label>
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger id="userRole">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="manager">经理</SelectItem>
                  <SelectItem value="member">成员</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userDepartment">部门</Label>
              <Select value={userDepartment} onValueChange={setUserDepartment}>
                <SelectTrigger id="userDepartment">
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">研发部</SelectItem>
                  <SelectItem value="design">设计部</SelectItem>
                  <SelectItem value="marketing">市场部</SelectItem>
                  <SelectItem value="operations">运营部</SelectItem>
                  <SelectItem value="hr">人力资源部</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">添加用户</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
