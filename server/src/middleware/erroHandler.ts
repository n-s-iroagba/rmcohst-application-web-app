import { Request, Response, NextFunction } from 'express'
import { AppError, ValidationError } from '../utils/errors'
import { ApiResponseUtil } from '../utils/response'
import { logger } from '../utils/logger'

export const errorHandler = (error: Error, req: Request, res: Response): void => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  // Handle validation errors
  if (error instanceof ValidationError) {
    res
      .status(error.statusCode)
      .json(ApiResponseUtil.error(error.message, error.statusCode, JSON.stringify(error.errors)))
    return
  }

  // Handle operational errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json(ApiResponseUtil.error(error.message, error.statusCode))
    return
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json(ApiResponseUtil.error('Invalid token', 401))
    return
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json(ApiResponseUtil.error('Token expired', 401))
    return
  }

  // Handle unexpected errors
  logger.error('Unexpected error', { error: error.message, stack: error.stack })
  res.status(500).json(ApiResponseUtil.error('Internal server error', 500))
}
