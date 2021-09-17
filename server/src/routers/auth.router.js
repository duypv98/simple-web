import { Router } from 'express';
import { BadRequestError } from '../common/error';
import { successResponse } from '../common/responses';
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import { verifyTokenMiddleware } from '../middlewares/authMiddlewares';

const authRouter = Router();

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError();
    const data = await authService.login({ email, password });
    const { access_token, ...response } = data;
    const cookieOptions = { httpOnly: true };
    if (process.env.SECURED_ENDPOINT) Object.assign(cookieOptions, { sameSite: 'none', secure: true });
    res.cookie('x-access-token', access_token, cookieOptions);
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
    return successResponse(res);
  })
)

export default authRouter;
