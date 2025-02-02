import { createHash } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

// Make sure JWT_SECRET is available
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return secret;
};

const SALT = process.env.PASSWORD_SALT!;

export interface JWTPayload {
  userId: string;
  role: 'USER' | 'ADMIN' | 'VENDOR';
  exp?: number;
}

export const hashPassword = (password: string): string => {
  return createHash('sha256')
    .update(password + SALT)
    .digest('hex');
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hash = createHash('sha256')
    .update(password + SALT)
    .digest('hex');
  return hash === hashedPassword;
};

export const generateToken = (payload: Omit<JWTPayload, 'exp'>): string => {
  console.log('Generating token for payload:', payload);
  const secret = getJwtSecret();
  return sign(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    },
    secret
  );
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    console.log('Verifying token...');
    const secret = getJwtSecret();
    const decoded = verify(token, secret) as JWTPayload;
    console.log('Token decoded successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}; 