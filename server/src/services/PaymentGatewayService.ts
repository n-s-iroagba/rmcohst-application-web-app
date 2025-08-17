import axios, { AxiosResponse } from 'axios'
import {
  ClientPaymentInitializationPayload,
  PaystackVerificationResponse,
  PaystackWebhookEvent,
} from '../types/paymentGateway.types'
import admissionSessonRepository from '../repositories/AdmissionSessonRepository'
import { NotFoundError, PaymentError } from '../utils/errors'
import userRepository from '../repositories/UserRepository'
import ProgramRepository from '../repositories/ProgramRepository'
import PaymentGatewayHelpers from '../helpers/PaymentGatewayHelpers'
import { logError } from '../utils/logger'
import { PaymentService } from './PaymentService'
import PaymentRepository from '../repositories/PaymentRepository'
import { PaymentStatus } from '../models/Payment'
const PAYSTACK_BASE_URL = 'https://api.paystack.co'
const PAYSTACK_KEY =
  process.env.PAYSTACK_SECRET_KEY || 'sk_test_afebde26ed66d974615c5b212af460dbdde8507d'

export default class PaymentGatewayService {
  static async initializePayment(data: ClientPaymentInitializationPayload): Promise<AxiosResponse> {
    try {
      const session = await admissionSessonRepository.findCurrentSession()
      if (!session) throw new NotFoundError('No current admission session')
      const user = await userRepository.findById(data.applicantUserId, {
        attributes: ['email', 'username'],
      })
      if (!user) throw new NotFoundError(' user not found')
      const program = await ProgramRepository.findById(data.programId)
      if (!program) throw new NotFoundError(' program not found')
      const metadata = { ...data, sessionId: session.id }
      const payload = PaymentGatewayHelpers.buildInitializePaymentPayload(
        user.email,
        user.username,
        program.applicationFeeInNaira,
        metadata
      )

      const response = await this.makePaystackRequest('POST', '/transaction/initialize', payload)

      const paymentData = {
        sessionId: session.id,
        programId: data.programId,
        applicantUserId: data.applicantUserId,
        amount: program.applicationFeeInNaira,
        reference: response.data.data.reference,
        paymentType: data.paymentType,
        status: PaymentStatus.PENDING,
      }
      if (response.data) {
        await await PaymentRepository.create(paymentData)
      }
      return response.data
    } catch (error) {
      logError('Paystack initializePayment error', error, { data })
      throw new PaymentError('Failed to initialize payment')
    }
  }

  static async makePaystackRequest<T = any>(
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

  static async verifyTransaction(reference: string): Promise<PaystackVerificationResponse> {
    try {
      const response = await this.makePaystackRequest<PaystackVerificationResponse>(
        'GET',
        `/transaction/verify/${reference}`
      )

      const { status, data: responseData } = response.data

      if (status) {
        await PaymentService.handleSuccessfulPayment(reference, responseData.paid_at)
      }

      return response.data
    } catch (error) {
      logError('Paystack verifyTransaction error', error, { reference })
      throw new PaymentError('Failed to verify transaction')
    }
  }

  static async processEvent(payload: PaystackWebhookEvent): Promise<boolean> {
    const { event, data: responseData } = payload

    try {
      const reference = responseData.reference

      if (event === 'charge.success') {
        await PaymentService.handleSuccessfulPayment(responseData.reference, responseData.paid_at)
        return true
      } else {
        await PaymentService.handleFailedPayment(reference, event)
        return false
      }
    } catch (error) {
      logError('Error processing webhook event', error, {
        event,
        reference: responseData.reference,
      })
      throw error
    }
  }
}
