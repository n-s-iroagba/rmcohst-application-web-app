// services/faculty.service.ts

import { Faculty, FacultyCreationAttributes } from '../models/Faculty'
import { Department } from '../models/Department'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'

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
   * Get all faculties with optional pagination and include departments
   */
  public async getAllFaculties(page: number = 1, limit: number = 10, includeDepartments: boolean = false): Promise<{
    faculties: Faculty[]
    totalCount: number
    totalPages: number
    currentPage: number
    hasNext: boolean
    hasPrev: boolean
  }> {
    try {
      const offset = (page - 1) * limit
      
      const includeOptions = includeDepartments ? [{
        model: Department,
        as: 'departments',
        required: false
      }] : []

      const { count, rows } = await Faculty.findAndCountAll({
        include: includeOptions,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      logger.info(`Retrieved ${rows.length} faculties (page ${page})`)
      
      return {
        faculties: rows,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    } catch (error: any) {
      logger.error(`Failed to get all faculties: ${error.message}`)
      throw new AppError('Failed to retrieve faculties', 500)
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


 public async getFacultiesWithDeparments(): Promise<Faculty[]> {
  try {
    const faculties = await Faculty.findAll({
      include: [{
        model: Department,
        as: 'departments',
        attributes: []
      }],
    
      group: ['Faculty.id'],
      order: [['name', 'ASC']]
    });

    logger.info(`Retrieved ${faculties.length} faculties with department counts`);
    return faculties;
  } catch (error: any) {
    logger.error(`Failed to get faculties with department counts: ${error.message}`);
    throw new AppError('Failed to retrieve faculties with department counts', 500);
  }
}
}
export default new FacultyService()