import User from '../models/User';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';


class UserService {
  // Create a new user
  public static async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'HEAD_OF_ADMISSIONS' | 'APPLICANT' | 'SUPER_ADMIN';
  }): Promise<User> {
    logger.info('Creating user with data:', data);
    try {
      const user = await User.create(data);
      logger.info(`User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  // Get user by ID
  public static async getById(id: number): Promise<User> {
    logger.info(`Fetching user with ID: ${id}`);
    const user = await User.findByPk(id);
    if (!user) {
      logger.error(`User with ID ${id} not found`);
      throw new AppError('User not found', 404);
    }
    logger.info(`User found: ${JSON.stringify(user)}`);
    return user;
  }

  // Get all users
  public static async getAll(): Promise<User[]> {
    logger.info('Fetching all users');
    const users = await User.findAll();
    logger.info(`Found ${users.length} users`);
    return users;
  }

  // Soft delete user (destroy)
  public static async softDelete(id: number): Promise<void> {
    logger.info(`Soft deleting user with ID: ${id}`);
    const user = await User.findByPk(id);
    if (!user) {
      logger.error(`User with ID ${id} not found for delete`);
      throw new AppError('User not found', 404);
    }
    try {
      await user.destroy();
      logger.info(`User with ID ${id} soft deleted`);
    } catch (error) {
      logger.error(`Error soft deleting user with ID ${id}`, error);
      throw new AppError('Failed to delete user', 500);
    }
  }
}

export default UserService;
