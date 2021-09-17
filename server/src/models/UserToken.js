import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';
import User from './user';

export const userTokensTbl = 'user_tokens';

const UserToken = sequelize.define('UserToken', {
  user_id: DataTypes.BIGINT,
  access_token: DataTypes.STRING,
  refresh_token: DataTypes.STRING
}, {
  tableName: userTokensTbl
});

UserToken.removeAttribute('id');

UserToken.belongsTo(User, { foreignKey: 'user_id' });

export default UserToken;
