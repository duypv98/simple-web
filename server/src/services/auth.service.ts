import { startSession } from "mongoose";
import { ServerError } from '../common/error';
import { default as User, default as UserModel } from "../models/User";
import UserTokenModel from "../models/UserToken";
import { comparePassword, decodePassword, hashPassword } from '../utils/encryption';
import { signCredentials } from '../utils/jwtHelper';


export default {
  login: async (args: { email: string; password: string }) => {
    const { email, password: _password } = args;

    const user = await UserModel.findOne({ email });
    if (!user) throw new ServerError({ data: -1 });

    const password = decodePassword(_password);
    if (!await comparePassword(user.password, password)) throw new ServerError({ data: -1 });

    const accessToken = signCredentials({ credentials: { userId: user.id, userName: user.name } });
    const refreshToken = signCredentials({ credentials: { userId: user.id, userName: user.name }, type: 'refreshToken' });

    UserTokenModel.findOneAndUpdate({ userId: user._id }, { $set: { accessToken, refreshToken } });

    return {
      userId: user.id,
      userName: user.name,
      accessToken,
      refreshToken
    }
  },

  register: async (args: { email: string; password: string; name: string }) => {
    const { email, password: _password, name } = args;

    const exUser = await User.findOne({ where: { email } });
    if (exUser) throw new ServerError({ data: -2 });

    const password = await hashPassword(decodePassword(_password));
    const session = await startSession();
    try {
      const [user] = await UserModel.create([{ email, name, password }], { session });
      await UserTokenModel.create({ userId: user._id }, { session });
      await session.commitTransaction();
      session.endSession();
      return {
        userId: user._id,
        email
      }
    } catch (error) {
      throw new ServerError({ data: -1, message: "Register error (Transaction)" });
    }
  },

  logout: async (args: { userId: string }) => {
    // TODO: Redis
    const updates = await UserTokenModel.findOneAndUpdate({ userId: args.userId }, { $set: { accessToken: null, refreshToken: null } }, { new: true });
    return { success: !!updates }
  },

  refreshToken: async (args: { userId: string; userName?: string }) => {
    const accessToken = signCredentials({ credentials: { ...args, userName: args.userName ?? '' } });
    UserTokenModel.findOneAndUpdate({ userId: args.userId }, { $set: { accessToken } });
    return accessToken;
  },

  getAccessToken: async (args: { userId: string }) => {
    const userToken = await UserTokenModel.findOne({ userId: args.userId });
    return userToken?.get("accessToken") ?? '';
  },

  getRefreshToken: async (args: { userId: string }) => {
    const userToken = await UserTokenModel.findOne({ userId: args.userId });
    return userToken?.get("refreshToken") ?? '';
  }
}