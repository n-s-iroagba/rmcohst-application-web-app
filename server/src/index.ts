import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import sequelize from './config/database'

import authRoutes from './routes/authRoutes'
import { errorHandler } from './middleware/erroHandler'
import { healthCheckLogger, requestLogger } from './middleware/requestLogger'
import { logger } from './utils/logger'
import academicSessionRoutes from './routes/academicSessionRoutes'
import facultyRoutes from './routes/facultyRoutes'

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
)


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use(requestLogger)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/academic-sessions', academicSessionRoutes)
app.use('/api/faculties',facultyRoutes)
app.use(errorHandler)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})
const PORT = process.env.PORT || 3000


// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Database connection established successfully')

    // Sync database (use { alter: true } only in development)
    await sequelize.sync({ force:true}) // Use alter:true to avoid dropping tables
    logger.info('Database synchronized')

  
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Unable to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
