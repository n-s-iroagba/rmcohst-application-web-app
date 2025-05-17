import AdmissionOfficer from '../models/AdmissionOfficer';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';

class AdmissionOfficerService {
  // CREATE
  static async createOfficer(data: {
    staffId: number;
    portalUsername: string;
  }) {
    try {
      const officer = await AdmissionOfficer.create(data);
      logger.info('Admission officer created', { id: officer.id });
      return officer;
    } catch (error) {
      logger.error('Failed to create admission officer', { error });
      throw new AppError('Could not create admission officer', 500);
    }
  }

  // READ ALL
  static async getAllOfficers() {
    try {
      const officers = await AdmissionOfficer.findAll();
      logger.info('Fetched all admission officers');
      return officers;
    } catch (error) {
      logger.error('Failed to fetch admission officers', { error });
      throw new AppError('Could not retrieve officers', 500);
    }
  }

  // READ ONE
  static async getOfficerById(id: number) {
    try {
      const officer = await AdmissionOfficer.findByPk(id);
      if (!officer) {
        throw new AppError('Admission officer not found', 404);
      }
      logger.info('Fetched admission officer', { id });
      return officer;
    } catch (error) {
      logger.error(`Failed to fetch officer with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Error retrieving officer', 500);
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
      logger.info('Updated admission officer', { id });
      return officer;
    } catch (error) {
      logger.error(`Failed to update officer with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Error updating officer', 500);
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
      logger.info('Deleted admission officer', { id });
      return { message: 'Officer deleted successfully' };
    } catch (error) {
      logger.error(`Failed to delete officer with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Error deleting officer', 500);
    }
  }
}

export default AdmissionOfficerService;
