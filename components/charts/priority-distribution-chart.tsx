import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Task } from "@/lib/types"

interface PriorityDistributionChartProps {
  tasks: Task[]
}

export function PriorityDistributionChart({ tasks }: PriorityDistributionChartProps) {
  // 计算每个优先级的任务数量
  const priorityCounts: Record<string, number> = {}

  tasks.forEach((task) => {
    const priority = task.priority || "未设置"
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1
  })

  // 转换为图表数据格式
  const chartData = Object.entries(priorityCounts).map(([priority, count]) => ({
    priority,
    count,
  }))

  // 为不同优先级设置不同颜色
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"]

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="priority"
            label={({ priority, percent }) => `${priority}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value} 个任务`, props.payload.priority]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
