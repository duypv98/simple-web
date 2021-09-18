import { Router } from 'express';
import { BadRequestError } from '../common/error';
import { successResponse } from '../common/responses';
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import { verifyRefreshTokenMiddleware, verifyTokenMiddleware } from '../middlewares/authMiddlewares';
import { signCredentials } from '../utils/jwtHelper';

const authRouter = Router();

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError();
    const data = await authService.login({ email, password });
    const { access_token, refresh_token, ...response } = data;
    const cookieOptions = { httpOnly: true };
    if (process.env.SECURED_ENDPOINT) Object.assign(cookieOptions, { secure: true });
    if (process.env.SAME_SITE) Object.assign(cookieOptions, { sameSite: process.env.SAME_SITE });
    if (process.env.COOKIE_DOMAIN) Object.assign(cookieOptions, { domain: process.env.COOKIE_DOMAIN });
    res.cookie('x-access-token', access_token, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365 });
    res.cookie('x-refresh-token', refresh_token, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return successResponse(res, response);
  })
);

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new BadRequestError();
    const data = await authService.register({ email, password, name });
    return successResponse(res, data);
  })
);

authRouter.get(
  '/logout',
  verifyTokenMiddleware,
  asyncHandler(async (req, res) => {
    // TODO: clear token REDIS
    const credentials = req.credentials;
    if (credentials) {
      const user_id = credentials.user_id;
      await authService.logout({ user_id });
    }
    res.clearCookie('x-access-token');
    res.clearCookie('x-refresh-token');
    return successResponse(res);
  })
)

authRouter.post(
  '/refresh-token',
  verifyRefreshTokenMiddleware,
  asyncHandler(async (req, res) => {
    const { user_id, user_name } = req.credentials;
    const access_token = await authService.refreshToken({ user_id, user_name });
    const cookieOptions = { httpOnly: true };
    if (process.env.SECURED_ENDPOINT) Object.assign(cookieOptions, { secure: true });
    if (process.env.SAME_SITE) Object.assign(cookieOptions, { sameSite: process.env.SAME_SITE });
    if (process.env.COOKIE_DOMAIN) Object.assign(cookieOptions, { domain: process.env.COOKIE_DOMAIN });
    res.cookie('x-access-token', access_token, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return successResponse(res);
  })
)

export default authRouter;
