import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/db';
import { encryptContactInfo, decryptContactInfo, generateId } from '../utils/crypto';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middleware/auth';

const router = express.Router();

/**
 * 发布商品
 * POST /api/products
 */
router.post(
  '/',
  authenticate,
  [
    body('title').trim().isLength({ min: 1, max: 100 }).withMessage('商品标题长度必须在1-100个字符之间'),
    body('description').optional().isLength({ max: 1000 }).withMessage('商品描述不能超过1000个字符'),
    body('price').isFloat({ min: 0 }).withMessage('价格必须大于0'),
    body('category').isIn(['电子产品', '服装', '书籍', '其他']).withMessage('商品分类无效'),
    body('contactInfo').trim().notEmpty().withMessage('联系方式不能为空'),
    body('imageUrls').isArray({ min: 1, max: 9 }).withMessage('至少上传1张图片，最多9张'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '验证失败',
          errors: errors.array()
        });
      }

      const { title, description, price, category, contactInfo, imageUrls } = req.body;
      const sellerId = req.user!.userId;

      // 加密联系方式
      const encryptedContact = encryptContactInfo(contactInfo);

      // 创建商品
      const productId = generateId('prod');
      await db.run(
        `INSERT INTO products (product_id, title, description, price, category, contact_info, seller_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [productId, title, description || '', price, category, encryptedContact, sellerId]
      );

      // 保存商品图片
      for (let i = 0; i < imageUrls.length; i++) {
        const imageId = generateId('img');
        await db.run(
          'INSERT INTO product_images (image_id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)',
          [imageId, productId, imageUrls[i], i]
        );
      }

      res.status(201).json({
        success: true,
        message: '商品发布成功，等待管理员审核',
        data: { productId }
      });
    } catch (error) {
      console.error('发布商品失败:', error);
      res.status(500).json({
        success: false,
        message: '发布商品失败，请稍后重试'
      });
    }
  }
);

/**
 * 获取商品列表（支持筛选和搜索）
 * GET /api/products
 */
router.get('/', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      status, 
      search, 
      page = 1, 
      limit = 20,
      sellerId 
    } = req.query;

    let query = `
      SELECT p.*, 
             (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order LIMIT 1) as main_image,
             u.username as seller_name
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.user_id
      WHERE 1=1
    `;
    const params: any[] = [];

    // 状态筛选 - 只有当status存在且不是'all'时才筛选
    if (status && status !== 'all') {
      query += ' AND p.status = ?';
      params.push(status);
    }

    // 分类筛选
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    // 卖家筛选
    if (sellerId) {
      query += ' AND p.seller_id = ?';
      params.push(sellerId);
    }

    // 搜索
    if (search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ' ORDER BY p.created_at DESC';

    // 分页
    const offset = (Number(page) - 1) * Number(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const products = await db.all<any>(query, params);

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
    const countParams: any[] = [];
    
    if (status && status !== 'all') {
      countQuery += ' AND p.status = ?';
      countParams.push(status);
    }
    if (category) {
      countQuery += ' AND p.category = ?';
      countParams.push(category);
    }
    if (sellerId) {
      countQuery += ' AND p.seller_id = ?';
      countParams.push(sellerId);
    }
    if (search) {
      countQuery += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern);
    }

    const { total } = await db.get<any>(countQuery, countParams) || { total: 0 };

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('获取商品列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取商品列表失败'
    });
  }
});

/**
 * 获取商品详情
 * GET /api/products/:productId
 */
router.get('/:productId', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // 获取商品信息
    const product = await db.get<any>(
      `SELECT p.*, 
              u.username as seller_name, 
              u.avatar as seller_avatar,
              (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order LIMIT 1) as main_image
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.user_id
       WHERE p.product_id = ?`,
      [productId]
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    // 获取商品图片
    const images = await db.all<any>(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order',
      [productId]
    );

    product.images = images.map(img => img.image_url);

    // 如果是可用状态且已登录，不显示加密的联系方式（需要通过联系卖家接口获取）
    if (product.status === 'available') {
      delete product.contact_info;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取商品详情失败'
    });
  }
});

/**
 * 联系卖家（获取联系方式）
 * POST /api/products/:productId/contact
 */
router.post('/:productId/contact', authenticate, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const buyerId = req.user!.userId;

    // 获取商品信息
    const product = await db.get<any>(
      'SELECT product_id, seller_id, contact_info, status FROM products WHERE product_id = ?',
      [productId]
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    // 验证商品状态
    if (product.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: '该商品当前不可联系'
      });
    }

    // 不能联系自己发布的商品
    if (product.seller_id === buyerId) {
      return res.status(400).json({
        success: false,
        message: '不能联系自己发布的商品'
      });
    }

    // 解密联系方式
    const contactInfo = decryptContactInfo(product.contact_info);

    // 记录联系记录
    const recordId = generateId('contact');
    await db.run(
      `INSERT INTO contact_records (record_id, buyer_id, seller_id, product_id)
       VALUES (?, ?, ?, ?)`,
      [recordId, buyerId, product.seller_id, productId]
    );

    res.json({
      success: true,
      message: '联系方式获取成功',
      data: { contactInfo }
    });
  } catch (error) {
    console.error('获取联系方式失败:', error);
    res.status(500).json({
      success: false,
      message: '获取联系方式失败'
    });
  }
});

/**
 * 更新商品信息（仅卖家本人）
 * PUT /api/products/:productId
 */
router.put(
  '/:productId',
  authenticate,
  [
    body('title').optional().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().isLength({ max: 1000 }),
    body('price').optional().isFloat({ min: 0 }),
    body('contactInfo').optional().trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '验证失败',
          errors: errors.array()
        });
      }

      const { productId } = req.params;
      const userId = req.user!.userId;

      // 检查商品是否存在且是否为本人发布
      const product = await db.get<any>(
        'SELECT seller_id FROM products WHERE product_id = ?',
        [productId]
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      if (product.seller_id !== userId) {
        return res.status(403).json({
          success: false,
          message: '无权修改此商品'
        });
      }

      const updates: string[] = [];
      const params: any[] = [];

      if (req.body.title) {
        updates.push('title = ?');
        params.push(req.body.title);
      }
      if (req.body.description !== undefined) {
        updates.push('description = ?');
        params.push(req.body.description);
      }
      if (req.body.price) {
        updates.push('price = ?');
        params.push(req.body.price);
      }
      if (req.body.contactInfo) {
        updates.push('contact_info = ?');
        params.push(encryptContactInfo(req.body.contactInfo));
      }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(productId);
        
        await db.run(
          `UPDATE products SET ${updates.join(', ')} WHERE product_id = ?`,
          params
        );
      }

      res.json({
        success: true,
        message: '商品更新成功'
      });
    } catch (error) {
      console.error('更新商品失败:', error);
      res.status(500).json({
        success: false,
        message: '更新商品失败'
      });
    }
  }
);

/**
 * 更新商品状态（卖家可以标记为已售或下架）
 * PUT /api/products/:productId/status
 */
router.put('/:productId/status', authenticate, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    const userId = req.user!.userId;

    if (!['sold', 'removed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '状态值无效'
      });
    }

    // 检查商品是否存在且是否为本人发布
    const product = await db.get<any>(
      'SELECT seller_id FROM products WHERE product_id = ?',
      [productId]
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    if (product.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权修改此商品'
      });
    }

    await db.run(
      'UPDATE products SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
      [status, productId]
    );

    res.json({
      success: true,
      message: '商品状态更新成功'
    });
  } catch (error) {
    console.error('更新商品状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新商品状态失败'
    });
  }
});

/**
 * 管理员：获取所有待审核商品
 * GET /api/products/admin/pending
 */
router.get('/admin/pending', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const products = await db.all<any>(
      `SELECT p.*, 
              (SELECT image_url FROM product_images WHERE product_id = p.product_id ORDER BY display_order LIMIT 1) as main_image,
              u.username as seller_name
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.user_id
       WHERE p.status = 'pending'
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('获取待审核商品失败:', error);
    res.status(500).json({
      success: false,
      message: '获取待审核商品失败'
    });
  }
});

/**
 * 管理员：审核商品（通过/拒绝）
 * PUT /api/products/admin/:productId/audit
 */
router.put('/admin/:productId/audit', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;

    if (!['available', 'removed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '状态值无效'
      });
    }

    await db.run(
      'UPDATE products SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?',
      [status, productId]
    );

    res.json({
      success: true,
      message: status === 'available' ? '商品审核通过' : '商品已下架'
    });
  } catch (error) {
    console.error('审核商品失败:', error);
    res.status(500).json({
      success: false,
      message: '审核商品失败'
    });
  }
});

/**
 * 管理员：删除商品
 * DELETE /api/products/admin/:productId
 */
router.delete('/admin/:productId', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    await db.run('DELETE FROM products WHERE product_id = ?', [productId]);

    res.json({
      success: true,
      message: '商品删除成功'
    });
  } catch (error) {
    console.error('删除商品失败:', error);
    res.status(500).json({
      success: false,
      message: '删除商品失败'
    });
  }
});

export default router;
