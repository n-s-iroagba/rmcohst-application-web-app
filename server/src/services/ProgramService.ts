// src/services/ProgramService.ts
import Program from '../models/Program'
import { Department } from '../models'

export default class ProgramService {
  static async createBulk(programs: any[]) {
    return await Program.bulkCreate(programs, { validate: true })
  }

  static async getAll(page: number, limit: number) {
    return await Program.findAll({
      where: { isActive: true },
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    })
  }

  static async getByFaculty(facultyId: number) {
    return await Program.findAll({
      include: {
        model: Department,
        where: { facultyId },
      },
    })
  }

  static async getByDepartment(departmentId: number) {
    return await Program.findAll({
      where: { departmentId },
    })
  }

  static async update(id: number, payload: any) {
    const program = await Program.findByPk(id)
    if (!program) throw new Error('Program not found')
    return await program.update(payload)
  }

  static async makeInactive(id: number) {
    const program = await Program.findByPk(id)
    if (!program) throw new Error('Program not found')
    await program.update({ isActive: false })
  }

  static async delete(id: number) {
    await Program.destroy({ where: { id } })
  }
}