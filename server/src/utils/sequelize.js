import pg from 'pg';
import { Sequelize } from 'sequelize';
import sequelizeConfig from '../sequelize.config';

const NODE_ENV = process.env.NODE_ENV || 'development';
const config = sequelizeConfig[NODE_ENV];

pg.types.setTypeParser(20, parseInt); 

const sequelize = new Sequelize(config.url, {
  logging: false,
  dialectOptions: config.dialectOptions,
  query: {
    raw: true,
    logging: false
  },
  pool: {
    idle: 20000
  },
  retry: {
    max: 3
  }
});

export default sequelize;
