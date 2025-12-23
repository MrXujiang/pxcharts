"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Database, BarChart2, FileText, Server, Globe } from "lucide-react"

interface SidebarItemProps {
  icon: React.ReactNode
  children: React.ReactNode
  isActive?: boolean
  badge?: React.ReactNode
  onClick: () => void
}

export function SidebarItem({ icon, children, isActive, badge, onClick }: SidebarItemProps) {
  return (
      <button
          onClick={onClick}
          className={cn(
              "flex items-center p-2 rounded-md hover:bg-gray-100 text-sm w-full text-left",
              isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700",
          )}
      >
        <span className={cn("mr-2", isActive ? "text-blue-600" : "text-gray-500")}>{icon}</span>
        <span>{children}</span>
        {badge && <span className="ml-auto">{badge}</span>}
      </button>
  )
}

export function SidebarNavigation({
                                    onNavigate,
                                    activeView,
                                  }: { onNavigate: (view: string) => void; activeView: string }) {
  return (
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">pxcharts 多维表格开源版</h2>
          <p className="text-xs text-gray-500">pxcharts多维表格引擎 v1.0</p>
        </div>

        <div className="space-y-1">
          <SidebarItem
              icon={<Database className="h-4 w-4" />}
              isActive={activeView === "tasks"}
              onClick={() => onNavigate("tasks")}
          >
            任务管理
          </SidebarItem>
          <SidebarItem
              icon={<BarChart2 className="h-4 w-4" />}
              isActive={activeView === "statistics"}
              onClick={() => onNavigate("statistics")}
          >
            任务统计看板
          </SidebarItem>
          <SidebarItem
              icon={<FileText className="h-4 w-4" />}
              isActive={activeView === "documentation"}
              onClick={() => onNavigate("documentation")}
          >
            使用说明文档
          </SidebarItem>
          <SidebarItem
              icon={<Server className="h-4 w-4" />}
              isActive={activeView === "deployment"}
              onClick={() => onNavigate("deployment")}
          >
            私有化部署
          </SidebarItem>
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <SidebarItem
                icon={<Globe className="h-4 w-4" />}
                isActive={false}
                onClick={() => window.open('http://pxcharts.com', '_blank')}
            >
              访问官网
            </SidebarItem>
          </div>
        </div>
      </div>
  )
}
