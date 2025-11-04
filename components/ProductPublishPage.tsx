import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from "sonner";

interface ProductPublishPageProps {
  onBack: () => void;
}

export function ProductPublishPage({ onBack }: ProductPublishPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`文件 ${file.name} 格式不支持，仅支持 JPG/PNG`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`文件 ${file.name} 过大，请选择小于5MB的图片`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveDraft = () => {
    setIsDraft(true);
    toast.success('草稿已保存');
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('请输入商品标题');
      return false;
    }
    if (!description.trim()) {
      toast.error('请输入商品描述');
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error('请输入有效的价格');
      return false;
    }
    if (!category) {
      toast.error('请选择商品分类');
      return false;
    }
    if (!contact.trim()) {
      toast.error('请输入联系方式');
      return false;
    }
    if (images.length === 0) {
      toast.error('请至少上传一张商品图片');
      return false;
    }
    return true;
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    toast.success('商品发布成功！');
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-purple-700 hover:text-purple-800 hover:bg-purple-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>

        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-900">发布新商品</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublish} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  商品标题 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入商品标题"
                  className="mt-1.5"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">
                  商品分类 <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="请选择商品分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="电子产品">电子产品</SelectItem>
                    <SelectItem value="服装">服装</SelectItem>
                    <SelectItem value="书籍">书籍</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price">
                  商品价格（元） <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="mt-1.5"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  商品描述 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请详细描述您的商品..."
                  className="mt-1.5 min-h-32"
                  required
                />
                <p className="text-gray-500 mt-1">
                  {description.length} / 500 字符
                </p>
              </div>

              {/* Images */}
              <div>
                <Label>
                  商品图片 <span className="text-red-500">*</span>
                </Label>
                <p className="text-gray-500 mb-3">
                  支持 JPG/PNG 格式，单张图片不超过 5MB，最多上传 5 张
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-purple-200">
                      <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-500 cursor-pointer flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 transition-colors">
                      <Upload className="w-8 h-8 text-purple-500 mb-2" />
                      <span className="text-purple-700">上传图片</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div>
                <Label htmlFor="contact">
                  联系方式 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="微信号 / 手机号"
                  className="mt-1.5"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  className="flex-1 border-purple-300 text-purple-700"
                >
                  保存草稿
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  发布商品
                </Button>
              </div>

              {isDraft && (
                <p className="text-green-600 text-center">
                  草稿已自动保存
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
