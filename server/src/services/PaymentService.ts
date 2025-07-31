import axios from 'axios';
import Payment from '../models/Payment';
import { Op } from 'sequelize';
import { PaystackWebhookEvent } from '../types/PaystackVerification';
import ApplicationService from './ApplicationService';
import { PaystackVerificationResponse } from '../types/PaystackVerification';
import logger from '../utils/logger'; // Ensure your logger path is correct
import { AdmissionSession } from '../models';
import { NotFoundError } from '../utils/errors';

const PAYSTACK_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_afebde26ed66d974615c5b212af460dbdde8507d';
const applicationService = new ApplicationService();

export class PaymentService {
  static async initializePayment(data: { email: string; amount: number }) {
    try {
      const { email, amount } = data;
      return await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: amount * 100,
          callback_url: '',
          metadata:{
            sessionId:1,
            applicantUserId:1,
            programId:2
          }
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      logger.error('Paystack initializePayment error', {
        message: error.message,
        data,
        response: error.response?.data,
      });
      throw error;
    }
  }

  static async verifyTransaction(reference: string ) {
   
    try {
      const response = await axios.get<PaystackVerificationResponse>(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
     console.log(response.data)
      const { status, data: responseData } = response.data;
      
      const metadata = responseData.metadata;
        await this.handleSuccessfulPayment({
          applicantUserId: metadata.applicantUserId,
          sessionId: metadata.sessionId,
          programId: metadata.programId,
          amount: responseData.amount,
          paidAt: responseData.paid_at,
          reference: responseData.reference,
          webhookEvent: 'verify.success',
        });
      if (status && responseData.status === 'success') {
        const metadata = responseData.metadata;
        await this.handleSuccessfulPayment({
          applicantUserId: metadata.applicantUserId,
          sessionId: metadata.sessionId,
          programId: metadata.programId,
          amount: responseData.amount,
          paidAt: responseData.paid_at,
          reference: responseData.reference,
          webhookEvent: 'verify.success',
        });
      }

      return response.data;
    } catch (error: any) {
      logger.error('Paystack verifyTransaction error', {
        message: error.message,
        reference,
        response: error.response?.data,
      });
      throw error;
    }
  }

  static async processEvent(payload: PaystackWebhookEvent) {
    const { event, data } = payload;
    const { metadata } = data;

    try {
      if (event === 'charge.success' && data.status === 'success') {
        await this.handleSuccessfulPayment({
          applicantUserId: metadata.applicantUserId,
          sessionId: metadata.sessionId,
          programId: metadata.programId,
          amount: data.amount,
          paidAt: data.paid_at,
          reference: data.reference,
          webhookEvent: event,
        });
        return true;
      }

      await this.createPaymentRecord({
        applicantUserId: metadata.applicantUserId,
        sessionId: metadata.sessionId,
        programId: metadata.programId,
        amount: data.amount,
        paidAt: data.paid_at,
        reference: data.reference,
        webhookEvent: event,
        status: 'FAILED',
      });

      return false;
    } catch (error: any) {
      logger.error('Paystack processEvent error', {
        message: error.message,
        event,
        payload,
        response: error.response?.data,
      });
      throw error;
    }
  }

  private static async handleSuccessfulPayment(data: {
    applicantUserId: number;
    sessionId: number;
    programId: number;
    amount: number;
    paidAt: string;
    reference: string;
    webhookEvent: string;
  }) {
    const { reference } = data;
    try {
      const existing = await Payment.findOne({ where: { reference } });
      if (existing) return;

      const application = await applicationService.createInitialApplication({
        sessionId: data.sessionId,
        programId: data.programId,
        applicantUserId: data.applicantUserId,
      });

      await this.createPaymentRecord({
        ...data,
        applicationId: application.id,
        status: 'PAID',
      });
  
    } catch (error: any) {
      logger.error('Error handling successful payment', {
        message: error.message,
        data,
        response: error.response?.data,
      });
      throw error;
    }
  }

  private static async createPaymentRecord(data: {
    applicantUserId: number;
    sessionId: number;
    programId: number;
    amount: number;
    paidAt: string;
    reference: string;
    webhookEvent: string;
    status: 'PAID' | 'FAILED';
    applicationId?: number;
  }) {
    try {
      await Payment.create({
        reference: data.reference,
        amount: data.amount / 100,
        applicantUserId: data.applicantUserId,
        status: data.status,
        paidAt: new Date(data.paidAt),
        webhookEvent: data.webhookEvent,
        sessionId: data.sessionId,
        programId: data.programId,
        applicationId: data.applicationId,
      });
    } catch (error: any) {
      logger.error('Error creating payment record', {
        message: error.message,
        data,
        response: error.response?.data,
      });
      throw error;
    }
  }

  static async getPaymentsByApplicantUserId(applicantUserId: number) {
    try {
      return await Payment.findAll({
        where: { applicantUserId },
        order: [['createdAt', 'DESC']],
      });
    } catch (error: any) {
      logger.error('Error fetching payments by user ID', {
        applicantUserId,
        message: error.message,
      });
      throw error;
    }
  }
 static async getSuccessfulApplicantPaymentForCurrentSession(applicantUserId: number) {
    try {
      const session = await AdmissionSession.findOne({where:{
        isCurrent:true}
      })
      if(!session)throw new NotFoundError('SESSION DOES NOT EXIST FOR APPLICATION')
      return await Payment.findAll({
        where: { applicantUserId,
          sessionId:session.id,
          status: 'PAID',
         },
       
        order: [['createdAt', 'DESC']],
      });
    } catch (error: any) {
      logger.error('Error fetching payments by user ID', {
        applicantUserId,
        message: error.message,
      });
      throw error;
    }
  }

  static async getPaymentsByDateRange(startDate: Date, endDate: Date, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
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
      });

      return {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      };
    } catch (error: any) {
      logger.error('Error fetching payments by date range', {
        startDate,
        endDate,
        page,
        limit,
        message: error.message,
      });
      throw error;
    }
  }
}
