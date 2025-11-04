import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Product } from './mockData';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-purple-100 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          className={`absolute top-3 right-3 ${
            product.status === 'available'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {product.status === 'available' ? '可用' : '已售'}
        </Badge>
      </div>
      
      <CardContent className="pt-4">
        <h3 className="text-purple-900 line-clamp-2 mb-2">
          {product.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-purple-600">
            ¥{product.price.toLocaleString()}
          </span>
          <Badge variant="outline" className="border-purple-300 text-purple-700">
            {product.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 text-gray-500">
        发布者：{product.seller}
      </CardFooter>
    </Card>
  );
}
