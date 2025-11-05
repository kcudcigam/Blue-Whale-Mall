import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/db';
import { hashPassword, verifyPassword, generateId } from '../utils/crypto';
import { generateToken } from '../utils/jwt';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * 用户注册
 * POST /api/users/register
 */
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间'),
    body('password').isLength({ min: 6 }).withMessage('密码长度至少为6个字符'),
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('phone').optional().isMobilePhone('zh-CN').withMessage('手机号格式不正确'),
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

      const { username, password, email, phone } = req.body;

      // 检查用户名是否已存在
      const existingUser = await db.get(
        'SELECT user_id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名或邮箱已被使用'
        });
      }

      // 创建新用户
      const userId = generateId('user');
      const hashedPassword = await hashPassword(password);
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

      await db.run(
        `INSERT INTO users (user_id, username, password, email, phone, avatar, role, status)
         VALUES (?, ?, ?, ?, ?, ?, 'user', 'active')`,
        [userId, username, hashedPassword, email, phone || null, avatar]
      );

      // 生成 token
      const token = generateToken({
        userId,
        username,
        role: 'user'
      });

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: {
          userId,
          username,
          email,
          phone,
          avatar,
          role: 'user',
          token
        }
      });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({
        success: false,
        message: '注册失败，请稍后重试'
      });
    }
  }
);

/**
 * 用户登录
 * POST /api/users/login
 */
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
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

      const { username, password } = req.body;

      // 查找用户
      const user = await db.get<any>(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, username]
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }

      // 检查账户状态
      if (user.status === 'disabled') {
        return res.status(403).json({
          success: false,
          message: '账户已被禁用，请联系管理员'
        });
      }

      // 验证密码
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }

      // 生成 token
      const token = generateToken({
        userId: user.user_id,
        username: user.username,
        role: user.role
      });

      res.json({
        success: true,
        message: '登录成功',
        data: {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          token
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({
        success: false,
        message: '登录失败，请稍后重试'
      });
    }
  }
);

/**
 * 获取当前用户信息
 * GET /api/users/profile
 */
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await db.get<any>(
      'SELECT user_id, username, email, phone, avatar, role, status, created_at FROM users WHERE user_id = ?',
      [req.user!.userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

/**
 * 更新用户信息
 * PUT /api/users/profile
 */
router.put(
  '/profile',
  authenticate,
  [
    body('email').optional().isEmail().withMessage('邮箱格式不正确'),
    body('phone').optional().isMobilePhone('zh-CN').withMessage('手机号格式不正确'),
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

      const { email, phone } = req.body;
      const userId = req.user!.userId;

      await db.run(
        `UPDATE users SET email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        [email, phone, userId]
      );

      res.json({
        success: true,
        message: '更新成功'
      });
    } catch (error) {
      console.error('更新用户信息失败:', error);
      res.status(500).json({
        success: false,
        message: '更新失败'
      });
    }
  }
);

/**
 * 修改密码
 * POST /api/users/change-password
 */
router.post(
  '/change-password',
  authenticate,
  [
    body('oldPassword').notEmpty().withMessage('请输入旧密码'),
    body('newPassword').isLength({ min: 6 }).withMessage('新密码长度至少为6个字符'),
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

      const { oldPassword, newPassword } = req.body;
      const userId = req.user!.userId;

      // 获取当前密码
      const user = await db.get<any>(
        'SELECT password FROM users WHERE user_id = ?',
        [userId]
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 验证旧密码
      const isPasswordValid = await verifyPassword(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: '旧密码错误'
        });
      }

      // 更新密码
      const hashedPassword = await hashPassword(newPassword);
      await db.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [hashedPassword, userId]
      );

      res.json({
        success: true,
        message: '密码修改成功'
      });
    } catch (error) {
      console.error('修改密码失败:', error);
      res.status(500).json({
        success: false,
        message: '修改密码失败'
      });
    }
  }
);

/**
 * 管理员：获取所有用户
 * GET /api/users/admin/all
 */
router.get('/admin/all', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await db.all<any>(
      `SELECT user_id, username, email, phone, role, status, created_at 
       FROM users ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败'
    });
  }
});

/**
 * 管理员：更新用户状态（禁用/启用）
 * PUT /api/users/admin/:userId/status
 */
router.put('/admin/:userId/status', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '状态值无效'
      });
    }

    await db.run(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [status, userId]
    );

    res.json({
      success: true,
      message: '用户状态更新成功'
    });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户状态失败'
    });
  }
});

/**
 * 管理员：删除用户
 * DELETE /api/users/admin/:userId
 */
router.delete('/admin/:userId', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // 不能删除管理员自己
    if (userId === req.user!.userId) {
      return res.status(400).json({
        success: false,
        message: '不能删除自己的账户'
      });
    }

    await db.run('DELETE FROM users WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败'
    });
  }
});

export default router;
