import ApplicationProgramSpecificQualification from "../models/ApplicantProgramSpecificQualification";
import { AppError } from "../utils/error/AppError";
import logger from "../utils/logger/logger";


class ApplicationProgramSpecificQualificationService {
  // CREATE
  static async createQualification(data: {
    applicationId: number;
  }) {
    try {
      const qualification = await ApplicationProgramSpecificQualification.create(data);
      logger.info('Created application program specific qualification', { id: qualification.id });
      return qualification;
    } catch (error) {
      logger.error('Failed to create specific qualification', { error });
      throw new AppError('Could not create qualification', 500);
    }
  }

  // READ ALL BY APPLICATION
  static async getQualificationsByApplication(applicationId: number) {
    try {
      const qualifications = await ApplicationProgramSpecificQualification.findAll({
        where: { applicationId },
      });
      logger.info('Fetched qualifications for application', { applicationId });
      return qualifications;
    } catch (error) {
      logger.error('Failed to fetch qualifications', { applicationId, error });
      throw new AppError('Could not retrieve qualifications', 500);
    }
  }

  // UPDATE
  static async updateQualification(
    id: number,
    updates: Partial<{
      qualificationType: string;
      grade: string;
    }>
  ) {
    try {
      const qualification = await ApplicationProgramSpecificQualification.findByPk(id);
      if (!qualification) {
        throw new AppError('Qualification not found', 404);
      }
      await qualification.update(updates);
      logger.info('Updated qualification', { id });
      return qualification;
    } catch (error) {
      logger.error(`Failed to update qualification with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Error updating qualification', 500);
    }
  }
}

export default ApplicationProgramSpecificQualificationService;
