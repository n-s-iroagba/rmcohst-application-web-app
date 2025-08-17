import Biodata, { BiodataAttributes } from '../models/Biodata'
import { Transaction } from 'sequelize'

export interface CreateBiodataInput {
  applicationId: number
  firstName: string
  middleName?: string | null
  surname: string
  gender: string
  dateOfBirth: Date
  maritalStatus: string
  homeAddress: string
  nationality: string
  stateOfOrigin: string
  lga: string
  homeTown: string
  phoneNumber: string
  emailAddress: string
  passportPhotograph: Buffer
  nextOfKinFullName: string
  nextOfKinPhoneNumber: string
  nextOfKinAddress: string
  relationshipWithNextOfKin: string
}

export interface UpdateBiodataInput {
  firstName?: string
  middleName?: string | null
  surname?: string
  gender?: string
  dateOfBirth?: Date
  maritalStatus?: string
  homeAddress?: string
  nationality?: string
  stateOfOrigin?: string
  lga?: string
  homeTown?: string
  phoneNumber?: string
  emailAddress?: string
  passportPhotograph?: Buffer
  nextOfKinFullName?: string
  nextOfKinPhoneNumber?: string
  nextOfKinAddress?: string
  relationshipWithNextOfKin?: string
}

class BiodataService {
  /**
   * Create new biodata for an application
   * @param biodataData - The biodata information
   * @param transaction - Optional database transaction
   * @returns Promise<Biodata>
   */
  async createBiodata(
    biodataData: CreateBiodataInput,
    transaction?: Transaction
  ): Promise<Biodata> {
    try {
      const biodata = await Biodata.create(biodataData, { transaction })
      return biodata
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create biodata: ${error.message}`)
      }
      throw new Error('Failed to create biodata: Unknown error')
    }
  }

  /**
   * Fetch biodata by application ID
   * @param applicationId - The application ID
   * @returns Promise<Biodata | null>
   */
  async getBiodataByApplicationId(applicationId: number): Promise<Biodata | null> {
    try {
      const biodata = await Biodata.findOne({
        where: { applicationId },
      })
      return biodata
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch biodata: ${error.message}`)
      }
      throw new Error('Failed to fetch biodata: Unknown error')
    }
  }

  /**
   * Fetch biodata by ID
   * @param id - The biodata ID
   * @returns Promise<Biodata | null>
   */
  async getBiodataById(id: number): Promise<Biodata | null> {
    try {
      const biodata = await Biodata.findByPk(id)
      return biodata
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch biodata: ${error.message}`)
      }
      throw new Error('Failed to fetch biodata: Unknown error')
    }
  }

  /**
   * Update biodata by application ID
   * @param applicationId - The application ID
   * @param updateData - The data to update
   * @param transaction - Optional database transaction
   * @returns Promise<Biodata | null>
   */
  async updateBiodataByApplicationId(
    applicationId: number,
    updateData: UpdateBiodataInput,
    transaction?: Transaction
  ): Promise<Biodata | null> {
    try {
      const biodata = await Biodata.findOne({
        where: { applicationId },
      })

      if (!biodata) {
        return null
      }

      await biodata.update(updateData, { transaction })
      await biodata.reload({ transaction })

      return biodata
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update biodata: ${error.message}`)
      }
      throw new Error('Failed to update biodata: Unknown error')
    }
  }

  /**
   * Update biodata by ID
   * @param id - The biodata ID
   * @param updateData - The data to update
   * @param transaction - Optional database transaction
   * @returns Promise<Biodata | null>
   */
  async updateBiodataById(
    id: number,
    updateData: UpdateBiodataInput,
    transaction?: Transaction
  ): Promise<Biodata | null> {
    try {
      const biodata = await Biodata.findByPk(id)

      if (!biodata) {
        return null
      }

      await biodata.update(updateData, { transaction })
      await biodata.reload({ transaction })

      return biodata
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update biodata: ${error.message}`)
      }
      throw new Error('Failed to update biodata: Unknown error')
    }
  }

  /**
   * Check if biodata exists for an application
   * @param applicationId - The application ID
   * @returns Promise<boolean>
   */
  async biodataExists(applicationId: number): Promise<boolean> {
    try {
      const count = await Biodata.count({
        where: { applicationId },
      })
      return count > 0
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check biodata existence: ${error.message}`)
      }
      throw new Error('Failed to check biodata existence: Unknown error')
    }
  }

  /**
   * Get all biodata records (with pagination)
   * @param limit - Number of records to return
   * @param offset - Number of records to skip
   * @returns Promise<{ biodata: Biodata[], total: number }>
   */
  async getAllBiodata(
    limit: number = 10,
    offset: number = 0
  ): Promise<{ biodata: Biodata[]; total: number }> {
    try {
      const { rows, count } = await Biodata.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      return {
        biodata: rows,
        total: count,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch biodata records: ${error.message}`)
      }
      throw new Error('Failed to fetch biodata records: Unknown error')
    }
  }
}

export default new BiodataService()
