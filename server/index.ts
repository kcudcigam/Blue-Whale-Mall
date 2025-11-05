import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database/db';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import recordsRouter from './routes/records';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（用于上传的图片等）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 路由
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/records', recordsRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blue Whale Mall API is running' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 启动服务器
async function startServer() {
  try {
    // 初始化数据库
    await db.connect();
    await db.initialize();

    // 创建默认管理员账户和测试数据
    const { hashPassword, encryptContactInfo, generateId } = await import('./utils/crypto');
    
    try {
      // 检查admin账户是否存在
      const existingAdmin = await db.get('SELECT user_id FROM users WHERE username = ?', ['admin']);
      
      if (!existingAdmin) {
        const hashedPassword = await hashPassword('admin123');
        await db.run(
          `INSERT INTO users (user_id, username, password, email, role, status, avatar)
           VALUES ('admin-001', 'admin', ?, 'admin@bluewhalemall.com', 'admin', 'active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin')`,
          [hashedPassword]
        );
        console.log('✓ 默认管理员账户已创建 (用户名: admin, 密码: admin123)');
      } else {
        // 如果已存在，更新密码以确保正确
        const hashedPassword = await hashPassword('admin123');
        await db.run(
          'UPDATE users SET password = ? WHERE username = ?',
          [hashedPassword, 'admin']
        );
        console.log('✓ 管理员账户密码已更新 (用户名: admin, 密码: admin123)');
      }
    } catch (error) {
      console.error('创建/更新管理员账户失败:', error);
    }

    // 添加测试商品数据（仅在数据库为空时）
    try {
      const productCount = await db.get<any>('SELECT COUNT(*) as count FROM products');
      if (productCount && productCount.count === 0) {
        console.log('正在添加测试商品数据...');
        
        const testProducts = [
          {
            id: generateId('prod'),
            title: 'MacBook Pro 16寸 M3芯片',
            description: '全新未拆封，原装正品，性能强劲，适合专业开发和设计工作。配备16GB内存和512GB SSD存储空间。',
            price: 18999,
            category: '电子产品',
            contact: '微信：tech_seller',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
          },
          {
            id: generateId('prod'),
            title: 'iPhone 15 Pro 256GB',
            description: '钛金属外观，A17 Pro芯片，支持5G，原装配件齐全。使用2个月，几乎全新。',
            price: 7999,
            category: '电子产品',
            contact: '电话：13812345678',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500'
          },
          {
            id: generateId('prod'),
            title: 'Sony WH-1000XM5 降噪耳机',
            description: '索尼旗舰降噪耳机，音质出色，降噪效果极佳。附带原装收纳盒和充电线。',
            price: 2299,
            category: '电子产品',
            contact: '微信：audio_lover',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'
          },
          {
            id: generateId('prod'),
            title: '秋季新款羊绒大衣',
            description: '100%纯羊绒，保暖舒适，经典款式。尺码齐全，颜色多选。',
            price: 899,
            category: '服装',
            contact: '微信：fashion_store',
            image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500'
          },
          {
            id: generateId('prod'),
            title: '《深入理解计算机系统》第三版',
            description: '经典计算机教材，9成新，无划痕无笔记。适合计算机专业学生和程序员。',
            price: 89,
            category: '书籍',
            contact: '微信：book_seller',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
          }
        ];

        for (const product of testProducts) {
          const encryptedContact = encryptContactInfo(product.contact);
          await db.run(
            `INSERT INTO products (product_id, title, description, price, category, contact_info, seller_id, status)
             VALUES (?, ?, ?, ?, ?, ?, 'admin-001', 'available')`,
            [product.id, product.title, product.description, product.price, product.category, encryptedContact]
          );
          
          // 添加商品图片
          const imageId = generateId('img');
          await db.run(
            'INSERT INTO product_images (image_id, product_id, image_url, display_order) VALUES (?, ?, ?, 0)',
            [imageId, product.id, product.image]
          );
        }
        
        console.log(`✓ 已添加 ${testProducts.length} 个测试商品`);
      }
    } catch (error) {
      console.error('添加测试数据失败:', error);
    }

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`\n🐋 Blue Whale Mall API Server`);
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await db.close();
  process.exit(0);
});

startServer();

export default app;
