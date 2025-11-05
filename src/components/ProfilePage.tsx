import { useState, useEffect } from 'react';
import { Package, Heart, Clock, Settings, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { getUserProfile, getProducts, Product, UserProfile } from '../services/api';
import { toast } from 'sonner';

type Page = 'home' | 'login' | 'product-detail' | 'publish' | 'profile' | 'admin';

interface UserData {
  userId: string;
  username: string;
  role: 'user' | 'admin';
  token: string;
}

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
  userData: UserData | null;
}

export function ProfilePage({ onNavigate, userData }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      loadUserData();
    }
  }, [userData]);

  const loadUserData = async () => {
    if (!userData) return;
    
    setIsLoading(true);
    try {
      // 加载用户资料
      const profileResponse = await getUserProfile();
      if (profileResponse.success && profileResponse.data) {
        setProfile(profileResponse.data);
      }

      // 加载用户发布的商品
      const productsResponse = await getProducts({
        sellerId: userData.userId,
        page: 1,
        limit: 100
      });
      if (productsResponse.success && productsResponse.data) {
        setUserProducts(productsResponse.data.products);
      }
    } catch (error: any) {
      console.error('加载用户数据失败:', error);
      toast.error('加载用户数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先登录</p>
          <Button onClick={() => onNavigate('login')} className="bg-purple-600 hover:bg-purple-700">
            前往登录
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-purple-900 mb-8">个人中心</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card className="border-purple-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-purple-200">
                    <AvatarImage src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} alt={profile?.username} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {profile?.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-purple-900 mb-2">{profile?.username || userData.username}</h2>
                  <p className="text-gray-600 mb-1">{profile?.email || '未设置邮箱'}</p>
                  {profile?.phone && <p className="text-gray-600 mb-4">{profile.phone}</p>}
                  <Badge variant="outline" className="border-purple-300 text-purple-700 mb-6">
                    会员等级：普通会员
                  </Badge>

                  <Separator className="my-4 bg-purple-200" />

                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>注册时间</span>
                      <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('zh-CN') : '-'}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>发布商品</span>
                      <span>{userProducts.length} 件</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>角色</span>
                      <Badge variant="outline" className="border-purple-300 text-purple-700">
                        {userData.role === 'admin' ? '管理员' : '普通用户'}
                      </Badge>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-6 border-purple-300 text-purple-700">
                    <Settings className="w-4 h-4 mr-2" />
                    编辑资料
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Products */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Package className="w-5 h-5" />
                  我的发布
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('publish')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  发布新商品
                </Button>
              </CardHeader>
              <CardContent>
                {userProducts.length > 0 ? (
                  <div className="space-y-4">
                    {userProducts.map((product) => (
                      <div
                        key={product.product_id}
                        className="flex gap-4 p-4 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        <img
                          src={product.main_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                          alt={product.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-purple-900 mb-1 truncate">
                            {product.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-purple-600">
                              ¥{product.price.toLocaleString()}
                            </span>
                            <Badge
                              variant={product.status === 'available' ? 'default' : 'secondary'}
                              className={
                                product.status === 'available'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : product.status === 'pending'
                                  ? 'bg-yellow-500 hover:bg-yellow-600'
                                  : 'bg-gray-500'
                              }
                            >
                              {product.status === 'available' ? '可用' : product.status === 'pending' ? '待审核' : product.status === 'sold' ? '已售' : '已下架'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" className="border-purple-300" disabled>
                            编辑
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-300 text-red-600" disabled>
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>还没有发布商品</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-purple-300 text-purple-700"
                      onClick={() => onNavigate('publish')}
                    >
                      立即发布
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity - Coming Soon */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Clock className="w-5 h-5" />
                  联系记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>功能开发中...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
