export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: '电子产品' | '服装' | '书籍';
  status: 'available' | 'sold';
  seller: string;
  contact: string;
  createdAt: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'MacBook Pro 16寸 M3芯片',
    description: '全新未拆封，原装正品，性能强劲，适合专业开发和设计工作。配备16GB内存和512GB SSD存储空间。',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1737868131581-6379cdee4ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTM4NjkyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: '电子产品',
    status: 'available',
    seller: '张三',
    contact: '微信：zhangsan123',
    createdAt: '2025-10-20',
  },
  {
    id: '2',
    title: '秋季新款羊绒大衣',
    description: '100%纯羊绒，保暖舒适，经典款式。尺码齐全，颜色多选。',
    price: 899,
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxMjc5MjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: '服装',
    status: 'available',
    seller: '李四',
    contact: '电话：13812345678',
    createdAt: '2025-10-19',
  },
  {
    id: '3',
    title: '《深入理解计算机系统》第三版',
    description: '经典计算机教材，9成新，无划痕无笔记。适合计算机专业学生和程序员。',
    price: 89,
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMHJlYWRpbmd8ZW58MXx8fHwxNzYxMzA2Nzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: '书籍',
    status: 'sold',
    seller: '王五',
    contact: '微信：wangwu789',
    createdAt: '2025-10-18',
  },
  {
    id: '4',
    title: 'iPhone 15 Pro 256GB',
    description: '钛金属外观，A17 Pro芯片，支持5G，原装配件齐全。使用2个月，几乎全新。',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1732998369893-af4c9a4695fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZGV2aWNlfGVufDF8fHx8MTc2MTI4OTc3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: '电子产品',
    status: 'available',
    seller: '赵六',
    contact: '电话：13998765432',
    createdAt: '2025-10-22',
  },
  {
    id: '5',
    title: 'Sony WH-1000XM5 降噪耳机',
    description: '索尼旗舰降噪耳机，音质出色，降噪效果极佳。附带原装收纳盒和充电线。',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzYxMzgxNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: '电子产品',
    status: 'available',
    seller: '孙七',
    contact: '微信：sunqi456',
    createdAt: '2025-10-21',
  },
  {
    id: '6',
    title: 'Canon EOS R6 相机套装',
    description: '全画幅微单相机，配24-105mm镜头，适合摄影爱好者。快门数仅500次。',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjEzMzIyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: '电子产品',
    status: 'available',
    seller: '周八',
    contact: '电话：13776543210',
    createdAt: '2025-10-23',
  },
];

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
}

export const mockUser: User = {
  id: 'user-1',
  name: '张伟',
  email: 'zhangwei@example.com',
  phone: '138****5678',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
  joinDate: '2024-03-15',
};
