"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function CustomerServiceButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 悬浮按钮 */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* 弹窗 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">关注FlowmixAI获取更多AI办公产品</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <img
              src="https://jitword.com/assets/media/wechat.png"
              alt="FlowmixAI 微信二维码"
              className="w-64 h-64 object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
