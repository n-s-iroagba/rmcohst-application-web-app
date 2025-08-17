// // src/services/ProgramSpecificRequirementService.ts


// import { ProgramSpecificRequirement } from '../models'
// import ProgramSpecificRequirementsRepository from '../repositories/ProgramSpecificRequirementsRepository'

// class ProgramSpecificRequirementService {
//   /**
//    * Create a new ProgramSpecificRequirement
//    */
//   public async create(data: {
//     programId: number
//     qualificationType: string
//     minimumGradeId: number
//   }): Promise<ProgramSpecificRequirement> {
//     try {
//       // Validate program exists
//       const programExists = await ProgramSpecificRequirementsRepository.programExists(data.programId)
//       if (!programExists) {
//         throw new AppError(`Program with ID ${data.programId} not found`, 404)
//       }

//       const qualification = await ProgramSpecificRequirementsRepository.createRequirement(data)
//       logger.info(`ProgramSpecificRequirement created with ID ${qualification.id}`)
//       return qualification
//     } catch (error: any) {
//       if (error instanceof AppError) {
//         throw error
//       }
//       logger.error(`Failed to create ProgramSpecificRequirement: ${error.message}`)
//       throw new AppError('Failed to create ProgramSpecificRequirement', 500)
//     }
//   }

//   /**
//    * Get a single ProgramSpecificRequirement by ID
//    */
//   public async getById(id: number): Promise<ProgramSpecificRequirement> {
//     try {
//       const qualification = await ProgramSpecificRequirementsRepository.findRequirementById(id)
//       if (!qualification) {
//         throw new AppError(`ProgramSpecificRequirement with ID ${id} not found`, 404)
//       }
//       return qualification
//     } catch (error: any) {
//       if (error instanceof AppError) {
//         throw error
//       }
//       logger.error(`Failed to get ProgramSpecificRequirement by ID ${id}: ${error.message}`)
//       throw new AppError('Failed to get ProgramSpecificRequirement', 500)
//     }
//   }

//   /**
//    * Get all ProgramSpecificRequirements
//    */
//   public async getAll(): Promise<ProgramSpecificRequirement[]> {
//     try {
//       return await ProgramSpecificRequirementsRepository.findAllRequirements()
//     } catch (error: any) {
//       logger.error(`Failed to get all ProgramSpecificRequirements: ${error.message}`)
//       throw new AppError('Failed to get ProgramSpecificRequirements', 500)
//     }
//   }

//   /**
//    * Update a ProgramSpecificRequirement by ID
//    */
//   public async update(
//     id: number,
//     updates: Partial<{
//       programId: number
//       qualificationType: string
//       minimumGrade: string
//     }>
//   ): Promise<ProgramSpecificRequirement> {
//     try {
//       // Check if requirement exists
//       const requirementExists = await ProgramSpecificRequirementsRepository.requirementExists(id)
//       if (!requirementExists) {
//         throw new AppError(`ProgramSpecificRequirement with ID ${id} not found`, 404)
//       }

//       // Validate program exists if programId is being updated
//       if (updates.programId) {
//         const programExists = await ProgramSpecificRequirementsRepository.programExists(updates.programId)
//         if (!programExists) {
//           throw new AppError(`Program with ID ${updates.programId} not found`, 404)
//         }
//       }

//       const qualification = await ProgramSpecificRequirementRepository.updateRequirement(id, updates)
//       if (!qualification) {
//         throw new AppError(`Failed to update ProgramSpecificRequirement with ID ${id}`, 500)
//       }

//       logger.info(`ProgramSpecificRequirement with ID ${id} updated`)
//       return qualification
//     } catch (error: any) {
//       if (error instanceof AppError) {
//         throw error
//       }
//       logger.error(`Failed to update ProgramSpecificRequirement with ID ${id}: ${error.message}`)
//       throw new AppError('Failed to update ProgramSpecificRequirement', 500)
//     }
//   }

//   /**
//    * Delete a ProgramSpecificRequirement by ID
//    */
//   public async delete(id: number): Promise<void> {
//     try {
//       const requirementExists = await ProgramSpecificRequirementRepository.requirementExists(id)
//       if (!requirementExists) {
//         throw new AppError(`ProgramSpecificRequirement with ID ${id} not found`, 404)
//       }

//       const deleted = await ProgramSpecificRequirementRepository.deleteRequirement(id)
//       if (!deleted) {
//         throw new AppError(`Failed to delete ProgramSpecificRequirement with ID ${id}`, 500)
//       }

//       logger.info(`ProgramSpecificRequirement with ID ${id} deleted`)
//     } catch (error: any) {
//       if (error instanceof AppError) {
//         throw error
//       }
//       logger.error(`Failed to delete ProgramSpecificRequirement with ID ${id}: ${error.message}`)
//       throw new AppError('Failed to delete ProgramSpecificRequirement', 500)
//     }
//   }
// }

// export default new ProgramSpecificRequirementService()