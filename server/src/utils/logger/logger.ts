import winston from "winston"

const { combine, timestamp, printf, colorize, errors } = winston.format

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} ${level}: ${stack || message}`
})

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Log stack traces
    logFormat,
  ),
  transports: [
    new winston.transports.Console(),
    // Add file transport for production if needed
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
  exceptionHandlers: [
    // Handle uncaught exceptions
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'exceptions.log' })
  ],
  rejectionHandlers: [
    // Handle unhandled promise rejections
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'rejections.log' })
  ],
})

export default logger // Default export
