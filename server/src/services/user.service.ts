import { ServerError } from '../common/error';
import UserModel from "../models/User";
import User from '../models/User';
import { decodePassword, hashPassword, comparePassword } from '../utils/encryption';
import { signCredentials, verifyCredentials } from '../utils/jwtHelper';


export default {
  getUser: async (args: { userId: string }) => {
    const { userId } = args;

    const user = await UserModel.findOne({ _id: userId });
    if (!user) throw new ServerError({ data: -1 });

    return {
      userId: user._id,
      userName: user.name,
    }
  }
}