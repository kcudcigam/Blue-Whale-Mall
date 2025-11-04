import { useState } from 'react';
import { Users, Package, Activity, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockProducts } from './mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7');

  // Mock statistics data
  const stats = {
    totalUsers: 1248,
    totalProducts: 856,
    activeToday: 324,
    totalRevenue: 156789,
  };

  // Mock user growth data
  const userGrowthData = [
    { date: '10-18', users: 1120 },
    { date: '10-19', users: 1145 },
    { date: '10-20', users: 1168 },
    { date: '10-21', users: 1195 },
    { date: '10-22', users: 1210 },
    { date: '10-23', users: 1232 },
    { date: '10-24', users: 1248 },
  ];

  // Mock category distribution data
  const categoryData = [
    { name: '电子产品', value: 450, color: '#8b5cf6' },
    { name: '服装', value: 256, color: '#a78bfa' },
    { name: '书籍', value: 150, color: '#c4b5fd' },
  ];

  // Mock recent users
  const recentUsers = [
    { id: '1', name: '张三', email: 'zhangsan@example.com', joinDate: '2025-10-24', status: 'active' },
    { id: '2', name: '李四', email: 'lisi@example.com', joinDate: '2025-10-23', status: 'active' },
    { id: '3', name: '王五', email: 'wangwu@example.com', joinDate: '2025-10-22', status: 'inactive' },
    { id: '4', name: '赵六', email: 'zhaoliu@example.com', joinDate: '2025-10-21', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-purple-900 mb-4 sm:mb-0">后台管理</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">近7天</SelectItem>
              <SelectItem value="30">近30天</SelectItem>
              <SelectItem value="90">近90天</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-purple-900">用户总数</CardTitle>
              <Users className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-purple-900 mb-1">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12.5% 较上周
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-purple-900">商品总数</CardTitle>
              <Package className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-purple-900 mb-1">
                {stats.totalProducts.toLocaleString()}
              </div>
              <p className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8.3% 较上周
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-purple-900">今日活跃</CardTitle>
              <Activity className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-purple-900 mb-1">
                {stats.activeToday.toLocaleString()}
              </div>
              <p className="text-gray-600">
                活跃率: {((stats.activeToday / stats.totalUsers) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-purple-900">交易总额</CardTitle>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-purple-900 mb-1">
                ¥{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15.2% 较上周
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                用户增长趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="date" stroke="#9333ea" />
                  <YAxis stroke="#9333ea" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#faf5ff',
                      border: '1px solid #d8b4fe',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="用户数"
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution Chart */}
          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                商品分类分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#faf5ff',
                      border: '1px solid #d8b4fe',
                      borderRadius: '8px',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Tables */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-900">数据管理</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="users">用户管理</TabsTrigger>
                <TabsTrigger value="products">商品管理</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <div className="rounded-md border border-purple-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>用户名</TableHead>
                        <TableHead>邮箱</TableHead>
                        <TableHead>注册时间</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-purple-50">
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === 'active' ? 'default' : 'secondary'}
                              className={
                                user.status === 'active'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-gray-500'
                              }
                            >
                              {user.status === 'active' ? '活跃' : '未活跃'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="rounded-md border border-purple-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>商品名称</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>价格</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>发布时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProducts.slice(0, 5).map((product) => (
                        <TableRow key={product.id} className="hover:bg-purple-50">
                          <TableCell className="max-w-xs truncate">{product.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>¥{product.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={product.status === 'available' ? 'default' : 'secondary'}
                              className={
                                product.status === 'available'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-gray-500'
                              }
                            >
                              {product.status === 'available' ? '可用' : '已售'}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
