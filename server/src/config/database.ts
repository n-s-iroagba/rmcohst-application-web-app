import { Sequelize } from 'sequelize'
import appConfig from './index' 
import { logger } from '../utils/logger'

const dbConfig = appConfig.database

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, '97chocho', {
  host: dbConfig.host,
  port: Number.parseInt(dbConfig.port || '3306'),
  dialect: 'mysql',
  logging: false, // Use logger.info
  pool: { 
    max: dbConfig.pool?.max || 5,
    min: dbConfig.pool?.min || 0,
    acquire: dbConfig.pool?.acquire || 30000,
    idle: dbConfig.pool?.idle || 10000,
  },
})

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Database connection has been established successfully.')
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

export default sequelize // Changed to default export
