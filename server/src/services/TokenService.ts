import jwt, {
  SignOptions,
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken'
import { StringValue } from 'ms'
import logger from '../utils/logger'
import {
  AccessTokenPayload,
  EmailVerificationTokenPayload,
  JwtPayload,
  ResetPasswordTokenPayload,
  TokenGenerationOptions,
  TokenVerificationResult,
} from '../types/token.types'
import { UnauthorizedError, AppError, InternalServerError } from '../utils/errors'
import User from '../models/User'

// Extended interfaces for specialized tokens

export class TokenService {
  private readonly defaultOptions: Partial<TokenGenerationOptions> = {
    issuer: 'your-app-name',
    audience: 'your-app-users',
  }

  // Token expiration defaults
  private readonly tokenExpirations = {
    access: '15m' as StringValue,
    refresh: '7d' as StringValue,
    resetPassword: '1h' as StringValue,
    emailVerification: '24h' as StringValue,
  }

  constructor(
    private readonly secret: string,
    private readonly refreshSecret?: string,
    private readonly resetPasswordSecret?: string,
    private readonly emailVerificationSecret?: string
  ) {
    if (!secret) {
      logger.error('JWT secret is required for TokenService initialization')
      throw new Error('JWT secret is required')
    }

    logger.info('TokenService initialized successfully', {
      hasRefreshSecret: !!refreshSecret,
      hasResetPasswordSecret: !!resetPasswordSecret,
      hasEmailVerificationSecret: !!emailVerificationSecret,
    })
  }

  /**
   * Generate an access token with user authentication info
   */
  generateAccessToken(
    payload: Omit<AccessTokenPayload, 'iat' | 'exp' | 'nbf'>,
    customExpiresIn?: number | StringValue
  ): string {
    try {
      // Create minimal payload with only essential fields
      const accessTokenPayload: JwtPayload = {
        id: payload.id,

        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
        tokenType: 'access',
      }

      const options: TokenGenerationOptions = {
        expiresIn: customExpiresIn || this.tokenExpirations.access,
        issuer: this.defaultOptions.issuer,
        audience: this.defaultOptions.audience,
        subject: payload.id?.toString(),
      }

      const signOptions: SignOptions = {
        expiresIn: options.expiresIn,
        issuer: options.issuer,
        audience: options.audience,
        subject: options.subject,
        algorithm: 'HS256',
      }

      const token = jwt.sign(accessTokenPayload, this.secret, signOptions)

      logger.info('Access token generated successfully', {
        userId: payload.id,
        email: payload.email,
        role: payload.role,
        expiresIn: options.expiresIn,
        hasPermissions: !!(payload.permissions && payload.permissions.length > 0),
        tokenLength: token.length,
      })

      return token
    } catch (error) {
      logger.error('Access token generation failed', {
        error,
        email: payload.email,
        role: payload.role,
      })
      throw new Error('Access token generation failed')
    }
  }

  /**
   * Generate a password reset token
   */
  generateResetPasswordToken(
    payload: Omit<ResetPasswordTokenPayload, 'iat' | 'exp' | 'nbf' | 'purpose'>,
    customExpiresIn?: number | StringValue
  ): string {
    try {
      // Create minimal payload with only essential fields
      const resetTokenPayload: JwtPayload = {
        id: payload.id,

        email: payload.email,
        requestId: payload.requestId,
        tokenType: 'reset_password',
        purpose: 'password_reset',
      }

      const secret = this.resetPasswordSecret || this.secret
      const options: TokenGenerationOptions = {
        expiresIn: customExpiresIn || this.tokenExpirations.resetPassword,
        issuer: this.defaultOptions.issuer,
        audience: this.defaultOptions.audience,
        subject: payload.userId?.toString() || payload.adminId?.toString(),
      }

      const signOptions: SignOptions = {
        expiresIn: options.expiresIn,
        issuer: options.issuer,
        audience: options.audience,
        subject: options.subject,
        algorithm: 'HS256',
      }

      const token = jwt.sign(resetTokenPayload, secret, signOptions)

      logger.info('Reset password token generated successfully', {
        userId: payload.userId || payload.adminId,
        email: payload.email,
        expiresIn: options.expiresIn,
        requestId: payload.requestId,
        tokenLength: token.length,
      })

      return token
    } catch (error) {
      logger.error('Reset password token generation failed', {
        error,
        email: payload.email,
      })
      throw new Error('Reset password token generation failed')
    }
  }

  /**
   * Generate an email verification token
   */
  generateEmailVerificationToken(user: User, customExpiresIn?: StringValue | number): string {
    try {
      // Extract only essential fields from the User model
      const verificationTokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        verificationCode: user.verificationCode,
        tokenType: 'email_verification',
        purpose: 'email_verification',
      }

      const secret = this.emailVerificationSecret || this.secret
      const options: TokenGenerationOptions = {
        expiresIn: customExpiresIn || this.tokenExpirations.emailVerification,
        issuer: this.defaultOptions.issuer,
        audience: this.defaultOptions.audience,
        subject: user.id?.toString(),
      }

      const signOptions: SignOptions = {
        expiresIn: options.expiresIn,
        issuer: options.issuer,
        audience: options.audience,
        subject: options.subject,
        algorithm: 'HS256',
      }

      const token = jwt.sign(verificationTokenPayload, secret, signOptions)

      logger.info('Email verification token generated successfully', {
        userId: user.id,
        email: user.email,
        expiresIn: options.expiresIn,
        verificationCode: user.verificationCode,
        tokenLength: token.length,
      })

      return token
    } catch (error) {
      logger.error('Email verification token generation failed', {
        error,
        email: user.email,
      })
      throw new Error('Email verification token generation failed')
    }
  }

  /**
   * Generate refresh token with different secret (if provided)
   */
  generateRefreshToken(
    payload: Omit<JwtPayload, 'iat' | 'exp' | 'nbf' | 'tokenType'>,
    expiresIn: number | StringValue = '7d'
  ): string {
    // Create minimal payload with only essential fields
    const refreshPayload: JwtPayload = {
      id: payload.id,

      email: payload.email,
      role: payload.role,
      tokenType: 'refresh',
    }

    const secret = this.refreshSecret || this.secret
    const options: TokenGenerationOptions = {
      expiresIn,
      issuer: this.defaultOptions.issuer,
      audience: this.defaultOptions.audience,
    }

    try {
      const signOptions: SignOptions = {
        expiresIn: options.expiresIn,
        issuer: options.issuer,
        audience: options.audience,
        algorithm: 'HS256',
      }

      const token = jwt.sign(refreshPayload, secret, signOptions)

      logger.info('Refresh token generated successfully', {
        userId: payload.userId || payload.adminId,
        tokenLength: token.length,
      })

      return token
    } catch (error) {
      logger.error('Refresh token generation failed', { error })
      throw new Error('Refresh token generation failed')
    }
  }

  /**
   * Verify token with comprehensive expiration and error handling
   * Now supports different token types with their respective secrets
   * Throws errors to be handled by middleware
   */
  verifyToken(
    token: string,
    tokenType: 'access' | 'refresh' | 'reset_password' | 'email_verification'
  ): TokenVerificationResult {
    try {
      let secret = this.secret

      // Select appropriate secret based on token type
      switch (tokenType) {
        case 'refresh':
          secret = this.refreshSecret || this.secret
          break
        case 'reset_password':
          secret = this.resetPasswordSecret || this.secret
          break
        case 'email_verification':
          secret = this.emailVerificationSecret || this.secret
          break
        default:
          secret = this.secret
      }

      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as JwtPayload
      console.log('decoded is', decoded)
      // Validate token type matches expected type
      if (decoded.tokenType && decoded.tokenType !== tokenType) {
        logger.warn('Token type mismatch', {
          expected: tokenType,
          actual: decoded.tokenType,
          userId: decoded.user.id,
        })

        throw new UnauthorizedError(
          `Invalid token type. Expected ${tokenType} but got ${decoded.tokenType}`,
          'TOKEN_TYPE_MISMATCH',
          { expected: tokenType, actual: decoded.tokenType }
        )
      }

      // Additional expiration check
      const now = Math.floor(Date.now() / 1000)
      const isExpired = decoded.exp ? decoded.exp < now : false

      if (isExpired) {
        logger.warn('Token is expired (manual check)', {
          userId: decoded.userId,
          tokenType: decoded.tokenType,
          exp: decoded.exp,
          now,
        })

        throw new UnauthorizedError('Token has expired', 'TOKEN_EXPIRED', {
          exp: decoded.exp,
          now,
          expiredAt: new Date(decoded.exp! * 1000),
        })
      }

      // Check not before claim
      if (decoded.nbf && decoded.nbf > now) {
        logger.warn('Token not yet valid', {
          userId: decoded.userId,
          tokenType: decoded.tokenType,
          nbf: decoded.nbf,
          now,
        })

        throw new UnauthorizedError('Token not yet valid', 'TOKEN_NOT_BEFORE', {
          nbf: decoded.nbf,
          now,
          validFrom: new Date(decoded.nbf * 1000),
        })
      }

      const expiresIn = decoded.exp ? decoded.exp - now : undefined
      const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : undefined

      logger.info('Token verified successfully', {
        userId: decoded.userId,
        tokenType: decoded.tokenType,
        expiresIn,
        expiresAt,
      })

      return { decoded }
    } catch (error) {
      // Handle JWT library errors
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('JWT verification failed', {
          error: error.message,
          tokenType,
        })

        if (error instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedError('Token has expired', 'TOKEN_EXPIRED', {
            expiredAt: error.expiredAt,
          })
        }

        if (error instanceof jwt.NotBeforeError) {
          throw new UnauthorizedError('Token not active', 'TOKEN_NOT_BEFORE', { date: error.date })
        }

        // Generic JWT error (malformed, invalid signature, etc.)
        throw new UnauthorizedError('Invalid token', 'TOKEN_INVALID', { reason: error.message })
      }

      // Re-throw our custom errors
      if (error instanceof AppError) {
        throw error
      }

      // Unexpected error
      logger.error('Unexpected error during token verification', {
        error: error instanceof Error ? error.message : String(error),
        tokenType,
      })

      throw new InternalServerError('Token verification failed', 'TOKEN_VERIFICATION_ERROR', {
        originalError: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Verify access token specifically
   */
  verifyAccessToken(token: string): TokenVerificationResult {
    return this.verifyToken(token, 'access')
  }

  /**
   * Verify refresh token specifically
   */
  verifyRefreshToken(token: string): TokenVerificationResult {
    return this.verifyToken(token, 'refresh')
  }

  /**
   * Verify reset password token specifically
   */
  verifyResetPasswordToken(token: string): TokenVerificationResult {
    return this.verifyToken(token, 'reset_password')
  }

  /**
   * Verify email verification token specifically
   */
  verifyEmailVerificationToken(token: string): TokenVerificationResult {
    return this.verifyToken(token, 'email_verification')
  }

  /**
   * Check if token is expired without full verification
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token)
      if (!decoded || !decoded.exp) {
        return true
      }

      const now = Math.floor(Date.now() / 1000)
      return decoded.exp < now
    } catch (error) {
      logger.warn('Error checking token expiration', { error })
      return true
    }
  }

  /**
   * Get token expiration info without verification
   */
  getTokenExpirationInfo(token: string): {
    isExpired: boolean
    expiresAt?: Date
    expiresIn?: number
    issuedAt?: Date
  } {
    try {
      const decoded = this.decodeToken(token)
      if (!decoded) {
        return { isExpired: true }
      }

      const now = Math.floor(Date.now() / 1000)
      const isExpired = decoded.exp ? decoded.exp < now : true
      const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : undefined
      const expiresIn = decoded.exp && !isExpired ? decoded.exp - now : undefined
      const issuedAt = decoded.iat ? new Date(decoded.iat * 1000) : undefined

      return {
        isExpired,
        expiresAt,
        expiresIn,
        issuedAt,
      }
    } catch (error) {
      logger.warn('Error getting token expiration info', { error })
      return { isExpired: true }
    }
  }

  /**
   * Decode token without verification (enhanced version)
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token, { complete: false }) as JwtPayload
      return decoded
    } catch (error) {
      logger.warn('Token decoding failed', {
        error,
        tokenPreview: token.substring(0, 20) + '...',
      })
      return null
    }
  }

  /**
   * Check if token needs refresh (within refresh threshold)
   */
  shouldRefreshToken(token: string, refreshThresholdMinutes: number = 15): boolean {
    const info = this.getTokenExpirationInfo(token)

    if (info.isExpired) {
      return true
    }

    if (!info.expiresIn) {
      return false
    }

    const thresholdSeconds = refreshThresholdMinutes * 60
    return info.expiresIn <= thresholdSeconds
  }

  /**
   * Extract user info from token safely
   */
  extractUserInfo(token: string): {
    userId?: number
    adminId?: number
    email?: string
    role?: string
    tokenType?: string
    permissions?: string[]
    purpose?: string
  } | null {
    const decoded = this.decodeToken(token)
    if (!decoded) return null

    return {
      userId: decoded.userId,
      adminId: decoded.adminId,
      email: decoded.email,
      role: decoded.role,
      tokenType: decoded.tokenType,
      permissions: decoded.permissions,
      purpose: decoded.purpose,
    }
  }

  /**
   * Generate complete authentication token set (access + refresh)
   */
  generateAuthTokens(payload: Omit<AccessTokenPayload, 'iat' | 'exp' | 'nbf'>): {
    accessToken: string
    refreshToken: string
    accessExpiresIn: number
    refreshExpiresIn: number
  } {
    const accessToken = this.generateAccessToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

    return {
      accessToken,
      refreshToken,
      accessExpiresIn: 15 * 60, // 15 minutes in seconds
      refreshExpiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    }
  }

  /**
   * Generate token pair (access + refresh) - legacy method
   */
  generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp' | 'nbf' | 'tokenType'>): {
    accessToken: string
    refreshToken: string
    accessExpiresIn: number
    refreshExpiresIn: number
  } {
    const accessToken = this.generateAccessToken(payload)
    const refreshToken = this.generateRefreshToken(payload, '7d')

    return {
      accessToken,
      refreshToken,
      accessExpiresIn: 15 * 60,
      refreshExpiresIn: 7 * 24 * 60 * 60,
    }
  }

  /**
   * Validate token format before verification
   */
  private isValidTokenFormat(token: string): boolean {
    const parts = token.split('.')
    return parts.length === 3 && parts.every(part => part.length > 0)
  }

  /**
   * Get token expiration defaults
   */
  getTokenExpirationDefaults(): typeof this.tokenExpirations {
    return { ...this.tokenExpirations }
  }

  /**
   * Update token expiration defaults
   */
  updateTokenExpirationDefaults(updates: Partial<typeof this.tokenExpirations>): void {
    Object.assign(this.tokenExpirations, updates)
    logger.info('Token expiration defaults updated', updates)
  }
}
