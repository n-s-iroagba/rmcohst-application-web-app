// middleware/request-logger.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'
import crypto from 'crypto'

interface RequestLogData {
  requestId: string
  method: string
  url: string
  originalUrl: string
  ip: string
  userAgent?: string
  referer?: string
  body?: any
  query?: any
  params?: any
  headers?: any
  timestamp: string
  statusCode?: number
  responseTime?: number
  contentLength?: number
  userId?: string
}

// Sensitive fields that should be hidden in production
const SENSITIVE_FIELDS = [
  'password',
  'confirmPassword',
  'token',
  'authorization',
  'cookie',
  'x-api-key',
  'x-auth-token',
  'access-token',
  'refresh-token',
]

// Headers that should be hidden in production
const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'x-api-key',
  'x-auth-token',
  'access-token',
  'refresh-token',
]

/**
 * Recursively sanitize an object by hiding sensitive fields
 */
const sanitizeObject = (obj: any, isProduction: boolean): any => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, isProduction))
  }

  const sanitized: any = {}

  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase()

    if (isProduction && SENSITIVE_FIELDS.some(field => keyLower.includes(field))) {
      sanitized[key] = '[HIDDEN]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, isProduction)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Sanitize headers by hiding sensitive ones
 */
const sanitizeHeaders = (headers: any, isProduction: boolean): any => {
  if (!isProduction) {
    return headers
  }

  const sanitized: any = {}

  for (const [key, value] of Object.entries(headers)) {
    const keyLower = key.toLowerCase()

    if (SENSITIVE_HEADERS.includes(keyLower)) {
      sanitized[key] = '[HIDDEN]'
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Generate a unique request ID
 */
const generateRequestId = (): string => {
  return crypto.randomBytes(8).toString('hex')
}

/**
 * Extract user ID from request (customize based on your auth implementation)
 */
const extractUserId = (req: Request): string | undefined => {
  // Try to extract from JWT token in authorization header
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // In a real app, you'd decode the JWT token here
      // For now, just return a placeholder
      return 'user-id-from-token'
    }

    // Try to extract from custom header
    const userId = req.headers['x-user-id'] as string
    if (userId) {
      return userId
    }

    // Try to extract from req.user (if auth middleware sets it)
    if ((req as any).user?.id) {
      return (req as any).user.id
    }
  } catch (error) {
    // Ignore errors in user ID extraction
  }

  return undefined
}

/**
 * Request logger middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now()
  const requestId = generateRequestId()
  const isProduction = process.env.NODE_ENV === 'production'

  // Add request ID to request object for use in other middleware/controllers
  ;(req as any).requestId = requestId

  // Add request ID to response headers for debugging
  res.setHeader('X-Request-ID', requestId)

  const requestData: RequestLogData = {
    requestId,
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    ip: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    timestamp: new Date().toISOString(),
    userId: extractUserId(req),
  }

  // Only log body, query, params in development or for specific log levels
  if (!isProduction || logger.level === 'debug') {
    requestData.body = sanitizeObject(req.body, isProduction)
    requestData.query = sanitizeObject(req.query, isProduction)
    requestData.params = sanitizeObject(req.params, isProduction)
  }

  // Log headers based on environment
  if (!isProduction || logger.level === 'debug') {
    requestData.headers = sanitizeHeaders(req.headers, isProduction)
  }

  // Log incoming request
  logger.info('Incoming request', requestData)

  // Override res.end to capture response data
  const originalEnd = res.end

  const endTime = Date.now()
  const responseTime = endTime - startTime

  const responseData = {
    requestId,
    method: req.method,
    url: req.url,
    ip: requestData.ip,
    statusCode: res.statusCode,
    responseTime,
    contentLength: res.get('Content-Length'),
    userId: requestData.userId,
    timestamp: new Date().toISOString(),
  }

  // Log response based on status code
  if (res.statusCode >= 400) {
    logger.error('Request completed with error', responseData)
  } else if (res.statusCode >= 300) {
    logger.info('Request completed with redirect', responseData)
  } else {
    logger.info('Request completed successfully', responseData)
  }

  // Log slow requests (>1000ms) as warnings
  if (responseTime > 1000) {
    logger.warn('Slow request detected', {
      ...responseData,
      slowRequest: true,
      threshold: '1000ms',
    })
  }

  next()
}

/**
 * Health check logger - lighter logging for health check endpoints
 */
export const healthCheckLogger = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = generateRequestId()
  ;(req as any).requestId = requestId
  res.setHeader('X-Request-ID', requestId)

  // Only log health checks at debug level to reduce noise
  logger.debug('Health check request', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip || 'unknown',
    timestamp: new Date().toISOString(),
  })

  next()
}
