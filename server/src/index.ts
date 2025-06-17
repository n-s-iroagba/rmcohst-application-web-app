import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import sequelize from "./config/database"
import logger from "./utils/logger/logger"
import { requestLogger } from "./utils/logger/requestLogger"
import { handleError } from "./utils/error/handleError"


const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging
app.use(requestLogger)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})
app.use(handleError)

// 404 handler

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate()
    logger.info("Database connection established successfully")

    // Sync database (use { alter: true } only in development)
    await sequelize.sync({ alter: true }) // Use alter:true to avoid dropping tables
    logger.info("Database synchronized")

    const PORT = 3001
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Unable to start server:", error)
    process.exit(1)
  }
}

startServer()

export default app
