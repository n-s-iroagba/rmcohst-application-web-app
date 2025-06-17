
import sequelize from '../config/database';
import { Transaction } from 'sequelize';
import AcademicSession from '../models/AcademicSession';
import Program from '../models/Program';

interface CreateSessionData {
  sessionName: string;
  reportingDate: Date;
  isCurrent?: boolean;
}

class ProgramSessionService {
  /**
   * Create a new academic session and add all active programs to it
   */
  static async createSession(sessionData: CreateSessionData): Promise<AcademicSession> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      // Create the new session
      const newSession = await AcademicSession.create(sessionData, { transaction });
      
      // Get all active programs
      const activePrograms = await Program.findAll({
        where: { isActive: true },
        transaction
      });
      
      // Add all active programs to the new session
      if (activePrograms.length > 0) {
        await newSession.addPrograms(activePrograms, { transaction });
      }
      
      await transaction.commit();
      return newSession;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }



  /**
   * Remove a program from a specific session
   */
  static async removeProgramFromSession(programId: number, sessionId: number): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      const program = await Program.findByPk(programId, { transaction });
      const session = await AcademicSession.findByPk(sessionId, { transaction });
      
      if (!program) {
        throw new Error(`Program with ID ${programId} not found`);
      }
      
      if (!session) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }
      
      await session.removeProgram(program, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get all programs for a specific session
   */
  static async getProgramsForSession(sessionId: number): Promise<Program[]> {
    const session = await AcademicSession.findByPk(sessionId, {
      include: [{
        model: Program,
        as: 'programs',
        through: { attributes: [] } // Exclude junction table attributes
      }]
    });
    
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    
    return session.programs || [];
  }

  /**
   * Get all sessions for a specific program
   */
  static async getSessionsForProgram(programId: number): Promise<AcademicSession[]> {
    const program = await Program.findByPk(programId, {
      include: [{
        model: AcademicSession,
        as: 'sessions',
        through: { attributes: [] }
      }]
    });
    
    if (!program) {
      throw new Error(`Program with ID ${programId} not found`);
    }
    
    return program.sessions || [];
  }

  /**
   * Add multiple programs to a session
   */
  static async addProgramsToSession(programs: Program[], sessionId: number): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
  
      
      const session = await AcademicSession.findByPk(sessionId, { transaction });
      
      if (!session) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }
      
      if (programs.length) {
        throw new Error('Some programs were not found');
      }
      
      await session.addPrograms(programs, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Remove multiple programs from a session
   */
  static async removeProgramsFromSession(programIds: number[], sessionId: number): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    
    try {
      const programs = await Program.findAll({
        where: { id: programIds },
        transaction
      });
      
      const session = await AcademicSession.findByPk(sessionId, { transaction });
      
      if (!session) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }
      
      await session.removePrograms(programs, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default ProgramSessionService;