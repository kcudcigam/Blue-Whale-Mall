// API 基础配置
const API_BASE_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:3001/api';

// 获取存储的 token
function getToken(): string | null {
  return localStorage.getItem('token');
}

// 设置 token
export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

// 清除 token
export function clearToken(): void {
  localStorage.removeItem('token');
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; errors?: any[] }> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// ==================== 用户相关 API ====================

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  phone?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt?: string;
  token?: string;
}

// 用户注册
export async function register(data: RegisterData) {
  return request<UserProfile>('/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 用户登录
export async function login(data: LoginData) {
  return request<UserProfile>('/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 获取当前用户信息
export async function getUserProfile() {
  return request<UserProfile>('/users/profile');
}

// 更新用户信息
export async function updateUserProfile(data: { email?: string; phone?: string }) {
  return request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 修改密码
export async function changePassword(data: { oldPassword: string; newPassword: string }) {
  return request('/users/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== 商品相关 API ====================

export interface Product {
  product_id: string;
  title: string;
  description: string;
  price: number;
  category: '电子产品' | '服装' | '书籍' | '其他';
  status: 'pending' | 'available' | 'sold' | 'removed';
  seller_id: string;
  seller_name?: string;
  seller_avatar?: string;
  main_image?: string;
  images?: string[];
  created_at: string;
}

export interface ProductListParams {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sellerId?: string;
}

export interface PublishProductData {
  title: string;
  description: string;
  price: number;
  category: '电子产品' | '服装' | '书籍' | '其他';
  contactInfo: string;
  imageUrls: string[];
}

// 获取商品列表
export async function getProducts(params: ProductListParams = {}) {
  // 过滤掉undefined的参数
  const cleanParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleanParams[key] = String(value);
    }
  });
  
  const queryString = new URLSearchParams(cleanParams).toString();
  return request<{
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/products${queryString ? '?' + queryString : ''}`);
}

// 获取商品详情
export async function getProductDetail(productId: string) {
  return request<Product>(`/products/${productId}`);
}

// 发布商品
export async function publishProduct(data: PublishProductData) {
  return request<{ productId: string }>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 更新商品信息
export async function updateProduct(productId: string, data: Partial<PublishProductData>) {
  return request(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 更新商品状态
export async function updateProductStatus(productId: string, status: 'sold' | 'removed') {
  return request(`/products/${productId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// 联系卖家（获取联系方式）
export async function contactSeller(productId: string) {
  return request<{ contactInfo: string }>(`/products/${productId}/contact`, {
    method: 'POST',
  });
}

// ==================== 联系记录相关 API ====================

export interface ContactRecord {
  record_id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  contact_time: string;
  product_title?: string;
  product_price?: number;
  product_image?: string;
  seller_name?: string;
  seller_avatar?: string;
  buyer_name?: string;
  buyer_avatar?: string;
}

// 获取我的联系记录（作为买家）
export async function getBuyerRecords(page: number = 1, limit: number = 20) {
  return request<{
    records: ContactRecord[];
    pagination: any;
  }>(`/records/buyer?page=${page}&limit=${limit}`);
}

// 获取我的联系记录（作为卖家）
export async function getSellerRecords(page: number = 1, limit: number = 20) {
  return request<{
    records: ContactRecord[];
    pagination: any;
  }>(`/records/seller?page=${page}&limit=${limit}`);
}

// ==================== 管理员相关 API ====================

// 获取所有用户
export async function getAllUsers() {
  return request<any[]>('/users/admin/all');
}

// 更新用户状态
export async function updateUserStatus(userId: string, status: 'active' | 'disabled') {
  return request(`/users/admin/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// 删除用户
export async function deleteUser(userId: string) {
  return request(`/users/admin/${userId}`, {
    method: 'DELETE',
  });
}

// 获取待审核商品
export async function getPendingProducts() {
  return request<Product[]>('/products/admin/pending');
}

// 审核商品
export async function auditProduct(productId: string, status: 'available' | 'removed') {
  return request(`/products/admin/${productId}/audit`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// 删除商品
export async function deleteProduct(productId: string) {
  return request(`/products/admin/${productId}`, {
    method: 'DELETE',
  });
}

// 获取统计数据
export async function getStatistics() {
  return request<{
    users: any;
    products: any;
    categories: any[];
    contacts: any;
    recentActivity: any[];
    popularProducts: any[];
  }>('/records/admin/statistics');
}
