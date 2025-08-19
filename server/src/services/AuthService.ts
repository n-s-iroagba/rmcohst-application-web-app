import { Role } from '../models'
import User, { AuthUser, UserCreationAttributes } from '../models/User'
import {
  AuthConfig,
  AuthServiceLoginResponse,
  LoginRequestDto,
  ResetPasswordRequestDto,
  SignUpRequestDto,
  SignUpResponseDto,
  VerifyEmailRequestDto,
} from '../types/auth.types'
import { BadRequestError, NotFoundError } from '../utils/errors'
import logger from '../utils/logger'
import { PasswordService } from './PasswordService'
import { TokenService } from './TokenService'
import { UserService } from './user.service'
import { VerificationService } from './VerificationService'

import { EmailService } from './EmailService'


import UserRepository from '../repositories/UserRepository'
import { GoogleProfile } from '../types/google'
import { UserWithRole } from '../types/join-model.types'
import { getGoogleTokens, getGoogleUser } from '../utils/googleAuth'

export class AuthService {
  private tokenService: TokenService
  private passwordService: PasswordService
  private userService: UserService
  private emailService: EmailService
  private verificationService: VerificationService
  roleService: any

  constructor(private readonly config: AuthConfig) {
    this.tokenService = new TokenService(config.jwtSecret)
    this.passwordService = new PasswordService()
    this.userService = new UserService()
    this.emailService = new EmailService(config.clientUrl)
    this.verificationService = new VerificationService(
      this.tokenService,
      this.userService,
      this.emailService,
      config
    )

    logger.info('AuthService initialized successfully')
  }

  /**
   * Registers a new user and initiates email verification.
   * @param data - User sign-up data.
   * @param roles - Optional array of user roles.
   * @returns Sign-up response with verification token.
   */
  async signUp(data: SignUpRequestDto): Promise<{ result: SignUpResponseDto; user: User }> {
    try {
      logger.info('Sign up process started', { email: data.email })

      const hashedPassword = await this.passwordService.hashPassword(data.password)
      const user = await this.userService.createUser({
        ...data,
        password: hashedPassword,
      })

      const result = await this.verificationService.generateVerificationDetails(user)

      logger.info('Sign up completed successfully', { userId: user.id })
      return { result, user }
    } catch (error) {
      return this.handleAuthError('Sign up', { email: data.email }, error)
    }
  }
  async googleAuth(code: string): Promise<AuthServiceLoginResponse | void> {
    const { access_token } = await getGoogleTokens(code)
    const googleUser: GoogleProfile = await getGoogleUser(access_token)
    return this.handleGoogleAuth(googleUser)




  }
  public async handleGoogleAuth(profile: GoogleProfile): Promise<AuthServiceLoginResponse | void> {
    try {


      let user = await UserRepository.findUserByGoogleId(profile.id)

      if (user) {
        const role = user.role
        const { accessToken, refreshToken } = this.generateTokenPair(user)
        logger.info('Login successful', { userId: user?.id })
        const returnUser = { ...user.get({ plain: true }), role: role.name }
        user.refreshToken = refreshToken
        await user.save()
        return { user: returnUser, accessToken, refreshToken }
      }

      const email = profile.email

      // Check if user exists with same email
      user = await UserRepository.findUserByEmail(email)

      if (user) {
        // Link Google account to existing user
        await UserRepository.updateById(user.id, {
          googleId: profile.id,

          isEmailVerified: true,

        })
        const role = user.role
        const { accessToken, refreshToken } = this.generateTokenPair(user)
        logger.info('Login successful', { userId: user?.id })
        const returnUser = { ...user.get({ plain: true }), role: role.name }
        user.refreshToken = refreshToken
        await user.save()
        return { user: returnUser, accessToken, refreshToken }
      }

      // Create new user
      const newUserData: UserCreationAttributes = {
        googleId: profile.id,
        email: email,
        username: profile.name,


        isEmailVerified: true,

      }
      user = await this.userService.createUser({
        ...newUserData,
        password: '',
      }) as UserWithRole

      if (user) {
        const role = await this.roleService.getRoleByName('applicant')
        if (!role) {
          logger.error(`Role 'APPLICANT' not found during signup for userId ${user.id}`)
          throw new NotFoundError(`Role 'APPLICANT' not found`)
        }
        user.roleId = role.id
        await user.save()
        logger.info(`Assigned 'APPLICANT' role to userId ${user.id}`)
        const { accessToken, refreshToken } = this.generateTokenPair(user)
        logger.info('Login successful', { userId: user?.id })
        const returnUser = { ...user.get({ plain: true }), role: role.name }
        user.refreshToken = refreshToken
        await user.save()
        return { user: returnUser, accessToken, refreshToken }
      }

    } catch (error) {
      throw new BadRequestError(`Google authentication failed: ${error}`)
    }
  }


  /**
   * Logs a user in by validating credentials and returning tokens.
   * @param data - Login DTO containing email and password.
   * @returns LoginAuthServiceReturn or SignUpResponseDto for unverified users.
   */
  async login(data: LoginRequestDto): Promise<AuthServiceLoginResponse | SignUpResponseDto> {
    try {
      logger.info('Login attempt started', { email: data.email })

      const user = await this.userService.findUserByEmail(data.email, true)
      console.log('PASSWORD', user?.password)
      await this.validatePassword(user, data.password)
      if (!user) {
        throw new NotFoundError('user not found')
      }

      if (!user.isEmailVerified) {
        logger.warn('Login attempted by unverified user', { userId: user.id })
        const { verificationToken } =
          await this.verificationService.generateVerificationDetails(user)
        return { id: user.id, verificationToken }
      }
      const role = await Role.findByPk(user.roleId)
      if (!role) throw new NotFoundError('role not found')
      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Login successful', { userId: user?.id })
      const returnUser = { ...user.get({ plain: true }), role: role.name }
      user.refreshToken = refreshToken
      await user.save()
      return { user: returnUser, accessToken, refreshToken }
    } catch (error) {
      return this.handleAuthError('Login', { email: data.email }, error)
    }
  }

  /**
   * Issues a new access token from a refresh token.
   * @param refreshToken - JWT refresh token.
   * @returns Object containing a new access token.
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      logger.info('Token refresh attempted')

      const { decoded } = this.tokenService.verifyToken(refreshToken, 'refresh')

      if (!decoded.id) {
        logger.warn('Invalid refresh token provided')
        throw new BadRequestError('Invalid refresh token')
      }

      const user = await this.userService.findUserById(decoded.id)
      const newAccessToken = this.tokenService.generateAccessToken(user)

      logger.info('Token refreshed successfully', { userId: user.id })
      return { accessToken: newAccessToken }
    } catch (error) {
      return this.handleAuthError('Token refresh', {}, error)
    }
  }

  /**
   * Verifies a user's email using a token and code.
   * @param data - DTO containing token and verification code.
   * @returns Auth tokens for the verified user.
   */
  async verifyEmail(data: VerifyEmailRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Email verification started')

      const { decoded } = this.tokenService.verifyToken(
        data.verificationToken,
        'email_verification'
      )
      console.log(decoded)
      const userId = decoded.userId

      if (!userId) {
        logger.warn('Invalid verification token provided')
        throw new BadRequestError('Unsuitable token')
      }

      const user = await this.userService.findUserById(userId)
      const role = await Role.findByPk(user.roleId)
      if (!role) throw new NotFoundError('Role not found')

      this.verificationService.validateVerificationCode(user, data.verificationCode)
      await this.userService.markUserAsVerified(user)

      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Email verification successful', { userId: user.id })
      const returnUser = { ...user.get({ plain: true }), role: role.name }
      user.refreshToken = refreshToken
      await user.save()
      return { user: returnUser, accessToken, refreshToken }
    } catch (error) {
      return this.handleAuthError('Email verification', {}, error)
    }
  }

  /**
   * Generates a new email verification code.
   * @param token - JWT token associated with the verification.
   * @returns A new verification code string.
   */
  async generateNewCode(id: string, token: string): Promise<string> {
    try {
      logger.info('New verification code generation requested')
      return await this.verificationService.regenerateVerificationCode(id, token)
    } catch (error) {
      return this.handleAuthError('New code generation', {}, error)
    }
  }

  /**
   * Sends a password reset email to the user.
   * @param email - User's email address.
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      logger.info('Password reset requested', { email })

      const user = await this.userService.findUserByEmail(email)
      if (!user) {
        logger.error('Password reset requested for non-existent email', { email })
        throw new NotFoundError('user for forgot password not found')
      }

      const { token, hashedToken } = this.passwordService.generateResetToken()
      await this.userService.setPasswordResetDetails(user, hashedToken)
      await this.emailService.sendPasswordResetEmail(user.email, token)

      logger.info('Password reset email sent', { userId: user.id })
    } catch (error) {
      return this.handleAuthError('Password reset', { email }, error)
    }
  }

  /**
   * Resets the user's password using the reset token.
   * @param data - DTO with new password and reset token.
   * @returns New auth tokens.
   */
  async resetPassword(data: ResetPasswordRequestDto): Promise<AuthServiceLoginResponse> {
    try {
      logger.info('Password reset process started')

      const user = await this.userService.findUserByResetToken(data.resetPasswordToken)
      const hashedPassword = await this.passwordService.hashPassword(data.password)
      await this.userService.updateUserPassword(user, hashedPassword)

      const { accessToken, refreshToken } = this.generateTokenPair(user)
      logger.info('Password reset successful', { userId: user.id })
      const role = await Role.findByPk(user.roleId)
      if (!role) throw new NotFoundError('role not found')
      return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken, role.name)
    } catch (error) {
      return this.handleAuthError('Password reset', {}, error)
    }
  }

  /**
   * Retrieves a user by ID.
   * @param userId - ID of the user.
   * @returns User object.
   */
  async getUserById(userId: string) {
    try {
      logger.info('Get user by ID requested', { userId })

      const user = await this.userService.findUserById(userId)
      logger.info('User retrieved successfully', { userId: user.id })

      return user
    } catch (error) {
      return this.handleAuthError('Get user by ID', { userId }, error)
    }
  }

  /**
   * Returns the current authenticated user's details.
   * @param userId - Authenticated user's ID.
   * @returns User object.
   */
  async getMe(userId: number): Promise<AuthUser> {
    try {
      logger.info('Get current user requested', { userId })

      const user = await this.userService.findUserById(userId)
      logger.info('Current user retrieved successfully', { userId })

      return user as unknown as AuthUser
    } catch (error) {
      return this.handleAuthError('Get current user', { userId }, error)
    }
  }

  /**
   * Compares the given password with the user's stored password.
   * @param user - User instance.
   * @param password - Plain text password to validate.
   */
  private async validatePassword(user: any, password: string): Promise<void> {
    const isMatch = await this.passwordService.comparePasswords(password, user.password)
    if (!isMatch) {
      logger.warn('Password validation failed', { userId: user.id })
      throw new BadRequestError('Invalid credentials', 'INVALID_CREDENTIALS')
    }
    logger.info('Password validated successfully', { userId: user.id })
  }

  /**
   * Generates a new access/refresh token pair.
   * @param userId - ID of the user.
   * @returns Object containing access and refresh tokens.
   */
  private generateTokenPair(user: UserWithRole): { accessToken: string; refreshToken: string } {
    const accessToken = this.tokenService.generateAccessToken(user)

    const refreshToken = this.tokenService.generateRefreshToken(user)

    return { accessToken, refreshToken }
  }

  /**
   * Saves the refresh token on the user and returns the full auth response.
   * @param user - User instance.
   * @param accessToken - JWT access token.
   * @param refreshToken - JWT refresh token.
   * @returns Full login/auth return object.
   */
  private async saveRefreshTokenAndReturn(
    passedUser: any,
    accessToken: string,
    refreshToken: string,
    role: string
  ): Promise<AuthServiceLoginResponse> {
    passedUser.refreshToken = refreshToken
    await passedUser.save()
    const user = { ...passedUser, role }

    return { accessToken, user, refreshToken }
  }

  /**
   * Unified error handler for all auth-related operations.
   * @param operation - Operation name for logging.
   * @param context - Additional context info.
   * @param error - Error caught during operation.
   * @throws Error - Re-throws the original error.
   */
  private async handleAuthError(
    operation: string,
    context: Record<string, any>,
    error: any
  ): Promise<never> {
    logger.error(`${operation} failed`, { ...context, error })
    throw error
  }
}

// factory/auth.factory.ts
export function createAuthService(): AuthService {
  const config: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET || 'udorakpuenyi',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    tokenExpiration: {
      verification: 86400,
      login: 3600,
      refresh: 86400 * 7,
    },
  }

  logger.info('AuthService factory creating new instance')
  return new AuthService(config)
}
