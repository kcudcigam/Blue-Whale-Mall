import express, { Request, Response } from 'express';
import { db } from '../database/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * 获取我的联系记录（作为买家）
 * GET /api/records/buyer
 */
router.get('/buyer', authenticate, async (req: Request, res: Response) => {
  try {
    const buyerId = req.user!.userId;
    const { page = 1, limit = 20 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const records = await db.all<any>(
      `SELECT 
        cr.*,
        p.title as product_title,
        p.price as product_price,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order LIMIT 1) as product_image,
        u.username as seller_name,
        u.avatar as seller_avatar
       FROM contact_records cr
       JOIN products p ON cr.product_id = p.product_id
       JOIN users u ON cr.seller_id = u.user_id
       WHERE cr.buyer_id = ?
       ORDER BY cr.contact_time DESC
       LIMIT ? OFFSET ?`,
      [buyerId, Number(limit), offset]
    );

    const { total } = await db.get<any>(
      'SELECT COUNT(*) as total FROM contact_records WHERE buyer_id = ?',
      [buyerId]
    ) || { total: 0 };

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('获取联系记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取联系记录失败'
    });
  }
});

/**
 * 获取我的联系记录（作为卖家）
 * GET /api/records/seller
 */
router.get('/seller', authenticate, async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.userId;
    const { page = 1, limit = 20 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const records = await db.all<any>(
      `SELECT 
        cr.*,
        p.title as product_title,
        p.price as product_price,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order LIMIT 1) as product_image,
        u.username as buyer_name,
        u.avatar as buyer_avatar
       FROM contact_records cr
       JOIN products p ON cr.product_id = p.product_id
       JOIN users u ON cr.buyer_id = u.user_id
       WHERE cr.seller_id = ?
       ORDER BY cr.contact_time DESC
       LIMIT ? OFFSET ?`,
      [sellerId, Number(limit), offset]
    );

    const { total } = await db.get<any>(
      'SELECT COUNT(*) as total FROM contact_records WHERE seller_id = ?',
      [sellerId]
    ) || { total: 0 };

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('获取联系记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取联系记录失败'
    });
  }
});

/**
 * 管理员：获取数据统计
 * GET /api/records/admin/statistics
 */
router.get('/admin/statistics', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    // 用户统计
    const userStats = await db.get<any>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as normalUsers,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as adminUsers,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeUsers,
        SUM(CASE WHEN status = 'disabled' THEN 1 ELSE 0 END) as disabledUsers
       FROM users`
    );

    // 商品统计
    const productStats = await db.get<any>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingProducts,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as availableProducts,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as soldProducts,
        SUM(CASE WHEN status = 'removed' THEN 1 ELSE 0 END) as removedProducts
       FROM products`
    );

    // 分类统计
    const categoryStats = await db.all<any>(
      `SELECT category, COUNT(*) as count
       FROM products
       GROUP BY category`
    );

    // 联系记录统计
    const contactStats = await db.get<any>(
      'SELECT COUNT(*) as total FROM contact_records'
    );

    // 最近7天的活跃数据
    const recentActivity = await db.all<any>(
      `SELECT 
        DATE(contact_time) as date,
        COUNT(*) as contacts
       FROM contact_records
       WHERE contact_time >= datetime('now', '-7 days')
       GROUP BY DATE(contact_time)
       ORDER BY date DESC`
    );

    // 热门商品（被联系最多）
    const popularProducts = await db.all<any>(
      `SELECT 
        p.product_id,
        p.title,
        p.price,
        p.category,
        COUNT(cr.record_id) as contact_count,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order LIMIT 1) as image
       FROM products p
       LEFT JOIN contact_records cr ON p.product_id = cr.product_id
       GROUP BY p.product_id
       ORDER BY contact_count DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        users: userStats,
        products: productStats,
        categories: categoryStats,
        contacts: contactStats,
        recentActivity,
        popularProducts
      }
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败'
    });
  }
});

export default router;
