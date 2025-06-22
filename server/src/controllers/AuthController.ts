import { Request, Response, NextFunction, CookieOptions } from 'express'
import { ApiResponseUtil } from '../utils/response'
import { logger } from '../utils/logger'
import { AuthService } from '../services/AuthService'
import { AuthenticatedRequest } from '../middleware/auth'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  private getCookieOptions(
    tokenType: 'login' | 'emailVerification' | 'passwordReset'
  ): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production'

    const baseOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax', // Cross-domain in production, same-domain in development
      path: '/',
    }

    // Set different expiration times based on token type
    switch (tokenType) {
      case 'login':
        return {
          ...baseOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }
      case 'emailVerification':
        return {
          ...baseOptions,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }
      case 'passwordReset':
        return {
          ...baseOptions,
          maxAge: 10 * 60 * 1000, // 10 minutes
        }
      default:
        return baseOptions
    }
  }

  private clearAuthCookies(res: Response): void {
    const cookieOptions = this.getCookieOptions('login')
    res.clearCookie('loginToken', cookieOptions)
    res.clearCookie('emailVerificationToken', cookieOptions)
    res.clearCookie('passwordResetToken', cookieOptions)
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Register endpoint called', { email: req.body.email })

      const result = await this.authService.register(req.body)

      // Set email verification token as cookie
      if (result.emailVerificationToken) {
        res.cookie(
          'emailVerificationToken',
          result.emailVerificationToken,
          this.getCookieOptions('emailVerification')
        )
      }

      const responseData = {
        user: result.user,
        requiresVerification: result.requiresVerification,
      }

      res
        .status(201)
        .json(
          ApiResponseUtil.success(
            responseData,
            'User registered successfully. Please check your email to verify your account.',
            201
          )
        )
    } catch (error) {
      logger.error('Registration error', { error: error, email: req.body.email })
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Login endpoint called', { email: req.body.email })

      const result = await this.authService.login(req.body)

      // Clear any existing auth cookies first
      this.clearAuthCookies(res)

      if (result.requiresVerification) {
        // User needs email verification
        if (result.emailVerificationToken) {
          res.cookie(
            'emailVerificationToken',
            result.emailVerificationToken,
            this.getCookieOptions('emailVerification')
          )
        }

        const responseData = {
          user: result.user,
          requiresVerification: true,
        }

        res
          .status(200)
          .json(
            ApiResponseUtil.success(
              responseData,
              'Please verify your email address to complete login. A verification code has been sent to your email.'
            )
          )
      } else {
        // User is verified, set login token
        if (result.loginToken) {
          res.cookie('loginToken', result.loginToken, this.getCookieOptions('login'))
        }

        const responseData = {
          user: result.user,
          requiresVerification: false,
        }

        res.status(200).json(ApiResponseUtil.success(responseData, 'Login successful'))
      }
    } catch (error) {
      logger.error('Login error', { error: error, email: req.body.email })
      next(error)
    }
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Forgot password endpoint called', { email: req.body.email })

      const result = await this.authService.forgotPassword(req.body.email)

      // Set password reset token as cookie
      if (result.passwordResetToken) {
        res.cookie(
          'passwordResetToken',
          result.passwordResetToken,
          this.getCookieOptions('passwordReset')
        )
      }

      res
        .status(200)
        .json(
          ApiResponseUtil.success(
            null,
            'If an account with that email exists, you will receive a password reset link.'
          )
        )
    } catch (error) {
      logger.error('Forgot password error', { error: error, email: req.body.email })
      next(error)
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params
      logger.info('Reset password endpoint called', { token: token.substring(0, 10) + '...' })

      const result = await this.authService.resetPassword(token, req.body)

      // Clear password reset cookie
      res.clearCookie('passwordResetToken', this.getCookieOptions('passwordReset'))

      if (result.requiresVerification) {
        // User needs email verification after password reset
        if (result.emailVerificationToken) {
          res.cookie(
            'emailVerificationToken',
            result.emailVerificationToken,
            this.getCookieOptions('emailVerification')
          )
        }

        const responseData = {
          user: result.user,
          requiresVerification: true,
        }

        res
          .status(200)
          .json(
            ApiResponseUtil.success(
              responseData,
              'Password reset successful. Please verify your email address to complete the process.'
            )
          )
      } else {
        // User is verified, set login token
        if (result.loginToken) {
          res.cookie('loginToken', result.loginToken, this.getCookieOptions('login'))
        }

        const responseData = {
          user: result.user,
          requiresVerification: false,
        }

        res
          .status(200)
          .json(
            ApiResponseUtil.success(
              responseData,
              'Password reset successful. You are now logged in.'
            )
          )
      }
    } catch (error) {
      logger.error('Reset password error', {
        error: error,
        token: req.params.token?.substring(0, 10) + '...',
      })
      next(error)
    }
  }

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Email verification endpoint called', {
        code: req.body.code.substring(0, 3) + '...',
      })

      const result = await this.authService.verifyEmail(req.body.code)

      // Clear email verification cookie and set login token
      res.clearCookie('emailVerificationToken', this.getCookieOptions('emailVerification'))

      if (result.loginToken) {
        res.cookie('loginToken', result.loginToken, this.getCookieOptions('login'))
      }

      const responseData = {
        user: result.user,
      }

      res
        .status(200)
        .json(
          ApiResponseUtil.success(
            responseData,
            'Email verified successfully. You are now logged in.'
          )
        )
    } catch (error) {
      logger.error('Email verification error', {
        error: error,
        code: req.body.code?.substring(0, 3) + '...',
      })
      next(error)
    }
  }

  resendVerificationCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info('Resend verification code endpoint called', { email: req.body.email })

      const result = await this.authService.resendVerificationCode(req.body.email)

      // Update email verification token cookie
      if (result.emailVerificationToken) {
        res.cookie(
          'emailVerificationToken',
          result.emailVerificationToken,
          this.getCookieOptions('emailVerification')
        )
      }

      res.status(200).json(ApiResponseUtil.success(null, 'Verification code resent successfully'))
    } catch (error) {
      logger.error('Resend verification code error', { error: error, email: req.body.email })
      next(error)
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Logout endpoint called')

      // Clear all auth cookies
      this.clearAuthCookies(res)

      res.status(200).json(ApiResponseUtil.success(null, 'Logout successful'))
    } catch (error) {
      logger.error('Logout error', { error })
      next(error)
    }
  }

  async authMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id // Assuming middleware sets req.user

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        })
        return
      }

      const authUser = await this.authService.getAuthenticatedUser(userId)

      res.status(200).json(ApiResponseUtil.success(authUser, 'Logout successful'))
    } catch (error) {
      next(error)
    }
  }
}
