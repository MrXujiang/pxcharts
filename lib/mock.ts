function generateTasks(num: number) {
    // 预设基础数据模板
    const baseData = [
        { id: "重要紧急", name: "重要紧急", priority: "重要紧急" },
        { id: "紧急不重要", name: "紧急不重要", priority: "紧急不重要" },
        { id: "重要不紧急", name: "重要不紧急", priority: "重要不紧急" },
    ];

    // 预设任务描述库（可自定义扩展）
    const taskDescriptions = [
        "完成季度市场报告", "筹备客户见面会", "更新产品手册",
        "处理客户投诉", "申请办公设备", "安排技术培训",
        "优化库存管理", "策划品牌活动", "开展竞品分析",
    ];

    // 预设执行人列表（可关联真实人员系统）
    const assignees = [
        { id: "zhoubeihe", name: "周北北" },
        { id: "huangpaopu", name: "黄泡泡" },
        { id: "liubeila", name: "刘贝拉" },
        { id: "wangxiaoyu", name: "王小雨" },
    ];

    // 生成随机日期函数（支持相对日期偏移）
    function randomDate(startOffset = -180, endOffset = 365) {
        const baseDate = new Date();
        const randomDays = Math.floor(Math.random() * (endOffset - startOffset + 1)) + startOffset;
        return new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]; // 格式化为YYYY-MM-DD
    }

    // 核心生成逻辑
    const result = [];
    for (let i = 0; i < num; i++) {
        // 随机选择优先级类别
        const category = baseData[Math.floor(Math.random() * baseData.length)];
        const tasksInCategory = Math.floor(Math.random() * 4) + 1; // 每个类别生成1-4个任务

        // 生成任务列表
        const tasks = [];
        for (let j = 0; j < tasksInCategory; j++) {
            const status = ["待开始", "进行中", "已完成"][Math.floor(Math.random() * 3)];
            const task = {
                id: (i * 10 + j + 10).toString(), // 保证唯一ID
                description: taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)],
                summary: `任务概述：随机生成的任务内容${i + j}`,
                assignee: assignees[Math.floor(Math.random() * assignees.length)],
                status,
                startDate: randomDate(-90, 0), // 开始时间在过去3个月内
                expectedEndDate: randomDate(0, 180), // 预计结束时间在未来6个月内
                isDelayed: Math.random() < 0.2, // 20%概率延迟
                completed: Math.random() < 0.3 && status === "已完成", // 已完成任务占30%
                priority: category.priority,
            };

            // 处理已完成任务的实际结束时间
            if (task.status === "已完成") {
                task.actualEndDate = randomDate(-90, 0); // 实际结束时间在过去3个月内
            }

            tasks.push(task);
        }

        result.push({ ...category, tasks });
    }

    // 去重处理（确保每个任务ID唯一）
    const uniqueTasks = new Map();
    return result.flatMap(category => {
        const filteredTasks = category.tasks.filter(task => {
            if (uniqueTasks.has(task.id)) return false;
            uniqueTasks.set(task.id, true);
            return true;
        });
        return { ...category, tasks: filteredTasks };
    });
}

export { generateTasks };
