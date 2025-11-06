import { useState, useEffect } from 'react';
import { Users, Package, Activity, TrendingUp, BarChart3, PieChart, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { toast } from 'sonner';
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
import {
  getStatistics,
  getAllUsers,
  getPendingProducts,
  getProducts,
  auditProduct,
  updateUserStatus,
  deleteUser,
  deleteProduct,
  Product
} from '../services/api';

interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadStatistics(),
        loadUsers(),
        loadPendingProducts(),
        loadAllProducts()
      ]);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('加载管理数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await getStatistics();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadPendingProducts = async () => {
    try {
      const response = await getPendingProducts();
      if (response.success && response.data) {
        setPendingProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load pending products:', error);
    }
  };

  const loadAllProducts = async () => {
    try {
      const response = await getProducts({ page: 1, limit: 1000 });
      if (response.success && response.data) {
        setAllProducts(response.data.products);
      }
    } catch (error) {
      console.error('Failed to load all products:', error);
    }
  };

  const handleApproveProduct = async (productId: string) => {
    setIsProcessing(productId);
    try {
      const response = await auditProduct(productId, 'available');
      if (response.success) {
        toast.success('商品已通过审核');
        await loadPendingProducts();
        await loadStatistics();
      }
    } catch (error: any) {
      toast.error(error.message || '审核失败');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectProduct = async (productId: string) => {
    setIsProcessing(productId);
    try {
      const response = await auditProduct(productId, 'removed');
      if (response.success) {
        toast.success('商品已下架');
        await loadPendingProducts();
        await loadStatistics();
      }
    } catch (error: any) {
      toast.error(error.message || '下架失败');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteProduct = async (productId: string, refreshAll: boolean = false) => {
    if (!confirm('确定要删除这个商品吗？此操作不可撤销！')) {
      // 用户取消，确保清除任何可能的处理状态
      setIsProcessing(null);
      return;
    }
    
    setIsProcessing(productId);
    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success('商品已删除');
        // 使用Promise.allSettled确保即使某个加载失败也不会中断
        const refreshPromises = [loadPendingProducts(), loadStatistics()];
        if (refreshAll) {
          refreshPromises.push(loadAllProducts());
        }
        await Promise.allSettled(refreshPromises);
      }
    } catch (error: any) {
      console.error('Delete product error:', error);
      toast.error(error.message || '删除失败');
    } finally {
      // 确保无论如何都清除处理状态
      setIsProcessing(null);
      // 强制失去焦点以防止焦点锁定
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    setIsProcessing(userId);
    try {
      const response = await updateUserStatus(userId, newStatus);
      if (response.success) {
        toast.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`);
        await loadUsers();
        await loadStatistics();
      }
    } catch (error: any) {
      toast.error(error.message || '操作失败');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？此操作不可撤销！')) return;
    
    setIsProcessing(userId);
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        toast.success('用户已删除');
        await loadUsers();
        await loadStatistics();
      }
    } catch (error: any) {
      toast.error(error.message || '删除失败');
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const categoryData = stats?.categories || [];
  const recentActivity = stats?.recentActivity || [];
  
  // 计算分类数据用于饼图
  const pieChartData = categoryData.map((cat: any, index: number) => ({
    name: cat.category,
    value: cat.count,
    color: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'][index % 4]
  }));

  return (
    <div className="h-full bg-gradient-to-b from-purple-50 to-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-4 sm:mb-0">后台管理</h1>
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
              <CardTitle className="text-sm font-medium text-purple-900">用户总数</CardTitle>
              <Users className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 mb-1">
                {stats?.users?.total || 0}
              </div>
              <p className="text-xs text-gray-600">
                活跃: {stats?.users?.active || 0} | 禁用: {stats?.users?.disabled || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">商品总数</CardTitle>
              <Package className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 mb-1">
                {stats?.products?.total || 0}
              </div>
              <p className="text-xs text-gray-600">
                可用: {stats?.products?.available || 0} | 待审: {stats?.products?.pending || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">联系记录</CardTitle>
              <Activity className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 mb-1">
                {stats?.contacts?.total || 0}
              </div>
              <p className="text-xs text-gray-600">
                今日: {stats?.contacts?.today || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">热门商品</CardTitle>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 mb-1">
                {stats?.popularProducts?.length || 0}
              </div>
              <p className="text-xs text-gray-600">
                被联系最多的商品
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {pieChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution Chart */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  商品分类分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry: any, index: number) => (
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

            {/* Recent Activity */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  最近活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.description}</p>
                        <p className="text-gray-500 text-xs">{new Date(activity.time).toLocaleString('zh-CN')}</p>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-gray-500 text-center py-8">暂无活动记录</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Management Tables */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-900">数据管理</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="pending">待审核商品 ({pendingProducts.length})</TabsTrigger>
                <TabsTrigger value="allproducts">所有商品 ({allProducts.length})</TabsTrigger>
                <TabsTrigger value="users">用户管理 ({users.length})</TabsTrigger>
                <TabsTrigger value="popular">热门商品</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="rounded-md border border-purple-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>商品名称</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>价格</TableHead>
                        <TableHead>卖家</TableHead>
                        <TableHead>发布时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProducts.map((product) => (
                        <TableRow key={product.product_id} className="hover:bg-purple-50">
                          <TableCell className="max-w-xs truncate font-medium">{product.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>¥{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.seller_name || '未知'}</TableCell>
                          <TableCell>{new Date(product.created_at).toLocaleDateString('zh-CN')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveProduct(product.product_id)}
                                disabled={isProcessing === product.product_id}
                                className="border-green-500 text-green-600 hover:bg-green-50"
                              >
                                {isProcessing === product.product_id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectProduct(product.product_id)}
                                disabled={isProcessing === product.product_id}
                                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.product_id)}
                                disabled={isProcessing === product.product_id}
                                className="border-red-500 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {pendingProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                            暂无待审核商品
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="allproducts">
                <div className="rounded-md border border-purple-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>商品名称</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>价格</TableHead>
                        <TableHead>卖家</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>发布时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allProducts.map((product) => (
                        <TableRow key={product.product_id} className="hover:bg-purple-50">
                          <TableCell className="max-w-xs truncate font-medium">{product.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>¥{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.seller_name || '未知'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={product.status === 'available' ? 'default' : 'secondary'}
                              className={
                                product.status === 'available'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : product.status === 'pending'
                                  ? 'bg-yellow-500 hover:bg-yellow-600'
                                  : product.status === 'sold'
                                  ? 'bg-blue-500 hover:bg-blue-600'
                                  : 'bg-gray-500'
                              }
                            >
                              {product.status === 'available' ? '可用' : 
                               product.status === 'pending' ? '待审核' :
                               product.status === 'sold' ? '已售' : '已下架'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(product.created_at).toLocaleDateString('zh-CN')}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.product_id, true)}
                              disabled={isProcessing === product.product_id}
                              className="border-red-500 text-red-600 hover:bg-red-50"
                            >
                              {isProcessing === product.product_id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {allProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            暂无商品
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="users">
                <div className="rounded-md border border-purple-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>用户名</TableHead>
                        <TableHead>邮箱</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>注册时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.filter(u => u.role !== 'admin').map((user) => (
                        <TableRow key={user.user_id} className="hover:bg-purple-50">
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.role === 'admin' ? '管理员' : '用户'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString('zh-CN')}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === 'active' ? 'default' : 'secondary'}
                              className={
                                user.status === 'active'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-gray-500'
                              }
                            >
                              {user.status === 'active' ? '活跃' : '禁用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleUserStatus(user.user_id, user.status)}
                                disabled={isProcessing === user.user_id}
                                className={user.status === 'active' ? 'border-yellow-500 text-yellow-600' : 'border-green-500 text-green-600'}
                              >
                                {isProcessing === user.user_id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  user.status === 'active' ? '禁用' : '启用'
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(user.user_id)}
                                disabled={isProcessing === user.user_id}
                                className="border-red-500 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.filter(u => u.role !== 'admin').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                            暂无用户
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="popular">
                <div className="rounded-md border border-purple-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>商品名称</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>价格</TableHead>
                        <TableHead>联系次数</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.popularProducts?.slice(0, 10).map((product: any) => (
                        <TableRow key={product.product_id} className="hover:bg-purple-50">
                          <TableCell className="max-w-xs truncate font-medium">{product.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>¥{product.price?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-500">{product.contact_count}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!stats?.popularProducts || stats.popularProducts.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                            暂无热门商品数据
                          </TableCell>
                        </TableRow>
                      )}
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
