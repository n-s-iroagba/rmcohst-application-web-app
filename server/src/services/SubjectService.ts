import Subject from '../models/Subject'
import { NotFoundError } from '../utils/errors'
import logger from '../utils/logger'

class SubjectService {
  /**
   * Bulk create new Subjects
   */
  public static async bulkCreate(data: Array<{ name: string; code: string; description?: string }>): Promise<Subject[]> {
    try {
      const subjects = await Subject.bulkCreate(data)
      logger.info(`Bulk created ${subjects.length} subjects`)
      return subjects
    } catch (error: any) {
      logger.error(`Failed to bulk create subjects: ${error.message}`)
      throw error
    }
  }

  /**
   * Get Subject by ID
   */
  public static async getById(id: number): Promise<Subject> {
    const subject = await Subject.findByPk(id)
    if (!subject) {
      throw new NotFoundError(`Subject with ID ${id} not found`)
    }
    return subject
  }

  /**
   * Get all Subjects
   */
  public static async getAll(): Promise<Subject[]> {
    return Subject.findAll()
  }

  /**
   * Update Subject by ID
   */
  public static async update(id: number, updates: Partial<{ name: string; code: string; description?: string }>): Promise<Subject> {
    const subject = await Subject.findByPk(id)
    if (!subject) {
      throw new NotFoundError(`Subject with ID ${id} not found`)
    }

    await subject.update(updates)
    logger.info(`Subject with ID ${id} updated`)
    return subject
  }

  /**
   * Delete Subject by ID
   */
  public static async delete(id: number): Promise<void> {
    const subject = await Subject.findByPk(id)
    if (!subject) {
      throw new NotFoundError(`Subject with ID ${id} not found`)
    }

    await subject.destroy()
    logger.info(`Subject with ID ${id} deleted`)
  }
}

export default SubjectService
