import Student from '../models/Student'
import { AppError } from '../utils/error/AppError'
import logger from '../utils/logger/logger'
// your Winston logger instance

class StudentService {
  public static async create(data: {
    studentId: string
    userId: number
    applicationId: number
    department: string
    status: 'active'
  }): Promise<Student> {
    logger.info('Creating student with data:', data)
    try {
      const student = await Student.create(data)
      logger.info(`Student created with ID: ${student.id}`)
      return student
    } catch (error) {
      logger.error('Error creating student', error)
      throw new AppError('Failed to create student', 500)
    }
  }

  public static async getById(id: number): Promise<Student> {
    logger.info(`Fetching student with ID: ${id}`)
    const student = await Student.findByPk(id)
    if (!student) {
      logger.error(`Student with ID ${id} not found`)
      throw new AppError('Student not found', 404)
    }
    logger.info(`Student found: ${JSON.stringify(student)}`)
    return student
  }

  public static async getAll(): Promise<Student[]> {
    logger.info('Fetching all students')
    const students = await Student.findAll()
    logger.info(`Found ${students.length} students`)
    return students
  }

  public static async update(
    id: number,
    updates: Partial<{
      studentId: string
      userId: number
      applicationId: number
      department: string
      status: 'active' | 'inactive' | 'graduated'
    }>
  ): Promise<Student> {
    logger.info(`Updating student with ID: ${id}, updates: ${JSON.stringify(updates)}`)
    const student = await Student.findByPk(id)
    if (!student) {
      logger.error(`Student with ID ${id} not found for update`)
      throw new AppError('Student not found', 404)
    }
    try {
      await student.update(updates)
      logger.info(`Student with ID ${id} updated`)
      return student
    } catch (error) {
      logger.error(`Error updating student with ID ${id}`, error)
      throw new AppError('Failed to update student', 500)
    }
  }

  public static async softDelete(id: number): Promise<void> {
    logger.info(`Soft deleting student with ID: ${id}`)
    const student = await Student.findByPk(id)
    if (!student) {
      logger.error(`Student with ID ${id} not found for delete`)
      throw new AppError('Student not found', 404)
    }
    try {
      await student.destroy()
      logger.info(`Student with ID ${id} soft deleted`)
    } catch (error) {
      logger.error(`Error soft deleting student with ID ${id}`, error)
      throw new AppError('Failed to delete student', 500)
    }
  }

  public static async restore(id: number): Promise<void> {
    logger.info(`Restoring student with ID: ${id}`)
    const student = await Student.findOne({ where: { id }, paranoid: false })
    if (!student) {
      logger.error(`Student with ID ${id} not found for restore`)
      throw new AppError('Student not found', 404)
    }
    try {
      await student.restore()
      logger.info(`Student with ID ${id} restored`)
    } catch (error) {
      logger.error(`Error restoring student with ID ${id}`, error)
      throw new AppError('Failed to restore student', 500)
    }
  }
}

export default StudentService
