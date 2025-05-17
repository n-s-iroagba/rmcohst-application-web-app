import ProgramSSCQualification from '../models/ProgramSSCQualification';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';

class ProgramSSCQualificationService {
  /**
   * Create a new SSC Qualification
   */
  public static async create(data: {
    programId: number;
    acceptedCertificateTypes: string[];
    maximumNumberOfSittings: number | null;
    minimumGrade: string;
  }): Promise<ProgramSSCQualification> {
    try {
      const qualification = await ProgramSSCQualification.create(data);
      logger.info(`SSC Qualification created with ID ${qualification.id}`);
      return qualification;
    } catch (error: any) {
      logger.error(`Failed to create SSC Qualification: ${error.message}`);
      throw new AppError('Failed to create SSC Qualification', 500);
    }
  }

  /**
   * Get SSC Qualification by ID
   */
  public static async getById(id: number): Promise<ProgramSSCQualification> {
    const qualification = await ProgramSSCQualification.findByPk(id);
    if (!qualification) {
      throw new AppError(`SSC Qualification with ID ${id} not found`, 404);
    }
    return qualification;
  }

  /**
   * Get all SSC Qualifications
   */
  public static async getAll(): Promise<ProgramSSCQualification[]> {
    return ProgramSSCQualification.findAll();
  }

  /**
   * Update SSC Qualification by ID
   */
  public static async update(
    id: number,
    updates: Partial<{
      acceptedCertificateTypes: string[];
      maximumNumberOfSittings: number | null;
      minimumGrade: string;
    }>
  ): Promise<ProgramSSCQualification> {
    const qualification = await ProgramSSCQualification.findByPk(id);
    if (!qualification) {
      throw new AppError(`SSC Qualification with ID ${id} not found`, 404);
    }

    await qualification.update(updates);
    logger.info(`SSC Qualification with ID ${id} updated`);
    return qualification;
  }

  /**
   * Delete SSC Qualification by ID
   */
  public static async delete(id: number): Promise<void> {
    const qualification = await ProgramSSCQualification.findByPk(id);
    if (!qualification) {
      throw new AppError(`SSC Qualification with ID ${id} not found`, 404);
    }

    await qualification.destroy();
    logger.info(`SSC Qualification with ID ${id} deleted`);
  }
}

export default ProgramSSCQualificationService;
