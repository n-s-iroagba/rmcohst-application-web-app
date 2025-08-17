import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import appConfig from '../config' // Default import
import User from '../models/User' // Assuming User model and UserRole enum

// Import your custom error classes
import { UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError } from '../utils/errors' // Adjust path as needed
import logger from '../utils/logger'
import { UserRole } from '../models'
import { TokenService } from '../services/TokenService'

// Fix: Make user optional to match Express Request interface
export interface AuthenticatedRequest extends Request {
  user?: User // Changed from required to optional
}

// JWT Payload interfaces
interface LoginTokenPayload {
  userId: string
  iat?: number
  exp?: number
}

interface EmailVerificationTokenPayload {
  userId: string
  verificationCode: string
  type: 'email_verification'
  iat?: number
  exp?: number
}

interface PasswordResetTokenPayload {
  userId: string
  resetToken: string
  type: 'password_reset'
  iat?: number
  exp?: number
}
const verificationService = new TokenService(process.env.JWT_SECRET || 'udorakpuenyi')
// Main authentication middleware for login tokens
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    console.log('access token', token)
    const { decoded } = verificationService.verifyToken(token, 'access')
    console.log('DECODED', decoded)

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new ForbiddenError('Please verify your email address')
    }

    req.user = user
    logger.info(`Authenticated user: ${user.email} (ID: ${user.id})`)
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn(`Token expired for user attempt`)
      return next(new UnauthorizedError('Token expired'))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Invalid token attempt`)
      return next(new UnauthorizedError('Invalid token'))
    }

    // If it's already one of our custom errors, pass it along
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      return next(error)
    }

    logger.error('Authentication error:', error)
    return next(error)
  }
}

// Middleware for email verification tokens
export const verifyEmailTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body

    if (!token) {
      throw new BadRequestError('Email verification token is required')
    }

    const decoded = jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET || 'email-verification-secret'
    ) as EmailVerificationTokenPayload

    if (decoded.type !== 'email_verification') {
      throw new BadRequestError('Invalid token type')
    }

    const user = await User.findByPk(decoded.userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Verify the verification code matches
    if (user.verificationToken !== decoded.verificationCode) {
      throw new BadRequestError('Invalid verification token')
    }

    // Attach user and verification code to request
    req.user = user
    req.verificationCode = decoded.verificationCode
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new BadRequestError('Email verification token expired'))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new BadRequestError('Invalid email verification token'))
    }

    // If it's already one of our custom errors, pass it along
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      return next(error)
    }

    logger.error('Email verification token error:', error)
    return next(error)
  }
}

// Middleware for password reset tokens
export const verifyPasswordResetTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body

    if (!token) {
      throw new BadRequestError('Password reset token is required')
    }

    const decoded = jwt.verify(
      token,
      process.env.PASSWORD_RESET_SECRET || 'password-reset-secret'
    ) as PasswordResetTokenPayload

    if (decoded.type !== 'password_reset') {
      throw new BadRequestError('Invalid token type')
    }

    const user = await User.findByPk(decoded.userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Verify the reset token matches
    if (user.passwordResetToken !== decoded.resetToken) {
      throw new BadRequestError('Invalid reset token')
    }

    // Check if token is expired (using verificationTokenExpiry for reset token expiry)

    // Attach user and reset token to request
    req.user = user
    req.resetToken = decoded.resetToken
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new BadRequestError('Password reset token expired'))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new BadRequestError('Invalid password reset token'))
    }

    // If it's already one of our custom errors, pass it along
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      return next(error)
    }

    logger.error('Password reset token error:', error)
    return next(error)
  }
}

// Type guard helper for authenticated routes
export const assertUser = (
  req: AuthenticatedRequest
): asserts req is AuthenticatedRequest & { user: User } => {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated')
  }
}

// // Role-based authorization middleware (uncommented and fixed)
// export const requireRole = (roles: UserRole[]) => {
//   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//       // Use type guard to ensure user exists
//       assertUser(req)

//       if (!roles.includes(req.user.role)) {
//         logger.warn(
//           `Forbidden: User ${req.user.email} (Role: ${req.user.role}) tried to access resource requiring roles: ${roles.join(', ')}`
//         )
//         throw new ForbiddenError('You do not have the required role')
//       }
//       next()
//     } catch (error) {
//       next(error)
//     }
//   }
// }

// Extend Request interface to include additional properties
declare global {
  namespace Express {
    interface Request {
      user?: User
      verificationCode?: string
      resetToken?: string
    }
  }
}

export class TokenMiddleware {
  constructor(private tokenService: TokenService) {}

  /**
   * Express middleware for token verification
   */
  verifyAccessToken() {
    return (req: any, res: any, next: any) => {
      const authHeader = req.headers.authorization
      try {
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

        if (!token) {
          throw new BadRequestError('No access Token provided')
        }

        const result = this.tokenService.verifyToken(token)
        req.user = result.decoded
        next()
      } catch (error) {
        next(error)
      }
    }
  }
}

export default TokenService
