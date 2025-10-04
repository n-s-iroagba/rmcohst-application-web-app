import { NextFunction, Request, Response } from 'express'; // Add NextFunction
import logger from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction  // ADD THIS - Express requires all 4 parameters
): void => {
  const statusCode = (error as any).statusCode || 500


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

  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(error)
  }

  const response = {
    status: 'error',
    message: error.message || 'Internal server error',
    name: error.name,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  }

  res.status(statusCode).json(response)
}