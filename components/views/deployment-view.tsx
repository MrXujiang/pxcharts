"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Server,
  Database,
  Shield,
  Settings,
  Download,
  Users,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  Building,
  CheckCheck,
  X,
  Zap,
  Award,
  BarChart,
  Lock,
} from "lucide-react"

export function DeploymentView() {
  const [activeTab, setActiveTab] = useState("contact")
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [isDeploying, setIsDeploying] = useState(false)
  const { toast } = useToast()

  const handleDeploy = () => {
    setIsDeploying(true)
    setDeploymentProgress(0)

    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDeploying(false)
          toast({
            title: "部署成功",
            description: "多维表格已成功部署到您的私有环境",
          })
          return 100
        }
        return prev + 5
      })
    }, 500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "已复制",
      description: "命令已复制到剪贴板",
    })
  }

  return (
      <ScrollArea className="h-screen">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">私有化部署</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" /> 最新版本: v1.0.0
              </Badge>
              <Button>
                <a href="https://mindlink.turntip.cn" target="_blank">AI文档编辑器</a>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 mb-4">
              {/*<TabsTrigger value="overview">部署概览</TabsTrigger>*/}
              {/*<TabsTrigger value="requirements">环境要求</TabsTrigger>*/}
              {/*<TabsTrigger value="installation">安装指南</TabsTrigger>*/}
              {/*<TabsTrigger value="configuration">配置选项</TabsTrigger>*/}
              {/*<TabsTrigger value="pricing">价格方案</TabsTrigger>*/}
              <TabsTrigger value="contact">联系我们</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">支持部署方式</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-blue-500" />
                        <span>物理服务器</span>
                      </div>
                      <div className="flex items-center">
                        <Cloud className="h-4 w-4 mr-2 text-blue-500" />
                        <span>私有云</span>
                      </div>
                      <div className="flex items-center">
                        <HardDrive className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Docker 容器</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">部署时间</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">约 30 分钟</div>
                    <p className="text-xs text-gray-500 mt-1">包括环境准备和配置</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">技术支持</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7×24 小时</div>
                    <p className="text-xs text-gray-500 mt-1">企业版用户专享</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>快速部署</CardTitle>
                  <CardDescription>一键部署多维表格到您的私有环境</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deployment-name">部署名称</Label>
                      <Input id="deployment-name" placeholder="例如：生产环境" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deployment-version">部署版本</Label>
                      <Select defaultValue="latest">
                        <SelectTrigger id="deployment-version">
                          <SelectValue placeholder="选择版本" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">v1.5.2 (最新)</SelectItem>
                          <SelectItem value="1.5.1">v1.5.1</SelectItem>
                          <SelectItem value="1.5.0">v1.5.0</SelectItem>
                          <SelectItem value="1.4.9">v1.4.9</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deployment-target">部署目标</Label>
                      <Select defaultValue="docker">
                        <SelectTrigger id="deployment-target">
                          <SelectValue placeholder="选择部署目标" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="docker">Docker</SelectItem>
                          <SelectItem value="kubernetes">Kubernetes</SelectItem>
                          <SelectItem value="server">物理服务器</SelectItem>
                          <SelectItem value="cloud">私有云</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deployment-mode">部署模式</Label>
                      <Select defaultValue="standalone">
                        <SelectTrigger id="deployment-mode">
                          <SelectValue placeholder="选择部署模式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standalone">单机模式</SelectItem>
                          <SelectItem value="cluster">集群模式</SelectItem>
                          <SelectItem value="ha">高可用模式</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>高级选项</Label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="enable-ssl" />
                        <label htmlFor="enable-ssl" className="text-sm">
                          启用 SSL 加密
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="enable-backup" />
                        <label htmlFor="enable-backup" className="text-sm">
                          启用自动备份
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="enable-monitoring" />
                        <label htmlFor="enable-monitoring" className="text-sm">
                          启用系统监控
                        </label>
                      </div>
                    </div>
                  </div>

                  {isDeploying && (
                      <div className="space-y-2">
                        <Label>部署进度</Label>
                        <Progress value={deploymentProgress} className="h-2" />
                        <p className="text-xs text-gray-500">
                          {deploymentProgress}% - {deploymentProgress < 100 ? "正在部署..." : "部署完成"}
                        </p>
                      </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleDeploy} disabled={isDeploying}>
                    {isDeploying ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          部署中...
                        </>
                    ) : (
                        <>
                          <Server className="h-4 w-4 mr-2" />
                          开始部署
                        </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>部署架构</CardTitle>
                    <CardDescription>多维表格私有化部署架构图</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                      <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        {/* 前端层 */}
                        <rect x="100" y="30" width="300" height="50" rx="4" fill="#e0f2fe" stroke="#0ea5e9" />
                        <text x="250" y="60" textAnchor="middle" fill="#0369a1" fontSize="14">
                          前端应用层 (React)
                        </text>

                        {/* API层 */}
                        <rect x="100" y="100" width="300" height="50" rx="4" fill="#dbeafe" stroke="#3b82f6" />
                        <text x="250" y="130" textAnchor="middle" fill="#1d4ed8" fontSize="14">
                          API 服务层 (Node.js)
                        </text>

                        {/* 数据层 */}
                        <rect x="100" y="170" width="300" height="50" rx="4" fill="#ede9fe" stroke="#8b5cf6" />
                        <text x="250" y="200" textAnchor="middle" fill="#6d28d9" fontSize="14">
                          数据存储层 (MongoDB/MySQL)
                        </text>

                        {/* 连接线 */}
                        <line x1="250" y1="80" x2="250" y2="100" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="250" y1="150" x2="250" y2="170" stroke="#94a3b8" strokeWidth="2" />

                        {/* 用户 */}
                        <circle cx="250" cy="10" r="8" fill="#cbd5e1" />
                        <line x1="250" y1="18" x2="250" y2="30" stroke="#94a3b8" strokeWidth="2" />

                        {/* 外部系统 */}
                        <rect x="430" y="100" width="60" height="50" rx="4" fill="#fef3c7" stroke="#f59e0b" />
                        <text x="460" y="130" textAnchor="middle" fill="#b45309" fontSize="10">
                          外部系统
                        </text>
                        <line x1="400" y1="125" x2="430" y2="125" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />

                        {/* 备份 */}
                        <rect x="20" y="170" width="60" height="50" rx="4" fill="#dcfce7" stroke="#22c55e" />
                        <text x="50" y="200" textAnchor="middle" fill="#15803d" fontSize="10">
                          备份系统
                        </text>
                        <line x1="80" y1="195" x2="100" y2="195" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />

                        {/* 监控 */}
                        <rect x="250" y="240" width="80" height="30" rx="4" fill="#ffedd5" stroke="#f97316" />
                        <text x="290" y="260" textAnchor="middle" fill="#c2410c" fontSize="10">
                          监控系统
                        </text>
                        <line x1="290" y1="220" x2="290" y2="240" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>部署优势</CardTitle>
                    <CardDescription>私有化部署的主要优势</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">数据安全</h3>
                          <p className="text-sm text-gray-500">所有数据存储在您自己的服务器上，确保数据安全与隐私</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Settings className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">灵活配置</h3>
                          <p className="text-sm text-gray-500">根据企业需求自定义系统配置，满足特定业务场景</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Database className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">数据集成</h3>
                          <p className="text-sm text-gray-500">轻松与企业内部其他系统集成，实现数据互通</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">用户管理</h3>
                          <p className="text-sm text-gray-500">与企业现有的用户认证系统集成，统一管理用户权限</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 产品推荐部分 */}
              <Card>
                <CardHeader>
                  <CardTitle>相关产品推荐</CardTitle>
                  <CardDescription>与多维表格协同工作的其他产品</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                          数据分析平台
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">强大的数据分析工具，将多维表格数据转化为可视化报表和洞察</p>
                        <div className="mt-4">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300">推荐搭配</Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          了解更多
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                          团队协作平台
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">集成聊天、文档和任务管理的一站式团队协作解决方案</p>
                        <div className="mt-4">
                          <Badge className="bg-purple-100 text-purple-800 border-purple-300">热门产品</Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          了解更多
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Lock className="h-5 w-5 mr-2 text-green-500" />
                          企业安全中心
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">全方位保护企业数据安全，提供访问控制、审计和合规管理</p>
                        <div className="mt-4">
                          <Badge className="bg-green-100 text-green-800 border-green-300">企业必备</Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          了解更多
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>系统要求</CardTitle>
                  <CardDescription>部署多维表格的最低系统要求</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">硬件要求</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">CPU</span>
                          <Badge variant="outline">4核 或以上</Badge>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">内存</span>
                          <Badge variant="outline">8GB 或以上</Badge>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">存储</span>
                          <Badge variant="outline">50GB 或以上</Badge>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">网络</span>
                          <Badge variant="outline">100Mbps 或以上</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">软件要求</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">操作系统</span>
                          <Badge variant="outline">Linux (推荐 Ubuntu 20.04+)</Badge>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">Docker</span>
                          <Badge variant="outline">v20.10.0 或以上</Badge>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">数据库</span>
                          <Badge variant="outline">MongoDB 4.4+ 或 MySQL 8.0+</Badge>
                        </div>
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <span className="text-sm">Node.js</span>
                          <Badge variant="outline">v16.0.0 或以上</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">网络要求</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm">开放 80/443 端口用于 HTTP/HTTPS 访问</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm">如使用集群模式，需开放节点间通信端口</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm">如需外部访问，建议配置反向代理</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>推荐配置</CardTitle>
                  <CardDescription>不同规模企业的推荐部署配置</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">小型团队 (10-50人)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">硬件配置</div>
                          <ul className="text-sm space-y-1">
                            <li>4核 CPU</li>
                            <li>8GB 内存</li>
                            <li>100GB SSD</li>
                          </ul>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">部署模式</div>
                          <ul className="text-sm space-y-1">
                            <li>单机部署</li>
                            <li>Docker Compose</li>
                            <li>内置数据库</li>
                          </ul>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">预期性能</div>
                          <ul className="text-sm space-y-1">
                            <li>同时在线: 20-30人</li>
                            <li>响应时间: &lt;500ms</li>
                            <li>数据量: &lt;10GB</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">中型企业 (50-200人)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">硬件配置</div>
                          <ul className="text-sm space-y-1">
                            <li>8核 CPU</li>
                            <li>16GB 内存</li>
                            <li>500GB SSD</li>
                          </ul>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">部署模式</div>
                          <ul className="text-sm space-y-1">
                            <li>双节点部署</li>
                            <li>Docker Swarm/K8s</li>
                            <li>独立数据库</li>
                          </ul>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">预期性能</div>
                          <ul className="text-sm space-y-1">
                            <li>同时在线: 50-100人</li>
                            <li>响应时间: &lt;300ms</li>
                            <li>数据量: &lt;50GB</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">大型企业 (200人以上)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">硬件配置</div>
                          <ul className="text-sm space-y-1">
                            <li>16核+ CPU</li>
                            <li>32GB+ 内存</li>
                            <li>1TB+ SSD</li>
                          </ul>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">部署模式</div>
                          <ul className="text-sm space-y-1">
                            <li>多节点集群</li>
                            <li>Kubernetes</li>
                            <li>数据库集群</li>
                          </ul>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="font-medium mb-1">预期性能</div>
                          <ul className="text-sm space-y-1">
                            <li>同时在线: 200+人</li>
                            <li>响应时间: &lt;200ms</li>
                            <li>数据量: &gt;100GB</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Docker 部署</CardTitle>
                  <CardDescription>使用 Docker 快速部署多维表格</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">1. 拉取镜像</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>docker pull multitable/server:latest</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("docker pull multitable/server:latest")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">2. 创建 docker-compose.yml 文件</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                    <pre>{`version: '3'
services:
  app:
    image: multitable/server:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - DB_URI=mongodb://mongo:27017/multitable
    depends_on:
      - mongo
    restart: always

  mongo:
    image: mongo:4.4
    volumes:
      - mongo_data:/data/db
    restart: always

volumes:
  mongo_data:`}</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() =>
                              copyToClipboard(`version: '3'
services:
  app:
    image: multitable/server:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - DB_URI=mongodb://mongo:27017/multitable
    depends_on:
      - mongo
    restart: always

  mongo:
    image: mongo:4.4
    volumes:
      - mongo_data:/data/db
    restart: always

volumes:
  mongo_data:`)
                          }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">3. 启动服务</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>docker-compose up -d</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("docker-compose up -d")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">4. 验证部署</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>curl http://localhost/api/health</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("curl http://localhost/api/health")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800">提示</h3>
                        <p className="text-sm text-blue-700">
                          部署完成后，访问 http://服务器IP 即可打开多维表格。默认管理员账号为 admin，密码为
                          admin123，请在首次登录后立即修改密码。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kubernetes 部署</CardTitle>
                  <CardDescription>在 Kubernetes 集群中部署多维表格</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">1. 创建命名空间</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>kubectl create namespace multitable</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("kubectl create namespace multitable")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">2. 部署 MongoDB</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>kubectl apply -f https://example.com/multitable/mongodb.yaml -n multitable</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() =>
                              copyToClipboard("kubectl apply -f https://example.com/multitable/mongodb.yaml -n multitable")
                          }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">3. 部署多维表格</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>kubectl apply -f https://example.com/multitable/deployment.yaml -n multitable</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() =>
                              copyToClipboard("kubectl apply -f https://example.com/multitable/deployment.yaml -n multitable")
                          }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">4. 创建服务和 Ingress</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>kubectl apply -f https://example.com/multitable/service.yaml -n multitable</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() =>
                              copyToClipboard("kubectl apply -f https://example.com/multitable/service.yaml -n multitable")
                          }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">5. 验证部署</h3>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm relative">
                      <pre>kubectl get pods -n multitable</pre>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("kubectl get pods -n multitable")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      下载完整 K8s 配置文件
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>系统配置</CardTitle>
                  <CardDescription>多维表格系统配置选项</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">环境变量配置</h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">变量名</th>
                            <th className="px-4 py-2 text-left font-medium">说明</th>
                            <th className="px-4 py-2 text-left font-medium">默认值</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y">
                          <tr>
                            <td className="px-4 py-2 font-mono">NODE_ENV</td>
                            <td className="px-4 py-2">运行环境</td>
                            <td className="px-4 py-2">production</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono">PORT</td>
                            <td className="px-4 py-2">服务端口</td>
                            <td className="px-4 py-2">3000</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono">DB_URI</td>
                            <td className="px-4 py-2">数据库连接字符串</td>
                            <td className="px-4 py-2">mongodb://localhost:27017/multitable</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono">JWT_SECRET</td>
                            <td className="px-4 py-2">JWT 密钥</td>
                            <td className="px-4 py-2">随机生成</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono">LOG_LEVEL</td>
                            <td className="px-4 py-2">日志级别</td>
                            <td className="px-4 py-2">info</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">数据库配置</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="db-type">数据库类型</Label>
                          <Select defaultValue="mongodb">
                            <SelectTrigger id="db-type">
                              <SelectValue placeholder="选择数据库类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mongodb">MongoDB</SelectItem>
                              <SelectItem value="mysql">MySQL</SelectItem>
                              <SelectItem value="postgresql">PostgreSQL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="db-host">数据库主机</Label>
                          <Input id="db-host" placeholder="localhost" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="db-port">数据库端口</Label>
                          <Input id="db-port" placeholder="27017" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="db-name">数据库名称</Label>
                          <Input id="db-name" placeholder="multitable" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="db-user">用户名</Label>
                          <Input id="db-user" placeholder="admin" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="db-password">密码</Label>
                          <Input id="db-password" type="password" placeholder="••••••••" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">安全配置</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="enable-ssl" />
                          <label htmlFor="enable-ssl" className="text-sm">
                            启用 HTTPS (SSL/TLS)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="enable-2fa" />
                          <label htmlFor="enable-2fa" className="text-sm">
                            启用双因素认证 (2FA)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="enable-ldap" />
                          <label htmlFor="enable-ldap" className="text-sm">
                            启用 LDAP 认证
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="enable-ip-restrict" />
                          <label htmlFor="enable-ip-restrict" className="text-sm">
                            启用 IP 访问限制
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">高级配置</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cache-type">缓存类型</Label>
                            <Select defaultValue="memory">
                              <SelectTrigger id="cache-type">
                                <SelectValue placeholder="选择缓存类型" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="memory">内存缓存</SelectItem>
                                <SelectItem value="redis">Redis</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="session-timeout">会话超时时间 (分钟)</Label>
                            <Input id="session-timeout" type="number" defaultValue="60" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="max-upload">最大上传文件大小 (MB)</Label>
                            <Input id="max-upload" type="number" defaultValue="10" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="backup-schedule">自动备份计划</Label>
                            <Select defaultValue="daily">
                              <SelectTrigger id="backup-schedule">
                                <SelectValue placeholder="选择备份频率" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hourly">每小时</SelectItem>
                                <SelectItem value="daily">每天</SelectItem>
                                <SelectItem value="weekly">每周</SelectItem>
                                <SelectItem value="monthly">每月</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>保存配置</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>集成配置</CardTitle>
                  <CardDescription>与第三方系统集成的配置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">LDAP 集成</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ldap-url">LDAP 服务器 URL</Label>
                        <Input id="ldap-url" placeholder="ldap://ldap.example.com:389" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ldap-base-dn">Base DN</Label>
                        <Input id="ldap-base-dn" placeholder="dc=example,dc=com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ldap-bind-dn">Bind DN</Label>
                        <Input id="ldap-bind-dn" placeholder="cn=admin,dc=example,dc=com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ldap-bind-password">Bind 密码</Label>
                        <Input id="ldap-bind-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">邮件服务配置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP 服务器</Label>
                        <Input id="smtp-host" placeholder="smtp.example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP 端口</Label>
                        <Input id="smtp-port" placeholder="587" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-user">SMTP 用户名</Label>
                        <Input id="smtp-user" placeholder="user@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">SMTP 密码</Label>
                        <Input id="smtp-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">API 集成</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">API 密钥</div>
                          <div className="text-sm text-gray-500">用于第三方系统访问</div>
                        </div>
                        <Button variant="outline">生成 API 密钥</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">Webhook</div>
                          <div className="text-sm text-gray-500">配置事件通知</div>
                        </div>
                        <Button variant="outline">配置 Webhook</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 价格方案标签页 */}
            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>价格方案</CardTitle>
                  <CardDescription>选择适合您企业需求的多维表格私有化部署方案</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 基础版 */}
                    <Card className="border-2 border-gray-200">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-center">基础版</CardTitle>
                        <div className="text-center mt-2">
                          <span className="text-3xl font-bold">¥29,800</span>
                          <span className="text-sm text-gray-500">/年</span>
                        </div>
                        <CardDescription className="text-center">适合小型团队使用</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>支持最多 50 个用户</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>基础任务管理功能</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>表格视图和看板视图</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>基础数据统计</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>单机部署</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>邮件技术支持</span>
                          </li>
                          <li className="flex items-start">
                            <X className="h-5 w-5 mr-2 text-gray-300 shrink-0" />
                            <span className="text-gray-500">高级API集成</span>
                          </li>
                          <li className="flex items-start">
                            <X className="h-5 w-5 mr-2 text-gray-300 shrink-0" />
                            <span className="text-gray-500">高可用部署</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">联系销售</Button>
                      </CardFooter>
                    </Card>

                    {/* 专业版 */}
                    <Card className="border-2 border-blue-500 shadow-md relative">
                      <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-bl-md">
                        推荐
                      </div>
                      <CardHeader className="bg-blue-50">
                        <CardTitle className="text-center">专业版</CardTitle>
                        <div className="text-center mt-2">
                          <span className="text-3xl font-bold">¥79,800</span>
                          <span className="text-sm text-gray-500">/年</span>
                        </div>
                        <CardDescription className="text-center">适合中型企业使用</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>支持最多 200 个用户</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>全部任务管理功能</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>多种视图模式</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>高级数据分析和报表</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>双节点部署</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>优先技术支持</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>API集成</span>
                          </li>
                          <li className="flex items-start">
                            <X className="h-5 w-5 mr-2 text-gray-300 shrink-0" />
                            <span className="text-gray-500">高可用部署</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">联系销售</Button>
                      </CardFooter>
                    </Card>

                    {/* 企业版 */}
                    <Card className="border-2 border-gray-200">
                      <CardHeader className="bg-gray-50">
                        <CardTitle className="text-center">企业版</CardTitle>
                        <div className="text-center mt-2">
                          <span className="text-3xl font-bold">¥198,000</span>
                          <span className="text-sm text-gray-500">/年</span>
                        </div>
                        <CardDescription className="text-center">适合大型企业使用</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>无限用户数量</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>全部高级功能</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>自定义视图和字段</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>企业级数据分析</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>多节点集群部署</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>7×24小时专属支持</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>高级API和Webhook</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCheck className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                            <span>高可用部署</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          联系销售
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium mb-2">附加服务</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start p-3 border rounded-md bg-white">
                        <Zap className="h-5 w-5 mr-3 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">实施服务</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            专业团队上门实施部署，包括环境配置、数据迁移和用户培训
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline">¥20,000 起</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start p-3 border rounded-md bg-white">
                        <Award className="h-5 w-5 mr-3 text-purple-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">定制开发</h4>
                          <p className="text-sm text-gray-500 mt-1">根据企业需求定制开发特定功能，满足个性化业务场景</p>
                          <div className="mt-2">
                            <Badge variant="outline">¥50,000 起</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 mb-4">需要更多信息或定制报价？</p>
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      获取完整报价单
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>常见问题</CardTitle>
                  <CardDescription>关于价格和许可的常见问题解答</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium">许可证有效期是多久？</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        所有许可证均为年度订阅，有效期为购买之日起一年。您可以在到期前续订以继续使用所有功能和获取技术支持。
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium">如何计算用户数量？</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        用户数量基于系统中创建的命名用户账号数量，而不是同时在线用户数。每个需要访问系统的用户都需要一个许可证。
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium">是否提供试用版？</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        是的，我们提供30天的免费试用版，包含专业版的全部功能。试用期结束后，您可以选择购买正式许可证或停止使用。
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium">是否支持分期付款？</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        对于企业版客户，我们提供分期付款选项。具体付款计划可与销售团队协商确定。
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium">如何升级我的许可证？</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        您可以随时升级到更高级别的许可证。升级费用将按剩余订阅期限的比例计算。请联系销售团队获取详细信息。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 联系我们标签页 */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>联系我们</CardTitle>
                  <CardDescription>获取更多信息或技术支持</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800">在线客服</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          我们提供在线客服服务，工作时间内可获得即时响应。您也可以通过微信扫描下方二维码关注我们的公众号获取更多信息。
                        </p>
                        <div className="mt-4 flex justify-center">
                          <div
                              className="bg-white p-2 rounded-md border border-blue-200 w-36 h-36 flex items-center justify-center">
                          <span className="text-xs text-gray-500"><img
                              src="https://flowmix.turntip.cn/fm/static/logo.ce1bcd6a.jpeg" alt=""/></span>
                          </div>
                          <div
                              className="bg-white ml-6 p-2 rounded-md border border-blue-200 w-36 h-36 flex items-center justify-center">
                          <span className="text-xs text-gray-500"><img
                              src="https://flowmix.turntip.cn/fm/static/my.8ee63da4.png" alt=""/></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>合作伙伴</CardTitle>
                  <CardDescription>成为我们的合作伙伴或寻找授权经销商</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">授权经销商</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        我们在全国各地拥有授权经销商网络，您可以联系离您最近的经销商获取产品和服务。
                      </p>
                      {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-4">*/}
                      {/*  <div className="border rounded-md p-4">*/}
                      {/*    <h4 className="font-medium">北方区域</h4>*/}
                      {/*    <p className="text-sm mt-1">北京科技创新有限公司</p>*/}
                      {/*    <p className="text-sm text-gray-500">联系人：张经理</p>*/}
                      {/*    <p className="text-sm text-gray-500">电话：010-88889999</p>*/}
                      {/*  </div>*/}
                      {/*  <div className="border rounded-md p-4">*/}
                      {/*    <h4 className="font-medium">东部区域</h4>*/}
                      {/*    <p className="text-sm mt-1">上海数字科技有限公司</p>*/}
                      {/*    <p className="text-sm text-gray-500">联系人：李经理</p>*/}
                      {/*    <p className="text-sm text-gray-500">电话：021-66667777</p>*/}
                      {/*  </div>*/}
                      {/*  <div className="border rounded-md p-4">*/}
                      {/*    <h4 className="font-medium">南方区域</h4>*/}
                      {/*    <p className="text-sm mt-1">广州信息技术有限公司</p>*/}
                      {/*    <p className="text-sm text-gray-500">联系人：王经理</p>*/}
                      {/*    <p className="text-sm text-gray-500">电话：020-55556666</p>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">成为合作伙伴</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        我们欢迎系统集成商、软件开发商和咨询公司加入我们的合作伙伴计划，共同为客户提供更好的服务。
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">解决方案合作伙伴</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            为特定行业或业务场景开发基于多维表格的解决方案，获得技术支持和市场推广。
                          </p>
                        </div>
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">技术集成合作伙伴</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            将您的产品或服务与多维表格集成，创建互补的解决方案，扩大市场覆盖。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
  )
}
