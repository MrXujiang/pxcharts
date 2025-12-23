export function IntroDocContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">入门指南</h2>
      <p className="text-muted-foreground">
        欢迎使用多维表格！本指南将帮助您快速上手，了解系统的基本功能和使用方法。
        多维表格是一款功能强大的任务管理工具，专为团队协作和项目管理设计。
      </p>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">系统概览</h3>
        <p>多维表格系统包含多个核心模块，每个模块负责不同的功能：</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-lg">表格视图</h4>
            <p className="text-sm text-muted-foreground mt-1">展示所有任务的详细信息，支持排序、筛选、分组等操作。</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-lg">看板视图</h4>
            <p className="text-sm text-muted-foreground mt-1">
              以卡片形式展示任务，按状态分列，通过拖拽操作管理任务状态。
            </p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-lg">统计分析</h4>
            <p className="text-sm text-muted-foreground mt-1">
              提供多维度的数据分析图表，帮助了解项目进展和资源分配情况。
            </p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-lg">人员分配</h4>
            <p className="text-sm text-muted-foreground mt-1">查看团队成员的任务分配情况，合理调配人力资源。</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">快速开始</h3>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <div>
              <strong className="text-lg">创建任务</strong>
              <p className="text-muted-foreground mt-1">
                点击表格视图中的"添加任务"按钮，在弹出的对话框中填写任务信息。
              </p>
              <div className="mt-2 border rounded-md p-3 bg-gray-50">
                <p className="text-sm">
                  <strong>提示：</strong> 任务创建后，您可以随时通过双击单元格来编辑任务信息。
                </p>
              </div>
            </div>
          </li>
          <li>
            <div>
              <strong className="text-lg">组织任务</strong>
              <p className="text-muted-foreground mt-1">使用分组功能按状态、优先级或负责人等维度组织任务。</p>
              <div className="mt-2 border rounded-md p-3 bg-gray-50">
                <p className="text-sm">
                  <strong>提示：</strong> 点击表格顶部的"分组"按钮，选择您想要的分组维度。
                </p>
              </div>
            </div>
          </li>
          <li>
            <div>
              <strong className="text-lg">跟踪进度</strong>
              <p className="text-muted-foreground mt-1">通过看板视图直观地跟踪任务状态和进度。</p>
              <div className="mt-2 border rounded-md p-3 bg-gray-50">
                <p className="text-sm">
                  <strong>提示：</strong> 在看板视图中，您可以通过拖拽任务卡片来更改任务状态。
                </p>
              </div>
            </div>
          </li>
          <li>
            <div>
              <strong className="text-lg">分析数据</strong>
              <p className="text-muted-foreground mt-1">使用统计视图分析任务分布和团队绩效。</p>
              <div className="mt-2 border rounded-md p-3 bg-gray-50">
                <p className="text-sm">
                  <strong>提示：</strong> 统计视图提供多种图表类型，帮助您从不同角度分析项目数据。
                </p>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">视频教程</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <p className="text-muted-foreground">基础功能教程（敬请期待）</p>
            </div>
            <div className="p-3">
              <h4 className="font-medium">多维表格基础使用</h4>
              <p className="text-sm text-muted-foreground mt-1">学习创建、编辑和管理任务的基本操作</p>
            </div>
          </div>
          <div className="border rounded-md overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <p className="text-muted-foreground">高级功能教程（敬请期待）</p>
            </div>
            <div className="p-3">
              <h4 className="font-medium">高级功能与自定义</h4>
              <p className="text-sm text-muted-foreground mt-1">掌握筛选、排序、分组等高级功能</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">常见问题</h3>
        <div className="space-y-3">
          <div className="border rounded-md p-4">
            <h4 className="font-medium">如何获取源代码？</h4>
            <p className="text-sm text-muted-foreground mt-1">
              您可以通过平台的【私有化部署】页面了解，或者加作者微信【cxzk_168】咨询。
            </p>
          </div>
          <div className="border rounded-md p-4">
            <h4 className="font-medium">如何共享我的表格？</h4>
            <p className="text-sm text-muted-foreground mt-1">
              多维表格采用结构化的JSON数据，可以通过本地JSON或者服务端生成JSON的方式渲染并共享多维表格。
            </p>
          </div>
          <div className="border rounded-md p-4">
            <h4 className="font-medium">数据是如何保存的？</h4>
            <p className="text-sm text-muted-foreground mt-1">
              默认情况下，数据保存在浏览器的本地存储中。如果您需要跨设备访问，请实现对应的API接口保存数据。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
