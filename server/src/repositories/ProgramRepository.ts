// src/repositories/ProgramRepository.ts

import { Department, Program, ProgramSpecificRequirement, ProgramSSCRequirement } from '../models'
import Faculty from '../models/Faculty'
import { ProgramCreationAttributes } from '../models/Program'
import BaseRepository from './BaseRepository'

class ProgramRepository extends BaseRepository<Program> {
  constructor() {
    super(Program)
  }

  async createProgram(programData: ProgramCreationAttributes): Promise<Program> {
    return await this.create(programData)
  }

  async findByIdWithRelations(id: string): Promise<any> {
    const include = [
      {
        model: Department,
        as: 'department',
        include: [
          {
            model: Faculty,
            as: 'faculty',
          },
        ],
      },
      {
        model: ProgramSSCRequirement,
        as: 'sscRequirements',
      },
      {
        model: ProgramSpecificRequirement,
        as: 'specificRequirements',
      },
    ]

    return await this.findById(id, { include })
  }

  async findByFaculty(facultyId: number) {
    const include = {
      model: Department,
      where: { facultyId },
    }
    return await this.findAll({ include })
  }

  async findByDepartment(departmentId: number) {
    const where = { departmentId }
    return await this.findAll({ where })
  }
}

export default new ProgramRepository()