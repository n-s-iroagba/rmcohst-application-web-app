import { NextFunction, Request, Response } from 'express'
import { AppError, ValidationError } from '../utils/errors'
import logger from '../utils/logger'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = (error as any).statusCode || 500
  const isOperational = error instanceof AppError || error instanceof ValidationError

  logger.error('❌ Error Handler Caught an Error', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    ip: req.ip,
  })

  const response = {
    status: 'error',
    message: error.message || 'Internal server error',
    name: error.name,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  }

  if (error instanceof ValidationError || error instanceof AppError) {
    res.status(statusCode).json(response)
    return
  }

  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({ status: 'fail', message: 'Invalid token', name: error.name })
    return
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({ status: 'fail', message: 'Token expired', name: error.name })
    return
  }

  res.status(500).json(response)
}
