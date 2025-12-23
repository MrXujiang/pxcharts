import type { TaskData } from "./types"
import { generateTasks } from './mock'

export const initialData: TaskData = {
  priorityGroups: [
    {
      id: "重要紧急",
      name: "重要紧急",
      tasks: [
        {
          id: "1",
          description: "完成年度财务报表",
          summary:
            "1. 任务执行人于小宇正在进行年度财务报告的制作，已经收集了所有必要的财务数据。\n2. 由于某些原因，任务已经被延期。\n3. 预计下周完成初稿。",
          assignee: {
            id: "zhoubeihe",
            name: "周北北",
          },
          status: "进行中",
          startDate: "2024/11/18",
          expectedEndDate: "2025/11/01",
          isDelayed: false,
          completed: false,
          priority: "重要紧急",
        },
        {
          id: "2",
          description: "组织年度员工团建活动",
          summary: "团建活动计划已完成，包括场地预订、活动安排和预算分配。",
          assignee: {
            id: "zhoubeihe",
            name: "周北北",
          },
          status: "已完成",
          startDate: "2024/11/08",
          expectedEndDate: "2025/12/26",
          actualEndDate: "2024/11/16",
          isDelayed: false,
          completed: true,
          priority: "重要紧急",
        },
        {
          id: "3",
          description: "更新公司网站",
          summary: "网站更新内容已确定，包括新产品信息、团队介绍和客户案例。",
          assignee: {
            id: "huangpaopu",
            name: "黄泡泡",
          },
          status: "进行中",
          startDate: "2023/02/04",
          isDelayed: false,
          completed: false,
          priority: "重要紧急",
        },
        {
          id: "4",
          description: "招聘新员工",
          summary: "已发布招聘信息，正在筛选简历和安排面试。",
          assignee: {
            id: "zhoubeihe",
            name: "周北北",
          },
          status: "进行中",
          startDate: "2024/11/27",
          expectedEndDate: "2025/11/20",
          isDelayed: false,
          completed: false,
          priority: "重要紧急",
        },
      ],
    },
    {
      id: "紧急不重要",
      name: "紧急不重要",
      tasks: [
        {
          id: "5",
          description: "开发新产品",
          summary: "产品需求已确定，正在进行原型设计和功能规划。",
          assignee: {
            id: "huangpaopu",
            name: "黄泡泡",
          },
          status: "待开始",
          startDate: "2024/12/03",
          expectedEndDate: "2025/10/01",
          isDelayed: false,
          completed: false,
          priority: "紧急不重要",
        },
        {
          id: "6",
          description: "进行客户满意度调查",
          summary: "调查问卷已设计完成，准备发送给客户。",
          assignee: {
            id: "liubeila",
            name: "刘贝拉",
          },
          status: "待开始",
          startDate: "2024/11/30",
          isDelayed: false,
          completed: false,
          priority: "紧急不重要",
        },
      ],
    },
    {
      id: "重要不紧急",
      name: "重要不紧急",
      tasks: [
        {
          id: "7",
          description: "优化供应链管理",
          summary: "正在分析当前供应链流程，识别优化点和改进方案。",
          assignee: {
            id: "huangpaopu",
            name: "黄泡泡",
          },
          status: "待开始",
          startDate: "2024/11/29",
          isDelayed: false,
          completed: false,
          priority: "重要不紧急",
        },
        {
          id: "8",
          description: "改善工作环境",
          summary: "收集员工反馈，制定办公环境改善计划。",
          assignee: {
            id: "zhoubeihe",
            name: "周北北",
          },
          status: "进行中",
          startDate: "2024/11/23",
          isDelayed: false,
          completed: false,
          priority: "重要不紧急",
        },
        {
          id: "9",
          description: "制定新的销售策略",
          summary: "分析市场数据，制定针对不同客户群体的销售策略。",
          assignee: {
            id: "liubeila",
            name: "刘贝拉",
          },
          status: "进行中",
          startDate: "2024/11/25",
          isDelayed: false,
          completed: false,
          priority: "重要不紧急",
        },
      ],
    },
  ],
}
