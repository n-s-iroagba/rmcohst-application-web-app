import ApplicantSSCSubject from '../models/ApplicantSSCSubject';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';


class ApplicantSSCSubjectService {
  // CREATE
  static async createSubject(data: {
    name: string;
    grade: string;
    applicantSSCQualificationId: number;
  }) {
    try {
      const subject = await ApplicantSSCSubject.create(data);
      logger.info('Created SSC subject', { id: subject.id });
      return subject;
    } catch (error) {
      logger.error('Failed to create SSC subject', { error });
      throw new AppError('Could not create SSC subject', 500);
    }
  }

  // READ ALL by Qualification
  static async getSubjectsByQualification(applicantSSCQualificationId: number) {
    try {
      const subjects = await ApplicantSSCSubject.findAll({
        where: { applicantSSCQualificationId },
      });
      logger.info('Fetched SSC subjects for qualification', { applicantSSCQualificationId });
      return subjects;
    } catch (error) {
      logger.error('Failed to fetch SSC subjects', { error, applicantSSCQualificationId });
      throw new AppError('Could not retrieve SSC subjects', 500);
    }
  }

  // UPDATE
  static async updateSubject(
    id: number,
    updates: Partial<{
      name: string;
      grade: string;
    }>
  ) {
    try {
      const subject = await ApplicantSSCSubject.findByPk(id);
      if (!subject) {
        throw new AppError('SSC subject not found', 404);
      }

      await subject.update(updates);
      logger.info('Updated SSC subject', { id });
      return subject;
    } catch (error) {
      logger.error(`Failed to update SSC subject with id ${id}`, { error });
      throw error instanceof AppError ? error : new AppError('Error updating SSC subject', 500);
    }
  }
}

export default ApplicantSSCSubjectService;
