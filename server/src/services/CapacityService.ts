// services/CapacityService.ts
import { Op } from 'sequelize'
import Program from '../models/Program'
import { AppError } from '../utils/error/AppError'

interface DepartmentCapacity {
  department: string
  totalCapacity: number
  currentApplications: number
  remainingSlots: number
  programs: {
    id: number
    certificationType: string
    capacity: number
    currentApplications: number
  }[]
}

interface ProgramCapacity {
  programId: number
  certificationType: string
  capacity: number
  currentApplications: number
  remainingSlots: number
}

export class CapacityService {
  async getDepartmentCapacities(): Promise<DepartmentCapacity[]> {
    try {
      // Get all unique departments
      const departments = await Program.findAll({
        attributes: ['department'],
        group: ['department'],
        raw: true
      })

      const capacities: DepartmentCapacity[] = []

      for (const dept of departments) {
        const departmentCapacity = await this.calculateDepartmentCapacity(dept.department)
        capacities.push(departmentCapacity)
      }

      return capacities
    } catch (error) {
      throw new AppError('Failed to retrieve department capacities', 500)
    }
  }

  async updateDepartmentCapacity(departmentId: string, totalCapacity: number): Promise<DepartmentCapacity> {
    try {
      // Check if department exists
      const departmentExists = await Program.findOne({
        where: { department: departmentId }
      })

      if (!departmentExists) {
        throw new AppError('Department not found', 404)
      }

      // For now, we'll store this in a separate table or cache
      // You might want to create a DepartmentCapacity model for persistence
      // This is a simplified implementation
      
      // Update capacity logic here (you might need a separate model for this)
      // For demonstration, returning calculated capacity
      const updatedCapacity = await this.calculateDepartmentCapacity(departmentId)
      updatedCapacity.totalCapacity = totalCapacity

      return updatedCapacity
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to update department capacity', 500)
    }
  }

  async getProgramCapacities(departmentId: string): Promise<ProgramCapacity[]> {
    try {
      const programs = await Program.findAll({
        where: { department: departmentId }
      })

      if (programs.length === 0) {
        throw new AppError('No programs found for this department', 404)
      }

      const capacities: ProgramCapacity[] = []

      for (const program of programs) {
        const capacity = await this.calculateProgramCapacity(program.id)
        capacities.push(capacity)
      }

      return capacities
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to retrieve program capacities', 500)
    }
  }

  private async calculateDepartmentCapacity(department: string): Promise<DepartmentCapacity> {
    // Get all programs in the department
    const programs = await Program.findAll({
      where: { department }
    })

    const programCapacities = []
    let totalCapacity = 0
    let totalCurrentApplications = 0

    for (const program of programs) {
      const programCapacity = await this.calculateProgramCapacity(program.id)
      
      programCapacities.push({
        id: program.id,
        certificationType: program.certificationType,
        capacity: programCapacity.capacity,
        currentApplications: programCapacity.currentApplications
      })

      totalCapacity += programCapacity.capacity
      totalCurrentApplications += programCapacity.currentApplications
    }

    return {
      department,
      totalCapacity,
      currentApplications: totalCurrentApplications,
      remainingSlots: totalCapacity - totalCurrentApplications,
      programs: programCapacities
    }
  }

  private async calculateProgramCapacity(programId: number): Promise<ProgramCapacity> {
    const program = await Program.findByPk(programId)
    
    if (!program) {
      throw new AppError('Program not found', 404)
    }

    // You'll need to implement this based on your Application model
    // For now, using placeholder values
    const currentApplications = await this.getCurrentApplicationsCount(programId)
    const capacity = await this.getProgramCapacityLimit(programId)

    return {
      programId,
      certificationType: program.certificationType,
      capacity,
      currentApplications,
      remainingSlots: capacity - currentApplications
    }
  }

  private async getCurrentApplicationsCount(programId: number): Promise<number> {
    // TODO: Implement this method when you have an Application model
    // Example:
    // const count = await Application.count({
    //   where: { 
    //     programId,
    //     status: { [Op.in]: ['PENDING', 'APPROVED'] }
    //   }
    // })
    // return count

    // Placeholder implementation
    return Math.floor(Math.random() * 50) // Remove this when implementing
  }

  private async getProgramCapacityLimit(programId: number): Promise<number> {
    // TODO: You might want to store capacity limits in the Program model
    // or create a separate ProgramCapacity model
    // For now, returning a default value based on program type
    
    const program = await Program.findByPk(programId)
    if (!program) return 0

    // Example capacity logic based on certificate type
    switch (program.certificationType.toLowerCase()) {
      case 'certificate':
        return 100
      case 'diploma':
        return 75
      case 'degree':
        return 50
      default:
        return 30
    }
  }

  async checkProgramAvailability(programId: number): Promise<boolean> {
    const capacity = await this.calculateProgramCapacity(programId)
    return capacity.remainingSlots > 0
  }

  async reserveSlot(programId: number): Promise<boolean> {
    // TODO: Implement slot reservation logic
    // This might involve creating a reservation record or updating counters
    const isAvailable = await this.checkProgramAvailability(programId)
    
    if (!isAvailable) {
      throw new AppError('No available slots for this program', 400)
    }

    // Implement reservation logic here
    return true
  }
}