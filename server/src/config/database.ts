
import { Sequelize } from 'sequelize';
import logger from '../utils/logger';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || '0.0.0.0',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '97chocho',
  database: process.env.DB_NAME || 'rmcohst_db',
  logging: (msg:string) => logger.info(msg)
});

export default sequelize;
