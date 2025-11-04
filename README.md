## 小蓝鲸商城

一个基于 Electron + React 构建的现代化网络商城系统。

## 功能特性

- 🎨 简洁浅色系设计，紫色主色调
- 📱 完全响应式布局，适配 PC 和移动端
- 🔐 用户登录/注册系统（支持邮箱密码和手机验证码登录）
- 🛍️ 商品列表展示和详情页
- 📝 商品发布功能（支持多图上传、分类选择）
- 👤 个人中心（我的发布、收藏、活动记录）
- 📊 后台管理系统（数据统计、用户管理、商品管理）
- 📈 数据可视化图表（用户增长曲线、商品分类分布）

## 项目结构

```
├── src/
│   └── main.tsx          # 应用入口文件
├── App.tsx               # 主应用组件
├── components/
│   ├── HomePage.tsx      # 首页
│   ├── LoginPage.tsx     # 登录/注册页
│   ├── ProductCard.tsx   # 商品卡片组件
│   ├── ProductDetailPage.tsx    # 商品详情页
│   ├── ProductPublishPage.tsx   # 商品发布页
│   ├── ProfilePage.tsx   # 个人中心
│   ├── AdminDashboard.tsx # 后台管理
│   ├── Navbar.tsx        # 导航栏
│   ├── mockData.ts       # 模拟数据
│   └── ui/               # UI 组件库
├── styles/
│   └── globals.css       # 全局样式
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖

```

## 测试账号

- **管理员账号**: admin@example.com (任意密码，至少6位)
- **普通用户**: 任意邮箱注册

## 核心页面

### 1. 首页
- 商品列表展示（网格布局）
- 搜索功能
- 分类筛选
- 状态筛选（可用/已售）
- 响应式设计

### 2. 登录/注册页
- 邮箱密码登录
- 手机验证码登录
- 用户注册
- 表单验证
- 记住登录状态

### 3. 商品详情页
- 完整商品信息展示
- 卖家信息
- 收藏功能
- 分享功能
- 联系卖家

### 4. 商品发布页
- 标题、描述、价格输入
- 分类选择
- 多图上传（支持 JPG/PNG）
- 联系方式
- 草稿保存
- 表单验证

### 5. 个人中心
- 用户信息展示
- 我的发布列表
- 我的收藏
- 最近活动记录

### 6. 后台管理
- 数据统计卡片
- 用户增长曲线图
- 商品分类饼图
- 用户管理表格
- 商品管理表格
- 时间范围筛选

## 响应式设计

### PC 端
- 商品网格布局（3-4 列）
- 完整导航菜单
- 大屏表格布局

### 移动端
- 单列商品布局
- 折叠菜单
- 触摸优化
- 紧凑的间距设计

## 快速开始

### 步骤 1: 清理旧依赖（如果存在）

```bash
# Windows (CMD)
rmdir /s /q node_modules
del package-lock.json

# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# macOS/Linux
rm -rf node_modules package-lock.json
```

### 步骤 2: 安装依赖

```bash
npm install
```

如果遇到依赖安装问题，可以尝试：

```bash
npm install --legacy-peer-deps
```

或者使用 yarn:

```bash
yarn install
```

### 步骤 4: 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 启动。
