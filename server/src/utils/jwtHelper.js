import crypto from 'crypto';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedError } from '../common/error';

/**
 * 
 * @param {{
 *  type?: 'accessToken' | 'refreshToken'
 *  credentials: { user_id: number, role?: string, user_name?: string }
 * }} args 
 * @returns 
 */
export function signCredentials(args) {
  const { credentials, type = 'accessToken' } = args;
  const secret = type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = type === 'accessToken' ? 600 : '7d';
  const nonce = crypto.randomBytes(6).toString('hex');
  return jwt.sign({ nonce, ...credentials }, secret, { expiresIn });
}

/**
 * 
 * @param {{
 *  token: string;
 *  type?: 'accessToken' | 'refreshToken';
 * }} args 
 * @returns 
 */
export function verifyCredentials(args) {
  try {
    const { token, type = 'accessToken' } = args;
    const secret = type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
    /**
     * @type {import('jsonwebtoken').JwtPayload}
     */
    const credentials = jwt.verify(token, secret);
    return credentials;
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedError({ message: 'Token Expired', data: -1 });
      }
      throw new UnauthorizedError();
    }
    throw e;
  }
}