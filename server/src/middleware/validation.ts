// middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'
import { ValidationError } from '../utils/errors'

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



export const validateQuery = <TInput, TOutput>(schema: ZodSchema<TOutput, any, TInput>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.query);
      req.query = result as any; // Type assertion needed here
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors
        });
      }
      next(error);
    }
  };
};

// Alternative: More type-safe version
export const validateQueryTyped = <T>(schema: ZodSchema<T>) => {
  return (req: Request & { validatedQuery?: T }, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.query);
      req.validatedQuery = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors
        });
      }
      next(error);
    }
  };
};

// Solution 2: Fix schema definitions to avoid transform/default issues


// Combined validation for common patterns
export const validateAll = <TBody, TParams, TQuery>(schemas: {
  body?: ZodSchema<TBody>
  params?: ZodSchema<TParams>
  query?: ZodSchema<TQuery>
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = []

    // Validate body
    if (schemas.body) {
      const bodyResult = schemas.body.safeParse(req.body)
      if (!bodyResult.success) {
        errors.push(...bodyResult.error.errors.map(err => ({
          field: `body.${err.path.join('.')}`,
          message: err.message,
        })))
      } else {
    
      }
    }

    // Validate params
    if (schemas.params) {
      const paramsResult = schemas.params.safeParse(req.params)
      if (!paramsResult.success) {
        errors.push(...paramsResult.error.errors.map(err => ({
          field: `params.${err.path.join('.')}`,
          message: err.message,
        })))
      } 
    }

    // Validate query
    if (schemas.query) {
      const queryResult = schemas.query.safeParse(req.query)
      if (!queryResult.success) {
        errors.push(...queryResult.error.errors.map(err => ({
          field: `query.${err.path.join('.')}`,
          message: err.message,
        })))
      } else {
        req.query = queryResult.data as any
      }
    }

    if (errors.length > 0) {
      const validationError = new ValidationError('Validation failed', errors)
      next(validationError)
      return
    }

    next()
  }
}