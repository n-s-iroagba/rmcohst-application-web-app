import { Request, Response } from 'express'
import { PaymentService } from '../services/PaymentService'
import logger from '../utils/logger'

export class PaymentController {
  static async getPaymentsByApplicantUserId(req: Request, res: Response) {
    try {
      const applicantUserId = parseInt(req.params.applicantUserId)
      const payments = await PaymentService.getPaymentsByApplicantUserId(applicantUserId)
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
