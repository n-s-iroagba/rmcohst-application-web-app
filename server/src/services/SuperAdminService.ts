import SuperAdmin from '../models/SuperAdmin';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';


class SuperAdminService {
  public static async create(data: {
    firstName: string;
    lastName: string;
    userId: number;
  }): Promise<SuperAdmin> {
    logger.info('Creating SuperAdmin with data:', data);
    try {
      const superAdmin = await SuperAdmin.create(data);
      logger.info(`SuperAdmin created with ID: ${superAdmin.id}`);
      return superAdmin;
    } catch (error) {
      logger.error('Error creating SuperAdmin', error);
      throw new AppError('Failed to create SuperAdmin', 500);
    }
  }

  public static async getById(id: number): Promise<SuperAdmin> {
    logger.info(`Fetching SuperAdmin with ID: ${id}`);
    const superAdmin = await SuperAdmin.findByPk(id);
    if (!superAdmin) {
      logger.error(`SuperAdmin with ID ${id} not found`);
      throw new AppError('SuperAdmin not found', 404);
    }
    logger.info(`SuperAdmin found: ${JSON.stringify(superAdmin)}`);
    return superAdmin;
  }

  public static async getAll(): Promise<SuperAdmin[]> {
    logger.info('Fetching all SuperAdmins');
    const superAdmins = await SuperAdmin.findAll();
    logger.info(`Found ${superAdmins.length} SuperAdmins`);
    return superAdmins;
  }

  public static async update(
    id: number,
    updates: Partial<{
      firstName: string;
      lastName: string;
      userId: number;
    }>
  ): Promise<SuperAdmin> {
    logger.info(`Updating SuperAdmin with ID: ${id}, updates: ${JSON.stringify(updates)}`);
    const superAdmin = await SuperAdmin.findByPk(id);
    if (!superAdmin) {
      logger.error(`SuperAdmin with ID ${id} not found for update`);
      throw new AppError('SuperAdmin not found', 404);
    }
    try {
      await superAdmin.update(updates);
      logger.info(`SuperAdmin with ID ${id} updated`);
      return superAdmin;
    } catch (error) {
      logger.error(`Error updating SuperAdmin with ID ${id}`, error);
      throw new AppError('Failed to update SuperAdmin', 500);
    }
  }

  public static async softDelete(id: number): Promise<void> {
    logger.info(`Soft deleting SuperAdmin with ID: ${id}`);
    const superAdmin = await SuperAdmin.findByPk(id);
    if (!superAdmin) {
      logger.error(`SuperAdmin with ID ${id} not found for delete`);
      throw new AppError('SuperAdmin not found', 404);
    }
    try {
      await superAdmin.destroy();
      logger.info(`SuperAdmin with ID ${id} soft deleted`);
    } catch (error) {
      logger.error(`Error soft deleting SuperAdmin with ID ${id}`, error);
      throw new AppError('Failed to delete SuperAdmin', 500);
    }
  }

  public static async restore(id: number): Promise<void> {
    logger.info(`Restoring SuperAdmin with ID: ${id}`);
    const superAdmin = await SuperAdmin.findOne({ where: { id }, paranoid: false });
    if (!superAdmin) {
      logger.error(`SuperAdmin with ID ${id} not found for restore`);
      throw new AppError('SuperAdmin not found', 404);
    }
    try {
      await superAdmin.restore();
      logger.info(`SuperAdmin with ID ${id} restored`);
    } catch (error) {
      logger.error(`Error restoring SuperAdmin with ID ${id}`, error);
      throw new AppError('Failed to restore SuperAdmin', 500);
    }
  }
}

export default SuperAdminService;
