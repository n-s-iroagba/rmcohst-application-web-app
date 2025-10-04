import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import appConfig from './config'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
import academicSessionRoutes from './routes/academicSessionRoutes'
import applicantProgramSpecificQualificationRoutes from './routes/applicantProgramSpecificQualificationRoutes'
import applicationRoutes from './routes/applicationRoutes'
import authRoutes from './routes/authRoutes'
import biodataRoutes from './routes/biodataRoutes'
import paymentRoutes from './routes/paymentRoutes'
import programRoutes from './routes/programRoutes'
import subjectRoutes from './routes/subjectRoutes'

const app = express()

console.log('✅ Express app created')

// Security middleware
app.use(helmet())
console.log('✅ Helmet middleware applied')

// Determine allowed origin
const allowedOrigin = appConfig.clientUrl || 'http://localhost:3000'

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
)

console.log('✅ CORS middleware applied')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
})
app.use(limiter)
console.log('✅ Rate limiter middleware applied')

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
console.log('✅ Body parsers applied')

app.use(requestLogger)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})
app.use('/auth', authRoutes)
app.use('/applications', applicationRoutes)
app.use('/programs', programRoutes)
app.use('/payments', paymentRoutes)
app.use('/biodata', biodataRoutes)
app.use('/subjects', subjectRoutes)
app.use('/sessions', academicSessionRoutes)
app.use('/ssc-qualifications', applicantProgramSpecificQualificationRoutes)
app.use('/program-qualifications', applicantProgramSpecificQualificationRoutes)
app.use(errorHandler)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})
app.use(errorHandler)
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    console.log('🔧 Starting server initialization...')

    // console.log('🧪 Testing DB connection...')
    // await sequelize.authenticate()
    // console.log('✅ DB connected')

    // console.log('📦 Syncing DB...');
    // await sequelize.sync(
    //   {
    //     force: true,
    //     logging: console.log
    //   }
    // )
    // console.log('✅ DB synced');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })

    server.on('error', (error: any) => {
      console.error('❌ Server startup error:', error.message)
      console.error(error.stack)
    })

    process.on('SIGTERM', () => {
      console.warn('🛑 SIGTERM received, shutting down gracefully')
      server.close(() => {
        console.log('✅ Server closed')
        // await sequelize.close()
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      console.warn('🛑 SIGINT received, shutting down gracefully')
      server.close(() => {
        console.log('✅ Server closed')
        // await sequelize.close()
        process.exit(0)
      })
    })
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message)
    console.error(error.stack)
    try {
      // await sequelize.close()
    } catch (closeError: any) {
      console.error('❌ Error closing DB connection:', closeError.message)
    }
    process.exit(1)
  }
}

// Handle global promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise)
  console.error('Reason:', reason)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err.message)
  console.error(err.stack)
  process.exit(1)
})

console.log('🟢 Calling startServer...')
startServer()
// test comment for pre-commit hook
