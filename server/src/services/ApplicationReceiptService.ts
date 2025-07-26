// services/applicationReceipt.service.ts

import ApplicationReceipt from '../models/ApplicationReceipt'
import { Application } from '../models/Application'

import { v4 as uuidv4 } from 'uuid'
import { AppError, NotFoundError } from '../utils/errors'
import logger from '../utils/logger'

class ApplicationReceiptService {
  /**
   * Create a new ApplicationReceipt
   */
  public async createReceipt(data: {
    applicationId: number

    amountPaid: number
  }): Promise<ApplicationReceipt> {
    try {
      // Verify related application exists
      const application = await Application.findByPk(data.applicationId)
      if (!application) {
        throw new NotFoundError(`Application with id ${data.applicationId} not found`)
      }
      const receiptID = uuidv4()

      // Check if a receipt already exists for this application (one-to-one)
      const existingReceipt = await ApplicationReceipt.findOne({
        where: { applicationId: data.applicationId },
      })
      if (existingReceipt) {
        throw new NotFoundError(`Receipt already exists for application id ${data.applicationId}`)
      }

      const receipt = await ApplicationReceipt.create({
        ...data,
        dateOfPayment: new Date(),
        receiptID,
      })
      logger.info(`Created ApplicationReceipt with id ${receipt.id}`)
      return receipt
    } catch (error: any) {
      logger.error(`Failed to create ApplicationReceipt: ${error.message}`)
      throw error
    }
  }
  /**
   * Get ApplicationReceipt by ID
   */
  public async getReceiptById(receiptID: string): Promise<ApplicationReceipt> {
    try {
      const receipt = await ApplicationReceipt.findOne({
        where: { receiptID },
        include: [{ model: Application, as: 'application' }],
      })
      if (!receipt) {
        throw new NotFoundError(`ApplicationReceipt with receipt1D ${receiptID} not found`)
      }
      logger.info(`Retrieved ApplicationReceipt with id ${receiptID}`)
      return receipt
    } catch (error: any) {
      logger.error(`Failed to get ApplicationReceipt: ${error.message}`)
      if (error instanceof AppError) throw error
      throw error
    }
  }

  /**
   * Optionally: Get all ApplicationReceipts
   */
  public async getAllReceipts(): Promise<ApplicationReceipt[]> {
    try {
      const receipts = await ApplicationReceipt.findAll({
        include: [{ model: Application, as: 'application' }],
      })
      logger.info(`Retrieved all ApplicationReceipts, count: ${receipts.length}`)
      return receipts
    } catch (error: any) {
      logger.error(`Failed to get all ApplicationReceipts: ${error.message}`)
      throw error
    }
  }
}

export default new ApplicationReceiptService()
