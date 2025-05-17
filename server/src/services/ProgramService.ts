import { Op } from 'sequelize';
import Program from '../models/Program';
import { AppError } from '../utils/error/AppError';
import logger from '../utils/logger/logger';


class ProgramService {
  /**
   * Create a new Program
   */
  public static async create(data: {
    department: string;
    certificationType: string;
    durationType: 'WEEK' | 'MONTH' | 'YEAR';
    duration: number;
    applicationFeeInNaira: number;
    acceptanceFeeInNaira: number;
  }): Promise<Program> {
    try {
      const program = await Program.create(data);
      logger.info(`Program created with ID ${program.id}`);
      return program;
    } catch (error: any) {
      logger.error(`Failed to create Program: ${error.message}`);
      throw new AppError('Failed to create Program', 500);
    }
  }

  /**
   * Get a single Program by ID
   */
  public static async getById(id: number): Promise<Program> {
    const program = await Program.findByPk(id);
    if (!program) {
      throw new AppError(`Program with ID ${id} not found`, 404);
    }
    return program;
  }

  /**
   * Get all Programs
   */
  public static async getAll(): Promise<Program[]> {
    return Program.findAll();
  }

  /**
   * Update a Program by ID
   */
  public static async update(id: number, updates: Partial<{
    department: string;
    certificationType: string;
    durationType: 'WEEK' | 'MONTH' | 'YEAR';
    duration: number;
    applicationFeeInNaira: number;
    acceptanceFeeInNaira: number;
  }>): Promise<Program> {
    const program = await Program.findByPk(id);
    if (!program) {
      throw new AppError(`Program with ID ${id} not found`, 404);
    }

    await program.update(updates);
    logger.info(`Program with ID ${id} updated`);
    return program;
  }

  /**
   * Delete a Program by ID
   */
  public static async delete(id: number): Promise<void> {
    const program = await Program.findByPk(id);
    if (!program) {
      throw new AppError(`Program with ID ${id} not found`, 404);
    }

    await program.destroy();
    logger.info(`Program with ID ${id} deleted`);
  }
}

export default ProgramService;
