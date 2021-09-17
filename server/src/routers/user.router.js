import { Router } from 'express';
import { successResponse } from '../common/responses';
import { verifyTokenMiddleware } from '../middlewares/authMiddlewares';
// import userService from '../services/user.service';
import asyncHandler from '../utils/asyncHandler';

const userRouter = Router();

userRouter.get(
  '/me',
  verifyTokenMiddleware,
  asyncHandler(async (req, res) => {
    const { user_id, user_name } = req.credentials;
    // const data = await userService.getUser({ user_id });
    return successResponse(res, { user_id, user_name });
  })
)

export default userRouter;
