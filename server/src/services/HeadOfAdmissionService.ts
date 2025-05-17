import { Op } from 'sequelize';
import HeadOfAdmissions from '../models/HeadOfAdmissions';
import Staff from '../models/Staff';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';

class HeadOfAdmissionsService {
  /**
   * Create a new HeadOfAdmissions entry
   */
  public async create(data: {
    staffId: number;
    portalUsername: string;
    portalPassword: string;
  }): Promise<HeadOfAdmissions> {
    try {
      // Ensure the staff exists
      const staff = await Staff.findByPk(data.staffId);
      if (!staff) {
        throw new AppError(`Staff with ID ${data.staffId} not found`, 404);
      }

      // Ensure no duplicate username
      const existing = await HeadOfAdmissions.findOne({
        where: { portalUsername: data.portalUsername },
      });

      if (existing) {
        throw new AppError(`Username "${data.portalUsername}" is already taken`, 409);
      }

      const admission = await HeadOfAdmissions.create(data);
      logger.info(`HeadOfAdmissions created with ID ${admission.id}`);
      return admission;
    } catch (error: any) {
      logger.error(`Create HeadOfAdmissions failed: ${error.message}`);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create HeadOfAdmissions', 500);
    }
  }

  /**
   * Get a single HeadOfAdmissions by ID
   */
  public async getById(id: number): Promise<HeadOfAdmissions> {
    const admission = await HeadOfAdmissions.findByPk(id, { include: [Staff] });
    if (!admission) {
      throw new AppError(`HeadOfAdmissions with ID ${id} not found`, 404);
    }
    return admission;
  }

  /**
   * Get all HeadOfAdmissions entries
   */
  public async getAll(): Promise<HeadOfAdmissions[]> {
    return HeadOfAdmissions.findAll({ include: [Staff] });
  }

  /**
   * Update a HeadOfAdmissions record
   */
  public async update(id: number, updates: Partial<{
    staffId: number;
    portalUsername: string;
    portalPassword: string;
  }>): Promise<HeadOfAdmissions> {
    const admission = await HeadOfAdmissions.findByPk(id);
    if (!admission) {
      throw new AppError(`HeadOfAdmissions with ID ${id} not found`, 404);
    }

    if (updates.staffId) {
      const staff = await Staff.findByPk(updates.staffId);
      if (!staff) {
        throw new AppError(`Staff with ID ${updates.staffId} not found`, 404);
      }
    }

    await admission.update(updates);
    logger.info(`HeadOfAdmissions with ID ${id} updated`);
    return admission;
  }

  /**
   * Delete a HeadOfAdmissions record
   */
  public async delete(id: number): Promise<void> {
    const admission = await HeadOfAdmissions.findByPk(id);
    if (!admission) {
      throw new AppError(`HeadOfAdmissions with ID ${id} not found`, 404);
    }

    await admission.destroy();
    logger.info(`HeadOfAdmissions with ID ${id} deleted`);
  }
}

export default new HeadOfAdmissionsService();
