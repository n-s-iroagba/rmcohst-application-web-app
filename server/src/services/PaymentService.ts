// src/services/PaymentService.ts

import Payment, { PaymentStatus } from '../models/Payment'
import PaymentRepository from '../repositories/PaymentRepository'
import UserRepository from '../repositories/UserRepository'
import { NotFoundError, PaymentError } from '../utils/errors'
import logger, { logError } from '../utils/logger'
import ApplicationService from './ApplicationService'
import EmailService from './EmailService'
import { ReceiptService } from './ReceiptService'

export class PaymentService {

  private static emailService = EmailService
  private static receiptService = new ReceiptService()
  private static applicationService = new ApplicationService()

  static async getPaymentsByApplicantUserId(applicantUserId: number): Promise<Payment[]> {
    try {
      return await PaymentRepository.findPaymentsByApplicantUserId(applicantUserId)
    } catch (error) {
      logError('Error fetching payments by applicant user ID', error, { applicantUserId })
      throw error
    }
  }

  static async getAccepantanceFeeByApplicantUserId(applicantUserId: number): Promise<Payment[]> {
    try {
      return await PaymentRepository.findAcceptanceFeeByApplicantUserId(applicantUserId)
    } catch (error) {
      logError('Error fetching payments by applicant user ID', error, { applicantUserId })
      throw error
    }
  }

  /**
   * Get payments within a date range with pagination
   */
  static async getPaymentsByDateRange(
    startDate: Date,
    endDate: Date,
    page = 1,
    limit = 10
  ): Promise<Payment[]> {
    try {
      const offset = (page - 1) * limit
      return await PaymentRepository.findPaymentsByDateRange(startDate, endDate, limit, offset)
    } catch (error) {
      logError('Error fetching payments by date range', error, { startDate, endDate, page, limit })
      throw new PaymentError('Failed to fetch payments by date range')
    }
  }

  static async handleSuccessfulPayment(reference: string, paidAt: string): Promise<void> {
    try {
      // Check if payment exists
      const paymentExists = await PaymentRepository.paymentExists(reference)
      if (!paymentExists) {
        throw new NotFoundError('Payment not found')
      }

      // Update payment status
      const updates = {
        paidAt: new Date(paidAt),
        status: PaymentStatus.PAID,
      }

      const payment = await PaymentRepository.updatePaymentByReference(reference, updates)

      if (!payment) {
        throw new NotFoundError('Payment not found')
      }

      // Create initial application
      const a = await this.applicationService.createInitialApplication({
        sessionId: payment.sessionId,
        programId: payment.programId,
        applicantUserId: payment.applicantUserId,
      })

      // Get applicant details
      const applicant = await UserRepository.findById(payment.applicantUserId)
      if (!applicant) {
        throw new NotFoundError('Applicant not found')
      }

      // Generate receipt
      const receiptData = await this.receiptService.generateReceipt(payment)


      // Send receipt email
      await this.emailService.sendReceiptEmail({
        to: applicant.email,
        applicantName: applicant.username,
        payment,
        receiptData,
      })

      logger.info('Successfully processed payment and sent receipt', {
        paymentId: payment.id,
        reference: payment.reference,
        applicantEmail: applicant.email,
      })
    } catch (error) {
      logError('Error handling successful payment', error, { reference })
      throw error
    }
  }

  private static async uploadReceiptToDrive(
    receiptData: any,
    parentFolderId: string,
    payment: Payment
  ): Promise<string> {
    try {
      // Create receipt buffer (could be PDF or JSON)
      let buffer: Buffer
      let mimeType: string
      let fileName: string

      if (receiptData.type === 'pdf') {
        buffer = receiptData.buffer
        mimeType = 'application/pdf'
        fileName = `receipt_${payment.reference}.pdf`
      } else {
        // JSON receipt
        const receiptJson = JSON.stringify(receiptData, null, 2)
        buffer = Buffer.from(receiptJson, 'utf-8')
        mimeType = 'application/json'
        fileName = `receipt_${payment.reference}.json`
      }

      const fileData = {
        name: fileName,
        buffer,
        mimeType,
        parentFolderId,
      }

      return ''
    } catch (error) {
      logger.error('Error uploading receipt to Google Drive:', error)
      throw error
    }
  }

  static async handleFailedPayment(reference: string, event: string): Promise<void> {
    try {
      // Check if payment exists
      const paymentExists = await PaymentRepository.paymentExists(reference)
      if (!paymentExists) {
        throw new NotFoundError('Payment not found')
      }

      // Update payment status
      const updates = {
        status: PaymentStatus.FAILED,
      }

      const payment = await PaymentRepository.updatePaymentByReference(reference, updates)
      if (!payment) {
        throw new NotFoundError('Payment not found')
      }

      // Get applicant details
      const applicant = await UserRepository.findById(payment.applicantUserId)
      if (!applicant) {
        throw new NotFoundError('Applicant not found')
      }

      // Send failure notification email
      await this.emailService.sendFailedPaymentEmail({
        to: applicant.email,
        applicantName: applicant.username,
        payment,
        failureReason: event,
      })

      logger.info('Processed failed payment', {
        reference: reference,
        event,
        applicantEmail: applicant.email,
      })
    } catch (error) {
      logError('Error handling failed payment', error, { reference, event })
      throw error
    }
  }
}