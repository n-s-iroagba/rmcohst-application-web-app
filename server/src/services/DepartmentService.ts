// src/services/DepartmentService.ts

import { NotFoundError } from '../utils/errors'
import logger from '../utils/logger'
import DepartmentRepository from '../repositories/DepartmentRepository'

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
      const departments = await DepartmentRepository.createDepartments(data)
      logger.info('Created departments')
      return departments
    } catch (error) {
      logger.error('Failed to create department', { error })
      throw error
    }
  }

  // READ ALL
  static async getAllDepartments() {
    try {
      const departments = await DepartmentRepository.findAllDepartments()
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
      const department = await DepartmentRepository.findDepartmentById(id)
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
      // Check if department exists
      const departmentExists = await DepartmentRepository.departmentExists(id)
      if (!departmentExists) {
        throw new NotFoundError('Department not found')
      }

      const department = await DepartmentRepository.updateDepartment(id, updates)
      logger.info('Updated department', { id })
      return department
    } catch (error) {
      logger.error(`Failed to update department ${id}`, { error })
      throw error
    }
  }
}

export default DepartmentService