// src/repositories/DepartmentRepository.ts

import { Department } from '../models/Department'
import BaseRepository from './BaseRepository'

interface DepartmentCreationData {
  name: string
  facultyId: number
  code: string
}

class DepartmentRepository extends BaseRepository<Department> {
  constructor() {
    super(Department)
  }

  async createDepartments(data: DepartmentCreationData[]): Promise<Department[]> {
    return await this.bulkCreate(data)
  }

  async findAllDepartments(): Promise<Department[]> {
    const include = [{ association: 'faculty' }]
    const result = await this.findAll({ include })
    return result.data
  }

  async findDepartmentById(id: number): Promise<Department | null> {
    const include = [{ association: 'faculty' }]
    return await this.findById(id, { include })
  }

  async updateDepartment(id: number, updates: Partial<Department>): Promise<Department | null> {
    return await this.updateById(id, updates)
  }

  async departmentExists(id: number): Promise<boolean> {
    return await this.existsById(id)
  }
}

export default new DepartmentRepository()