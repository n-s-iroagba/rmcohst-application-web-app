// services/faculty.service.ts

import { Faculty, FacultyCreationAttributes } from '../models/Faculty'
import { Department } from '../models/Department'
import { AppError, NotFoundError } from '../utils/errors'
import logger from '../utils/logger'

class FacultyService {
  /**
   * Create a new faculty
   */
  public async createFaculty(data: FacultyCreationAttributes[]): Promise<Faculty[]> {
    try {
      console.log(data)
      const faculties = await Faculty.bulkCreate(data)
      logger.info(`Faculties created`)
      return faculties
    } catch (error: any) {
      logger.error(`Failed to create faculty: ${error.message}`)
      throw error
    }
  }

  /**
   * Get all faculties with optional pagination and include departments
   */
  public async getAllFaculties(
    page: number = 1,
    limit: number = 10,
    includeDepartments: boolean = false
  ): Promise<Faculty[]> {
    try {
      const offset = (page - 1) * limit

      return await Faculty.findAll()
    } catch (error: any) {
      logger.error(`Failed to get all faculties: ${error.message}`)
      throw error
    }
  }

  /**
   * Get a faculty by ID, including associated departments
   */
  public async getFacultyById(id: number): Promise<Faculty> {
    try {
      const faculty = await Faculty.findByPk(id)
      if (!faculty) {
        throw new NotFoundError(`Faculty with id ${id} not found`)
      }
      // // Use association mixin to get departments
      // const departments = await faculty.getDepartments()
      // // Attach departments as a property if needed
      // ;(faculty as any).departments = departments
      logger.info(`Faculty retrieved with id: ${id}`)
      return faculty
    } catch (error: any) {
      logger.error(`Failed to get faculty: ${error.message}`)
      if (error instanceof AppError) throw error
      throw error
    }
  }

  /**
   * Update a faculty by ID
   */
  public async updateFaculty(id: number, name: string): Promise<Faculty> {
    try {
      const faculty = await Faculty.findByPk(id)
      if (!faculty) {
        throw new NotFoundError(`Faculty with id ${id} not found`)
      }
      faculty.name = name
      await faculty.save()
      logger.info(`Faculty updated with id: ${id}`)
      return faculty
    } catch (error: any) {
      logger.error(`Failed to update faculty: ${error.message}`)
      if (error instanceof AppError) throw error
      throw error
    }
  }

  /**
   * Delete a faculty by ID
   */
  public async deleteFaculty(id: number): Promise<void> {
    try {
      const faculty = await Faculty.findByPk(id)
      if (!faculty) {
        throw new NotFoundError(`Faculty with id ${id} not found`)
      }
      await faculty.destroy()
      logger.info(`Faculty deleted with id: ${id}`)
    } catch (error: any) {
      logger.error(`Failed to delete faculty: ${error.message}`)
      throw error
    }
  }

  public async getFacultiesWithDeparments(): Promise<Faculty[]> {
    try {
      const faculties = await Faculty.findAll({
        include: [
          {
            model: Department,
            as: 'departments',
            attributes: [],
          },
        ],

        group: ['Faculty.id'],
        order: [['name', 'ASC']],
      })

      logger.info(`Retrieved ${faculties.length} faculties with department counts`)
      return faculties
    } catch (error: any) {
      logger.error(`Failed to get faculties with department counts: ${error.message}`)
      throw error
    }
  }
}
export default new FacultyService()
