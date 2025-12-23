"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTaskStore } from "@/lib/task-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Filter, RefreshCw } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bar, Pie, Line, Doughnut, PolarArea, Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
} from "chart.js"

// 注册 ChartJS 组件
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler,
)

export function StatisticsView() {
  const { data } = useTaskStore()
  const [timeRange, setTimeRange] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // 从所有任务中提取数据
  const allTasks = data.priorityGroups.flatMap((group) => group.tasks)

  // 按状态统计
  const statusCounts = allTasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
  )

  // 按优先级统计
  const priorityCounts = allTasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
  )

  // 按执行人统计
  const assigneeCounts = allTasks.reduce(
      (acc, task) => {
        acc[task.assignee.name] = (acc[task.assignee.name] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
  )

  // 按完成状态统计
  const completionStatus = {
    已完成: allTasks.filter((task) => task.completed).length,
    进行中: allTasks.filter((task) => !task.completed).length,
  }

  // 按月份统计任务数量（用于趋势图）
  const getMonthlyTaskData = () => {
    const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    const currentYear = new Date().getFullYear()

    return months.map((month, index) => {
      const monthIndex = index
      const tasksInMonth = allTasks.filter((task) => {
        const startDate = new Date(task.startDate.replace(/\//g, "-"))
        return startDate.getMonth() === monthIndex && startDate.getFullYear() === currentYear
      })

      return {
        name: month,
        新增任务: tasksInMonth.length,
        完成任务: tasksInMonth.filter((task) => task.completed).length,
      }
    })
  }

  // 按周统计任务完成情况
  const getWeeklyCompletionData = () => {
    const weeks = ["第1周", "第2周", "第3周", "第4周"]

    return weeks.map((week) => {
      // 模拟数据，实际应用中应根据真实日期计算
      const completedTasks = Math.floor(Math.random() * 10) + 5
      const totalTasks = completedTasks + Math.floor(Math.random() * 8)

      return {
        name: week,
        完成率: (completedTasks / totalTasks) * 100,
        任务数: totalTasks,
      }
    })
  }

  // 按优先级和状态的交叉分析
  const getPriorityStatusData = () => {
    const priorities = ["重要紧急", "紧急不重要", "重要不紧急"]
    const statuses = ["已完成", "进行中", "待开始", "已停滞"]

    const result: Record<string, Record<string, number>> = {}

    priorities.forEach((priority) => {
      result[priority] = {}
      statuses.forEach((status) => {
        result[priority][status] = allTasks.filter(
            (task) => task.priority === priority && task.status === status,
        ).length
      })
    })

    return result
  }

  // 计算任务延期情况
  const getTaskDelayData = () => {
    // 模拟数据，实际应用中应根据真实截止日期计算
    return {
      按时完成: Math.floor(allTasks.length * 0.65),
      轻微延期: Math.floor(allTasks.length * 0.2),
      严重延期: Math.floor(allTasks.length * 0.15),
    }
  }

  // 图表数据
  const chartData = {
    status: {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "任务数量",
          data: Object.values(statusCounts),
          backgroundColor: ["#4ade80", "#facc15", "#f87171", "#94a3b8"],
        },
      ],
    },
    priority: {
      labels: Object.keys(priorityCounts),
      datasets: [
        {
          label: "任务数量",
          data: Object.values(priorityCounts),
          backgroundColor: ["#f87171", "#facc15", "#4ade80"],
        },
      ],
    },
    assignee: {
      labels: Object.keys(assigneeCounts),
      datasets: [
        {
          label: "任务数量",
          data: Object.values(assigneeCounts),
          backgroundColor: ["#a78bfa", "#38bdf8", "#fb923c", "#4ade80", "#f87171"],
        },
      ],
    },
    monthly: {
      labels: getMonthlyTaskData().map((item) => item.name),
      datasets: [
        {
          label: "新增任务",
          data: getMonthlyTaskData().map((item) => item.新增任务),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
        },
        {
          label: "完成任务",
          data: getMonthlyTaskData().map((item) => item.完成任务),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.5)",
        },
      ],
    },
    weekly: {
      labels: getWeeklyCompletionData().map((item) => item.name),
      datasets: [
        {
          label: "完成率 (%)",
          data: getWeeklyCompletionData().map((item) => item.完成率),
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.5)",
          yAxisID: "y",
        },
        {
          type: "bar" as const,
          label: "任务数",
          data: getWeeklyCompletionData().map((item) => item.任务数),
          backgroundColor: "rgba(249, 115, 22, 0.5)",
          yAxisID: "y1",
        },
      ],
    },
    delay: {
      labels: Object.keys(getTaskDelayData()),
      datasets: [
        {
          label: "任务数量",
          data: Object.values(getTaskDelayData()),
          backgroundColor: ["#4ade80", "#facc15", "#f87171"],
        },
      ],
    },
    radar: {
      labels: ["任务管理", "时间管理", "资源分配", "风险控制", "沟通协作", "质量控制"],
      datasets: [
        {
          label: "团队表现",
          data: [85, 75, 90, 80, 95, 70],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
  }

  const monthlyData = getMonthlyTaskData()
  const priorityStatusData = getPriorityStatusData()

  return (
      <ScrollArea className="h-screen">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">任务统计看板</h1>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部时间</SelectItem>
                  <SelectItem value="today">今天</SelectItem>
                  <SelectItem value="week">本周</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="quarter">本季度</SelectItem>
                  <SelectItem value="year">本年度</SelectItem>
                </SelectContent>
              </Select>
              {/*<Button variant="outline">*/}
              {/*  <Filter className="h-4 w-4 mr-2" />*/}
              {/*  筛选*/}
              {/*</Button>*/}
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="overview">总览</TabsTrigger>
              <TabsTrigger value="progress">进度分析</TabsTrigger>
              <TabsTrigger value="personnel">人员分析</TabsTrigger>
              <TabsTrigger value="priority">优先级分析</TabsTrigger>
              <TabsTrigger value="performance">绩效分析</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">总任务数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allTasks.length}</div>
                    <p className="text-xs text-gray-500 mt-1">较上月 {allTasks.length > 10 ? "+5" : "+2"} 个任务</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">完成率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {((completionStatus.已完成 / allTasks.length) * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${(completionStatus.已完成 / allTasks.length) * 100}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">进行中任务</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allTasks.filter((task) => task.status === "进行中").length}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      占总任务{" "}
                      {Math.round((allTasks.filter((task) => task.status === "进行中").length / allTasks.length) * 100)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">重要紧急任务</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {allTasks.filter((task) => task.priority === "重要紧急").length}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      完成 {allTasks.filter((task) => task.priority === "重要紧急" && task.completed).length} 个
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>任务状态分布</CardTitle>
                    <CardDescription>各状态任务数量分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Pie data={chartData.status} options={{ maintainAspectRatio: false }} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>任务优先级分布</CardTitle>
                    <CardDescription>各优先级任务数量分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar
                          data={chartData.priority}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  precision: 0,
                                },
                              },
                            },
                          }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>任务趋势</CardTitle>
                  <CardDescription>按月份统计的任务新增和完成情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line
                        data={chartData.monthly}
                        options={{
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0,
                              },
                            },
                          },
                        }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">平均任务完成时间</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.5 天</div>
                    <p className="text-xs text-gray-500 mt-1">较上月 -0.5 天</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">任务延期率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15.2%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "15.2%" }}></div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">周环比增长</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+12.5%</div>
                    <p className="text-xs text-gray-500 mt-1">任务完成效率提升</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>周任务完成情况</CardTitle>
                    <CardDescription>按周统计的任务完成率和数量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Line
                          data={chartData.weekly}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                type: "linear",
                                display: true,
                                position: "left",
                                title: {
                                  display: true,
                                  text: "完成率 (%)",
                                },
                              },
                              y1: {
                                type: "linear",
                                display: true,
                                position: "right",
                                title: {
                                  display: true,
                                  text: "任务数",
                                },
                                grid: {
                                  drawOnChartArea: false,
                                },
                              },
                            },
                          }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>任务延期情况</CardTitle>
                    <CardDescription>任务延期分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Doughnut data={chartData.delay} options={{ maintainAspectRatio: false }} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>任务完成时间分布</CardTitle>
                  <CardDescription>各类任务的平均完成时间（天）</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar
                        data={{
                          labels: ["重要紧急", "紧急不重要", "重要不紧急"],
                          datasets: [
                            {
                              label: "平均完成时间（天）",
                              data: [2.5, 3.8, 6.2],
                              backgroundColor: ["#f87171", "#facc15", "#4ade80"],
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personnel" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">人均任务数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(allTasks.length / Object.keys(assigneeCounts).length).toFixed(1)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">共 {Object.keys(assigneeCounts).length} 名成员</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">最高任务负载</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.max(...Object.values(assigneeCounts))} 个任务</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Object.entries(assigneeCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">平均完成率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78.3%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "78.3%" }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>人员任务分布</CardTitle>
                    <CardDescription>各人员任务数量分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar
                          data={chartData.assignee}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  precision: 0,
                                },
                              },
                            },
                          }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>人员完成率对比</CardTitle>
                    <CardDescription>各人员任务完成率</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar
                          data={{
                            labels: Object.keys(assigneeCounts),
                            datasets: [
                              {
                                label: "完成率 (%)",
                                data: Object.keys(assigneeCounts).map(() => Math.floor(Math.random() * 30) + 70),
                                backgroundColor: "#3b82f6",
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                              },
                            },
                          }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>人员工作负载趋势</CardTitle>
                  <CardDescription>按月统计的人员任务分配情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line
                        data={{
                          labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
                          datasets: Object.keys(assigneeCounts).map((name, index) => ({
                            label: name,
                            data: Array(6)
                                .fill(0)
                                .map(() => Math.floor(Math.random() * 5) + 3),
                            borderColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5],
                            backgroundColor: [
                              "rgba(59, 130, 246, 0.5)",
                              "rgba(16, 185, 129, 0.5)",
                              "rgba(245, 158, 11, 0.5)",
                              "rgba(239, 68, 68, 0.5)",
                              "rgba(139, 92, 246, 0.5)",
                            ][index % 5],
                          })),
                        }}
                        options={{
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0,
                              },
                            },
                          },
                        }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="priority" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">重要紧急任务比例</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(((priorityCounts["重要紧急"] || 0) / allTasks.length) * 100)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                          className="bg-red-600 h-2.5 rounded-full"
                          style={{ width: `${Math.round(((priorityCounts["重要紧急"] || 0) / allTasks.length) * 100)}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">重要不紧急任务比例</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(((priorityCounts["重要不紧急"] || 0) / allTasks.length) * 100)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                          className="bg-yellow-500 h-2.5 rounded-full"
                          style={{ width: `${Math.round(((priorityCounts["重要不紧急"] || 0) / allTasks.length) * 100)}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">紧急不重要任务比例</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(((priorityCounts["紧急不重要"] || 0) / allTasks.length) * 100)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                          className="bg-orange-500 h-2.5 rounded-full"
                          style={{ width: `${Math.round(((priorityCounts["紧急不重要"] || 0) / allTasks.length) * 100)}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>优先级与状态交叉分析</CardTitle>
                    <CardDescription>各优先级任务在不同状态下的分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar
                          data={{
                            labels: ["重要紧急", "紧急不重要", "重要不紧急"],
                            datasets: [
                              {
                                label: "已完成",
                                data: [
                                  priorityStatusData["重要紧急"]?.["已完成"] || 0,
                                  priorityStatusData["紧急不重要"]?.["已完成"] || 0,
                                  priorityStatusData["重要不紧急"]?.["已完成"] || 0,
                                ],
                                backgroundColor: "#4ade80",
                              },
                              {
                                label: "进行中",
                                data: [
                                  priorityStatusData["重要紧急"]?.["进行中"] || 0,
                                  priorityStatusData["紧急不重要"]?.["进行中"] || 0,
                                  priorityStatusData["重要不紧急"]?.["进行中"] || 0,
                                ],
                                backgroundColor: "#facc15",
                              },
                              {
                                label: "待开始",
                                data: [
                                  priorityStatusData["重要紧急"]?.["待开始"] || 0,
                                  priorityStatusData["紧急不重要"]?.["待开始"] || 0,
                                  priorityStatusData["重要不紧急"]?.["待开始"] || 0,
                                ],
                                backgroundColor: "#f87171",
                              },
                              {
                                label: "已停滞",
                                data: [
                                  priorityStatusData["重要紧急"]?.["已停滞"] || 0,
                                  priorityStatusData["紧急不重要"]?.["已停滞"] || 0,
                                  priorityStatusData["重要不紧急"]?.["已停滞"] || 0,
                                ],
                                backgroundColor: "#94a3b8",
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              x: {
                                stacked: true,
                              },
                              y: {
                                stacked: true,
                                beginAtZero: true,
                                ticks: {
                                  precision: 0,
                                },
                              },
                            },
                          }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>优先级趋势变化</CardTitle>
                    <CardDescription>按月统计的各优先级任务数量变化</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Line
                          data={{
                            labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
                            datasets: [
                              {
                                label: "重要紧急",
                                data: [4, 6, 8, 5, 7, 9],
                                borderColor: "#ef4444",
                                backgroundColor: "rgba(239, 68, 68, 0.5)",
                              },
                              {
                                label: "紧急不重要",
                                data: [7, 5, 6, 8, 6, 4],
                                borderColor: "#f97316",
                                backgroundColor: "rgba(249, 115, 22, 0.5)",
                              },
                              {
                                label: "重要不紧急",
                                data: [5, 7, 9, 8, 10, 12],
                                borderColor: "#eab308",
                                backgroundColor: "rgba(234, 179, 8, 0.5)",
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  precision: 0,
                                },
                              },
                            },
                          }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>优先级分配情况</CardTitle>
                  <CardDescription>各执行人的优先级任务分配</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar
                        data={{
                          labels: Object.keys(assigneeCounts),
                          datasets: [
                            {
                              label: "重要紧急",
                              data: Object.keys(assigneeCounts).map(() => Math.floor(Math.random() * 5) + 1),
                              backgroundColor: "#ef4444",
                            },
                            {
                              label: "紧急不重要",
                              data: Object.keys(assigneeCounts).map(() => Math.floor(Math.random() * 5) + 1),
                              backgroundColor: "#f97316",
                            },
                            {
                              label: "重要不紧急",
                              data: Object.keys(assigneeCounts).map(() => Math.floor(Math.random() * 5) + 1),
                              backgroundColor: "#eab308",
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          scales: {
                            x: {
                              stacked: true,
                            },
                            y: {
                              stacked: true,
                              beginAtZero: true,
                              ticks: {
                                precision: 0,
                              },
                            },
                          },
                        }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">团队效能指数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">82.5</div>
                    <p className="text-xs text-gray-500 mt-1">较上月 +3.2</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">任务质量评分</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.7/5.0</div>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                              key={star}
                              className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">平均响应时间</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2 天</div>
                    <p className="text-xs text-gray-500 mt-1">较上月 -0.3 天</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>团队能力雷达图</CardTitle>
                    <CardDescription>团队在各方面的表现评估</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Radar data={chartData.radar} options={{ maintainAspectRatio: false }} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>绩效评估</CardTitle>
                    <CardDescription>团队成员绩效评估</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <PolarArea
                          data={{
                            labels: Object.keys(assigneeCounts),
                            datasets: [
                              {
                                label: "绩效评分",
                                data: Object.keys(assigneeCounts).map(() => Math.floor(Math.random() * 20) + 80),
                                backgroundColor: [
                                  "rgba(75, 192, 192, 0.5)",
                                  "rgba(54, 162, 235, 0.5)",
                                  "rgba(153, 102, 255, 0.5)",
                                  "rgba(255, 159, 64, 0.5)",
                                  "rgba(255, 99, 132, 0.5)",
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              r: {
                                min: 70,
                              },
                            },
                          }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>绩效趋势</CardTitle>
                  <CardDescription>团队绩效随时间变化趋势</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line
                        data={{
                          labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
                          datasets: [
                            {
                              label: "团队效能",
                              data: [75, 78, 76, 80, 82, 85],
                              borderColor: "#8b5cf6",
                              backgroundColor: "rgba(139, 92, 246, 0.5)",
                              fill: true,
                            },
                          ],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false,
                              min: 70,
                              max: 100,
                            },
                          },
                        }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
  )
}
