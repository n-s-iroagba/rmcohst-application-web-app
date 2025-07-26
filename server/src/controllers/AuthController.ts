import { NextFunction, Request, Response } from 'express'
import {
  LoginAuthServiceReturn,
  LoginResponseDto,
  ResendVerificationRespnseDto,
  SignUpResponseDto,
} from '../types/auth.types'
import { createAuthService } from '../services/AuthService'
import { getCookieOptions } from '../config/cookieOptions'
import { BadRequestError, NotFoundError } from '../utils/errors'
import RoleService from '../services/RoleService'
import logger from '../utils/logger'
import { AuthUser } from '../models/User'

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

      const {result,user} = await this.authService.signUp(req.body)


      const userId = user?.id
      if (!userId) {
        logger.error('User ID not found in signup result', { result })
        throw new BadRequestError('Failed to create user')
      }

      const role = await this.roleService.getRoleByName('APPLICANT')
      if (!role) {
        logger.error(`Role 'APPLICANT' not found during signup for userId ${userId}`)
        throw new NotFoundError(`Role 'APPLICANT' not found`)
      }

  
      await this.roleService.assignRoleToUser(userId, role.id)
      logger.info(`Assigned 'APPLICANT' role to userId ${userId}`)

      
      res.status(201).json({verificationToken:result.verificationToken,id:user.id} as SignUpResponseDto)
    } catch (error) {
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
   * Handles user login.
   * Validates email and password, returns tokens or verification token if unverified.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const result = await this.authService.login({ email, password })
      const unverified = result as SignUpResponseDto
      const verified = result as LoginAuthServiceReturn

      if (unverified) {
        // User not verified
        res.status(200).json(unverified)
      } else {
        res.cookie('refreshToken', verified.refreshToken, getCookieOptions())
        res.status(200).json({ user: verified.user, accessToken: verified.accessToken })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Verifies user's email using verification token and code.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {


      const result = await this.authService.verifyEmail(req.body)
      res.cookie('refreshToken', result.refreshToken, getCookieOptions())
      const authUser = result.user as AuthUser
      res.status(200).json({ user: authUser, accessToken: result.accessToken } as LoginResponseDto)
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
      const { token,id } = req.body
      const newToken = await this.authService.generateNewCode(token,id)
      res.json({ token:newToken,id }as  ResendVerificationRespnseDto)
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
   * Resets user's password with given token and new password.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resetPassword(req.body)
      res.cookie('refreshToken', result.refreshToken, getCookieOptions())
      res.status(200).json({ user: result.user, accessToken: result.accessToken }as LoginResponseDto)
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
  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const user = await this.authService.getMe(userId)
      res.status(200).json(user as AuthUser)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Generates new access token from refresh token.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken

      if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token provided' })
        return
      }

      const accessToken = await this.authService.refreshToken(refreshToken)
      res.status(200).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logs out the user by clearing refresh token cookie.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
      })

      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}
