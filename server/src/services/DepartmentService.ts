import { Department } from '../models/Department'
import { NotFoundError } from '../utils/errors'
import logger from '../utils/logger'

class DepartmentService {
  // CREATE
  static async createDepartment(
    data: {
      name: string
      facultyId: number
      code: string
    }[]
  ) {
    try {
      const department = await Department.bulkCreate(data)
      logger.info('Created departments')
      return department
    } catch (error) {
      logger.error('Failed to create department', { error })
      throw error
    }
  }

  // READ ALL
  static async getAllDepartments() {
    try {
      const departments = await Department.findAll({
        include: [{ association: 'faculty' }],
      })
      logger.info('Fetched all departments')
      return departments
    } catch (error) {
      logger.error('Failed to fetch departments', { error })
      throw error
    }
  }

  // READ ONE
  static async getDepartmentById(id: number) {
    try {
      const department = await Department.findByPk(id, {
        include: [{ association: 'faculty' }],
      })
      if (!department) {
        throw new NotFoundError('Department not found')
      }
      logger.info('Fetched department', { id })
      return department
    } catch (error) {
      logger.error(`Failed to fetch department ${id}`, { error })
      throw error
    }
  }

  // UPDATE
  static async updateDepartment(
    id: number,
    updates: Partial<{
      name: string
      facultyId: number
    }>
  ) {
    try {
      const department = await Department.findByPk(id)
      if (!department) {
        throw new NotFoundError('Department not found')
      }
      await department.update(updates)
      logger.info('Updated department', { id })
      return department
    } catch (error) {
      logger.error(`Failed to update department ${id}`, { error })
      throw error
    }
  }
}

export default DepartmentService
