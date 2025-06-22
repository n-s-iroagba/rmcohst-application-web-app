// middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ValidationError } from '../../utils/errors'

export const validateBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      const validationError = new ValidationError('Validation failed', errors)
      next(validationError)
      return
    }

    req.body = result.data
    next()
  }
}

export const validateParams = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      const validationError = new ValidationError('Validation failed', errors)
      next(validationError)
      return
    }

    next()
  }
}

export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      const validationError = new ValidationError('Validation failed', errors)
      next(validationError)
      return
    }

    next()
  }
}
