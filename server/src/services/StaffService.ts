// import { Staff, StaffRole } from '../models/Staff'
// import { AppError } from '../utils/error/AppError'
// import logger from '../utils/logger/logger'

// class StaffService {
//   /**
//    * Create a new Staff member
//    */
//   public static async create(data: {
//     firstName: string
//     lastName: string
//     email: string
//     phoneNumber: string
//     officeAddress?: string
//     role: StaffRole
//     userId: number
//   }): Promise<Staff> {
//     try {
//       const staff = await Staff.create(data)
//       logger.info(`Staff created with ID ${staff.id}`)
//       return staff
//     } catch (error: any) {
//       logger.error(`Failed to create Staff: ${error.message}`)
//       throw new AppError('Failed to create Staff', 500)
//     }
//   }

//   /**
//    * Get Staff by ID
//    */
//   public static async getById(id: number): Promise<Staff> {
//     const staff = await Staff.findByPk(id, { include: ['user'] })
//     if (!staff) {
//       throw new AppError(`Staff with ID ${id} not found`, 404)
//     }
//     return staff
//   }

//   /**
//    * Get all Staff members
//    */
//   public static async getAll(): Promise<Staff[]> {
//     return Staff.findAll({ include: ['user'] })
//   }

//   /**
//    * Update Staff by ID
//    */
//   public static async update(
//     id: number,
//     updates: Partial<{
//       firstName: string
//       lastName: string
//       email: string
//       phoneNumber: string
//       officeAddress?: string
//       userId: number
//     }>
//   ): Promise<Staff> {
//     const staff = await Staff.findByPk(id)
//     if (!staff) {
//       throw new AppError(`Staff with ID ${id} not found`, 404)
//     }

//     await staff.update(updates)
//     logger.info(`Staff with ID ${id} updated`)
//     return staff
//   }

//   /**
//    * Delete Staff by ID
//    */
//   public static async delete(id: number): Promise<void> {
//     const staff = await Staff.findByPk(id)
//     if (!staff) {
//       throw new AppError(`Staff with ID ${id} not found`, 404)
//     }

//     await staff.destroy()
//     logger.info(`Staff with ID ${id} deleted`)
//   }
// }

// export default StaffService
