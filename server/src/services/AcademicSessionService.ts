import AdmissionOfficer from '../models/AdmissionOfficer';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';
;

class AdmissionOfficerService {
  // CREATE
  static async createOfficer(data: {
    staffId: number;
    portalUsername: string;
  }) {
    try {
      const officer = await AdmissionOfficer.create(data);
      logger.info('Created admission officer', { id: officer.id });
      return officer;
    } catch (error) {
      logger.error('Error creating admission officer', { error });
      throw new AppError('Failed to create admission officer', 500);
    }
  }

  // READ ALL
  static async getAllOfficers() {
    try {
      return await AdmissionOfficer.findAll();
    } catch (error) {
      logger.error('Error fetching admission officers', { error });
      throw new AppError('Could not retrieve admission officers', 500);
    }
  }

  // READ ONE
  static async getOfficerById(id: number) {
    try {
      const officer = await AdmissionOfficer.findByPk(id);
      if (!officer) {
        throw new AppError('Admission officer not found', 404);
      }
      return officer;
    } catch (error) {
      logger.error(`Error fetching admission officer with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Could not fetch officer', 500);
    }
  }

  // UPDATE
  static async updateOfficer(
    id: number,
    updates: Partial<{ staffId: number; portalUsername: string }>
  ) {
    try {
      const officer = await AdmissionOfficer.findByPk(id);
      if (!officer) {
        throw new AppError('Admission officer not found', 404);
      }
      await officer.update(updates);
      logger.info(`Updated admission officer with id ${id}`);
      return officer;
    } catch (error) {
      logger.error(`Error updating admission officer with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Could not update officer', 500);
    }
  }

  // DELETE
  static async deleteOfficer(id: number) {
    try {
      const officer = await AdmissionOfficer.findByPk(id);
      if (!officer) {
        throw new AppError('Admission officer not found', 404);
      }
      await officer.destroy();
      logger.info(`Deleted admission officer with id ${id}`);
      return { message: 'Officer deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting admission officer with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Could not delete officer', 500);
    }
  }
}

export default AdmissionOfficerService;
