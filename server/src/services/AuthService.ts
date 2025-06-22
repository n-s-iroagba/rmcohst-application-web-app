import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User, { UserCreationAttributes, UserRole } from '../models/User'
import { ConflictError, UnauthorizedError, NotFoundError, AppError } from '../utils/errors'
import { logger } from '../utils/logger'
import { Op } from 'sequelize'
type AuthUser = {
  userId: number
  role: UserRole
  displayName: string
}
interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}

interface LoginData {
  email: string
  password: string
}

interface ResetPasswordFormData {
  password: string
}

interface UserWithoutPassword {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isEmailVerified: boolean
  verificationToken?: string | null
  verificationTokenExpiry?: Date | null
  passwordResetToken?: string | null
  createdAt?: Date
  updatedAt?: Date
}

interface AuthResult {
  user: UserWithoutPassword
  loginToken?: string
  emailVerificationToken?: string
  passwordResetToken?: string
  requiresVerification?: boolean
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
  private readonly EMAIL_VERIFICATION_SECRET =
    process.env.EMAIL_VERIFICATION_SECRET || 'email-verification-secret'
  private readonly PASSWORD_RESET_SECRET =
    process.env.PASSWORD_RESET_SECRET || 'password-reset-secret'

  async register(userData: RegisterData): Promise<AuthResult> {
    logger.info('Attempting to register user', { email: userData.email })

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData.email } })
    if (existingUser) {
      logger.warn('Registration failed: User already exists', { email: userData.email })
      throw new ConflictError('User with this email already exists')
    }

    // Generate email verification token
    const verificationToken = this.generateVerificationCode()
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user data
    const newUserData: UserCreationAttributes = {
      email: userData.email,
      password: userData.password, // Will be hashed by the beforeCreate hook
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'APPLICANT',
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpiry,
    }

    // Create user in database
    const newUser = await User.create(newUserData)

    // Generate email verification JWT token
    const emailVerificationToken = this.generateEmailVerificationToken(
      newUser.id.toString(),
      verificationToken
    )

    // Send verification email (mock)
    await this.sendVerificationEmail(newUser.email, verificationToken)

    logger.info('User registered successfully', { userId: newUser.id, email: newUser.email })

    // Return user without password
    const { password, ...userWithoutPassword } = newUser.toJSON()

    return {
      user: userWithoutPassword,
      emailVerificationToken,
      requiresVerification: true,
    }
  }

  async login(loginData: LoginData): Promise<AuthResult> {
    logger.info('Attempting to login user', { email: loginData.email })

    // Find user
    const user = await User.findOne({ where: { email: loginData.email } })
    if (!user) {
      logger.warn('Login failed: User not found', { email: loginData.email })
      throw new UnauthorizedError('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password)
    if (!isPasswordValid) {
      logger.warn('Login failed: Invalid password', { email: loginData.email })
      throw new UnauthorizedError('Invalid credentials')
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      logger.warn('Login failed: Email not verified', { email: loginData.email })

      // Generate new verification token if needed
      if (!user.verificationToken) {
        const newVerificationToken = this.generateVerificationCode()
        const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await user.update({
          verificationToken: newVerificationToken,
          verificationTokenExpiry: newExpiry,
        })

        await this.sendVerificationEmail(user.email, newVerificationToken)
      }

      const emailVerificationToken = this.generateEmailVerificationToken(
        user.id.toString(),
        user.verificationToken!
      )

      const { password, ...userWithoutPassword } = user.toJSON()

      return {
        user: userWithoutPassword,
        emailVerificationToken,
        requiresVerification: true,
      }
    }

    // Generate JWT login token
    const loginToken = this.generateToken(user.id.toString())

    logger.info('User logged in successfully', { userId: user.id, email: user.email })

    // Return user without password
    const { password, ...userWithoutPassword } = user.toJSON()

    return {
      user: userWithoutPassword,
      loginToken,
      requiresVerification: false,
    }
  }

  async forgotPassword(email: string): Promise<{ passwordResetToken: string }> {
    logger.info('Processing forgot password request', { email })

    const user = await User.findOne({ where: { email } })
    if (!user) {
      logger.warn('Forgot password failed: User not found', { email })
      throw new NotFoundError('User not found')
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update user with reset token
    await user.update({
      passwordResetToken: resetToken,
      verificationTokenExpiry: resetTokenExpiry, // Using verificationTokenExpiry for reset token expiry
    })

    // Generate password reset JWT token
    const passwordResetToken = this.generatePasswordResetToken(user.id.toString(), resetToken)

    // Send reset email (mock)
    await this.sendPasswordResetEmail(user.email, resetToken)

    logger.info('Password reset email sent', { email })

    return { passwordResetToken }
  }

  async resetPassword(token: string, newPasswordData: ResetPasswordFormData): Promise<AuthResult> {
    logger.info('Processing password reset', { token: token.substring(0, 10) + '...' })

    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        verificationTokenExpiry: {
          [Op.gt]: new Date(), // Token not expired
        },
      },
    })

    if (!user) {
      logger.warn('Password reset failed: Invalid or expired token')
      throw new UnauthorizedError('Invalid or expired reset token')
    }

    // Update user password and clear reset token
    await user.update({
      password: newPasswordData.password, // Will be hashed by the beforeUpdate hook
      passwordResetToken: null,
      verificationTokenExpiry: null,
    })

    logger.info('Password reset successfully', { userId: user.id })

    // Check if user needs email verification
    if (!user.isEmailVerified) {
      logger.info('Password reset successful but email not verified', { userId: user.id })

      // Generate new verification token
      const newVerificationToken = this.generateVerificationCode()
      const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await user.update({
        verificationToken: newVerificationToken,
        verificationTokenExpiry: newExpiry,
      })

      await this.sendVerificationEmail(user.email, newVerificationToken)

      const emailVerificationToken = this.generateEmailVerificationToken(
        user.id.toString(),
        newVerificationToken
      )

      const { password, ...userWithoutPassword } = user.toJSON()

      return {
        user: userWithoutPassword,
        emailVerificationToken,
        requiresVerification: true,
      }
    }

    // Generate login token for verified user
    const loginToken = this.generateToken(user.id.toString())

    const { password, ...userWithoutPassword } = user.toJSON()

    return {
      user: userWithoutPassword,
      loginToken,
      requiresVerification: false,
    }
  }

  async verifyEmail(code: string): Promise<{ user: UserWithoutPassword; loginToken: string }> {
    logger.info('Processing email verification', { code: code.substring(0, 3) + '...' })

    const user = await User.findOne({
      where: {
        verificationToken: code,
        verificationTokenExpiry: {
          [Op.gt]: new Date(), // Token not expired
        },
      },
    })

    if (!user) {
      logger.warn('Email verification failed: Invalid or expired code')
      throw new UnauthorizedError('Invalid or expired verification code')
    }

    // Update user email verification status
    await user.update({
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    })

    // Generate login token for newly verified user
    const loginToken = this.generateToken(user.id.toString())

    logger.info('Email verified successfully', { userId: user.id })

    const { password, ...userWithoutPassword } = user.toJSON()

    return { user: userWithoutPassword, loginToken }
  }

  async resendVerificationCode(email: string): Promise<{ emailVerificationToken: string }> {
    logger.info('Resending verification code', { email })

    const user = await User.findOne({ where: { email } })
    if (!user) {
      logger.warn('Resend verification failed: User not found', { email })
      throw new NotFoundError('User not found')
    }

    if (user.isEmailVerified) {
      logger.warn('Resend verification failed: Email already verified', { email })
      throw new AppError('Email is already verified', 400)
    }

    const newCode = this.generateVerificationCode()
    const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with new verification token
    await user.update({
      verificationToken: newCode,
      verificationTokenExpiry: newExpiry,
    })

    await this.sendVerificationEmail(user.email, newCode)

    const emailVerificationToken = this.generateEmailVerificationToken(user.id.toString(), newCode)

    logger.info('Verification code resent', { email })

    return { emailVerificationToken }
  }
  async getAuthenticatedUser(userId: number): Promise<AuthUser> {
    const user = await User.findByPk(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return {
      userId: user.id,
      role: user.role,
      displayName: user.firstName,
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions)
  }
  private generateEmailVerificationToken(userId: string, verificationCode: string): string {
    return jwt.sign(
      { userId, verificationCode, type: 'email_verification' },
      this.EMAIL_VERIFICATION_SECRET,
      { expiresIn: '24h' }
    )
  }

  private generatePasswordResetToken(userId: string, resetToken: string): string {
    return jwt.sign({ userId, resetToken, type: 'password_reset' }, this.PASSWORD_RESET_SECRET, {
      expiresIn: '10m',
    })
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    // Mock email sending
    logger.info('Sending verification email', { email, code })
    // In real app, integrate with email service like SendGrid, AWS SES, etc.
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // Mock email sending
    logger.info('Sending password reset email', { email, token: token.substring(0, 10) + '...' })
    // In real app, integrate with email service
  }
}
