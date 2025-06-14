import { Sequelize } from "sequelize"
import logger from "../utils/logger/logger" // Assuming logger is default export from its module
import appConfig from "./index" // Assuming config is default export

const dbConfig = appConfig.database

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: Number.parseInt(dbConfig.port || "3306"),
  dialect: dbConfig.dialect || "mysql",
  logging: dbConfig.logging === "true" ? (msg: string) => logger.info(msg) : false, // Use logger.info
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
    logger.info("Database connection has been established successfully.")
  } catch (error) {
    logger.error("Unable to connect to the database:", error)
    process.exit(1)
  }
}

export default sequelize // Changed to default export
