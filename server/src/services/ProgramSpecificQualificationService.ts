
import ProgramSpecificQualification from '../models/ProgramSpecificQualification';
import Program from '../models/Program';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';


class ProgramSpecificQualificationService {
  /**
   * Create a new ProgramSpecificQualification
   */
  public async create(data: {
    programId: number;
    qualificationType: string;
    minimumGradeId: number;
    
  }): Promise<ProgramSpecificQualification> {
    const program = await Program.findByPk(data.programId);
    if (!program) {
      throw new AppError(`Program with ID ${data.programId} not found`, 404);
    }

    try {
      const qualification = await ProgramSpecificQualification.create(data);
      logger.info(`ProgramSpecificQualification created with ID ${qualification.id}`);
      return qualification;
    } catch (error: any) {
      logger.error(`Failed to create ProgramSpecificQualification: ${error.message}`);
      throw new AppError('Failed to create ProgramSpecificQualification', 500);
    }
  }

  /**
   * Get a single ProgramSpecificQualification by ID
   */
  public async getById(id: number): Promise<ProgramSpecificQualification> {
    const qualification = await ProgramSpecificQualification.findByPk(id, {
      include: [{ model: Program, as: 'program' }],
    });
    if (!qualification) {
      throw new AppError(`ProgramSpecificQualification with ID ${id} not found`, 404);
    }
    return qualification;
  }

  /**
   * Get all ProgramSpecificQualifications
   */
  public async getAll(): Promise<ProgramSpecificQualification[]> {
    return ProgramSpecificQualification.findAll({ include: [{ model: Program, as: 'program' }] });
  }

  /**
   * Update a ProgramSpecificQualification by ID
   */
  public async update(
    id: number,
    updates: Partial<{
      programId: number;
      qualificationType: string;
      minimumGrade: string;
    }>
  ): Promise<ProgramSpecificQualification> {
    const qualification = await ProgramSpecificQualification.findByPk(id);
    if (!qualification) {
      throw new AppError(`ProgramSpecificQualification with ID ${id} not found`, 404);
    }

    if (updates.programId) {
      const program = await Program.findByPk(updates.programId);
      if (!program) {
        throw new AppError(`Program with ID ${updates.programId} not found`, 404);
      }
    }

    await qualification.update(updates);
    logger.info(`ProgramSpecificQualification with ID ${id} updated`);
    return qualification;
  }

  /**
   * Delete a ProgramSpecificQualification by ID
   */
  public async delete(id: number): Promise<void> {
    const qualification = await ProgramSpecificQualification.findByPk(id);
    if (!qualification) {
      throw new AppError(`ProgramSpecificQualification with ID ${id} not found`, 404);
    }

    await qualification.destroy();
    logger.info(`ProgramSpecificQualification with ID ${id} deleted`);
  }
}

export default new ProgramSpecificQualificationService();
