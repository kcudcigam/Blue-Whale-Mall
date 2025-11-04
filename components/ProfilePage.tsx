import { Package, Heart, Clock, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { mockUser, mockProducts } from './mockData';

type Page = 'home' | 'login' | 'product-detail' | 'publish' | 'profile' | 'admin';

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const userProducts = mockProducts.slice(0, 3);
  const favoriteProducts = mockProducts.slice(3, 6);

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
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {mockUser.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-purple-900 mb-2">{mockUser.name}</h2>
                  <p className="text-gray-600 mb-1">{mockUser.email}</p>
                  <p className="text-gray-600 mb-4">{mockUser.phone}</p>
                  <Badge variant="outline" className="border-purple-300 text-purple-700 mb-6">
                    会员等级：普通会员
                  </Badge>

                  <Separator className="my-4 bg-purple-200" />

                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>注册时间</span>
                      <span>{mockUser.joinDate}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>发布商品</span>
                      <span>{userProducts.length} 件</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>收藏商品</span>
                      <span>{favoriteProducts.length} 件</span>
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
                <div className="space-y-4">
                  {userProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-4 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <img
                        src={product.image}
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
                                : 'bg-gray-500'
                            }
                          >
                            {product.status === 'available' ? '可用' : '已售'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="border-purple-300">
                          编辑
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-300 text-red-600">
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Heart className="w-5 h-5" />
                  我的收藏
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoriteProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-4 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <img
                        src={product.image}
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
                          <Badge variant="outline" className="border-purple-300 text-purple-700">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Clock className="w-5 h-5" />
                  最近活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div>
                      <p>收藏了商品「Canon EOS R6 相机套装」</p>
                      <p className="text-gray-500">2025-10-24 14:30</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div>
                      <p>发布了商品「MacBook Pro 16寸 M3芯片」</p>
                      <p className="text-gray-500">2025-10-23 10:15</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div>
                      <p>浏览了商品「iPhone 15 Pro 256GB」</p>
                      <p className="text-gray-500">2025-10-22 16:45</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
