import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Loader2 } from 'lucide-react';
import { getProducts, Product } from '../services/api';
import { toast } from 'sonner';

interface HomePageProps {
  onProductClick: (productId: string) => void;
}

export function HomePage({ onProductClick }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从后端加载商品列表
  useEffect(() => {
    loadProducts();
  }, [categoryFilter, statusFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getProducts({
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: 1,
        limit: 100
      });

      if (response.success && response.data) {
        setProducts(response.data.products);
      }
    } catch (error: any) {
      console.error('Failed to load products:', error);
      toast.error('加载商品列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 前端搜索过滤
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center gap-6">
            {/* Search Bar - Desktop Style */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="搜索商品名称、描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">分类：</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] h-12 border-gray-300 rounded-lg shadow-sm">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="电子产品">电子产品</SelectItem>
                  <SelectItem value="服装">服装</SelectItem>
                  <SelectItem value="书籍">书籍</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">状态：</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-12 border-gray-300 rounded-lg shadow-sm">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="available">可用</SelectItem>
                  <SelectItem value="sold">已售</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Results Info Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isLoading ? (
                '加载中...'
              ) : (
                <>
                  找到 <span className="font-semibold text-purple-600">{filteredProducts.length}</span> 件商品
                </>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">加载商品列表中...</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onClick={() => onProductClick(product.product_id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                <Search className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">未找到相关商品</h3>
              <p className="text-gray-500 mb-6">试试调整搜索关键词或筛选条件</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
