import ProgramSpecificRequirement from '../models/ProgramSpecificRequirement'
import Program from '../models/Program'
import { AppError } from '../utils/error/AppError'
import logger from '../utils/logger/logger'

class ProgramSpecificRequirementService {
  /**
   * Create a new ProgramSpecificRequirement
   */
  public async create(data: {
    programId: number
    qualificationType: string
    minimumGradeId: number
  }): Promise<ProgramSpecificRequirement> {
    const program = await Program.findByPk(data.programId)
    if (!program) {
      throw new AppError(`Program with ID ${data.programId} not found`, 404)
    }

    try {
      const qualification = await ProgramSpecificRequirement.create(data)
      logger.info(`ProgramSpecificRequirement created with ID ${qualification.id}`)
      return qualification
    } catch (error: any) {
      logger.error(`Failed to create ProgramSpecificRequirement: ${error.message}`)
      throw new AppError('Failed to create ProgramSpecificRequirement', 500)
    }
  }

  /**
   * Get a single ProgramSpecificRequirement by ID
   */
  public async getById(id: number): Promise<ProgramSpecificRequirement> {
    const qualification = await ProgramSpecificRequirement.findByPk(id, {
      include: [{ model: Program, as: 'program' }],
    })
    if (!qualification) {
      throw new AppError(`ProgramSpecificRequirement with ID ${id} not found`, 404)
    }
    return qualification
  }

  /**
   * Get all ProgramSpecificRequirements
   */
  public async getAll(): Promise<ProgramSpecificRequirement[]> {
    return ProgramSpecificRequirement.findAll({ include: [{ model: Program, as: 'program' }] })
  }

  /**
   * Update a ProgramSpecificRequirement by ID
   */
  public async update(
    id: number,
    updates: Partial<{
      programId: number
      qualificationType: string
      minimumGrade: string
    }>
  ): Promise<ProgramSpecificRequirement> {
    const qualification = await ProgramSpecificRequirement.findByPk(id)
    if (!qualification) {
      throw new AppError(`ProgramSpecificRequirement with ID ${id} not found`, 404)
    }

    if (updates.programId) {
      const program = await Program.findByPk(updates.programId)
      if (!program) {
        throw new AppError(`Program with ID ${updates.programId} not found`, 404)
      }
    }

    await qualification.update(updates)
    logger.info(`ProgramSpecificRequirement with ID ${id} updated`)
    return qualification
  }

  /**
   * Delete a ProgramSpecificRequirement by ID
   */
  public async delete(id: number): Promise<void> {
    const qualification = await ProgramSpecificRequirement.findByPk(id)
    if (!qualification) {
      throw new AppError(`ProgramSpecificRequirement with ID ${id} not found`, 404)
    }

    await qualification.destroy()
    logger.info(`ProgramSpecificRequirement with ID ${id} deleted`)
  }
}

export default new ProgramSpecificRequirementService()
