# Blue Whale Mall 🐋

一个基于 Electron + React + TypeScript 的前后端分离校园二手商城系统

## 📋 项目简介

Blue Whale Mall （小蓝鲸商城）是一个功能完整的网络商城应用，专门为校园二手物品交易设计。采用现代化的前后端分离架构，提供用户管理、商品发布、交易联系、后台管理等完整功能。该项目仅供测试需要，主要代码由 Gemini/Claude 实现，有可完整运行的 demo。

<img src="https://s2.loli.net/2025/11/05/OgPLhQv7VMabi3N.png" alt="demo.png" style="zoom: 50%;" />

### 主要特性

- ✅ **用户系统**：注册/登录、个人中心、密码管理
- ✅ **商品管理**：发布商品、搜索筛选、详情查看、状态管理
- ✅ **交易功能**：联系卖家、联系记录、加密联系方式
- ✅ **管理后台**：用户管理、商品审核、数据统计
- ✅ **安全保障**：JWT认证、密码加密、信息加密存储
- ✅ **响应式设计**：适配桌面和移动设备

## 🛠 技术栈

### 前端
- **框架**：React 18 + TypeScript
- **桌面端**：Electron
- **构建工具**：Vite
- **UI框架**：Shadcn UI + Radix UI + Tailwind CSS
- **图表**：Recharts
- **通知**：Sonner

### 后端
- **运行时**：Node.js
- **框架**：Express + TypeScript
- **数据库**：SQLite3
- **认证**：JWT (JSON Web Token)
- **加密**：bcryptjs + AES-256-CBC
- **验证**：express-validator

## 📁 项目结构

```
Blue-Whale-Mall/
├── src/                        # 前端源码
│   ├── components/             # React组件
│   │   ├── ui/                # UI组件库
│   │   ├── HomePage.tsx       # 首页
│   │   ├── LoginPage.tsx      # 登录页
│   │   ├── ProfilePage.tsx    # 个人中心
│   │   ├── ProductDetailPage.tsx    # 商品详情
│   │   ├── ProductPublishPage.tsx   # 发布商品
│   │   └── AdminDashboard.tsx       # 管理后台
│   ├── services/              # API服务
│   │   └── api.ts            # API封装
│   └── styles/               # 样式文件
│
├── server/                    # 后端源码
│   ├── database/             # 数据库
│   │   ├── db.ts            # 数据库连接
│   │   └── init.sql         # 数据库初始化
│   ├── routes/              # API路由
│   │   ├── users.ts        # 用户API
│   │   ├── products.ts     # 商品API
│   │   └── records.ts      # 记录API
│   ├── middleware/          # 中间件
│   │   └── auth.ts         # 认证中间件
│   ├── utils/              # 工具函数
│   │   ├── crypto.ts       # 加密工具
│   │   └── jwt.ts          # JWT工具
│   └── index.ts            # 服务器入口
│
├── electron/                # Electron配置
├── UML/                     # UML设计文档
└── public/                  # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js = v22.20.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

环境变量说明：
```env
PORT=3001                                    # 后端端口
JWT_SECRET=your-secret-key-here              # JWT密钥
ENCRYPTION_KEY=12345678901234567890123456789012  # 加密密钥(32字符)
FRONTEND_URL=http://localhost:5173           # 前端地址
```

### 运行项目

```bash
# 同时运行前后端（推荐）
npm run dev:all

# 只运行前端
npm run dev

# 只运行后端
npm run dev:server
```

### 构建项目

```bash
# 构建前端
npm run build

# 构建后端
npm run build:server

# 打包Electron应用
npm run build:electron
```

## 📊 数据库设计

### 核心数据表

- **users** - 用户表（用户名、密码、邮箱、角色、状态）
- **products** - 商品表（标题、描述、价格、分类、状态、联系方式）
- **product_images** - 商品图片表（图片URL、显示顺序）
- **contact_records** - 联系记录表（买家、卖家、商品、时间）

详细设计请参考 `server/database/init.sql`

## 🔐 默认账户

**管理员账户**
- 用户名：`admin`
- 密码：`admin123`

⚠️ **重要**：生产环境请立即修改默认密码！

## 📡 API接口

### 基础URL
```
http://localhost:3001/api
```

### 认证方式
```
Headers: Authorization: Bearer <token>
```

### 主要接口

#### 用户模块
- `POST /users/register` - 用户注册
- `POST /users/login` - 用户登录
- `GET /users/profile` - 获取用户信息
- `PUT /users/profile` - 更新用户信息
- `POST /users/change-password` - 修改密码

#### 商品模块
- `GET /products` - 获取商品列表
- `GET /products/:id` - 获取商品详情
- `POST /products` - 发布商品
- `PUT /products/:id/status` - 更新商品状态
- `POST /products/:id/contact` - 联系卖家

#### 管理员模块
- `GET /users/admin/all` - 获取所有用户
- `PUT /users/admin/:id/status` - 更新用户状态
- `DELETE /users/admin/:id` - 删除用户
- `GET /products/admin/pending` - 获取待审核商品
- `PUT /products/admin/:id/audit` - 审核商品
- `DELETE /products/admin/:id` - 删除商品
- `GET /records/admin/statistics` - 获取统计数据

更多API详情请参考源码中的注释

## 🔒 安全特性

1. **密码安全**：bcrypt加密，加盐轮次10
2. **联系方式加密**：AES-256-CBC算法加密存储
3. **JWT认证**：Token有效期7天
4. **权限控制**：基于角色的访问控制(RBAC)
5. **输入验证**：express-validator参数验证
6. **SQL注入防护**：参数化查询

## 📖 UML设计文档

项目包含完整的UML设计文档，位于 `UML/` 目录：

- **UML类图** - 系统类结构设计
- **UML用例图** - 功能用例说明
- **UML序列图** - 交互流程设计
- **UML包图** - 模块划分设计

设计与代码实现的映射关系请参考 `UML_IMPLEMENTATION_MAPPING.md`

## 🎯 核心功能

### 普通用户
- 注册登录账户
- 浏览搜索商品
- 发布二手商品
- 联系卖家交易
- 管理个人中心
- 查看联系记录

### 管理员
- 管理用户账户（禁用/删除）
- 审核商品发布（通过/拒绝）
- 删除不当商品
- 查看数据统计
- 可视化数据分析

## 📝 开发指南

### 添加新功能

1. 设计数据库表结构（修改 `server/database/init.sql`）
2. 创建后端API路由（在 `server/routes/` 目录）
3. 添加前端API调用（在 `src/services/api.ts`）
4. 创建前端组件（在 `src/components/` 目录）

### 代码规范

- 使用TypeScript严格模式
- 遵循ESLint规则
- 组件使用函数式编程
- API使用RESTful规范

## 🐛 常见问题

**Q: 数据库连接失败？**  
A: 检查 `server/database/` 目录权限，确保SQLite3正确安装

**Q: CORS跨域错误？**  
A: 检查 `.env` 中 `FRONTEND_URL` 配置是否正确

**Q: Token认证失败？**  
A: 检查token是否过期，确认 `JWT_SECRET` 配置一致

**Q: 如何重置数据库？**  
A: 删除 `server/database/bluewhalemall.db` 文件，重启后端服务自动重建

## 🚀 部署建议

### 生产环境配置

1. 修改环境变量为生产配置
2. 使用强密码作为JWT_SECRET
3. 配置HTTPS
4. 定期备份数据库
5. 使用PM2管理Node.js进程
6. 配置Nginx反向代理

### 示例PM2配置

```bash
pm2 start dist-server/index.js --name blue-whale-api
pm2 save
pm2 startup
```
