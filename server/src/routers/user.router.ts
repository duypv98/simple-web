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
    const { userId, userName } = req.credentials!;
    // const data = await userService.getUser({ userId });
    // TODO: get all information
    return successResponse(res, { userId, userName });
  })
)

export default userRouter;
