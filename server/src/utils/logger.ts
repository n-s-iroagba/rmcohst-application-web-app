// logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
    })
  ),
  transports: [new winston.transports.Console()],
})

export const logError = (message: string, error: any, context?: Record<string, any>): void => {
  logger.error(message, {
    message: error.message,
    stack: error.stack,
    response: error.response?.data,
    ...context,
  })
}
export default logger
