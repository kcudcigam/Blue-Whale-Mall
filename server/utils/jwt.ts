import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bluewhalemall-jwt-secret-key';
const JWT_EXPIRES_IN = '7d'; // token 有效期 7 天

export interface JWTPayload {
  userId: string;
  username: string;
  role: 'user' | 'admin';
}

/**
 * 生成 JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证 JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Token 无效或已过期');
  }
}

/**
 * 解码 token（不验证）
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}
