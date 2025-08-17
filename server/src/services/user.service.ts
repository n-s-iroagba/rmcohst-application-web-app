// src/services/UserService.ts

import logger from '../utils/logger'
import { CryptoUtil } from '../utils/crpto.util'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors'
import { SignUpRequestDto } from '../types/auth.types'
import { UserWithRole } from './RbacService'
import UserRepository from '../repositories/UserRepository'
import User from '../models/User'

export class UserService {
  async findUserByEmail(
    email: string,
    shouldThrowError: boolean = false
  ): Promise<UserWithRole | null> {
    try {
      const user = await UserRepository.findUserByEmail(email)

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

  async findUserById(id: string | number): Promise<UserWithRole> {
    try {
      const user = await UserRepository.findUserById(id)

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
      const user = await UserRepository.findUserByResetToken(hashedToken)

      if (!user) {
        const users = await UserRepository.getAllUsers()
        console.log(users)
        console.log(hashedToken)
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
      const user = await UserRepository.findUserByVerificationToken(token)

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

  async createUser(userData: SignUpRequestDto): Promise<User> {
    try {
      const existingUser = await this.findUserByEmail(userData.email)

      if (existingUser) {
        logger.warn('Attempt to create user with existing email', { email: userData.email })
        throw new UnauthorizedError('User already exists', 'USER_EXISTS')
      }

      const user = await UserRepository.createUser(userData)

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
      const updates = {
        verificationCode,
        verificationToken
      }

      console.log('CODE IS', verificationCode)
      
      const updatedUser = await UserRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for verification update')
      }

      logger.info('User verification details updated', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error updating user verification', { userId: user.id, error })
      throw error
    }
  }

  async markUserAsVerified(user: User): Promise<User> {
    try {
      const updates = {
        isEmailVerified: true,
        verificationCode: null,
        verificationToken: null
      }

      const updatedUser = await UserRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for verification')
      }

      logger.info('User marked as verified', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error marking user as verified', { userId: user.id, error })
      throw error
    }
  }

  async setPasswordResetDetails(user: User, hashedToken: string): Promise<User> {
    try {
      const updates = {
        passwordResetToken: hashedToken
      }

      console.log('token', hashedToken)
      
      const updatedUser = await UserRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for password reset')
      }

      console.log(updatedUser)
      logger.info('Password reset details set', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error setting password reset details', { userId: user.id, error })
      throw error
    }
  }

  async updateUserPassword(user: User, hashedPassword: string): Promise<User> {
    try {
      const updates = {
        password: hashedPassword,
        passwordResetToken: null
      }

      const updatedUser = await UserRepository.updateUserById(user.id, updates)

      if (!updatedUser) {
        throw new NotFoundError('User not found for password update')
      }

      logger.info('User password updated successfully', { userId: user.id })
      return updatedUser
    } catch (error) {
      logger.error('Error updating user password', { userId: user.id, error })
      throw error
    }
  }
}