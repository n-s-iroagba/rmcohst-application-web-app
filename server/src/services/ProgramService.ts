// src/services/ProgramService.ts
import Program from '../models/Program'
import { Department, ProgramSpecificRequirement, ProgramSSCRequirement } from '../models'
import Faculty from '../models/Faculty';
import { NotFoundError } from '../utils/errors';
export interface FullProgram extends Program {
   sscRequirement: ProgramSSCRequirement
  specificRequirements: ProgramSpecificRequirement
  department:DepartmentWithFaculty
}
interface DepartmentWithFaculty extends Department {
  faculty: Faculty
}
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
static async getOne(id: string):Promise<FullProgram> {
  try{
  const program = await Program.findByPk(id, {
    include: [
      {
        model: Department,
        as: 'department',
        include:[{
          model: Faculty,
          as:'faculty'
        }
      ]
      },
      {
        model: ProgramSSCRequirement,
        as:'sscRequirements'
      },
       {
        model: ProgramSpecificRequirement,
        as:'specificRequirements'

      }
    ]
  })as FullProgram

  if(!program) throw new NotFoundError('program not found')
    return program
}catch(error){
  throw error
}
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