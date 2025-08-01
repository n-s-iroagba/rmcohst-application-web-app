// services/user.service.ts
import { Op } from 'sequelize'

import logger from '../utils/logger'
import { CryptoUtil } from '../utils/crpto.util'
import User from '../models/User'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors'
import { SignUpRequestDto } from '../types/auth.types'
import { UserWithRole } from './RbacService'
import { Role } from '../models'

export class UserService {
  async findUserByEmail(email: string, shouldThrowError:boolean=false): Promise<UserWithRole|null> {
    try {
      const user = await User.findOne({ where: { email },
        include:[{
          model:Role,
          as:'role'
        }]
      },
      )as UserWithRole
      
      if (!user && shouldThrowError) {
        logger.warn('User not found by email', { email })
        throw new BadRequestError('INVALID_CREDENTIALS')
      }

      if (user) {
        logger.info('User found by email', { userId: user.id, email })
      }

      return user
    } catch (error) {
      logger.error('Error finding user by email', { email, error })
      throw error
    }
  }

  async findUserById(id: string|number): Promise<UserWithRole> {
    try {
      const user = await User.findByPk(id,{
           include:[{
          model:Role,
          as:'role'
        }]
    })as UserWithRole

      if (!user) {
        logger.warn('User not found by ID', { userId: id })
        throw new NotFoundError('USER_NOT_FOUND')
      }

      logger.info('User found by ID', { userId: id })
      return user
    } catch (error) {
      logger.error('Error finding user by ID', { userId: id, error })
      throw error
    }
  }

  async findUserByResetToken(token: string): Promise<UserWithRole> {
    try {
      const hashedToken = CryptoUtil.hashString(token)
      const user = await User.findOne({
        where: {
          passwordResetToken: hashedToken,
        },
         include:[{
          model:Role,
          as:'role'
        }]
      }) as UserWithRole

      if (!user) {
        logger.warn('User not found by reset token or token expired')
        throw new UnauthorizedError('Invalid or expired reset token', 'INVALID_RESET_TOKEN')
      }

      logger.info('User found by reset token', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error finding user by reset token', { error })
      throw error
    }
  }

  async findUserByVerificationToken(token: string): Promise<User> {
    try {
      const user = await User.findOne({
        where: { verificationToken: token },
      })

      if (!user) {
        logger.warn('User not found by verification token')
        throw new NotFoundError('User not found')
      }

      logger.info('User found by verification token', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error finding user by verification token', { error })
      throw error
    }
  }

  async createUser(userData: SignUpRequestDto ): Promise<User> {
    try {
      const existingUser = await this.findUserByEmail(userData.email)

      if (existingUser) {
        logger.warn('Attempt to create user with existing email', { email: userData.email })
        throw new UnauthorizedError('User already exists', 'USER_EXISTS')
      }

      const user = await User.create(userData)

      logger.info('User created successfully', { userId: user.id, email: userData.email })
      return user
    } catch (error) {
      logger.error('Error creating user', { email: userData.email, error })
      throw error
    }
  } 

  async updateUserVerification(   
    user: User,
    verificationCode: string,
    verificationToken: string
  ): Promise<User> {
    try {
      user.verificationCode = verificationCode
      console.log('CODE IS',user.verificationCode)
      user.verificationToken = verificationToken
      await user.save()

      logger.info('User verification details updated', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error updating user verification', { userId: user.id, error })
      throw error
    }
  }

  async markUserAsVerified(user: User): Promise<User> {
    try {
      user.isEmailVerified = true
      user.verificationCode = null
      user.verificationToken = null
      await user.save()

      logger.info('User marked as verified', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error marking user as verified', { userId: user.id, error })
      throw error
    }
  }

  async setPasswordResetDetails(user: User, hashedToken: string): Promise<User> {
    try {
      user.passwordResetToken = hashedToken

      await user.save()

      logger.info('Password reset details set', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error setting password reset details', { userId: user.id, error })
      throw error
    }
  }

  async updateUserPassword(user: User, hashedPassword: string): Promise<User> {
    try {
      user.password = hashedPassword
      user.passwordResetToken = null

      await user.save()

      logger.info('User password updated successfully', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Error updating user password', { userId: user.id, error })
      throw error
    }
  }
}
