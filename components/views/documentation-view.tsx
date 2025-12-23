"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, BookOpen, Settings, Code } from "lucide-react"
import { IntroDocContent } from "../documentation/intro-doc-content"
import { FeatureDocContent } from "../documentation/feature-doc-content"
import { SettingsDocContent } from "../documentation/settings-doc-content"
import { DevDocContent } from "../documentation/dev-doc-content"

type DocSection = "intro" | "features" | "settings" | "development"

export function DocumentationView() {
  const [activeSection, setActiveSection] = useState<DocSection>("intro")

  const renderContent = () => {
    switch (activeSection) {
      case "intro":
        return <IntroDocContent />
      case "features":
        return <FeatureDocContent />
      case "settings":
        return <SettingsDocContent />
      case "development":
        return <DevDocContent />
      default:
        return <IntroDocContent />
    }
  }

  return (
      <div className="flex h-full">
        {/* 左侧导航区域 - 固定不滚动 */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-6 text-xl font-semibold">文档目录</h2>

          <nav className="space-y-1">
            <button
                onClick={() => setActiveSection("intro")}
                className={cn(
                    "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                    activeSection === "intro"
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              <span>入门指南</span>
            </button>

            <button
                onClick={() => setActiveSection("features")}
                className={cn(
                    "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                    activeSection === "features"
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>功能介绍</span>
            </button>

            <button
                onClick={() => setActiveSection("settings")}
                className={cn(
                    "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                    activeSection === "settings"
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>设置与配置</span>
            </button>

            <button
                onClick={() => setActiveSection("development")}
                className={cn(
                    "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                    activeSection === "development"
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
            >
              <Code className="mr-2 h-4 w-4" />
              <span>使用和二次开发</span>
            </button>
          </nav>
        </div>

        {/* 右侧内容区域 - 内部滚动 */}
        <div className="flex-1 h-full overflow-hidden" style={{background: '#fff'}}>
          <ScrollArea className="h-full w-full" style={{height: '100vh'}}>
            <div className="p-6">{renderContent()}</div>
          </ScrollArea>
        </div>
      </div>
  )
}
