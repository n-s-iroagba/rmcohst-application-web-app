import ProgramSSCSubject from '../models/ProgramSSCSubject';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';


class ProgramSSCSubjectService {
  /**
   * Create a new ProgramSSCSubject
   */
  public static async create(data: {
    sscSubjectId: number;
    minimumGrade: string;
    programSSCQualificationId: string;
  }): Promise<ProgramSSCSubject> {
    try {
      const subject = await ProgramSSCSubject.create(data);
      logger.info(`ProgramSSCSubject created with ID ${subject.id}`);
      return subject;
    } catch (error: any) {
      logger.error(`Failed to create ProgramSSCSubject: ${error.message}`);
      throw new AppError('Failed to create ProgramSSCSubject', 500);
    }
  }

  /**
   * Get a ProgramSSCSubject by ID
   */
  public static async getById(id: number): Promise<ProgramSSCSubject> {
    const subject = await ProgramSSCSubject.findByPk(id);
    if (!subject) {
      throw new AppError(`ProgramSSCSubject with ID ${id} not found`, 404);
    }
    return subject;
  }

  /**
   * Get all ProgramSSCSubjects
   */
  public static async getAll(): Promise<ProgramSSCSubject[]> {
    return ProgramSSCSubject.findAll();
  }

  /**
   * Update a ProgramSSCSubject by ID
   */
  public static async update(
    id: number,
    updates: Partial<{
      sscSubjectId: number;
      minimumGrade: string;
      programSSCQualificationId: string;
    }>
  ): Promise<ProgramSSCSubject> {
    const subject = await ProgramSSCSubject.findByPk(id);
    if (!subject) {
      throw new AppError(`ProgramSSCSubject with ID ${id} not found`, 404);
    }

    await subject.update(updates);
    logger.info(`ProgramSSCSubject with ID ${id} updated`);
    return subject;
  }

  /**
   * Delete a ProgramSSCSubject by ID
   */
  public static async delete(id: number): Promise<void> {
    const subject = await ProgramSSCSubject.findByPk(id);
    if (!subject) {
      throw new AppError(`ProgramSSCSubject with ID ${id} not found`, 404);
    }

    await subject.destroy();
    logger.info(`ProgramSSCSubject with ID ${id} deleted`);
  }
}

export default ProgramSSCSubjectService;
