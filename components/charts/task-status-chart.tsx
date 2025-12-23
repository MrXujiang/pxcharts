import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Task } from "@/lib/types"

interface TaskStatusChartProps {
  tasks: Task[]
}

export function TaskStatusChart({ tasks }: TaskStatusChartProps) {
  // 计算每个状态的任务数量
  const statusCounts: Record<string, number> = {}

  tasks.forEach((task) => {
    const status = task.status || "未设置"
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })

  // 转换为图表数据格式
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }))

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="任务数量" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
