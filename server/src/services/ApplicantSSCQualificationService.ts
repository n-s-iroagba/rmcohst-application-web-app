import ApplicantSSCQualification from '../models/ApplicantSSCQualification';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';


class ApplicantSSCQualificationService {
  // CREATE
  static async createSSCQualification(data: {
    applicationId: number;
  }) {
    try {
      const qualification = await ApplicantSSCQualification.create(data);
      logger.info('Created SSC qualification', { id: qualification.id });
      return qualification;
    } catch (error) {
      logger.error('Failed to create SSC qualification', { error });
      throw new AppError('Could not create SSC qualification', 500);
    }
  }

  // READ ONE BY APPLICATION
  static async getSSCQualificationByApplication(applicationId: number) {
    try {
      const qualification = await ApplicantSSCQualification.findOne({
        where: { applicationId },
      });

      if (!qualification) {
        throw new AppError('SSC qualification not found for application', 404);
      }

      logger.info('Fetched SSC qualification for application', { applicationId });
      return qualification;
    } catch (error) {
      logger.error('Failed to fetch SSC qualification', { error, applicationId });
      throw error instanceof AppError ? error : new AppError('Error retrieving SSC qualification', 500);
    }
  }

  // UPDATE
  static async updateSSCQualification(
    id: number,
    updates: Partial<{
      numberOfSittings?: number | null;
      certificateTypes?: string[];
      minimumGrade?: string;
    }>
  ) {
    try {
      const qualification = await ApplicantSSCQualification.findByPk(id);
      if (!qualification) {
        throw new AppError('SSC qualification not found', 404);
      }

      await qualification.update(updates);
      logger.info('Updated SSC qualification', { id });
      return qualification;
    } catch (error) {
      logger.error(`Failed to update SSC qualification with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Error updating SSC qualification', 500);
    }
  }
}

export default ApplicantSSCQualificationService;
