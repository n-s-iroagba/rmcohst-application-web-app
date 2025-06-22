import User, { UserRole } from '../models/User'
import { Staff, StaffRole } from '../models/Staff'

import { AppError } from '../utils/error/AppError'
import logger from '../utils/logger/logger'
import sequelize from '../config/database'
import { Op } from 'sequelize'

interface StaffCreationData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: StaffRole // Staff roles
  password?: string // Password only for creation
}

interface UserUpdateData {
  firstName?: string
  lastName?: string
  email?: string
  role?: UserRole
  phoneNumber?: string // For updating staff's phone number
}

class UserService {
  public static async createStaffUser(data: StaffCreationData): Promise<User> {
    logger.info('Creating staff user with data:', data)
    const transaction = await sequelize.transaction()
    try {
      const existingUser = await User.findOne({ where: { email: data.email }, transaction })
      if (existingUser) {
        throw new AppError('User with this email already exists', 409)
      }

      if (!data.password) {
        throw new AppError('Password is required for new staff user creation', 400)
      }

      const user = await User.create(
        {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'STAFF',
          emailVerified: true,
        },
        { transaction }
      )

      await transaction.commit()
      logger.info(`Staff user created with ID: ${user.id}`)
      return this.getById(user.id, true)
    } catch (error) {
      await transaction.rollback()
      logger.error('Error creating staff user', error)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to create staff user', 500)
    }
  }

  public static async getById(id: number, includeDetails = false): Promise<User> {
    logger.info(`Fetching user with ID: ${id}`)
    const queryOptions: any = { where: { id } }
    if (includeDetails) {
      queryOptions.include = [
        // Ensure 'user' is included if Staff model itself is fetched elsewhere and needs its User details
        { model: Staff, as: 'staff', include: [{ model: User, as: 'user' }] },
      ]
    }
    const user = await User.findOne(queryOptions)
    if (!user) {
      logger.error(`User with ID ${id} not found`)
      throw new AppError('User not found', 404)
    }
    logger.info(`User found: ${JSON.stringify(user)}`)
    return user
  }

  public static async getAllDetailed(includeInactive = false): Promise<User[]> {
    logger.info('Fetching all users with details')
    const queryOptions: any = {
      include: [
        { model: Staff, as: 'staff', required: false }, // User.staff will have phoneNumber
        // No need to include User again inside Staff here as we are fetching User records primarily
      ],
      order: [['createdAt', 'DESC']],
    }

    if (!includeInactive) {
      queryOptions.where = {
        deletedAt: { [Op.is]: null },
      }
    } else {
      queryOptions.paranoid = false
    }

    const users = await User.findAll(queryOptions)
    logger.info(`Found ${users.length} users`)
    return users
  }

  public static async updateUserDetails(userId: number, data: UserUpdateData): Promise<User> {
    logger.info(`Updating user ID ${userId} with data:`, data)
    const transaction = await sequelize.transaction()
    try {
      const user = await User.findByPk(userId, {
        transaction,
        include: [{ model: Staff, as: 'staff' }], // Include staff to update it
      })
      if (!user) {
        throw new AppError('User not found', 404)
      }

      if (data.firstName) user.firstName = data.firstName
      if (data.lastName) user.lastName = data.lastName
      if (data.email) {
        const existingUserWithEmail = await User.findOne({
          where: { email: data.email, id: { [Op.ne]: userId } },
          transaction,
        })
        if (existingUserWithEmail) {
          throw new AppError('This email is already in use by another account.', 409)
        }
        user.email = data.email
      }

      await user.save({ transaction })

      // Update Staff model's phone number or create Staff if it doesn't exist for non-applicants
      if (data.phoneNumber) {
        if (user.staff) {
          user.staff.phoneNumber = data.phoneNumber
          await user.staff.save({ transaction })
        } else if (user.role !== 'APPLICANT') {
          // Create Staff record if it doesn't exist and user is not an applicant
        }
      }
      await transaction.commit()
      logger.info(`User ID ${userId} updated successfully.`)
      return this.getById(userId, true)
    } catch (error) {
      await transaction.rollback()
      logger.error(`Error updating user ID ${userId}`, error)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to update user', 500)
    }
  }

  public static async deactivateUser(id: number): Promise<void> {
    logger.info(`Deactivating user with ID: ${id}`)
    const user = await User.findByPk(id)
    if (!user) {
      logger.error(`User with ID ${id} not found for deactivation`)
      throw new AppError('User not found', 404)
    }
    try {
      await user.destroy()
      logger.info(`User with ID ${id} deactivated`)
    } catch (error) {
      logger.error(`Error deactivating user with ID ${id}`, error)
      throw new AppError('Failed to deactivate user', 500)
    }
  }

  public static async reactivateUser(id: number): Promise<User> {
    logger.info(`Reactivating user with ID: ${id}`)
    const user = await User.findByPk(id, { paranoid: false })
    if (!user) {
      logger.error(`User with ID ${id} not found for reactivation`)
      throw new AppError('User not found', 404)
    }
    if (!user.deletedAt) {
      throw new AppError('User is already active', 400)
    }
    try {
      await user.restore()
      logger.info(`User with ID ${id} reactivated`)
      return this.getById(id, true)
    } catch (error) {
      logger.error(`Error reactivating user with ID ${id}`, error)
      throw new AppError('Failed to reactivate user', 500)
    }
  }
}

export default UserService
