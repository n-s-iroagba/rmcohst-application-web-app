import { Request, Response } from 'express'
import { PaymentService } from '../services/PaymentService'
import logger from '../utils/logger';


export class PaymentController {

    static async handleWebhook(req: Request, res: Response) {
    try {
      const success =await PaymentService.processEvent(req.body);
      if (success) {
        logger.info('Webhook processed successfully');
        res.status(200).json({ status: 'success' });

      }    
    } catch (error) {
      console.error('Webhook error:', error);
       res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  }
  static async initializePayment(req: Request, res: Response) {
    try {
      const { email, amount } = req.body;

      if (!email || !amount) {
         res.status(400).json({ error: 'Email and amount are required' });
      }

      const response = await PaymentService.initializePayment({ email, amount });
       res.status(200).json(response.data);
    } catch (error: any) {
      logger.error('Failed to initialize payment:', error.response?.data || error.message);
       res.status(500).json({ error: 'Failed to initialize payment' });
    }
  }

  static async verifyTransaction(req: Request, res: Response) {
    try {
      const { reference } = req.params;

      if (!reference) {
         res.status(400).json({ error: 'Transaction reference is required' });
      }

      const response = await PaymentService.verifyTransaction(reference);
       res.status(200).json(response);
    } catch (error: any) {
      logger.error('Failed to verify transaction:', error.response?.data || error.message);
       res.status(500).json({ error: 'Failed to verify transaction' });
    }
  }


  static async getPaymentsByApplicantUserId(req: Request, res: Response) {
    try {
      const applicantUserId = parseInt(req.params.applicantUserId)
      const payments = await PaymentService.getPaymentsByApplicantUserId(applicantUserId)
      res.status(200).json(payments)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getSuccessfulApplicantPaymentForCurrentSession(req: Request, res: Response) {
    try {
      const applicantUserId = parseInt(req.params.applicantUserId)
      const payments = await PaymentService.getSuccessfulApplicantPaymentForCurrentSession(applicantUserId)
      res.status(200).json(payments)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getPaymentsByDate(req: Request, res: Response) {
    try {
      const { startDate, endDate, page = '1', limit = '10' } = req.query

      if (!startDate || !endDate) {
        res.status(400).json({ error: 'startDate and endDate are required' })
      }

      const result = await PaymentService.getPaymentsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string),
        parseInt(page as string),
        parseInt(limit as string)
      )

      res.status(200).json(result)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  
}
