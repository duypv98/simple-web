import { ServerError } from '../common/error';
import User from '../models/User';
import UserToken from '../models/UserToken';
import { decodePassword, hashPassword, comparePassword } from '../utils/encryption';
import { signCredentials, verifyCredentials } from '../utils/jwtHelper';
import sequelize from '../utils/sequelize';


export default {
  /**
   * 
   * @param {{ email: string; password: string }} args 
   */
  login: async (args) => {
    const { email, password: _password } = args;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new ServerError({ data: -1 });

    const password = decodePassword(_password);
    if (!await comparePassword(user.password, password)) throw new ServerError({ data: -1 });

    const access_token = signCredentials({ credentials: { user_id: user.id, user_name: user.name } });
    const refresh_token = signCredentials({ credentials: { user_id: user.id }, type: 'refreshToken' });

    await UserToken.update({ access_token, refresh_token }, { where: { user_id: user.id } });

    return {
      user_id: user.id,
      user_name: user.name,
      access_token,
      refresh_token
    }
  },

  /**
   * 
   * @param {{ email: string; password: string; name: string }} args 
   */
  register: async (args) => {
    const { email, password: _password, name } = args;

    const exUser = await User.findOne({ where: { email } });
    if (exUser) throw new ServerError({ data: -2 });

    const password = await hashPassword(decodePassword(_password));
    const user = await sequelize.transaction(async (t) => {
      const user = await User.create({
        email,
        name,
        password
      }, { transaction: t });

      await UserToken.create({ user_id: user.id }, { transaction: t });
      return user;
    })

    return {
      user_id: user.id,
      email
    }
  },

  /**
   * 
   * @param {{ user_id: number }} args 
   */
  logout: async (args) => {
    // TODO: Redis
    const [updated] = await UserToken.update({ access_token: null, refresh_token: null }, { where: { user_id: args.user_id } });
    return { updated }
  }
}