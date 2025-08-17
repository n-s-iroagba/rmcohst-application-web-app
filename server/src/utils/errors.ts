export class AppError extends Error {
  public statusCode: number
  public code: string
  public details: any

  constructor(message: string, code: string, statusCode: number, details?: any) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.details = details

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        ...(this.details && { details: this.details }),
      },
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request', code = 'BAD_REQUEST', details?: any) {
    super(message, code, 400, details)
  }
}

export class PaymentError extends AppError {
  readonly isOperational = true

  constructor(message: string, code = 'PAYMENT_ERROR', statusCode = 400, details?: any) {
    super(message, code, statusCode, details)
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED', details?: any) {
    super(message, code, 401, details)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN', details?: any) {
    super(message, code, 403, details)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details?: any) {
    super(message, code, 404, details)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', code = 'CONFLICT', details?: any) {
    super(message, code, 409, details)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(message, code, 500, details)
  }
}

export class ValidationError extends AppError {
  constructor(errors: any[], message = 'Validation failed', code = 'VALIDATION_ERROR') {
    super(message, code, 422, errors)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'DATABASE_ERROR', 500, details)
  }
}
