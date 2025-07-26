// middleware/request-logger.middleware.ts
import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start

    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      body: req.body,
    }

    if (res.statusCode >= 500) {
      logger.error('❌ Request failed', log)
    } else if (res.statusCode >= 400) {
      logger.warn('⚠️ Client error', log)
    } else {
      logger.info('✅ Request completed', log)
    }
  })

  next()
}
