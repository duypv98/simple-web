import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  tableName: 'users'
});

export default User;
