import SSCSubject from '../models/SSCSubject'
import { NotFoundError } from '../utils/errors'
import logger from '../utils/logger'

class SSCSubjectService {
  /**
   * Create a new SSCSubject
   */
  public static async create(data: { name: string }): Promise<SSCSubject> {
    try {
      const subject = await SSCSubject.create(data)
      logger.info(`SSCSubject created with ID ${subject.id}`)
      return subject
    } catch (error: any) {
      logger.error(`Failed to create SSCSubject: ${error.message}`)
      throw error
    }
  }

  /**
   * Get SSCSubject by ID
   */
  public static async getById(id: number): Promise<SSCSubject> {
    const subject = await SSCSubject.findByPk(id)
    if (!subject) {
      throw new NotFoundError(`SSCSubject with ID ${id} not found`)
    }
    return subject
  }

  /**
   * Get all SSCSubjects
   */
  public static async getAll(): Promise<SSCSubject[]> {
    return SSCSubject.findAll()
  }

  /**
   * Update SSCSubject by ID
   */
  public static async update(id: number, updates: Partial<{ name: string }>): Promise<SSCSubject> {
    const subject = await SSCSubject.findByPk(id)
    if (!subject) {
      throw new NotFoundError(`SSCSubject with ID ${id} not found`)
    }

    await subject.update(updates)
    logger.info(`SSCSubject with ID ${id} updated`)
    return subject
  }

  /**
   * Delete SSCSubject by ID
   */
  public static async delete(id: number): Promise<void> {
    const subject = await SSCSubject.findByPk(id)
    if (!subject) {
      throw new NotFoundError(`SSCSubject with ID ${id} not found`)
    }

    await subject.destroy()
    logger.info(`SSCSubject with ID ${id} deleted`)
  }
}

export default SSCSubjectService
