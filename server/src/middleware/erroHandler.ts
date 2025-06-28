// middleware/errorHandler.ts
import { NextFunction, Request, Response } from 'express'
import { AppError, ValidationError } from '../utils/errors'
import { logger } from '../utils/logger'

export const errorHandler = (error: Error, req: Request, res: Response,next:NextFunction): void => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })
if (error instanceof ValidationError) {
  res.status(error.statusCode).json({
    message: error.message,
    errors: error.errors, // <-- include this
  })
  return
}


  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message })
    return
  }

  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({ message: 'Token expired' })
    return
  }

  res.status(500).json({ message: 'Internal server error' })
}
