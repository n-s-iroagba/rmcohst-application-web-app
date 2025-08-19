import { NextFunction, Request, Response } from 'express'
import { getCookieOptions } from '../config/cookieOptions'
import { AuthenticatedRequest } from '../middleware/auth'
import { AuthUser } from '../models/User'
import { createAuthService } from '../services/AuthService'
import RoleService from '../services/RoleService'
import {
  AuthServiceLoginResponse,
  ResendVerificationRespnseDto,
  SignUpResponseDto,
} from '../types/auth.types'
import { BadRequestError, NotFoundError } from '../utils/errors'
import { getGoogleAuthURL } from '../utils/googleAuth'
import logger from '../utils/logger'

export class AuthController {
  private authService = createAuthService()
  private roleService = new RoleService()
  /**
   * Handles applicant sign-up and assigns the 'APPLICANT' role.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  signUpApplicant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { result, user } = await this.authService.signUp(req.body)

      const userId = user?.id
      if (!userId) {
        logger.error('User ID not found in signup result', { result })
        throw new BadRequestError('Failed to create user')
      }

      const role = await this.roleService.getRoleByName('applicant')
      if (!role) {
        logger.error(`Role 'APPLICANT' not found during signup for userId ${userId}`)
        throw new NotFoundError(`Role 'APPLICANT' not found`)
      }

      user.roleId = role.id
      await user.save()
      logger.info(`Assigned 'APPLICANT' role to userId ${userId}`)

      const response: SignUpResponseDto = {
        verificationToken: result.verificationToken,
        id: user.id,
      }
      res.status(201).json(response)
      return
    } catch (error) {
      next(error)
    }
  }
  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const state = Math.random().toString(36).substring(2, 15);
      const authUrl = getGoogleAuthURL(state);

      res.json(authUrl);
    } catch (error) {
      next(error)

    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, error, error_description } = req.query;

      if (error) {
        throw new BadRequestError(error_description?.toString() || 'Google authentication failed')
      }

      if (!code) {
        throw new BadRequestError('Authorization code not provided')
      }

      const result = await this.authService.googleAuth(code as string);

      const verified = result as AuthServiceLoginResponse

      const cookieOptions = getCookieOptions()
      console.log('Setting refresh token cookie with options:', cookieOptions)

      res.cookie('refreshToken', verified.refreshToken, cookieOptions)
      res.status(200).json({
        user: verified.user,
        accessToken: verified.accessToken,
      })
    } catch (error: any) {
      next(error)
    }
  }

  /**
   * Handles staff sign-up.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  staffSignUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.signUp({ ...req.body })
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Resends email verification code.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  resendCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, id } = req.body
      const newToken = await this.authService.generateNewCode(token, id)
      res.json({ verificationToken: newToken, id } as ResendVerificationRespnseDto)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends password reset email.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body
      if (!email) {
        res.status(400).json({ message: 'Email is required' })
        return
      }

      await this.authService.forgotPassword(email)
      res.status(200).end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns currently authenticated user details.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const user = await this.authService.getMe(userId)
      console.log('AUTH USER', user)
      res.status(200).json(user as AuthUser)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const result = await this.authService.login({ email, password })

      // Check if result has refreshToken property (verified user)
      if ('refreshToken' in result && 'accessToken' in result) {
        // User is verified
        const verified = result as AuthServiceLoginResponse

        const cookieOptions = getCookieOptions()
        console.log('Setting refresh token cookie with options:', cookieOptions)

        res.cookie('refreshToken', verified.refreshToken, cookieOptions)
        res.status(200).json({
          user: verified.user,
          accessToken: verified.accessToken,
        })
      } else {
        // User not verified
        const unverified = result as SignUpResponseDto
        res.status(200).json(unverified)
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Verifies user's email with improved cookie setting
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.verifyEmail(req.body)

      const cookieOptions = getCookieOptions()
      console.log('Setting refresh token cookie after verification:', cookieOptions)

      res.cookie('refreshToken', result.refreshToken, cookieOptions)

      const authUser = result.user
      console.log('auth user', authUser)

      res.status(200).json({
        user: authUser,
        accessToken: result.accessToken,
      })
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resetPassword(req.body)

      const cookieOptions = getCookieOptions()
      console.log('Setting refresh token cookie after password reset:', cookieOptions)

      res.cookie('refreshToken', result.refreshToken, cookieOptions)

      // Extract only the properties you need from the user object
      const userResponse = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        // Add other properties you need
      }

      res.status(200).json({
        user: userResponse,
        accessToken: result.accessToken,
      })
    } catch (error) {
      next(error)
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('All cookies received:', req.cookies)
      console.log('Headers:', req.headers.cookie)

      const cookieHeader = req.headers.cookie
      console.log('Raw cookie header:', cookieHeader)

      if (!cookieHeader) {
        res.status(401).json({ message: 'No cookies provided' })
        return
      }

      // Extract the refreshToken value from the cookie string
      const refreshToken = cookieHeader
        .split(';')
        .find(cookie => cookie.trim().startsWith('refreshToken='))
        ?.split('=')[1]

      console.log('Extracted refresh token:', refreshToken ? 'Present' : 'Missing')
      console.log('Token preview:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None')

      if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token found in cookies' })
        return
      }

      // Now pass just the token value (not the whole cookie header)
      const accessToken = await this.authService.refreshToken(refreshToken)
      res.status(200).json(accessToken)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logout with improved cookie clearing
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProduction = process.env.NODE_ENV === 'production'

      const clearOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        path: '/', // Important: match the path used when setting
      }

      console.log('Clearing cookie with options:', clearOptions)
      res.clearCookie('refreshToken', clearOptions)

      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}
