// src/repositories/ProgramSpecificRequirementRepository.ts

import ProgramSpecificRequirement, { ProgramSpecificRequirementCreationAttributes } from '../models/ProgramSpecificRequirement'
import Program from '../models/Program'
import BaseRepository from './BaseRepository'



class ProgramSpecificRequirementRepository extends BaseRepository<ProgramSpecificRequirement> {
  constructor() {
    super(ProgramSpecificRequirement)
  }

  async createRequirement(data: ProgramSpecificRequirementCreationAttributes): Promise<ProgramSpecificRequirement> {
    return await this.create(data)
  }

  async findRequirementById(id: number): Promise<ProgramSpecificRequirement | null> {
    const include = [{ model: Program, as: 'program' }]
    return await this.findById(id, { include })
  }

  async findAllRequirements(): Promise<ProgramSpecificRequirement[]> {
    const include = [{ model: Program, as: 'program' }]
    const result = await this.findAll({ include })
    return result.data
  }

  async updateRequirement(id: number, updates: Partial<ProgramSpecificRequirement>): Promise<ProgramSpecificRequirement | null> {
    return await this.updateById(id, updates)
  }

  async deleteRequirement(id: number): Promise<boolean> {
    return await this.deleteById(id)
  }

  async requirementExists(id: number): Promise<boolean> {
    return await this.existsById(id)
  }

  // Related model operations
  async findProgramById(programId: number): Promise<ProgramSpecificRequirement | null> {
    return await this.findOne({programId})
  }

  async programExists(programId: number): Promise<boolean> {
    const program = await this.findProgramById(programId)
    return !!program
  }
}

export default new ProgramSpecificRequirementRepository()