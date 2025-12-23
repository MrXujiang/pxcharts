import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Task } from "@/lib/types"

interface WorkloadChartProps {
  tasks: Task[]
}

export function WorkloadChart({ tasks }: WorkloadChartProps) {
  // 计算每个人的任务数量
  const assigneeCounts: Record<string, number> = {}

  tasks.forEach((task) => {
    const assignee = task.assignee || "未分配"
    assigneeCounts[assignee] = (assigneeCounts[assignee] || 0) + 1
  })

  // 转换为图表数据格式
  const chartData = Object.entries(assigneeCounts)
    .map(([assignee, count]) => ({
      assignee,
      count,
    }))
    .sort((a, b) => b.count - a.count) // 按任务数量降序排序

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="assignee" type="category" width={80} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="任务数量" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
