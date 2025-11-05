import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from "sonner";
import { getProductDetail, contactSeller, Product } from '../services/api';

interface ProductDetailPageProps {
  productId: string | null;
  onBack: () => void;
}

export function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProductDetail();
    }
  }, [productId]);

  const loadProductDetail = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      const response = await getProductDetail(productId);
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        toast.error('获取商品详情失败');
        setProduct(null);
      }
    } catch (error) {
      console.error('Failed to load product detail:', error);
      toast.error('获取商品详情失败');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = async () => {
    if (!productId) return;
    
    setIsContacting(true);
    try {
      const response = await contactSeller(productId);
      if (response.success && response.data) {
        toast.success(`联系方式：${response.data.contactInfo}`);
      }
    } catch (error: any) {
      console.error('Failed to get contact info:', error);
      toast.error(error.message || '获取联系方式失败');
    } finally {
      setIsContacting(false);
    }
  };

  const handleFavorite = () => {
    toast.success('已加入收藏');
  };

  const handleShare = () => {
    toast.success('分享链接已复制');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">商品不存在</p>
          <Button onClick={onBack} variant="outline">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  const statusText = {
    available: '可用',
    sold: '已售',
    pending: '待审核',
    removed: '已下架'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-purple-700 hover:text-purple-800 hover:bg-purple-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-lg">
              <ImageWithFallback
                src={product.main_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-4 right-4 ${
                  product.status === 'available'
                    ? 'bg-green-500 hover:bg-green-600'
                    : product.status === 'pending'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {statusText[product.status]}
              </Badge>
            </div>

            {/* Action Buttons for Mobile */}
            <div className="flex gap-2 lg:hidden">
              <Button
                variant="outline"
                onClick={handleFavorite}
                className="flex-1 border-purple-300"
              >
                <Heart className="w-4 h-4 mr-2" />
                收藏
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 border-purple-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-900 mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-purple-600">
                  ¥{product.price.toLocaleString()}
                </span>
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  {product.category}
                </Badge>
              </div>
            </div>

            <Separator className="bg-purple-200" />

            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-3">商品描述</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator className="bg-purple-200" />

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">卖家信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">卖家昵称</span>
                    <span className="text-gray-900">{product.seller_name || '未知卖家'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">发布时间</span>
                    <span className="text-gray-900">{formatDate(product.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons for Desktop */}
            <div className="hidden lg:flex gap-3">
              <Button
                variant="outline"
                onClick={handleFavorite}
                className="flex-1 border-purple-300"
              >
                <Heart className="w-4 h-4 mr-2" />
                收藏
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 border-purple-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>

            <Button
              onClick={handleContact}
              disabled={product.status !== 'available' || isContacting}
              className="w-full bg-purple-600 hover:bg-purple-700 h-12"
            >
              {isContacting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  获取中...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {product.status === 'available' ? '联系卖家' : 
                   product.status === 'sold' ? '商品已售出' :
                   product.status === 'pending' ? '待审核' : '商品已下架'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
