export function FeatureDocContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">功能介绍</h2>
      <p className="text-muted-foreground">
        多维表格是一个强大的任务管理工具，提供多种视图和功能来帮助您高效管理项目和任务。
      </p>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">表格视图</h3>
          <p>表格视图是多维表格的核心功能，提供了直观的任务列表，支持以下功能：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>任务创建、编辑和删除</li>
            <li>任务分组和排序</li>
            <li>自定义字段配置</li>
            <li>任务筛选和搜索</li>
            <li>任务优先级调整</li>
            <li>拖拽排序</li>
            <li>批量编辑</li>
            <li>数据导入导出</li>
            <li>历史记录和版本控制</li>
            <li>单元格格式化和条件格式</li>
          </ul>
          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium">高级表格功能</h4>
            <p className="text-sm text-muted-foreground mt-1">
              表格视图还支持多级表头、冻结列、行高调整、列宽调整等高级功能，满足复杂的数据展示需求。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">看板视图</h3>
          <p>看板视图提供了可视化的任务管理方式，支持以下功能：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>任务状态可视化</li>
            <li>拖拽任务更改状态</li>
            <li>按状态分组查看任务</li>
            <li>快速添加新任务</li>
            <li>任务卡片自定义</li>
            <li>泳道视图</li>
            <li>WIP限制（在制品数量限制）</li>
            <li>任务流转历史</li>
          </ul>
          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium">看板最佳实践</h4>
            <p className="text-sm text-muted-foreground mt-1">
              看板视图最适合敏捷开发团队和需要可视化工作流程的项目。通过限制每个状态的任务数量，可以帮助团队发现瓶颈并优化工作流程。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">统计分析</h3>
          <p>统计分析功能提供了多维度的任务数据分析，帮助您了解项目进展和资源分配：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>任务状态分布</li>
            <li>任务优先级分布</li>
            <li>人员工作负载</li>
            <li>项目进度趋势</li>
            <li>自定义报表</li>
            <li>数据导出</li>
            <li>周期性报告</li>
            <li>关键指标监控</li>
            <li>预测分析</li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium">实时数据</h4>
              <p className="text-sm text-muted-foreground mt-1">
                统计分析功能提供实时数据更新，让您随时了解项目最新状态。
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium">自定义仪表板</h4>
              <p className="text-sm text-muted-foreground mt-1">
                您可以根据自己的需求创建自定义仪表板，展示最关心的指标和图表。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">人员分配视图</h3>
          <p>人员分配视图帮助您管理团队成员的工作分配：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>按人员查看任务分配</li>
            <li>工作负载均衡</li>
            <li>资源冲突检测</li>
            <li>技能匹配</li>
            <li>可用性日历</li>
            <li>团队协作</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">私有化部署</h3>
          <p>私有化部署功能允许您在自己的服务器上部署多维表格，保障数据安全：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>数据驱动的多维表格渲染和存储</li>
            <li>数据本地存储</li>
            <li>自定义配置选项</li>
            <li>企业级安全保障</li>
            <li>轻松集成到企业业务系统</li>
            <li>支持自动备份和恢复</li>
            <li>支持源码级二次开发扩展</li>
            <li>支持专业的技术培训</li>
          </ul>
          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium">企业级支持</h4>
            <p className="text-sm text-muted-foreground mt-1">
              私有化部署版本提供企业级支持，包括专属技术支持、定制开发（付费）和培训服务。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">应用场景：自动化工作流</h3>
          <p>自动化工作流功能帮助您减少重复性工作：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>自定义触发条件</li>
            <li>自动任务分配</li>
            <li>状态变更通知</li>
            <li>截止日期提醒</li>
            <li>周期性任务创建</li>
            <li>条件逻辑</li>
            <li>与外部系统集成</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
