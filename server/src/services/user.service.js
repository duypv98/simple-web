import { ServerError } from '../common/error';
import User from '../models/User';
import { decodePassword, hashPassword, comparePassword } from '../utils/encryption';
import { signCredentials, verifyCredentials } from '../utils/jwtHelper';


export default {
  /**
   * 
   * @param {{ user_id: string }} args 
   */
  getUser: async (args) => {
    const { user_id } = args;

    const user = await User.findOne({ where: { id: user_id } });
    if (!user) throw new ServerError({ data: -1 });
    
    return {
      user_id: user.id,
      user_name: user.name,
    }
  }
}