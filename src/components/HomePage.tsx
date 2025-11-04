import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { mockProducts } from './mockData';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search } from 'lucide-react';

interface HomePageProps {
  onProductClick: (productId: string) => void;
}

export function HomePage({ onProductClick }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section - Optimized for Mobile */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-6 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-2 md:mb-4 text-center">欢迎来到小蓝鲸商城</h1>
          <p className="text-purple-100 text-center mb-4 md:mb-8">
            发现优质商品，享受便捷购物体验
          </p>

          {/* Search Bar - Compact on mobile */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索商品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 md:pl-12 h-10 md:h-12 bg-white shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-8">
        {/* Filter Bar - Compact on mobile */}
        <div className="flex flex-row gap-2 sm:gap-4 mb-4 md:mb-8">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="flex-1 sm:w-48 h-9 md:h-10">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="电子产品">电子产品</SelectItem>
              <SelectItem value="服装">服装</SelectItem>
              <SelectItem value="书籍">书籍</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 sm:w-48 h-9 md:h-10">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="available">可用</SelectItem>
              <SelectItem value="sold">已售</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid - Optimized spacing for mobile */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">未找到相关商品</p>
          </div>
        )}
      </div>
    </div>
  );
}
