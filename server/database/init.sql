-- 用户表
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
    status TEXT CHECK(status IN ('active', 'disabled')) DEFAULT 'active',
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE IF NOT EXISTS products (
    product_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT CHECK(category IN ('电子产品', '服装', '书籍', '其他')) NOT NULL,
    status TEXT CHECK(status IN ('pending', 'available', 'sold', 'removed')) DEFAULT 'pending',
    contact_info TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 商品图片表
CREATE TABLE IF NOT EXISTS product_images (
    image_id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 联系记录表
CREATE TABLE IF NOT EXISTS contact_records (
    record_id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    contact_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_contact_records_buyer ON contact_records(buyer_id);
CREATE INDEX IF NOT EXISTS idx_contact_records_seller ON contact_records(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- 插入默认管理员账户 (密码: admin123)
INSERT OR IGNORE INTO users (user_id, username, password, email, role, status)
VALUES ('admin-001', 'admin', '$2a$10$YourHashedPasswordHere', 'admin@bluewhalemall.com', 'admin', 'active');
