import { UnauthorizedError } from '../common/error';
import authService from "../services/auth.service";
import asyncHandler from '../utils/asyncHandler';
import { verifyCredentials } from '../utils/jwtHelper';

export const verifyTokenMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // if (!authHeader) throw new UnauthorizedError();

  let token: string;
  if (authHeader) {
    const [tokenType, _token] = authHeader.split(' ');
    if (tokenType.toLocaleLowerCase() !== 'bearer' || !_token) throw new UnauthorizedError({ message: 'Invalid Token' });
    token = _token;
  } else {
    const _token = req.cookies['x-access-token'];
    if (!_token) throw new UnauthorizedError({ message: 'Invalid Token' });
    token = _token;
  }


  const credentials = verifyCredentials({ token, type: 'accessToken' });
  if (!credentials) throw new UnauthorizedError({ message: 'Invalid Token' });

  // TODO: REDIS
  const savedToken = await authService.getAccessToken({ userId: credentials.userId });
  if (!savedToken || savedToken !== token) throw new UnauthorizedError({ message: 'Invalid Token' });
  req.credentials = credentials;
  return next!();
});

export const verifyRefreshTokenMiddleware = asyncHandler(async (req, res, next) => {
  // const authHeader = req.headers.authorization;
  // if (!authHeader) throw new UnauthorizedError();

  let token = req.body.refresh_token;
  if (!token) {
    const _token = req.cookies['x-refresh-token'];
    if (!_token) throw new UnauthorizedError({ message: 'Invalid Token' });
    token = _token;
  }

  const credentials = verifyCredentials({ token, type: 'refreshToken' });
  if (!credentials) throw new UnauthorizedError({ message: 'Invalid Token' });

  // TODO: REDIS
  const savedToken = await authService.getRefreshToken({ userId: credentials.userId });
  if (!savedToken || savedToken !== token) throw new UnauthorizedError({ message: 'Invalid Token' });
  req.credentials = credentials;
  return next!();
});