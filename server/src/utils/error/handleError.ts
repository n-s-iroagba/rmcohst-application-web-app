import type { Request, Response, NextFunction } from "express"

import logger from "../logger/logger"
import { AppError } from "./AppError"

export function handleError(err: unknown, req: Request, res: Response, next: NextFunction): void {
  // Default to 500 if no code provided
  let statusCode = 500
  let message = "Internal Server Error"

  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message

    logger.warn(`CustomError - ${statusCode}: ${message} - URL: ${req.originalUrl}`)
  } else if (err instanceof Error) {
    message = err.message
    // Log unknown errors at 'error' level
    logger.error(`Error: ${message} - URL: ${req.originalUrl} - Stack: ${err.stack}`)
  } else {
    // If err is something else (string, object, etc)
    logger.error(`Unknown error type: ${JSON.stringify(err)} - URL: ${req.originalUrl}`)
  }

  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
    },
  })
}
