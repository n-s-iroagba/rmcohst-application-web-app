

import axios, { AxiosResponse } from 'axios'
import Payment from '../models/Payment'
import { Op } from 'sequelize'
import { PaystackWebhookEvent, PaystackVerificationResponse } from '../types/PaystackVerification'
import ApplicationService from './ApplicationService'
import logger from '../utils/logger'
import { NotFoundError, PaymentError } from '../utils/errors'
import AdmissionSessionService from './AcademicSessionService'

import GoogleDriveApplicationService from './DriveService'
import {EmailService} from './EmailService'
import {ReceiptService} from './ReceiptService'
import { User } from '../models'



// Constants
const PAYSTACK_BASE_URL = 'https://api.paystack.co'
const PAYSTACK_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_afebde26ed66d974615c5b212af460dbdde8507d'
const KOBO_TO_NAIRA = 100

// Types
export  interface PaymentWithApplicant extends Payment{
  applicantUser:User
 }

interface InitializePaymentRequest {
  email: string
  amount: number
  applicantUserId: number
  programId: number
}

interface PaymentData {
  applicantUserId: number
  sessionId: number
  programId: number
  amount: number
  paidAt?: string
  reference: string
  status: PaymentStatus
  webhookEvent: string
  applicationId?: number
}

type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED'
type PaymentEvent = 'charge.success' | 'charge.failed'

interface PaginatedResult<T> {
  total: number
  pages: number
  currentPage: number
  data: T[]
}


export class PaymentService {
  private static googleDriveService = new GoogleDriveApplicationService()
  private static emailService = new EmailService('')
  private static receiptService = new ReceiptService()
  private static applicationService = new ApplicationService()

  /**
   * Initialize payment transaction with Paystack
   */
  static async initializePayment(data: InitializePaymentRequest): Promise<AxiosResponse> {
    try {
      const session = await this.getCurrentSession()
      const payload = this.buildInitializePaymentPayload(data, session.id)
 
      const response = await this.makePaystackRequest('POST', '/transaction/initialize', payload)
   
      const paymentData ={
        sessionId:session.id,
        programId:data.programId,
        applicantUserId:data.applicantUserId,
        amount:data.amount,
        reference:response.data.data.reference
      }
    //   if (response.data){
    //   await this.createPaymentRecord({ ...paymentData, status: 'PENDING', webhookEvent: 'verify.pending' })
    // }
    return response.data
    } catch (error) {
      this.logError('Paystack initializePayment error', error, { data })
      throw new PaymentError('Failed to initialize payment')
    }
  }

  /**
   * Verify transaction with Paystack
   */
  static async verifyTransaction(reference: string): Promise<PaystackVerificationResponse> {
    try {
      const response = await this.makePaystackRequest<PaystackVerificationResponse>(
        'GET', 
        `/transaction/verify/${reference}`
      )

      const { status, data: responseData } = response.data
      

      if (status) {
        await this.handleSuccessfulPayment(reference,responseData.paid_at)
      }
       

      return response.data
    } catch (error) {
      this.logError('Paystack verifyTransaction error', error, { reference })
      throw new PaymentError('Failed to verify transaction')
    }
  }

  /**
   * Process webhook events from Paystack
   */
  static async processEvent(payload: PaystackWebhookEvent): Promise<boolean> {
    const { event, data: responseData } = payload
    
    try {
      const paymentData = this.extractPaymentDataFromResponse(responseData)
      
      if (event === 'charge.success') {
        await this.handleSuccessfulPayment(responseData.reference,responseData.paid_at)
        return true
      } else {
        await this.handleFailedPayment(paymentData, event)
        return false
      }
    } catch (error) {
      this.logError('Error processing webhook event', error, { event, reference: responseData.reference })
      throw error
    }
  }

  /**
   * Get payments by applicant user ID
   */
  static async getPaymentsByApplicantUserId(applicantUserId: number): Promise<Payment[]> {
    try {
      return await Payment.findAll({
        where: { applicantUserId },
        order: [['createdAt', 'DESC']],
      })
    } catch (error) {
      this.logError('Error fetching payments by user ID', error, { applicantUserId })
      throw new PaymentError('Failed to fetch user payments')
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
  ): Promise<PaginatedResult<Payment>> {
    const offset = (page - 1) * limit
    
    try {
      const { count, rows } = await Payment.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })

      return {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      }
    } catch (error) {
      this.logError('Error fetching payments by date range', error, { startDate, endDate, page, limit })
      throw new PaymentError('Failed to fetch payments by date range')
    }
  }

  // Private helper methods

  private static async getCurrentSession() {
    const session = await AdmissionSessionService.getCurrentSession()
    if (!session) {
      throw new NotFoundError('Current admission session not found')
    }
    return session
  }

  private static buildInitializePaymentPayload(data: InitializePaymentRequest, sessionId: number) {
    return {
      email: data.email,
      amount: data.amount * KOBO_TO_NAIRA,
      callback_url: '', // Consider making this configurable
      metadata: {
        applicantUserId: data.applicantUserId,
        programId: data.programId,
        sessionId,
      },
    }
  }

  private static async makePaystackRequest<T = any>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any
  ): Promise<AxiosResponse<T>> {
    const config = {
      method,
      url: `${PAYSTACK_BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        'Content-Type': 'application/json',
      },
      ...(data && { data }),
    }

    return await axios(config)
  }

  private static extractPaymentDataFromResponse(responseData: any): Omit<PaymentData, 'status' | 'webhookEvent'> {
    const { metadata } = responseData
    return {
      applicantUserId: metadata.applicantUserId,
      sessionId: metadata.sessionId,
      programId: metadata.programId,
      amount: responseData.amount,
      paidAt: responseData.paid_at,
      reference: responseData.reference,
    }
  }



  private static async handleSuccessfulPayment(reference: string, paidAt: string): Promise<void> {
    try {
      const payment = await Payment.findOne({ 
        where: { reference },
        include: [
          {
            model: User,
            as: 'applicantUser',
            attributes: ['id', 'email', 'firstName', 'lastName']
          }
        ]
      }) as PaymentWithApplicant
    
      if (!payment) throw new NotFoundError('Payment not found')
      
      // Update payment status
      payment.paidAt = new Date(paidAt)
      payment.status = 'PAID'
      await payment.save()

      // Create initial application
      await this.applicationService.createInitialApplication({
        sessionId: payment.sessionId,
        programId: payment.programId,
        applicantUserId: payment.applicantUserId,
      })
   

      // Generate receipt
      const receiptData = await this.receiptService.generateReceipt(payment)
      
      // Create receipts folder in Google Drive (if it doesn't exist)
      const receiptsFolderId = await this.googleDriveService.createOrGetFolder('receipts')
      
      // Upload receipt to Google Drive
      const receiptFileId = await this.uploadReceiptToDrive(receiptData, receiptsFolderId, payment)
      
      // Get shareable link for the receipt
      const receiptLink = await this.googleDriveService.getFolderShareableLink(receiptFileId)
      
      // Update payment with receipt information
      await payment.update({
        receiptFileId,
        receiptLink,
        receiptGeneratedAt: new Date()
      })

      // Send receipt email
      if (payment.applicantUser?.email) {
        await this.emailService.sendReceiptEmail({
          to: payment.applicantUser.email,
          applicantName: `${payment.applicantUser.username}`,
          payment,
          receiptData,
          receiptLink
        })
      }

      logger.info('Successfully processed payment and sent receipt', {
        paymentId: payment.id,
        reference: payment.reference,
        receiptFileId,
        applicantEmail: payment.applicantUser?.email
      })

    } catch (error) {
      this.logError('Error handling successful payment', error)
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

      return await this.googleDriveService.uploadFile(fileData)
    } catch (error) {
      logger.error('Error uploading receipt to Google Drive:', error)
      throw error
    }
  }

  private static async handleFailedPayment(
    paymentData: Omit<PaymentData, 'status' | 'webhookEvent'>, 
    event: string
  ): Promise<void> {
    try {
      await this.updateExistingPaymentStatus(paymentData.reference, 'FAILED')
      
      // Get payment details for failed payment email
      const payment = await Payment.findOne({
        where: { reference: paymentData.reference },
        include: [
          {
            model: User,
            as: 'applicantUser',
            attributes: ['id', 'email', 'firstName', 'lastName']
          }
        ]
      }) as PaymentWithApplicant

      // Send failed payment email
      if (payment?.applicantUser?.email) {
        await this.emailService.sendFailedPaymentEmail({
          to: payment.applicantUser.email,
          applicantName: `${payment.applicantUser.username}`,
          payment,
          failureReason: event
        })
      }

      logger.info('Processed failed payment', {
        reference: paymentData.reference,
        event,
        applicantEmail: payment?.applicantUser?.email
      })

    } catch (error) {
      this.logError('Error handling failed payment', error)
      throw error
    }
  }



  private static async updateExistingPaymentStatus(reference: string, status: PaymentStatus): Promise<void> {
    const existingPayment = await Payment.findOne({ where: { reference } })
    if (existingPayment) {
      existingPayment.status = status
      await existingPayment.save()
    }
  }

  private static async createPaymentRecord(data: PaymentData): Promise<Payment> {
    try {
      // Check for existing payment to avoid duplicates
      const existingPayment = await Payment.findOne({ where: { reference: data.reference } })
      if (existingPayment) {
        return existingPayment
      }

      return await Payment.create({
        reference: data.reference,
        amount: data.amount / KOBO_TO_NAIRA, // Convert kobo back to naira
        applicantUserId: data.applicantUserId,
        status: data.status,
        webhookEvent: data.webhookEvent,
        sessionId: data.sessionId,
        programId: data.programId,
        applicationId: data.applicationId,
      })
    } catch (error) {
      this.logError('Error creating payment record', error, { data })
      throw new PaymentError('Failed to create payment record')
    }
  }

  private static logError(message: string, error: any, context?: Record<string, any>): void {
    logger.error(message, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      ...context,
    })
  }
}