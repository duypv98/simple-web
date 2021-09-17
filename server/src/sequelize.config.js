import dotenv from './utils/dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  [NODE_ENV]: {
    url: process.env.DB_URL,
    dialect: 'postgres',
    dialectOptions: { ssl: { rejectUnauthorized: false } }
  }
}