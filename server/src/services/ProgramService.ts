// src/services/ProgramService.ts

import { NotFoundError } from '../utils/errors'
import ProgramRepository from '../repositories/ProgramRepository'
import { FullProgram } from '../types/join-model.types'

export default class ProgramService {
  static async createBulk(programs: any[]) {
    try {
      return await ProgramRepository.bulkCreate(programs, { validate: true })
    } catch (error) {
      throw error
    }
  }

  static async getAll(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit
      return await ProgramRepository.findAll({ offset, limit })
    } catch (error) {
      throw error
    }
  }

  static async getOne(id: string): Promise<FullProgram> {
    try {
      const program = await ProgramRepository.findByIdWithRelations(id)

      if (!program) {
        throw new NotFoundError('Program not found')
      }
      
      return program
    } catch (error) {
      throw error
    }
  }

  static async getByFaculty(facultyId: number) {
    try {
      return await ProgramRepository.findByFaculty(facultyId)
    } catch (error) {
      throw error
    }
  }

  static async getByDepartment(departmentId: number) {
    try {
      return await ProgramRepository.findByDepartment(departmentId)
    } catch (error) {
      throw error
    }
  }

  static async update(id: number, payload: any) {
    try {
      return await ProgramRepository.updateById(id, payload)
    } catch (error) {
      throw error
    }
  }

  static async makeInactive(id: number) {
    try {
      await ProgramRepository.updateById(id, { isActive: false })
    } catch (error) {
      throw error
    }
  }

  static async delete(id: number) {
    try {
      await ProgramRepository.deleteById(id)
    } catch (error) {
      throw error
    }
  }
}