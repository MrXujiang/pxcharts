export function SettingsDocContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">设置与配置</h2>
      <p className="text-muted-foreground">多维表格提供了丰富的配置选项，您可以根据自己的需求进行个性化设置。</p>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">表格配置</h3>
          <p>您可以通过以下方式自定义表格：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>字段配置</strong>：通过字段配置对话框，您可以添加、删除和重新排序表格列。
            </li>
            <li>
              <strong>分组设置</strong>：使用分组功能按不同维度组织任务，如状态、优先级或负责人。
            </li>
            <li>
              <strong>排序设置</strong>：设置多级排序规则，按照您的偏好排列任务。
            </li>
            <li>
              <strong>筛选设置</strong>：创建复杂的筛选条件，只显示您关心的任务。
            </li>
            <li>
              <strong>视图管理</strong>：创建和保存多个自定义视图，快速切换不同的数据展示方式。
            </li>
            <li>
              <strong>条件格式</strong>：根据单元格内容设置不同的显示样式，突出重要信息。
            </li>
          </ul>
          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium">视图共享</h4>
            <p className="text-sm text-muted-foreground mt-1">
              您可以将自定义视图共享给团队成员，确保团队内部使用统一的数据视图。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">数据存储</h3>
          <p>多维表格支持多种数据存储方式：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>本地存储</strong>：默认使用浏览器的localStorage存储数据，适合个人使用。
            </li>
            <li>
              <strong>云端同步</strong>：可配置云端存储，实现多设备数据同步。
            </li>
            <li>
              <strong>私有部署</strong>：企业用户可以选择私有部署方案，数据存储在自己的服务器上。
            </li>
            <li>
              <strong>数据库集成</strong>：支持与MySQL、PostgreSQL等数据库系统集成。
            </li>
            <li>
              <strong>数据备份</strong>：定期自动备份数据，防止数据丢失。
            </li>
            <li>
              <strong>版本控制</strong>：记录数据变更历史，支持回滚到之前的版本。
            </li>
          </ul>
        </div>

        <h2 className="font-semibold" style={{fontSize: 32}}>可扩展的业务场景</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">通知设置</h3>
          <p>配置任务提醒和通知：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>截止日期提醒</strong>：设置任务截止日期前的提醒时间。
            </li>
            <li>
              <strong>状态变更通知</strong>：当任务状态变更时接收通知。
            </li>
            <li>
              <strong>分配通知</strong>：当任务分配给您时接收通知。
            </li>
            <li>
              <strong>通知方式</strong>：选择通知方式，如浏览器通知、邮件或移动应用推送。
            </li>
            <li>
              <strong>通知频率</strong>：设置通知的发送频率，避免过多打扰。
            </li>
            <li>
              <strong>自定义通知</strong>：创建基于特定条件的自定义通知规则。
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">权限管理</h3>
          <p>设置用户权限和访问控制：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>用户角色</strong>：定义不同的用户角色，如管理员、编辑者、查看者等。
            </li>
            <li>
              <strong>字段级权限</strong>：控制用户对特定字段的访问权限。
            </li>
            <li>
              <strong>记录级权限</strong>：基于记录属性控制用户访问权限。
            </li>
            <li>
              <strong>视图权限</strong>：控制用户可以访问的视图。
            </li>
            <li>
              <strong>操作权限</strong>：控制用户可以执行的操作，如创建、编辑、删除等。
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">集成设置</h3>
          <p>配置与第三方系统的集成：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>API集成</strong>：通过API与其他系统进行数据交换。
            </li>
            <li>
              <strong>Webhook</strong>：设置Webhook接收实时事件通知。
            </li>
            <li>
              <strong>邮件集成</strong>：通过邮件创建和更新任务。
            </li>
            <li>
              <strong>日历同步</strong>：与Google日历、Outlook等日历系统同步。
            </li>
            <li>
              <strong>文件存储</strong>：与Google Drive、Dropbox等文件存储服务集成。
            </li>
            <li>
              <strong>通信工具</strong>：与Slack、Teams等通信工具集成。
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
