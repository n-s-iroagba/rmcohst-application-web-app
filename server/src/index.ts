import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { config } from "./config"
import sequelize from "./config/database"
import logger from "./utils/logger/logger"
import { requestLogger } from "./utils/logger/requestLogger"
import { handleError } from "./utils/error/handleError"

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: config.clientUrl,
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

// Import and use routes with error handling
try {
  // Import routes
  const applicationRoutes = require("./routes/applications").default || require("./routes/applications")
  const authRoutes = require("./routes/auth").default || require("./routes/auth")

  // API routes
  app.use("/api/applications", applicationRoutes)
  app.use("/api/auth", authRoutes)
  
  logger.info("Routes loaded successfully")
} catch (error) {
  logger.error("Error loading routes:", error)
  
  // Fallback routes for debugging
  app.use("/api/applications", (req, res) => {
    res.status(500).json({ error: "Application routes failed to load" })
  })
  
  app.use("/api/auth", (req, res) => {
    res.status(500).json({ error: "Auth routes failed to load" })
  })
}

// // Error handling
app.use(handleError)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate()
    logger.info("Database connection established successfully")

    // Sync database (use { force: true } only in development)
    await sequelize.sync({ force: true })
    logger.info("Database synchronized")

    const PORT = config.port || 3001
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