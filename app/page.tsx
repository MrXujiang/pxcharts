// @ts-nocheck
"use client"
import { useState } from "react"
import TaskManagementTable from "@/components/task-management-table"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { StatisticsView } from "@/components/views/statistics-view"
import { DocumentationView } from "@/components/views/documentation-view"
import { AssignmentView } from "@/components/views/assignment-view"
import { DeploymentView } from "@/components/views/deployment-view"
import { CustomerServiceButton } from "@/components/customer-service-button"

export default function Home() {
  const [currentView, setCurrentView] = useState("tasks")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="w-64 border-r border-gray-200 bg-white flex-shrink-0">
          <SidebarNavigation onNavigate={handleNavigate} activeView={currentView} />
        </div>
      )}
      <div className="flex-1 bg-gray-50">
        {currentView === "tasks" && <TaskManagementTable sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        {currentView === "statistics" && <StatisticsView />}
        {currentView === "documentation" && <DocumentationView />}
        {currentView === "assignment" && <AssignmentView />}
        {currentView === "deployment" && <DeploymentView />}
      </div>
      <CustomerServiceButton />
    </div>
  )
}
