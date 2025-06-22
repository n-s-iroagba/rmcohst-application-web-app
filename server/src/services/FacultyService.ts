// services/faculty.service.ts

import { Faculty, FacultyCreationAttributes } from '../models/Faculty'
import { Department } from '../models/Department'
import { AppError } from '../utils/error/AppError'
import logger from '../utils/logger/logger'

class FacultyService {
  /**
   * Create a new faculty
   */
  public async createFaculty(data: FacultyCreationAttributes[]): Promise<Faculty[]> {
    try {
      const faculties = await Faculty.bulkCreate(data)
      logger.info(`Faculties created`)
      return faculties
    } catch (error: any) {
      logger.error(`Failed to create faculty: ${error.message}`)
      throw new AppError('Failed to create faculty', 500)
    }
  }

  /**
   * Get a faculty by ID, including associated departments
   */
  public async getFacultyById(id: number): Promise<Faculty> {
    try {
      const faculty = await Faculty.findByPk(id)
      if (!faculty) {
        throw new AppError(`Faculty with id ${id} not found`, 404)
      }
      // Use association mixin to get departments
      const departments = await faculty.getDepartments()
      // Attach departments as a property if needed
      ;(faculty as any).departments = departments
      logger.info(`Faculty retrieved with id: ${id}`)
      return faculty
    } catch (error: any) {
      logger.error(`Failed to get faculty: ${error.message}`)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to get faculty', 500)
    }
  }

  /**
   * Update a faculty by ID
   */
  public async updateFaculty(id: number, name: string): Promise<Faculty> {
    try {
      const faculty = await Faculty.findByPk(id)
      if (!faculty) {
        throw new AppError(`Faculty with id ${id} not found`, 404)
      }
      faculty.name = name
      await faculty.save()
      logger.info(`Faculty updated with id: ${id}`)
      return faculty
    } catch (error: any) {
      logger.error(`Failed to update faculty: ${error.message}`)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to update faculty', 500)
    }
  }

  /**
   * Delete a faculty by ID
   */
  public async deleteFaculty(id: number): Promise<void> {
    try {
      const faculty = await Faculty.findByPk(id)
      if (!faculty) {
        throw new AppError(`Faculty with id ${id} not found`, 404)
      }
      await faculty.destroy()
      logger.info(`Faculty deleted with id: ${id}`)
    } catch (error: any) {
      logger.error(`Failed to delete faculty: ${error.message}`)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to delete faculty', 500)
    }
  }

  /**
   * Add a department to a faculty
   */
  public async addDepartmentToFaculty(facultyId: number, departmentId: number): Promise<void> {
    try {
      const faculty = await Faculty.findByPk(facultyId)
      if (!faculty) throw new AppError(`Faculty with id ${facultyId} not found`, 404)

      const department = await Department.findByPk(departmentId)
      if (!department) throw new AppError(`Department with id ${departmentId} not found`, 404)

      await faculty.addDepartment(department)
      logger.info(`Department ${departmentId} added to Faculty ${facultyId}`)
    } catch (error: any) {
      logger.error(`Failed to add department to faculty: ${error.message}`)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to add department to faculty', 500)
    }
  }

  /**
   * Get all departments of a faculty
   */
  public async getDepartmentsOfFaculty(facultyId: number): Promise<Department[]> {
    try {
      const faculty = await Faculty.findByPk(facultyId)
      if (!faculty) throw new AppError(`Faculty with id ${facultyId} not found`, 404)
      const departments = await faculty.getDepartments()
      logger.info(`Departments retrieved for Faculty ${facultyId}`)
      return departments
    } catch (error: any) {
      logger.error(`Failed to get departments of faculty: ${error.message}`)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to get departments of faculty', 500)
    }
  }
}

export default new FacultyService()
