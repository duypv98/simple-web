import crypto from 'crypto';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedError } from '../common/error';
import { Credentials } from "../common/requests";

/**
 * 
 * @param {{
 *  type?: 'accessToken' | 'refreshToken'
 *  credentials: { userId: string, role?: string, userName?: string }
 * }} args 
 * @returns 
 */
export function signCredentials(args: {
  type?: "accessToken" | "refreshToken",
  credentials: Credentials
}) {
  const { credentials, type = 'accessToken' } = args;
  const secret = type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = type === 'accessToken' ? 600 : 60 * 60 * 24 * 7;
  const nonce = crypto.randomBytes(6).toString('hex');
  return jwt.sign({ nonce, ...credentials }, secret, { expiresIn });
}

export function verifyCredentials(args: {
  type?: 'accessToken' | 'refreshToken';
  token: string
}) {
  try {
    const { token, type = 'accessToken' } = args;
    const secret = type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
    const credentials: Credentials = jwt.verify(token, secret);
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